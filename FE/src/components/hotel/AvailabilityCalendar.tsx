"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

import type { BookingGuestCounts } from "@/types/booking";
import type { HotelAvailabilityDay } from "@/types/hotel";

interface AvailabilityCalendarProps {
  hotelId: number;
  availability: HotelAvailabilityDay[];
}

function addDays(dateValue: string, days: number): string {
  const date = new Date(`${dateValue}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function buildCheckoutHref(input: {
  hotelId: number;
  checkIn: string;
  checkOut: string;
  guests: BookingGuestCounts;
}): string {
  const params = new URLSearchParams({
    hotelId: String(input.hotelId),
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    adults: String(input.guests.adults),
    children: String(input.guests.children),
    rooms: String(input.guests.rooms),
  });

  return `/checkout?${params.toString()}`;
}

export default function AvailabilityCalendar({
  hotelId,
  availability,
}: AvailabilityCalendarProps) {
  const { t } = useLanguage();
  const firstAvailable = availability.find((day) => day.is_available);
  const availableDateSet = useMemo(
    () => new Set(availability.filter((day) => day.is_available).map((day) => day.date)),
    [availability],
  );

  const [checkIn, setCheckIn] = useState(firstAvailable?.date ?? "");
  const [checkOut, setCheckOut] = useState(
    firstAvailable ? addDays(firstAvailable.date, 1) : "",
  );
  const [guests, setGuests] = useState<BookingGuestCounts>({
    adults: 2,
    children: 0,
    rooms: 1,
  });

  const checkInAvailable = checkIn ? availableDateSet.has(checkIn) : false;
  const checkOutAfterCheckIn = checkIn && checkOut ? checkOut > checkIn : false;
  const canContinue = Boolean(checkIn && checkOut && checkInAvailable && checkOutAfterCheckIn);

  const statusMessage = !checkIn || !checkOut
    ? t("calendar.error.selectDates")
    : !checkInAvailable
      ? t("calendar.error.unavailable")
      : !checkOutAfterCheckIn
        ? t("calendar.error.invalidCheckout")
        : null;

  const checkoutHref = useMemo(
    () =>
      canContinue
        ? buildCheckoutHref({ hotelId, checkIn, checkOut, guests })
        : "/checkout",
    [canContinue, checkIn, checkOut, guests, hotelId],
  );

  const updateGuests = (key: keyof BookingGuestCounts, value: number) => {
    setGuests((current) => ({
      ...current,
      [key]: Math.max(key === "children" ? 0 : 1, value),
    }));
  };

  const handleCheckInChange = (value: string) => {
    setCheckIn(value);

    if (!checkOut || value >= checkOut) {
      setCheckOut(addDays(value, 1));
    }
  };

  const handleCheckOutChange = (value: string) => {
    if (!checkIn) {
      setCheckOut(value);
      return;
    }

    // Auto-correct invalid checkout to improve UX
    if (value <= checkIn) {
      setCheckOut(addDays(checkIn, 1));
      return;
    }

    setCheckOut(value);
  };

  return (
    <div className='bg-white tw-rounded-lg tw-p-8'>
      <h3 className='tw-text-8 fw-normal tw-mb-6'>{t("calendar.title")}</h3>

      <div className='row row-gap-4 tw-mb-8'>
        <div className='col-md-6'>
          <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
            {t("calendar.checkIn")}
          </label>
          <input
            className='form-control tw-h-14'
            min={firstAvailable?.date}
            onChange={(event) => handleCheckInChange(event.target.value)}
            type='date'
            value={checkIn}
          />
        </div>

        <div className='col-md-6'>
          <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
            {t("calendar.checkOut")}
          </label>
          <input
            className='form-control tw-h-14'
            min={checkIn ? addDays(checkIn, 1) : firstAvailable?.date}
            onChange={(event) => handleCheckOutChange(event.target.value)}
            type='date'
            value={checkOut}
          />
        </div>
      </div>

      <div className='d-flex flex-wrap tw-gap-3 tw-mb-8'>
        {availability.slice(0, 14).map((day) => (
          <button
            className={`border tw-rounded-lg tw-py-3 tw-px-4 bg-white ${
              checkIn === day.date ? "border-dark" : ""
            }`}
            disabled={!day.is_available}
            key={day.date}
            onClick={() => {
              setCheckIn(day.date);
              setCheckOut(addDays(day.date, 1));
            }}
            type='button'
          >
            <span className='d-block fw-bold'>{day.date.slice(5)}</span>
            <span className={day.is_available ? "text-success" : "text-muted"}>
              {day.is_available
                ? `${day.available_rooms} ${t("calendar.roomsCount")}`
                : t("calendar.soldOut")}
            </span>
          </button>
        ))}
      </div>

      <div className='row row-gap-4 tw-mb-8'>
        <div className='col-md-4'>
          <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
            {t("calendar.adults")}
          </label>
          <input
            className='form-control tw-h-14'
            max='12'
            min='1'
            onChange={(event) => updateGuests("adults", Number(event.target.value))}
            type='number'
            value={guests.adults}
          />
        </div>
        <div className='col-md-4'>
          <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
            {t("calendar.children")}
          </label>
          <input
            className='form-control tw-h-14'
            max='12'
            min='0'
            onChange={(event) =>
              updateGuests("children", Number(event.target.value))
            }
            type='number'
            value={guests.children}
          />
        </div>
        <div className='col-md-4'>
          <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
            {t("calendar.rooms")}
          </label>
          <input
            className='form-control tw-h-14'
            max='6'
            min='1'
            onChange={(event) => updateGuests("rooms", Number(event.target.value))}
            type='number'
            value={guests.rooms}
          />
        </div>
      </div>

      {statusMessage ? (
        <p className='tw-text-sm text-danger tw-mb-4' role='status'>
          {statusMessage}
        </p>
      ) : null}

      {canContinue ? (
        <Link
          className='tw-btn-hover-black bg-main-600 tw-py-5 tw-px-12 text-heading font-heading d-inline-flex align-items-center justify-content-center tw-gap-2 tw-rounded-lg w-100'
          href={checkoutHref}
        >
          {t("calendar.bookNow")}
          <span className='d-inline-block lh-1 tw-text-lg'>
            <i className='ph ph-arrow-up-right' />
          </span>
        </Link>
      ) : (
        <button
          className='tw-btn-hover-black bg-main-600 tw-py-5 tw-px-12 text-heading font-heading tw-rounded-lg w-100'
          disabled
          type='button'
        >
          {t("calendar.selectDates")}
        </button>
      )}
    </div>
  );
}
