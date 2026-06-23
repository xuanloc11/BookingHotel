"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ZodError } from "zod";

import { createBooking } from "@/lib/api/bookingApi";
import { readStoredAccessToken } from "@/lib/api/authApi";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useCurrency } from "@/lib/currency/CurrencyContext";
import type {
  BookingPriceBreakdown,
  CheckoutSelection,
  CreateBookingRequest,
  PaymentMethod,
  PaymentProvider,
} from "@/types/booking";
import type { HotelDetails } from "@/types/hotel";

interface CheckoutFormProps {
  hotel: HotelDetails;
  selection: CheckoutSelection;
  price: BookingPriceBreakdown;
}

const paymentProviders: Record<PaymentMethod, PaymentProvider> = {
  pay_at_hotel: "manual",
  bank_transfer: "manual",
  card: "stripe",
};

function value(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "");
}

function getPaymentMethod(formData: FormData): PaymentMethod {
  const method = value(formData, "payment_method");

  if (method === "bank_transfer" || method === "card") {
    return method;
  }

  return "pay_at_hotel";
}

export default function CheckoutForm({
  hotel,
  selection,
  price,
}: CheckoutFormProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const { formatMoney } = useCurrency();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const paymentMethod = getPaymentMethod(formData);
    const payload: CreateBookingRequest = {
      hotel_id: selection.hotel_id,
      check_in: selection.check_in,
      check_out: selection.check_out,
      guests: selection.guests,
      customer: {
        first_name: value(formData, "first_name"),
        last_name: value(formData, "last_name"),
        email: value(formData, "email"),
        phone: value(formData, "phone"),
        country: value(formData, "country"),
        special_requests: value(formData, "special_requests"),
      },
      payment: {
        method: paymentMethod,
        provider: paymentProviders[paymentMethod],
      },
    };

    try {
      const response = await createBooking(payload, {
        authToken: readStoredAccessToken() ?? undefined,
      });
      const params = new URLSearchParams({
        bookingId: response.booking_id,
        status: response.status,
        hotelName: hotel.name,
        checkIn: response.check_in,
        checkOut: response.check_out,
      });

      router.push(`/booking-success?${params.toString()}`);
    } catch (requestError) {
      if (requestError instanceof ZodError) {
        setError(requestError.issues[0]?.message ?? "Checkout details are invalid.");
      } else {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Booking request failed.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className='bg_2 pt-120 pb-120'>
      <div className='container'>
        <div className='row row-gap-5'>
          <div className='col-xl-4'>
            {/* Hotel & Booking Summary Card */}
            <aside className='bg-white tw-rounded-lg tw-p-8 tw-mb-6 tw-shadow-sm border border-neutral'>
              <Image
                alt={hotel.name}
                className='tw-rounded-lg w-100 object-fit-cover tw-mb-6'
                height={300}
                src={hotel.thumbnail}
                width={520}
              />
              <h2 className='tw-text-6 fw-normal tw-mb-2'>{hotel.name}</h2>
              <p className='tw-mb-4 tw-text-sm text-secondary'>{hotel.address}</p>

              <div className='border-top tw-pt-4 tw-mt-4'>
                <h3 className='tw-text-base fw-bold tw-mb-3'>{t("checkout.booking")}</h3>
                <div className='d-flex justify-content-between tw-mb-2 tw-text-sm'>
                  <span>{t("calendar.checkIn")}</span>
                  <strong>{selection.check_in}</strong>
                </div>
                <div className='d-flex justify-content-between tw-mb-3 tw-text-sm'>
                  <span>{t("calendar.checkOut")}</span>
                  <strong>{selection.check_out}</strong>
                </div>
                <div className='d-flex justify-content-between tw-text-sm'>
                  <span>{t("checkout.quantity")}</span>
                  <strong className='text-end'>
                    {selection.guests.adults} {t("checkout.adultsCount")}, {selection.guests.children}{" "}
                    {t("checkout.childrenCount")}, {selection.guests.rooms} {t("checkout.roomsCount")}
                  </strong>
                </div>
              </div>
            </aside>

            {/* Price Summary Card */}
            <aside className='bg-white tw-rounded-lg tw-p-8 tw-shadow-sm border border-neutral'>
              <h3 className='tw-text-lg fw-bold tw-mb-4'>{t("checkout.totalAmount")}</h3>
              
              <div className='d-flex justify-content-between tw-mb-3 tw-text-sm'>
                <p className='tw-text-sm text-neutral-500 mb-0'>
                  {formatMoney(price.nightly_rate)} x {price.nights}{" "}
                  {t("checkout.nights")}
                </p>
                <strong>{formatMoney(price.subtotal)}</strong>
              </div>
              
              <div className='border-top tw-pt-4 tw-mt-4 tw-mb-4'>
                <h3 className='tw-text-base fw-bold tw-mb-3'>{t("checkout.priceDetails")}</h3>
                <div className='d-flex align-items-start tw-gap-3 tw-mb-2'>
                  <i className='ph-bold ph-money tw-text-xl'></i>
                  <div className='w-100'>
                    <p className='tw-text-sm text-neutral-500 mb-0'>
                    {t("checkout.included")} {formatMoney(price.taxes_and_fees)} {t("checkout.includesTaxes")}
                  </p>
                    <div className='d-flex justify-content-between tw-text-sm text-secondary tw-mb-1'>
                      <span>8% {t("checkout.vat")}</span>
                      <span>{formatMoney(Math.round(price.subtotal * 0.08))}</span>
                    </div>
                    <div className='d-flex justify-content-between tw-text-sm text-secondary'>
                      <span>5% {t("checkout.serviceFee")}</span>
                      <span>{formatMoney(Math.round(price.subtotal * 0.05))}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className='bg-main-50 tw-p-4 tw-rounded-md tw-mb-4'>
                <div className='d-flex justify-content-between align-items-center mb-0'>
                  <strong className='tw-text-lg'>{t("checkout.total")}</strong>
                  <span className='fw-bold tw-text-lg'>{formatMoney(price.total)}</span>
                </div>
              </div>
            </aside>
          </div>

          <div className='col-xl-8'>
            <div className='bg-white tw-rounded-lg tw-p-10 tw-shadow-sm border border-neutral'>
              <h2 className='tw-text-8 fw-bold tw-mb-4'>
                {t("checkout.customerInfo")}
              </h2>

              <div className='alert alert-info d-flex tw-gap-3 align-items-center tw-mb-8'>
                <i className='ph-fill ph-info tw-text-2xl text-main-600'></i>
                <div>
                  <p className='fw-bold mb-0'>{t("checkout.almostDone")}</p>
                  <p className='mb-0 tw-text-sm'>{t("checkout.useLatin")}</p>
                </div>
              </div>

              {error ? (
                <div className='alert alert-danger' role='alert'>
                  {error}
                </div>
              ) : null}

              <form onSubmit={handleSubmit}>
                <div className='row row-gap-4'>
                  <div className='col-md-6'>
                    <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
                      {t("checkout.firstName")} <span className='text-danger'>*</span>
                    </label>
                    <input
                      className='form-control tw-h-14'
                      maxLength={80}
                      name='first_name'
                      required
                      type='text'
                    />
                  </div>
                  <div className='col-md-6'>
                    <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
                      {t("checkout.lastName")} <span className='text-danger'>*</span>
                    </label>
                    <input
                      className='form-control tw-h-14'
                      maxLength={80}
                      name='last_name'
                      required
                      type='text'
                    />
                  </div>
                  <div className='col-md-6'>
                    <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
                      {t("checkout.email")} <span className='text-danger'>*</span>
                    </label>
                    <input
                      className='form-control tw-h-14'
                      name='email'
                      required
                      type='email'
                    />
                    <small className='text-secondary tw-text-xs tw-mt-1 d-block'>{t("checkout.emailHelp")}</small>
                  </div>
                  <div className='col-md-6'>
                    <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
                      {t("checkout.phone")} <span className='text-danger'>*</span>
                    </label>
                    <input
                      className='form-control tw-h-14'
                      maxLength={30}
                      name='phone'
                      required
                      type='tel'
                    />
                  </div>
                  <div className='col-md-6'>
                    <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
                      {t("checkout.country")} <span className='text-danger'>*</span>
                    </label>
                    <input
                      className='form-control tw-h-14'
                      maxLength={80}
                      name='country'
                      required
                      type='text'
                    />
                  </div>
                  <div className='col-md-6'>
                    <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
                      {t("checkout.paymentMethod")} <span className='text-danger'>*</span>
                    </label>
                    <select
                      className='form-select tw-h-14'
                      defaultValue='pay_at_hotel'
                      name='payment_method'
                    >
                      <option value='pay_at_hotel'>{t("checkout.payAtHotel")}</option>
                      <option value='bank_transfer'>{t("checkout.bankTransfer")}</option>
                      <option value='card'>{t("checkout.card")}</option>
                    </select>
                  </div>
                  <div className='col-12'>
                    <hr className='tw-my-4 text-neutral' />
                    <h3 className='tw-text-lg fw-bold tw-mb-4'>{t("checkout.specialRequests")}</h3>
                    <p className='tw-text-sm tw-mb-3'>
                      {t("checkout.specialRequestsDesc")}
                    </p>
                    <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
                      {t("checkout.specialRequestsLabel")}
                    </label>
                    <textarea
                      className='form-control'
                      maxLength={500}
                      name='special_requests'
                      rows={5}
                    />
                  </div>
                  <div className='col-12'>
                    <label className='form-check-label d-flex align-items-start tw-gap-3 tw-mt-4'>
                      <input className='form-check-input mt-1' required type='checkbox' />
                      <span className='tw-text-sm'>
                        {t("checkout.confirmDetails")}
                      </span>
                    </label>
                  </div>
                  <div className='col-12 text-end tw-mt-6'>
                    <button
                      className='tw-btn-hover-black bg-main-600 tw-py-4 tw-px-8 text-heading font-heading d-inline-flex align-items-center justify-content-center tw-gap-2 tw-rounded-lg'
                      disabled={submitting}
                      type='submit'
                    >
                      {submitting ? t("checkout.creatingBooking") : t("checkout.nextFinalDetails")}
                      <span className='d-inline-block lh-1 tw-text-lg'>
                        <i className='ph-bold ph-caret-right' />
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
