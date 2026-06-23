"use client";

import Image from "next/image";
import Link from "next/link";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useCurrency } from "@/lib/currency/CurrencyContext";
import type { BookingSummary } from "@/types/booking";
import type { UserProfile } from "@/types/user";

interface MyBookingsDashboardProps {
  bookings: BookingSummary[];
  user?: UserProfile;
  error?: string;
}

export default function MyBookingsDashboard({
  bookings,
  user,
  error,
}: MyBookingsDashboardProps) {
  const { t } = useLanguage();
  const { formatMoney } = useCurrency();
  return (
    <section className='bg_2 pt-120 pb-120'>
      <div className='container'>
        <div className='d-flex justify-content-between align-items-end flex-wrap row-gap-3 tw-mb-10'>
          <div>
            <h1 className='section-title fw-normal tw-mb-3'>{t("myBookings.title")}</h1>
            <p className='mb-0'>
              {user ? `${t("myBookings.signedInAs")} ${user.full_name || user.email}` : t("myBookings.history")}
            </p>
          </div>
          <Link
            className='tw-btn-hover-black bg-main-600 tw-py-4 tw-px-8 text-heading font-heading tw-rounded-lg'
            href='/room'
          >
            {t("myBookings.bookAnother")}
          </Link>
        </div>

        {error ? (
          <div className='alert alert-warning' role='alert'>
            {error}
          </div>
        ) : null}

        {bookings.length === 0 ? (
          <div className='bg-white tw-rounded-lg tw-p-10 text-center'>
            <h2 className='tw-text-8 fw-normal tw-mb-3'>{t("myBookings.emptyTitle")}</h2>
            <p className='tw-mb-6'>
              {t("myBookings.emptyDesc")}
            </p>
            <Link className='text-main-600 fw-bold' href='/room'>
              {t("myBookings.browseHotels")}
            </Link>
          </div>
        ) : (
          <div className='d-flex flex-column tw-gap-5'>
            {bookings.map((booking) => (
              <article
                className='bg-white tw-rounded-lg tw-p-5 d-flex flex-wrap tw-gap-5 align-items-center'
                key={booking.booking_id}
              >
                {booking.hotel_thumbnail ? (
                  <Image
                    alt={booking.hotel_name}
                    className='tw-rounded-lg object-fit-cover'
                    height={130}
                    src={booking.hotel_thumbnail}
                    width={170}
                  />
                ) : null}
                <div className='flex-grow-1'>
                  <div className='d-flex align-items-center tw-gap-3 flex-wrap tw-mb-2'>
                    <h2 className='tw-text-7 fw-normal mb-0'>
                      {booking.hotel_name}
                    </h2>
                    <span className='badge text-bg-light text-capitalize'>
                      {booking.status}
                    </span>
                  </div>
                  <p className='tw-mb-2'>
                    {booking.check_in} {t("myBookings.to")} {booking.check_out}
                  </p>
                  <p className='mb-0'>
                    {t("myBookings.bookingId")}: <strong>{booking.booking_id}</strong>
                  </p>
                </div>
                <div className='text-xl-end'>
                  <strong className='tw-text-6 text-heading d-block tw-mb-3'>
                    {formatMoney(booking.total)}
                  </strong>
                  <Link
                    className='font-heading text-heading hover-text-main-600'
                    href={`/hotel/${booking.hotel_id}`}
                  >
                    {t("myBookings.viewHotel")} <i className='ph ph-arrow-up-right' />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
