"use client";

import { useEffect, useState } from "react";
import { getExtranetDashboard, getVendorFinance, getVendorBookings, getVendorWithdrawals, createVendorWithdrawal } from "@/lib/api/vendorApi";
import toast from "react-hot-toast";

const COMMISSION_RATE = 0.15;

export default function ExtranetFinance() {
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [activeMainTab, setActiveMainTab] = useState("bookings"); // 'bookings' or 'withdrawals'
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currency, setCurrency] = useState("VND");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrency(localStorage.getItem("app_currency") || "VND");
    }
    Promise.all([getExtranetDashboard(), getVendorFinance(), getVendorBookings(), getVendorWithdrawals()])
      .then(([dashData, financeData, bookData, withData]) => {
        setStats({ ...dashData, ...financeData });
        setBookings(bookData.bookings || []);
        setWithdrawals(withData.withdrawals || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleWithdraw = async () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      toast.error("Vui lòng nhập số tiền hợp lệ");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await createVendorWithdrawal(Number(withdrawAmount));
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Đã gửi yêu cầu rút tiền thành công!");
        setShowWithdrawModal(false);
        setWithdrawAmount("");
        // Tải lại lịch sử rút tiền
        const withData = await getVendorWithdrawals();
        setWithdrawals(withData.withdrawals || []);
        // Cập nhật lại số dư
        const financeData = await getVendorFinance();
        setStats((prev: any) => ({ ...prev, ...financeData }));
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra khi gửi yêu cầu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalRevenue = stats?.total_revenue || 0;
  const commission = Math.round(totalRevenue * COMMISSION_RATE);
  const netBalance = stats?.available_balance || 0;

  const formatMoney = (amount: number, bCurr: string = "VND") => {
    let finalAmount = amount;
    if (bCurr === "USD" && currency === "VND") {
      finalAmount = amount * 25300;
    } else if (bCurr === "VND" && currency === "USD") {
      finalAmount = amount / 25300;
    }
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: currency }).format(finalAmount);
  };

  // Lịch sử lọc theo tab
  const isCompleted = (s: string) => s === "completed" || s === "hoàn thành" || s === "hoàn tất";
  const isPending = (s: string) => s === "pending" || s === "đang chờ" || s === "chờ duyệt";
  const isConfirmed = (s: string) => s === "confirmed" || s === "đã xác nhận";
  const isCancelled = (s: string) => s === "cancelled" || s === "đã hủy";

  const filteredBookings =
    activeTab === "all"
      ? bookings
      : bookings.filter((b) => {
          const s = (b.status || "").toLowerCase();
          if (activeTab === "completed") return isCompleted(s);
          if (activeTab === "pending") return isPending(s);
          if (activeTab === "confirmed") return isConfirmed(s);
          if (activeTab === "cancelled") return isCancelled(s);
          return s === activeTab;
        });

  // Tháng này
  const now = new Date();
  const thisMonthRevenue = bookings
    .filter((b) => {
      if (!isCompleted((b.status || "").toLowerCase())) return false;
      const d = new Date(b.created_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, b) => sum + (b.total || 0), 0);

  const lastMonthRevenue = bookings
    .filter((b) => {
      if (!isCompleted((b.status || "").toLowerCase())) return false;
      const d = new Date(b.created_at);
      const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return d.getMonth() === last.getMonth() && d.getFullYear() === last.getFullYear();
    })
    .reduce((sum, b) => sum + (b.total || 0), 0);

  const growthPct =
    lastMonthRevenue > 0
      ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
      : null;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}></div>
          <h5 className="mt-3 text-muted">Đang tải dữ liệu tài chính...</h5>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="page-title-box">
            <h4 className="page-title">Quản lý Tài chính &amp; Thanh toán</h4>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row">
        {/* Số dư khả dụng */}
        <div className="col-xl-4 col-lg-4">
          <div className="card text-center text-white bg-primary">
            <div className="card-body">
              <i className="ri-wallet-3-line fs-1 mb-2"></i>
              <h4 className="font-weight-normal mt-0 text-white">Số dư khả dụng</h4>
              <h2 className="text-white mt-2 mb-3">
                {formatMoney(netBalance, "VND")}
              </h2>
              <button 
                className="btn btn-light btn-rounded"
                onClick={() => setShowWithdrawModal(true)}
              >
                Rút tiền về Ngân hàng
              </button>
            </div>
          </div>
        </div>

        {/* Tổng doanh thu tháng này */}
        <div className="col-xl-4 col-lg-4">
          <div className="card">
            <div className="card-body">
              <i className="ri-line-chart-line text-muted float-end fs-3"></i>
              <h6 className="text-uppercase mt-0">Tổng doanh thu (Tháng này)</h6>
              <h2 className="my-2">{formatMoney(thisMonthRevenue, "VND")}</h2>
              <p className="mb-0 text-muted">
                {growthPct !== null ? (
                  <span className={`me-2 ${growthPct >= 0 ? "text-success" : "text-danger"}`}>
                    <i className={`mdi ${growthPct >= 0 ? "mdi-arrow-up-bold" : "mdi-arrow-down-bold"}`}></i>{" "}
                    {Math.abs(growthPct)}%
                  </span>
                ) : (
                  <span className="text-muted me-2">—</span>
                )}
                <span className="text-nowrap">So với tháng trước</span>
              </p>
            </div>
          </div>
        </div>

        {/* Hoa hồng */}
        <div className="col-xl-4 col-lg-4">
          <div className="card">
            <div className="card-body">
              <i className="ri-money-dollar-circle-line text-muted float-end fs-3"></i>
              <h6 className="text-uppercase mt-0">Hoa hồng nền tảng ({Math.round(COMMISSION_RATE * 100)}%)</h6>
              <h2 className="my-2 text-danger">
                {commission > 0 ? `- ${formatMoney(commission, "VND")}` : "0 ₫"}
              </h2>
              <p className="mb-0 text-muted">
                <span className="text-nowrap">Đã tự động cấn trừ</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <ul className="nav nav-pills" style={{ cursor: 'pointer' }}>
                <li className="nav-item">
                  <a className={`nav-link ${activeMainTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveMainTab('bookings')}>
                    Giao dịch Đặt phòng
                  </a>
                </li>
                <li className="nav-item">
                  <a className={`nav-link ${activeMainTab === 'withdrawals' ? 'active' : ''}`} onClick={() => setActiveMainTab('withdrawals')}>
                    Lịch sử Rút tiền
                  </a>
                </li>
              </ul>
            </div>
            <div className="card-body pt-0">
              {activeMainTab === 'bookings' ? (
                <>
                  <ul className="nav nav-tabs nav-bordered mt-3 mb-3">
                {[
                  { key: "all", label: "Tất cả" },
                  { key: "completed", label: "Thành công" },
                  { key: "confirmed", label: "Đã xác nhận" },
                  { key: "pending", label: "Đang xử lý" },
                  { key: "cancelled", label: "Đã hủy" },
                ].map((tab) => (
                  <li className="nav-item" key={tab.key}>
                    <button
                      onClick={() => setActiveTab(tab.key)}
                      className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="table-responsive">
                <table className="table table-centered mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Mã đơn</th>
                      <th>Ngày tạo</th>
                      <th>Ngày nhận / trả</th>
                      <th>Tổng tiền</th>
                      <th>Hoa hồng (15%)</th>
                      <th>Thực nhận</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4 text-muted">
                          Không có giao dịch nào.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => {
                        const stat = (b.status || "").toLowerCase();
                        const completed = isCompleted(stat);
                        const fee = completed ? Math.round(b.total * COMMISSION_RATE) : 0;
                        const net = completed ? b.total - fee : 0;
                        return (
                          <tr key={b.booking_id}>
                            <td><b>#{b.booking_id}</b></td>
                            <td>{new Date(b.created_at).toLocaleDateString("vi-VN")}</td>
                            <td>{b.check_in} → {b.check_out}</td>
                            <td>{formatMoney(b.total || 0, b.currency)}</td>
                            <td className="text-danger">
                              {fee > 0 ? `- ${formatMoney(fee, b.currency)}` : "—"}
                            </td>
                            <td className="text-success fw-bold">
                              {net > 0 ? formatMoney(net, b.currency) : "—"}
                            </td>
                            <td>
                              <span className={`badge ${
                                completed ? "bg-success" :
                                isConfirmed(stat) ? "bg-info" :
                                isPending(stat) ? "bg-warning text-dark" : "bg-danger"
                              }`}>
                                {completed ? "Thành công" :
                                 isConfirmed(stat) ? "Đã xác nhận" :
                                 isPending(stat) ? "Đang xử lý" :
                                 isCancelled(stat) ? "Đã hủy" : b.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              </>
              ) : (
              <div className="table-responsive mt-3">
                <table className="table table-centered mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Mã giao dịch</th>
                      <th>Thời gian</th>
                      <th>Số tiền rút</th>
                      <th>Ngân hàng</th>
                      <th>Số tài khoản</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4 text-muted">
                          Chưa có yêu cầu rút tiền nào.
                        </td>
                      </tr>
                    ) : (
                      withdrawals.map((w) => (
                        <tr key={w.id}>
                          <td><b>#{w.id}</b></td>
                          <td>{new Date(w.created_at).toLocaleString("vi-VN")}</td>
                          <td className="fw-bold">{formatMoney(w.amount, "VND")}</td>
                          <td>{w.bank_name}</td>
                          <td>{w.account_number}</td>
                          <td>
                            <span className={`badge ${
                              w.status === 'approved' ? 'bg-success' :
                              w.status === 'rejected' ? 'bg-danger' : 'bg-warning text-dark'
                            }`}>
                              {w.status === 'approved' ? 'Đã duyệt' :
                               w.status === 'rejected' ? 'Từ chối' : 'Đang xử lý'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Rút tiền */}
      {showWithdrawModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Yêu cầu rút tiền</h5>
                <button type="button" className="btn-close" onClick={() => setShowWithdrawModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Số dư khả dụng</label>
                  <input type="text" className="form-control" value={formatMoney(netBalance, "VND")} disabled />
                  <small className="text-muted mt-1 d-block">
                    * Bạn cần cập nhật thông tin Tài khoản ngân hàng ở mục <b>Cài đặt</b> trước khi rút.
                  </small>
                </div>
                <div className="mb-3">
                  <label className="form-label">Số tiền muốn rút (VND) <span className="text-danger">*</span></label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="VD: 500000"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    max={netBalance}
                  />
                  {Number(withdrawAmount) > netBalance && (
                    <div className="text-danger mt-1 small">Số tiền rút không được vượt quá số dư khả dụng.</div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light" onClick={() => setShowWithdrawModal(false)}>Hủy</button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleWithdraw}
                  disabled={isSubmitting || !withdrawAmount || Number(withdrawAmount) <= 0 || Number(withdrawAmount) > netBalance}
                >
                  {isSubmitting ? "Đang xử lý..." : "Gửi yêu cầu"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
