"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useCurrency } from "@/lib/currency/CurrencyContext";
import { fetchGuestBooking } from "@/lib/api/bookingApi";
import type { BookingSummary } from "@/types/booking";
import InvoiceGenerator from "./InvoiceGenerator";

interface BookingSuccessDetailsProps {
  bookingId?: string;
  status?: string;
  hotelName?: string;
  checkIn?: string;
  checkOut?: string;
  contact?: string;
}

export default function BookingSuccessDetails({
  bookingId,
  status,
  hotelName,
  checkIn,
  checkOut,
  contact,
}: BookingSuccessDetailsProps) {
  const { t } = useLanguage();
  const { formatMoney } = useCurrency();
  const [booking, setBooking] = useState<BookingSummary | null>(null);

  useEffect(() => {
    if (bookingId && contact) {
      fetchGuestBooking(bookingId, contact)
        .then(setBooking)
        .catch(console.error);
    }
  }, [bookingId, contact]);

  return (
    <section className='bg_2 pt-120 pb-120'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-xl-8'>
            <div className='bg-white tw-rounded-lg tw-p-12 text-center'>
              <span className='tw-w-16 tw-h-16 rounded-circle bg-main-600 d-inline-flex align-items-center justify-content-center tw-text-8 text-heading tw-mb-6'>
                <i className='ph ph-check' />
              </span>
              <h1 className='tw-text-12 fw-normal tw-mb-4'>
                {t("success.heading")}
              </h1>
              <p className='tw-text-lg tw-mb-8'>
                {t("success.desc")}
              </p>

              <div className='border tw-rounded-lg tw-p-6 text-start tw-mb-8'>
                <div className='d-flex justify-content-between tw-mb-3'>
                  <span>{t("success.bookingId")}</span>
                  <strong>{bookingId ?? t("success.statusPending")}</strong>
                </div>
                <div className='d-flex justify-content-between tw-mb-3'>
                  <span>{t("success.status")}</span>
                  <strong className='text-capitalize'>{status ?? t("success.statusPending")}</strong>
                </div>
                {hotelName ? (
                  <div className='d-flex justify-content-between tw-mb-3'>
                    <span>{t("success.hotel")}</span>
                    <strong>{hotelName}</strong>
                  </div>
                ) : null}
                {checkIn && checkOut ? (
                  <div className='d-flex justify-content-between'>
                    <span>{t("success.dates")}</span>
                    <strong>
                      {t("success.from")} {checkIn} {t("success.to")} {checkOut}
                    </strong>
                  </div>
                ) : null}

                {booking && (
                  <div className='border-top tw-pt-4 tw-mt-4'>
                    <h3 className='tw-text-base fw-bold tw-mb-3'>Thông tin chi tiết</h3>
                    <div className='d-flex justify-content-between tw-mb-3'>
                      <span>Khách hàng</span>
                      <strong>
                        {booking.customer.first_name} {booking.customer.last_name}
                      </strong>
                    </div>
                    <div className='d-flex justify-content-between tw-mb-3'>
                      <span>Email / SĐT</span>
                      <strong>
                        {booking.customer.email} / {booking.customer.phone}
                      </strong>
                    </div>
                    {booking.rooms && booking.rooms.length > 0 && (
                      <div className='d-flex justify-content-between tw-mb-3'>
                        <span>Loại phòng</span>
                        <div className='text-end'>
                          {booking.rooms.map((room, idx) => (
                            <div key={idx}>
                              <strong>{room.quantity}x {room.room_type_name}</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className='d-flex justify-content-between tw-mb-3'>
                      <span>Tổng thanh toán</span>
                      <strong className='text-main-600 tw-text-lg'>
                        {formatMoney(booking.total)}
                      </strong>
                    </div>
                  </div>
                )}
              </div>

              <div className='d-flex justify-content-center flex-wrap tw-gap-3'>
                {booking && <InvoiceGenerator booking={booking} />}
                <Link
                  className='tw-btn-hover-black bg-main-600 tw-py-4 tw-px-8 text-heading font-heading tw-rounded-lg'
                  href='/profile/?tab=bookings'
                >
                  {t("success.viewBookings")}
                </Link>
                <Link className='btn btn-outline-secondary tw-py-4 tw-px-8' href='/room'>
                  {t("success.searchMore")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
