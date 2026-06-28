"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { BookingSummary } from "@/types/booking";
import { useCurrency } from "@/lib/currency/CurrencyContext";

interface InvoiceGeneratorProps {
  booking: BookingSummary;
}

export default function InvoiceGenerator({ booking }: InvoiceGeneratorProps) {
  const { formatMoney } = useCurrency();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const title = booking.is_group_booking ? "HỢP ĐỒNG ĐẶT PHÒNG" : "HÓA ĐƠN ĐẶT PHÒNG";
  const fileName = booking.is_group_booking 
    ? `Hop_Dong_${booking.booking_id}.pdf` 
    : `Hoa_Don_${booking.booking_id}.pdf`;

  const generatePDF = async () => {
    if (!invoiceRef.current) return;
    setIsGenerating(true);
    try {
      const element = invoiceRef.current;
      // Temporarily make it visible for capture
      element.style.display = "block";
      
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF", error);
    } finally {
      if (invoiceRef.current) {
        invoiceRef.current.style.display = "none";
      }
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button 
        onClick={generatePDF} 
        disabled={isGenerating}
        className="btn btn-outline-secondary d-flex align-items-center tw-gap-2"
      >
        <i className="ph ph-download-simple" />
        {isGenerating ? "Đang tạo PDF..." : `Tải ${booking.is_group_booking ? 'Hợp đồng' : 'Hóa đơn'}`}
      </button>

      {/* Hidden Invoice Template */}
      <div 
        ref={invoiceRef} 
        style={{ 
          display: "none", 
          width: "210mm", 
          padding: "20mm", 
          backgroundColor: "white", 
          color: "black",
          position: "absolute",
          top: "-9999px",
          left: "-9999px"
        }}
      >
        <div className="text-center tw-mb-8 border-bottom tw-pb-6">
          <h1 className="tw-text-3xl fw-bold">{title}</h1>
          <p className="tw-text-sm tw-mt-2">Mã số: {booking.booking_id}</p>
          <p className="tw-text-sm">Ngày tạo: {new Date(booking.created_at).toLocaleDateString("vi-VN")}</p>
        </div>

        <div className="row tw-mb-8">
          <div className="col-6">
            <h3 className="tw-text-lg fw-bold border-bottom tw-pb-2 tw-mb-3">Khách sạn</h3>
            <p><strong>Tên:</strong> {booking.hotel_name}</p>
          </div>
          <div className="col-6">
            <h3 className="tw-text-lg fw-bold border-bottom tw-pb-2 tw-mb-3">Khách hàng</h3>
            <p><strong>Tên:</strong> {booking.customer.first_name} {booking.customer.last_name}</p>
            <p><strong>Email:</strong> {booking.customer.email}</p>
            <p><strong>Số ĐT:</strong> {booking.customer.phone}</p>
          </div>
        </div>

        <div className="tw-mb-8">
          <h3 className="tw-text-lg fw-bold border-bottom tw-pb-2 tw-mb-3">Thông tin lưu trú</h3>
          <p><strong>Nhận phòng:</strong> {booking.check_in}</p>
          <p><strong>Trả phòng:</strong> {booking.check_out}</p>
          <p>
            <strong>Số lượng:</strong> {booking.guests.adults} người lớn, {booking.guests.children} trẻ em
          </p>
        </div>

        <div className="tw-mb-8">
          <h3 className="tw-text-lg fw-bold border-bottom tw-pb-2 tw-mb-3">Chi tiết phòng</h3>
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Loại phòng</th>
                <th className="text-center">Số lượng</th>
                <th className="text-end">Đơn giá</th>
              </tr>
            </thead>
            <tbody>
              {booking.rooms?.map((room, idx) => (
                <tr key={idx}>
                  <td>{room.room_type_name}</td>
                  <td className="text-center">{room.quantity}</td>
                  <td className="text-end">{formatMoney(room.price)}/đêm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-end">
          <div className="tw-w-1/2">
            <table className="table table-borderless">
              <tbody>
                <tr>
                  <td>Tạm tính:</td>
                  <td className="text-end">{formatMoney(booking.price?.subtotal || 0)}</td>
                </tr>
                <tr>
                  <td>Thuế & phí:</td>
                  <td className="text-end">{formatMoney(booking.price?.taxes_and_fees || 0)}</td>
                </tr>
                <tr className="border-top fw-bold tw-text-xl">
                  <td>Tổng cộng:</td>
                  <td className="text-end text-main-600">{formatMoney(booking.total)}</td>
                </tr>
                {(booking.deposit_amount || 0) > 0 && (
                  <tr>
                    <td>Tiền cọc (Đã TT: {booking.is_deposit_paid ? 'Rồi' : 'Chưa'}):</td>
                    <td className="text-end">{formatMoney(booking.deposit_amount || 0)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center tw-mt-12 tw-pt-8 border-top text-secondary tw-text-sm">
          <p className="tw-mb-2">Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!</p>
          <div className="tw-mt-4">
            <p className="mb-1 fw-medium text-dark">Mọi thắc mắc xin vui lòng liên hệ:</p>
            <p className="mb-1">Email: support@bookin.xloc.id.vn</p>
            <p className="mb-0">Hotline: 1900 1234</p>
          </div>
          {booking.is_group_booking && (
            <div className="tw-mt-8 row text-dark">
              <div className="col-6 fw-bold">ĐẠI DIỆN KHÁCH HÀNG<br/><br/><br/><br/></div>
              <div className="col-6 fw-bold">ĐẠI DIỆN KHÁCH SẠN<br/><br/><br/><br/></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
