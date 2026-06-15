"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ZodError } from "zod";

import { createBooking } from "@/lib/api/bookingApi";
import { readStoredAccessToken } from "@/lib/api/authApi";
import type {
  BookingPriceBreakdown,
  CheckoutSelection,
  CreateBookingRequest,
  PaymentMethod,
  PaymentProvider,
} from "@/types/booking";
import type { HotelDetails } from "@/types/hotel";

const moneyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

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
          <div className='col-xl-7'>
            <div className='bg-white tw-rounded-lg tw-p-10'>
              <h2 className='tw-text-10 fw-normal tw-mb-7'>
                Thông tin khách hàng
              </h2>

              {error ? (
                <div className='alert alert-danger' role='alert'>
                  {error}
                </div>
              ) : null}

              <form onSubmit={handleSubmit}>
                <div className='row row-gap-4'>
                  <div className='col-md-6'>
                    <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
                      Họ
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
                      Tên
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
                      Email
                    </label>
                    <input
                      className='form-control tw-h-14'
                      name='email'
                      required
                      type='email'
                    />
                  </div>
                  <div className='col-md-6'>
                    <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
                      Số điện thoại
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
                      Quốc gia
                    </label>
                    <input
                      className='form-control tw-h-14'
                      maxLength={80}
                      name='country'
                      type='text'
                    />
                  </div>
                  <div className='col-md-6'>
                    <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
                      Phương thức thanh toán
                    </label>
                    <select
                      className='form-select tw-h-14'
                      defaultValue='pay_at_hotel'
                      name='payment_method'
                    >
                      <option value='pay_at_hotel'>Thanh toán tại khách sạn</option>
                      <option value='bank_transfer'>Chuyển khoản ngân hàng</option>
                      <option value='card'>Thẻ</option>
                    </select>
                  </div>
                  <div className='col-12'>
                    <label className='tw-text-sm fw-bold text-heading tw-mb-2'>
                      Yêu cầu đặc biệt
                    </label>
                    <textarea
                      className='form-control'
                      maxLength={500}
                      name='special_requests'
                      rows={5}
                    />
                  </div>
                  <div className='col-12'>
                    <label className='form-check-label d-flex align-items-start tw-gap-3'>
                      <input className='form-check-input mt-1' required type='checkbox' />
                      <span>
                        Tôi xác nhận chi tiết thông tin khách hàng là chính xác và hiểu rằng tổng số tiền cuối cùng sẽ được tính bởi hệ thống của khách sạn.
                      </span>
                    </label>
                  </div>
                  <div className='col-12'>
                    <button
                      className='tw-btn-hover-black bg-main-600 tw-py-5 tw-px-12 text-heading font-heading d-inline-flex align-items-center justify-content-center tw-gap-2 tw-rounded-lg w-100'
                      disabled={submitting}
                      type='submit'
                    >
                      {submitting ? "Creating booking..." : "Confirm booking"}
                      <span className='d-inline-block lh-1 tw-text-lg'>
                        <i className='ph ph-arrow-up-right' />
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className='col-xl-5'>
            <aside className='bg-white tw-rounded-lg tw-p-8'>
              <Image
                alt={hotel.name}
                className='tw-rounded-lg w-100 object-fit-cover tw-mb-6'
                height={300}
                src={hotel.thumbnail}
                width={520}
              />
              <h2 className='tw-text-8 fw-normal tw-mb-3'>{hotel.name}</h2>
              <p className='tw-mb-6'>{hotel.address}</p>

              <div className='border-top border-bottom tw-py-5 tw-mb-5'>
                <div className='d-flex justify-content-between tw-mb-3'>
                  <span>Check-in</span>
                  <strong>{selection.check_in}</strong>
                </div>
                <div className='d-flex justify-content-between tw-mb-3'>
                  <span>Check-out</span>
                  <strong>{selection.check_out}</strong>
                </div>
                <div className='d-flex justify-content-between'>
                  <span>Số lượng</span>
                  <strong>
                    {selection.guests.adults} người lớn, {selection.guests.children}{" "}
                    trẻ em, {selection.guests.rooms} phòng
                  </strong>
                </div>
              </div>

              <div className='d-flex justify-content-between tw-mb-3'>
                <span>
                  {moneyFormatter.format(price.nightly_rate)} x {price.nights}{" "}
                  nights x {price.rooms} rooms
                </span>
                <strong>{moneyFormatter.format(price.subtotal)}</strong>
              </div>
              <div className='d-flex justify-content-between tw-mb-4'>
                <span>Thuế và phí</span>
                <strong>{moneyFormatter.format(price.taxes_and_fees)}</strong>
              </div>
              <div className='d-flex justify-content-between tw-text-6 text-heading'>
                <span>Tổng tiền</span>
                <strong>{moneyFormatter.format(price.total)}</strong>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
