"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminDashboard } from "@/lib/api/adminApi";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <>
      <div className="row mt-4">
        <div className="col-12">
          <div className="page-title-box">
            <h4 className="page-title">Tổng quan Hệ thống</h4>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-xxl-3 col-sm-6">
          <div className="card widget-flat">
            <div className="card-body">
              <div className="float-end">
                <i className="ri-group-line widget-icon bg-primary-lighten text-primary"></i>
              </div>
              <h5 className="text-muted fw-normal mt-0" title="Tổng người dùng">Người dùng</h5>
              <h3 className="mt-3 mb-3">{data?.total_users || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-xxl-3 col-sm-6">
          <div className="card widget-flat">
            <div className="card-body">
              <div className="float-end">
                <i className="ri-building-4-line widget-icon bg-info-lighten text-info"></i>
              </div>
              <h5 className="text-muted fw-normal mt-0" title="Tổng đối tác/khách sạn">Khách sạn đối tác</h5>
              <h3 className="mt-3 mb-3">{data?.total_hotels || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-xxl-3 col-sm-6">
          <div className="card widget-flat">
            <div className="card-body">
              <div className="float-end">
                <i className="ri-calendar-check-line widget-icon bg-warning-lighten text-warning"></i>
              </div>
              <h5 className="text-muted fw-normal mt-0" title="Tổng đơn đặt phòng">Đơn đặt phòng</h5>
              <h3 className="mt-3 mb-3">{data?.total_bookings || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-xxl-3 col-sm-6">
          <div className="card widget-flat">
            <div className="card-body">
              <div className="float-end">
                <i className="ri-money-dollar-box-line widget-icon bg-success-lighten text-success"></i>
              </div>
              <h5 className="text-muted fw-normal mt-0" title="Tổng doanh thu toàn sàn">Doanh thu sàn</h5>
              <h3 className="mt-3 mb-3">{data?.total_revenue?.toLocaleString('vi-VN') || 0} ₫</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom pt-4 pb-3">
              <h5 className="fw-bold m-0">Giao dịch gần đây trên hệ thống</h5>
            </div>
            <div className="card-body">
              {!data?.recent_bookings || data.recent_bookings.length === 0 ? (
                <p className="text-muted text-center py-4">Chưa có giao dịch nào.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-centered table-nowrap mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Mã đơn</th>
                        <th>Khách sạn</th>
                        <th>Khách hàng</th>
                        <th>Ngày nhận/trả</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recent_bookings.map((b: any) => (
                        <tr key={b.booking_id}>
                          <td><span className="fw-medium">#{b.booking_id}</span></td>
                          <td>{b.hotel_name}</td>
                          <td>{b.guests.adults} NL, {b.guests.children} TE</td>
                          <td>{b.check_in} &rarr; {b.check_out}</td>
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
                <Link href="/admin/bookings" className="btn btn-outline-primary btn-sm">Xem tất cả đơn</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
