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

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="text-center">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="mt-3 text-muted">Đang tải dữ liệu tổng quan...</h5>
      </div>
    </div>
  );

  if (!data?.has_hotel) {
    return (
      <div className="row mt-4">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center py-5">
              <div className="display-4 text-muted mb-3"><i className="ri-building-4-line" /></div>
              <h4 className="card-title fw-bold">Chưa có khách sạn nào</h4>
              <p className="card-text text-muted mb-4">Bạn cần thêm khách sạn của mình để bắt đầu quản lý và nhận đơn đặt phòng.</p>
              <Link href="/vendor/hotels" className="btn btn-primary fw-medium px-4">
                Thêm khách sạn ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="row mt-4">
        <div className="col-12">
          <div className="page-title-box">
            <h4 className="page-title">Tổng quan: {data.hotel_name}</h4>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-xxl-4 col-sm-6">
          <div className="card widget-flat">
            <div className="card-body">
              <div className="float-end">
                <i className="ri-money-dollar-box-line widget-icon bg-success-lighten text-success"></i>
              </div>
              <h5 className="text-muted fw-normal mt-0" title="Tổng doanh thu">Tổng doanh thu</h5>
              <h3 className="mt-3 mb-3">{data.total_revenue.toLocaleString('vi-VN')} ₫</h3>
            </div>
          </div>
        </div>

        <div className="col-xxl-4 col-sm-6">
          <div className="card widget-flat">
            <div className="card-body">
              <div className="float-end">
                <i className="ri-calendar-check-line widget-icon bg-info-lighten text-info"></i>
              </div>
              <h5 className="text-muted fw-normal mt-0" title="Đơn đặt phòng">Đơn đặt phòng</h5>
              <h3 className="mt-3 mb-3">{data.total_bookings}</h3>
            </div>
          </div>
        </div>

        <div className="col-xxl-4 col-sm-6">
          <div className="card widget-flat">
            <div className="card-body">
              <div className="float-end">
                <i className="ri-door-open-line widget-icon bg-warning-lighten text-warning"></i>
              </div>
              <h5 className="text-muted fw-normal mt-0" title="Số loại phòng">Số loại phòng</h5>
              <h3 className="mt-3 mb-3">{data.rooms_count}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom pt-4 pb-3">
              <h5 className="fw-bold m-0">Đơn đặt phòng gần đây</h5>
            </div>
            <div className="card-body">
              {data.recent_bookings.length === 0 ? (
                <p className="text-muted text-center py-4">Chưa có đơn đặt phòng nào.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-centered table-nowrap mb-0">
                    <thead className="table-light">
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
                          <td className="fw-medium text-primary">{b.total.toLocaleString('vi-VN')} ₫</td>
                          <td>
                            <span className={`badge ${
                              b.status === 'confirmed' ? 'bg-success' : 
                              b.status === 'pending' ? 'bg-warning text-dark' : 
                              b.status === 'completed' ? 'bg-info' : 'bg-danger'
                            }`}>
                              {b.status === 'confirmed' ? 'ĐÃ XÁC NHẬN' : 
                               b.status === 'pending' ? 'CHỜ DUYỆT' : 
                               b.status === 'completed' ? 'HOÀN TẤT' : 
                               b.status === 'cancelled' ? 'ĐÃ HỦY' : b.status.toUpperCase()}
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
      </div>
    </>
  );
}
