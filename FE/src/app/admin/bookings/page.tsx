"use client";

import { useEffect, useState } from "react";
import { getAdminBookings, cancelAdminBooking } from "@/lib/api/adminApi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function AdminBookingsManage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // States for search, filter, pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchBookings = () => {
    setLoading(true);
    getAdminBookings()
      .then((res) => setBookings(res.bookings))
      .catch((err) => toast.error("Lỗi khi tải dữ liệu đơn đặt phòng: " + err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: string) => {
    const result = await Swal.fire({
      title: "Hủy đơn đặt phòng này?",
      text: `Hành động này sẽ ép hủy đơn #${bookingId}. Bạn có chắc chắn không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Đúng, hủy ngay!",
      cancelButtonText: "Quay lại",
    });

    if (!result.isConfirmed) return;

    try {
      toast.loading("Đang hủy đơn...", { id: `cancel-${bookingId}` });
      await cancelAdminBooking(bookingId);
      toast.success("Đã hủy đơn thành công!", { id: `cancel-${bookingId}` });
      fetchBookings();
    } catch (err: any) {
      toast.error("Lỗi: " + err.message, { id: `cancel-${bookingId}` });
    }
  };

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  // Derived state for filtering and pagination
  const filteredBookings = bookings.filter((b) => {
    if (filterStatus !== "all" && b.status !== filterStatus) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = String(b.booking_id).toLowerCase().includes(q);
      const matchName = b.customer_name?.toLowerCase().includes(q);
      const matchHotel = b.hotel_name?.toLowerCase().includes(q);
      return matchId || matchName || matchHotel;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <div className="row mt-4">
        <div className="col-12">
          <div className="page-title-box">
            <h4 className="page-title">Quản lý Đơn đặt phòng (Toàn hệ thống)</h4>
          </div>
        </div>
      </div>

      {/* Toolbar: Search & Filter */}
      <div className="row mb-4">
        <div className="col-12 col-md-6 mb-3 mb-md-0">
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white border-end-0 text-muted"><i className="ri-search-line"></i></span>
            <input 
              type="text" 
              className="form-control border-start-0 ps-0" 
              placeholder="Tìm theo Mã đơn, Tên khách, Tên khách sạn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="col-12 col-md-3">
          <select 
            className="form-select shadow-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="completed">Hoàn tất</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>
      
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover table-centered align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="py-3 px-4">Mã đơn</th>
                      <th className="py-3">Khách hàng</th>
                      <th className="py-3">Khách sạn</th>
                      <th className="py-3">Ngày nhận - trả</th>
                      <th className="py-3 text-end">Tổng tiền</th>
                      <th className="py-3 text-center">Trạng thái</th>
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
                            <i className="ri-calendar-event-line display-4"></i>
                            <h5 className="mt-3">Không tìm thấy đơn đặt phòng</h5>
                            <p className="mb-0">Vui lòng thử lại với từ khóa hoặc bộ lọc khác.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentBookings.map((b) => (
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
                          <td className="text-end">
                            <div className="fw-medium">{b.total?.toLocaleString('vi-VN')} ₫</div>
                          </td>
                          <td className="text-center">
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
                            {b.status !== 'completed' && b.status !== 'cancelled' && (
                              <button 
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleCancel(b.booking_id)}
                                title="Ép hủy đơn"
                              >
                                <i className="ri-close-circle-line"></i> Hủy
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="card-footer bg-white border-top py-3">
                  <ul className="pagination justify-content-end mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Trước</button>
                    </li>
                    {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                      <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Sau</button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
