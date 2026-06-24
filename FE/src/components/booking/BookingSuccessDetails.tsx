"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface BookingSuccessDetailsProps {
  bookingId?: string;
  status?: string;
  hotelName?: string;
  checkIn?: string;
  checkOut?: string;
}

export default function BookingSuccessDetails({
  bookingId,
  status,
  hotelName,
  checkIn,
  checkOut,
}: BookingSuccessDetailsProps) {
  const { t } = useLanguage();
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
              </div>

              <div className='d-flex justify-content-center flex-wrap tw-gap-3'>
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
