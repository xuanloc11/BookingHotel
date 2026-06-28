"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface FindBookingFormData {
  bookingId: string;
  contact: string;
}

export default function FindBookingForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FindBookingFormData>();

  const onSubmit = async (data: FindBookingFormData) => {
    setError(null);
    setLoading(true);
    try {
      // Just redirect to success page which will fetch and display it
      // or we could build a custom detail page here, but booking-success works perfectly!
      // Actually, booking-success says "Đặt phòng thành công". 
      // It's better to show it in a generic booking detail page if possible, 
      // but let's redirect to `/booking-success?bookingId=...&contact=...` to reuse the component
      // and we can change the "Thành công" texts based on URL params?
      // No, let's redirect to `/bookings/[id]` but since they might not be logged in,
      // `/bookings/[id]` needs to fetch guest booking if no auth?
      // Let's create a dedicated detail view or just redirect to `/booking-success` and let it be.
      
      const params = new URLSearchParams({
        bookingId: data.bookingId,
        contact: data.contact,
        isGuestView: "true" // flag to change UI text if needed
      });
      router.push(`/booking-success?${params.toString()}`);
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <div className="alert alert-danger tw-text-sm tw-mb-4">{error}</div>
      )}
      
      <div className="tw-mb-4">
        <label className="fw-bold tw-mb-2">Mã đơn hàng (Booking ID) <span className="text-danger">*</span></label>
        <input 
          type="text" 
          className={`form-control tw-h-14 ${errors.bookingId ? 'is-invalid' : ''}`} 
          placeholder="VD: BK-1A2B3C" 
          {...register("bookingId", { required: "Vui lòng nhập mã đơn hàng" })} 
        />
        {errors.bookingId && <small className="text-danger mt-1">{errors.bookingId.message}</small>}
      </div>

      <div className="tw-mb-6">
        <label className="fw-bold tw-mb-2">Email hoặc Số điện thoại <span className="text-danger">*</span></label>
        <input 
          type="text" 
          className={`form-control tw-h-14 ${errors.contact ? 'is-invalid' : ''}`} 
          placeholder="Nhập email hoặc SĐT đã đặt phòng" 
          {...register("contact", { required: "Vui lòng nhập thông tin liên hệ" })} 
        />
        {errors.contact && <small className="text-danger mt-1">{errors.contact.message}</small>}
      </div>

      <button 
        type="submit" 
        className="w-100 tw-btn-hover-black bg-main-600 tw-py-4 tw-px-8 text-heading font-heading fw-bold tw-rounded-lg d-flex justify-content-center align-items-center tw-gap-2"
        disabled={loading}
      >
        {loading ? (
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        ) : <i className="ph-bold ph-magnifying-glass"></i>}
        {loading ? "Đang tra cứu..." : "Tra cứu đơn hàng"}
      </button>
    </form>
  );
}
