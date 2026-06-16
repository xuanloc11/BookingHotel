"use client";

import { useEffect, useState } from "react";
import { getVendorBookings, updateVendorBookingStatus } from "@/lib/api/vendorApi";

export default function VendorBookingsManage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    setLoading(true);
    getVendorBookings()
      .then((res) => setBookings(res.bookings))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    if (!confirm(`Xác nhận chuyển trạng thái đơn này thành ${newStatus.toUpperCase()}?`)) return;
    
    try {
      await updateVendorBookingStatus(bookingId, newStatus);
      fetchBookings(); // Refresh data
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div>
      <h3 className="fw-bold mb-4">Quản lý Đơn đặt phòng</h3>
      
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {bookings.length === 0 ? (
            <div className="text-center py-5 text-neutral-500">
              <div className="tw-text-5xl mb-3"><i className="ph ph-calendar-x" /></div>
              <p className="m-0">Chưa có đơn đặt phòng nào.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle m-0">
                <thead className="table-light">
                  <tr>
                    <th className="py-3 px-4">Mã đơn</th>
                    <th className="py-3">Ngày nhận/trả</th>
                    <th className="py-3">Thông tin khách</th>
                    <th className="py-3">Tổng tiền</th>
                    <th className="py-3">Trạng thái</th>
                    <th className="py-3 px-4 text-end">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.booking_id}>
                      <td className="px-4">
                        <span className="fw-bold">#{b.booking_id}</span>
                        <div className="tw-text-xs text-neutral-500 mt-1">{new Date(b.created_at).toLocaleDateString('vi-VN')}</div>
                      </td>
                      <td>
                        <div className="fw-medium">{b.check_in}</div>
                        <div className="text-neutral-500 tw-text-sm">đến {b.check_out}</div>
                      </td>
                      <td>
                        <div className="fw-medium">{b.guests.adults} NL, {b.guests.children} TE</div>
                        <div className="tw-text-sm text-neutral-500">Khách hàng đặt qua App</div>
                      </td>
                      <td className="fw-bold text-main-600">{b.total.toLocaleString('vi-VN')} ₫</td>
                      <td>
                        <span className={`badge ${
                          b.status === 'confirmed' ? 'bg-success' : 
                          b.status === 'pending' ? 'bg-warning text-dark' : 
                          b.status === 'completed' ? 'bg-primary' : 'bg-danger'
                        }`}>
                          {b.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 text-end">
                        <div className="dropdown">
                          <button className="btn btn-light btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Đổi trạng thái
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                            <li><button className="dropdown-item" onClick={() => handleStatusChange(b.booking_id, 'confirmed')}><i className="ph ph-check text-success me-2"/> Xác nhận (Confirmed)</button></li>
                            <li><button className="dropdown-item" onClick={() => handleStatusChange(b.booking_id, 'completed')}><i className="ph ph-flag text-primary me-2"/> Hoàn tất (Completed)</button></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><button className="dropdown-item text-danger" onClick={() => handleStatusChange(b.booking_id, 'cancelled')}><i className="ph ph-x text-danger me-2"/> Hủy đơn (Cancelled)</button></li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
