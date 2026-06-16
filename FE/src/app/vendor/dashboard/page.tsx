"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getVendorDashboard } from "@/lib/api/vendorApi";

export default function VendorDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVendorDashboard()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Đang tải dữ liệu...</div>;

  if (!data?.has_hotel) {
    return (
      <div className="card shadow-sm border-0">
        <div className="card-body text-center py-5">
          <div className="tw-text-6xl text-neutral-300 mb-3"><i className="ph ph-buildings" /></div>
          <h4 className="card-title fw-bold">Chưa có khách sạn nào</h4>
          <p className="card-text text-neutral-500 mb-4">Bạn cần thêm khách sạn của mình để bắt đầu quản lý và nhận đơn đặt phòng.</p>
          <Link href="/vendor/hotels" className="btn btn-primary fw-medium px-4">
            Thêm khách sạn ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="fw-bold mb-4">Tổng quan: {data.hotel_name}</h3>
      
      <div className="row g-4 mb-5">
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h6 className="card-title text-neutral-500 m-0">Tổng doanh thu</h6>
                <div className="bg-main-50 text-main-600 rounded p-2"><i className="ph ph-money tw-text-xl" /></div>
              </div>
              <h2 className="fw-bold m-0">{data.total_revenue.toLocaleString('vi-VN')} ₫</h2>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h6 className="card-title text-neutral-500 m-0">Đơn đặt phòng</h6>
                <div className="bg-blue-50 text-blue-600 rounded p-2"><i className="ph ph-calendar-check tw-text-xl" /></div>
              </div>
              <h2 className="fw-bold m-0">{data.total_bookings}</h2>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h6 className="card-title text-neutral-500 m-0">Số loại phòng</h6>
                <div className="bg-green-50 text-green-600 rounded p-2"><i className="ph ph-door tw-text-xl" /></div>
              </div>
              <h2 className="fw-bold m-0">{data.rooms_count}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
          <h5 className="fw-bold m-0">Đơn đặt phòng gần đây</h5>
        </div>
        <div className="card-body">
          {data.recent_bookings.length === 0 ? (
            <p className="text-neutral-500 text-center py-4">Chưa có đơn đặt phòng nào.</p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Ngày nhận</th>
                    <th>Ngày trả</th>
                    <th>Khách</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent_bookings.map((b: any) => (
                    <tr key={b.booking_id}>
                      <td><span className="fw-medium">#{b.booking_id}</span></td>
                      <td>{b.check_in}</td>
                      <td>{b.check_out}</td>
                      <td>{b.guests.adults} NL, {b.guests.children} TE</td>
                      <td className="fw-medium text-main-600">{b.total.toLocaleString('vi-VN')} ₫</td>
                      <td>
                        <span className={`badge ${
                          b.status === 'confirmed' ? 'bg-success' : 
                          b.status === 'pending' ? 'bg-warning text-dark' : 
                          b.status === 'completed' ? 'bg-primary' : 'bg-danger'
                        }`}>
                          {b.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="text-center mt-3">
            <Link href="/vendor/bookings" className="btn btn-outline-primary btn-sm">Xem tất cả đơn</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
