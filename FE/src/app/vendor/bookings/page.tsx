"use client";

import { useEffect, useState } from "react";
import { getVendorBookings, updateVendorBookingStatus } from "@/lib/api/vendorApi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function VendorBookingsManage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    setLoading(true);
    getVendorBookings()
      .then((res) => setBookings(res.bookings))
      .catch((err) => toast.error("Lỗi khi tải dữ liệu đơn đặt: " + err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    let actionText = newStatus.toUpperCase();
    let actionColor = "#3085d6";
    let icon: any = "info";

    if (newStatus === 'cancelled') {
      actionText = "HỦY";
      actionColor = "#d33";
      icon = "warning";
    } else if (newStatus === 'confirmed') {
      actionText = "XÁC NHẬN";
      actionColor = "#28a745";
      icon = "question";
    } else if (newStatus === 'completed') {
      actionText = "ĐÁNH DẤU HOÀN TẤT";
      actionColor = "#17a2b8";
    }

    const result = await Swal.fire({
      title: `${actionText} ĐƠN ĐẶT PHÒNG?`,
      text: `Xác nhận chuyển trạng thái đơn #${bookingId} thành ${actionText}?`,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: actionColor,
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy bỏ",
    });

    if (!result.isConfirmed) return;
    
    try {
      toast.loading("Đang cập nhật trạng thái...", { id: `status-${bookingId}` });
      await updateVendorBookingStatus(bookingId, newStatus);
      toast.success("Cập nhật trạng thái thành công!", { id: `status-${bookingId}` });
      fetchBookings(); // Refresh data
    } catch (err: any) {
      toast.error("Lỗi: " + err.message, { id: `status-${bookingId}` });
    }
  };

  return (
    <>
      <div className="row mt-4">
        <div className="col-12">
          <div className="page-title-box">
            <h4 className="page-title">Quản lý Đơn đặt phòng</h4>
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
                      <th className="py-3">Ngày nhận/trả</th>
                      <th className="py-3">Thông tin khách</th>
                      <th className="py-3">Tổng tiền</th>
                      <th className="py-3">Trạng thái</th>
                      <th className="py-3 px-4 text-end">Thao tác</th>
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
                            <i className="ri-calendar-close-line display-4"></i>
                            <h5 className="mt-3">Chưa có đơn đặt phòng nào</h5>
                            <p className="mb-0">Khách sạn của bạn chưa nhận được yêu cầu đặt phòng nào.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      bookings.map((b) => (
                        <tr key={b.booking_id}>
                          <td className="px-4">
                            <span className="fw-bold">#{b.booking_id}</span>
                            <div className="fs-6 text-muted mt-1">{new Date(b.created_at).toLocaleDateString('vi-VN')}</div>
                          </td>
                          <td>
                            <div className="fw-medium">{b.check_in}</div>
                            <div className="text-muted fs-6">đến {b.check_out}</div>
                          </td>
                          <td>
                            <div className="fw-medium">{b.guests.adults} NL, {b.guests.children} TE</div>
                            <div className="fs-6 text-muted">Khách hàng đặt qua App</div>
                          </td>
                          <td className="fw-bold text-primary">{b.total.toLocaleString('vi-VN')} ₫</td>
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
                          <td className="px-4 text-end">
                            <div className="dropdown">
                              <button className="btn btn-light btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Đổi trạng thái
                              </button>
                              <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                                <li><button className="dropdown-item" onClick={() => handleStatusChange(b.booking_id, 'confirmed')}><i className="ri-check-line text-success me-2"/> Xác nhận đơn</button></li>
                                <li><button className="dropdown-item" onClick={() => handleStatusChange(b.booking_id, 'completed')}><i className="ri-flag-line text-primary me-2"/> Đánh dấu hoàn tất</button></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><button className="dropdown-item text-danger" onClick={() => handleStatusChange(b.booking_id, 'cancelled')}><i className="ri-close-line text-danger me-2"/> Hủy đơn đặt</button></li>
                              </ul>
                            </div>
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
