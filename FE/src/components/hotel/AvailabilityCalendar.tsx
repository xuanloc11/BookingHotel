"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

import type { BookingGuestCounts } from "@/types/booking";
import type { HotelAvailabilityDay } from "@/types/hotel";

interface AvailabilityCalendarProps {
  hotelId: number;
  availability: HotelAvailabilityDay[];
  searchParams?: { [key: string]: string | string[] | undefined };
}

function addDays(dateValue: string, days: number): string {
  const [year, month, day] = dateValue.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
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
  searchParams,
}: AvailabilityCalendarProps) {
  const { t } = useLanguage();
  const firstAvailable = availability.find((day) => day.is_available);
  const availableDateSet = useMemo(
    () => new Set(availability.filter((day) => day.is_available).map((day) => day.date)),
    [availability],
  );

  const paramCheckIn = typeof searchParams?.checkIn === 'string' ? searchParams.checkIn : null;
  const paramCheckOut = typeof searchParams?.checkOut === 'string' ? searchParams.checkOut : null;
  const paramRooms = typeof searchParams?.rooms === 'string' ? parseInt(searchParams.rooms, 10) : 1;
  const paramAdults = typeof searchParams?.adults === 'string' ? parseInt(searchParams.adults, 10) : 2;
  const paramChildren = typeof searchParams?.children === 'string' ? parseInt(searchParams.children, 10) : 0;

  const [checkIn, setCheckIn] = useState(paramCheckIn || firstAvailable?.date || "");
  const [checkOut, setCheckOut] = useState(
    paramCheckOut || (firstAvailable ? addDays(firstAvailable.date, 1) : "")
  );
  const [selectingMode, setSelectingMode] = useState<"checkIn" | "checkOut">("checkIn");
  const [guests, setGuests] = useState<BookingGuestCounts>({
    adults: isNaN(paramAdults) ? 2 : paramAdults,
    children: isNaN(paramChildren) ? 0 : paramChildren,
    rooms: isNaN(paramRooms) ? 1 : paramRooms,
  });

  const checkInAvailable = checkIn ? availableDateSet.has(checkIn) : false;
  const checkOutAfterCheckIn = checkIn && checkOut ? checkOut > checkIn : false;
  
  const availableRoomsInRange = useMemo(() => {
    if (!checkIn || !checkOut || checkOut <= checkIn) return 0;

    let minRooms = Infinity;
    let currentDate = checkIn;
    
    while (currentDate < checkOut) {
      const dayData = availability.find((day) => day.date === currentDate);
      if (!dayData || !dayData.is_available) {
        return 0;
      }
      if (dayData.available_rooms < minRooms) {
        minRooms = dayData.available_rooms;
      }
      currentDate = addDays(currentDate, 1);
    }
    
    return minRooms === Infinity ? 0 : minRooms;
  }, [checkIn, checkOut, availability]);

  const hasEnoughRooms = Boolean(guests.rooms > 0 && guests.rooms <= availableRoomsInRange);

  const canContinue = Boolean(checkIn && checkOut && checkInAvailable && checkOutAfterCheckIn && hasEnoughRooms);

  const statusMessage = !checkIn || !checkOut
    ? t("calendar.error.selectDates")
    : !checkInAvailable
      ? t("calendar.error.unavailable")
      : !checkOutAfterCheckIn
        ? t("calendar.error.invalidCheckout")
        : !hasEnoughRooms
          ? t("calendar.error.notEnoughRooms")
          : null;

  const checkoutHref = useMemo(
    () =>
      canContinue
        ? buildCheckoutHref({ hotelId, checkIn, checkOut, guests })
        : "/checkout",
    [canContinue, checkIn, checkOut, guests, hotelId],
  );

  const updateGuests = (key: keyof BookingGuestCounts, value: string) => {
    if (value === "") {
      setGuests((current) => ({
        ...current,
        [key]: "" as any,
      }));
      return;
    }
    
    const num = Number(value);
    if (isNaN(num)) return;

    setGuests((current) => ({
      ...current,
      [key]: Math.max(key === "children" ? 0 : 1, num),
    }));
  };

  const handleGuestBlur = (key: keyof BookingGuestCounts) => {
    if (guests[key] === ("" as any) || guests[key] === null || guests[key] === undefined) {
      updateGuests(key, key === "children" ? "0" : "1");
    }
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
            onFocus={() => setSelectingMode("checkIn")}
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
            onFocus={() => setSelectingMode("checkOut")}
            type='date'
            value={checkOut}
          />
        </div>
      </div>

      <div className='d-flex flex-wrap tw-gap-3 tw-mb-8'>
        {availability.slice(0, 14).map((day) => {
          const isCheckIn = day.date === checkIn;
          const isCheckOut = day.date === checkOut;
          const inRange = checkIn && checkOut && day.date > checkIn && day.date < checkOut;

          return (
            <button
              className={`border tw-rounded-lg tw-py-3 tw-px-4 ${
                isCheckIn || isCheckOut 
                  ? "border-dark bg-white" 
                  : inRange 
                    ? "bg-light border-light" 
                    : "bg-white"
              }`}
              disabled={!day.is_available}
              key={day.date}
              onClick={() => {
                if (selectingMode === "checkOut") {
                  if (day.date > checkIn) {
                    setCheckOut(day.date);
                    setSelectingMode("checkIn"); // complete
                  } else {
                    setCheckIn(day.date);
                    setCheckOut(checkIn); // shift
                  }
                } else {
                  setCheckIn(day.date);
                  if (!checkOut || day.date >= checkOut) {
                    setCheckOut(addDays(day.date, 1));
                  }
                  setSelectingMode("checkOut"); // automatically advance
                }
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
          );
        })}
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
            onChange={(event) => updateGuests("adults", event.target.value)}
            onBlur={() => handleGuestBlur("adults")}
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
              updateGuests("children", event.target.value)
            }
            onBlur={() => handleGuestBlur("children")}
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
            onChange={(event) => updateGuests("rooms", event.target.value)}
            onBlur={() => handleGuestBlur("rooms")}
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
