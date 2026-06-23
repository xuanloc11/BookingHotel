"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getVendorBookings, updateVendorBookingStatus } from "@/lib/api/vendorApi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

// Modal chi tiết đơn đặt
function BookingDetailModal({ booking, onClose, formatMoney }: { booking: any; onClose: () => void; formatMoney: (amount: number, bCurr: string) => string }) {
  if (!booking) return null;
  const statusLabel: Record<string, string> = {
    confirmed: "Đã xác nhận",
    pending: "Chờ duyệt",
    completed: "Hoàn tất",
    cancelled: "Đã hủy",
  };
  const statusClass: Record<string, string> = {
    confirmed: "bg-success",
    pending: "bg-warning text-dark",
    completed: "bg-info",
    cancelled: "bg-danger",
  };
  return createPortal(
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff", borderRadius: 12, width: "100%", maxWidth: 520,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)", padding: 0, overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ background: "#2a7aef", color: "#fff", padding: "20px 24px" }}>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">Chi tiết đơn #{booking.booking_id}</h5>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", fontSize: 20, cursor: "pointer" }}>×</button>
          </div>
          <span className={`badge mt-2 ${statusClass[booking.status] || "bg-secondary"}`}>
            {statusLabel[booking.status] || booking.status}
          </span>
        </div>
        {/* Body */}
        <div style={{ padding: "24px", maxHeight: "70vh", overflowY: "auto" }}>
          <div className="row g-3">
            {booking.customer && (
              <div className="col-12 mb-1">
                <div className="p-3 bg-light rounded border">
                  <h6 className="mb-2 fw-bold text-primary"><i className="ri-user-line me-1"></i> Thông tin khách hàng</h6>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="text-muted" style={{ fontSize: 12 }}>Họ và tên</div>
                      <div className="fw-bold">{booking.customer.last_name} {booking.customer.first_name}</div>
                    </div>
                    <div className="col-sm-6">
                      <div className="text-muted" style={{ fontSize: 12 }}>Số điện thoại</div>
                      <div className="fw-bold">{booking.customer.phone || "Không có"}</div>
                    </div>
                    <div className="col-sm-12 mt-2">
                      <div className="text-muted" style={{ fontSize: 12 }}>Email</div>
                      <div className="fw-bold">{booking.customer.email || "Không có"}</div>
                    </div>
                    {booking.customer.special_requests && (
                      <div className="col-sm-12 mt-2">
                        <div className="text-muted" style={{ fontSize: 12 }}>Yêu cầu đặc biệt</div>
                        <div className="fw-bold text-danger">{booking.customer.special_requests}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className="col-6">
              <div className="text-muted" style={{ fontSize: 12 }}>Ngày nhận phòng</div>
              <div className="fw-bold">{booking.check_in}</div>
            </div>
            <div className="col-6">
              <div className="text-muted" style={{ fontSize: 12 }}>Ngày trả phòng</div>
              <div className="fw-bold">{booking.check_out}</div>
            </div>
            <div className="col-6">
              <div className="text-muted" style={{ fontSize: 12 }}>Số khách</div>
              <div className="fw-bold">{booking.guests?.adults} người lớn, {booking.guests?.children} trẻ em</div>
            </div>
            <div className="col-6">
              <div className="text-muted" style={{ fontSize: 12 }}>Ngày đặt</div>
              <div className="fw-bold">{new Date(booking.created_at).toLocaleDateString("vi-VN")}</div>
            </div>
            <div className="col-12">
              <hr style={{ margin: "4px 0 12px" }} />
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">Tổng tiền đơn</span>
                <span className="fw-bold text-primary fs-5">
                  {formatMoney(booking.total || 0, booking.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: "0 24px 20px" }}>
          <button onClick={onClose} className="btn btn-secondary w-100">Đóng</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// Dropdown render qua React Portal - tránh bị clip bởi overflow của parent
function StatusDropdown({ bookingId, onSelect }: { bookingId: string; onSelect: (id: string, status: string) => void }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + window.scrollY, left: rect.right - 190 });
    }
    setOpen((v) => !v);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        className="btn btn-light btn-sm dropdown-toggle"
        type="button"
        onClick={handleToggle}
      >
        Đổi trạng thái
      </button>
      {open && typeof document !== "undefined" && createPortal(
        <div
          ref={menuRef}
          style={{
            position: "absolute",
            top: pos.top + 4,
            left: pos.left,
            zIndex: 99999,
            minWidth: 190,
            background: "#fff",
            borderRadius: 6,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            border: "1px solid #e9ecef",
            padding: "4px 0",
          }}
        >
          <button
            className="dropdown-item"
            style={{ padding: "9px 16px" }}
            onClick={() => { setOpen(false); onSelect(bookingId, "confirmed"); }}
          >
            <i className="ri-check-line text-success me-2" /> Xác nhận đơn
          </button>
          <button
            className="dropdown-item"
            style={{ padding: "9px 16px" }}
            onClick={() => { setOpen(false); onSelect(bookingId, "completed"); }}
          >
            <i className="ri-flag-line text-primary me-2" /> Đánh dấu hoàn tất
          </button>
          <hr style={{ margin: "4px 0" }} />
          <button
            className="dropdown-item text-danger"
            style={{ padding: "9px 16px" }}
            onClick={() => { setOpen(false); onSelect(bookingId, "cancelled"); }}
          >
            <i className="ri-close-line text-danger me-2" /> Hủy đơn đặt
          </button>
        </div>,
        document.body
      )}
    </>
  );
}

