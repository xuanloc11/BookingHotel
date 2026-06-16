"use client";

import { useEffect, useState } from "react";
import { getAdminBookings } from "@/lib/api/adminApi";
import toast from "react-hot-toast";

export default function AdminBookingsManage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAdminBookings()
      .then((res) => setBookings(res.bookings))
      .catch((err) => toast.error("Lỗi khi tải dữ liệu đơn đặt phòng: " + err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="row mt-4">
        <div className="col-12">
          <div className="page-title-box">
            <h4 className="page-title">Quản lý Đơn đặt phòng (Toàn hệ thống)</h4>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover table-centered mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="py-3 px-4">Mã đơn</th>
                      <th className="py-3">Khách hàng</th>
                      <th className="py-3">Khách sạn</th>
                      <th className="py-3">Ngày nhận - trả</th>
                      <th className="py-3">Tổng tiền</th>
                      <th className="py-3">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="text-center py-5">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <p className="text-muted mt-2 mb-0">Đang tải danh sách đơn đặt phòng...</p>
                        </td>
                      </tr>
                    ) : bookings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-5">
                          <div className="text-muted">
                            <i className="ri-calendar-event-line display-4"></i>
                            <h5 className="mt-3">Chưa có đơn đặt phòng nào</h5>
                            <p className="mb-0">Hệ thống chưa ghi nhận giao dịch đặt phòng nào.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      bookings.map((b) => (
                        <tr key={b.booking_id}>
                          <td className="px-4">
                            <span className="fw-bold">#{b.booking_id}</span>
                          </td>
                          <td>
                            <div className="fw-medium">{b.customer_name}</div>
                            <div className="fs-6 text-muted">{b.customer_email}</div>
                          </td>
                          <td>
                            <div className="fw-medium text-primary">{b.hotel_name}</div>
                          </td>
                          <td>
                            <div>In: <span className="fw-medium">{b.check_in}</span></div>
                            <div>Out: <span className="fw-medium">{b.check_out}</span></div>
                          </td>
                          <td>
                            <div className="fw-medium">{b.total?.toLocaleString('vi-VN')} ₫</div>
                          </td>
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
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