export default function VendorBookingsManage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // States for search, filter, pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchBookings = () => {
    setLoading(true);
    getVendorBookings()
      .then((res) => setBookings(res.bookings))
      .catch((err) => toast.error("Lỗi khi tải dữ liệu đơn đặt: " + err.message))
      .finally(() => setLoading(false));
  };

  const [currency, setCurrency] = useState("VND");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrency(localStorage.getItem("app_currency") || "VND");
    }
    fetchBookings();
  }, []);

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
      const matchName = b.customer 
        ? `${b.customer.last_name} ${b.customer.first_name}`.toLowerCase().includes(q) 
        : false;
      const matchPhone = b.customer?.phone?.includes(q);
      return matchId || matchName || matchPhone;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  const formatMoney = (amount: number, bCurr: string = "VND") => {
    let finalAmount = amount;
    if (bCurr === "USD" && currency === "VND") {
      finalAmount = amount * 25300;
    } else if (bCurr === "VND" && currency === "USD") {
      finalAmount = amount / 25300;
    }
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: currency }).format(finalAmount);
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    let actionText = newStatus.toUpperCase();
    let actionColor = "#3085d6";
    let icon: any = "info";

    if (newStatus === "cancelled") { actionText = "HỦY"; actionColor = "#d33"; icon = "warning"; }
    else if (newStatus === "confirmed") { actionText = "XÁC NHẬN"; actionColor = "#28a745"; icon = "question"; }
    else if (newStatus === "completed") { actionText = "ĐÁNH DẤU HOÀN TẤT"; actionColor = "#17a2b8"; }

    const result = await Swal.fire({
      title: `${actionText} ĐƠN ĐẶT PHÒNG?`,
      text: `Xác nhận chuyển trạng thái đơn #${bookingId} thành ${actionText}?`,
      icon,
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
      fetchBookings();
    } catch (err: any) {
      toast.error("Lỗi: " + err.message, { id: `status-${bookingId}` });
    }
  };

  return (
    <>
      {selectedBooking && (
        <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} formatMoney={formatMoney} />
      )}
      <div className="row mt-4">
        <div className="col-12">
          <div className="page-title-box">
            <h4 className="page-title">Quản lý Đơn đặt phòng</h4>
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
              placeholder="Tìm theo Mã đơn, Tên khách, Số điện thoại..."
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
                            <h5 className="mt-3">Không tìm thấy đơn đặt phòng</h5>
                            <p className="mb-0">Vui lòng thử lại với từ khóa hoặc bộ lọc khác.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentBookings.map((b) => (
                        <tr
                          key={b.booking_id}
                          style={{ cursor: "pointer" }}
                          onClick={() => setSelectedBooking(b)}
                        >
                          <td className="px-4">
                            <span className="fw-bold">#{b.booking_id}</span>
                            <div className="fs-6 text-muted mt-1">{new Date(b.created_at).toLocaleDateString("vi-VN")}</div>
                          </td>
                          <td>
                            <div className="fw-medium">{b.check_in}</div>
                            <div className="text-muted fs-6">đến {b.check_out}</div>
                          </td>
                          <td>
                            <div className="fw-medium">
                              {b.customer ? `${b.customer.last_name} ${b.customer.first_name}` : `${b.guests.adults} NL, ${b.guests.children} TE`}
                            </div>
                            <div className="fs-6 text-muted">{b.customer?.phone || "Khách hàng đặt qua App"}</div>
                          </td>
                          <td className="fw-bold text-primary">
                            {formatMoney(b.total || 0, b.currency)}
                          </td>
                          <td>
                            {(() => {
                              const stat = (b.status || "").toLowerCase();
                              return (
                                <span className={`badge ${
                                  stat === "confirmed" ? "bg-success" :
                                  stat === "pending" ? "bg-warning text-dark" :
                                  stat === "completed" ? "bg-info" : "bg-danger"
                                }`}>
                                  {stat === "confirmed" ? "ĐÃ XÁC NHẬN" :
                                   stat === "pending" ? "CHỜ DUYỆT" :
                                   stat === "completed" ? "HOÀN TẤT" :
                                   stat === "cancelled" ? "ĐÃ HỦY" : b.status.toUpperCase()}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-4 text-end" onClick={(e) => e.stopPropagation()}>
                            <StatusDropdown bookingId={b.booking_id} onSelect={handleStatusChange} />
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
