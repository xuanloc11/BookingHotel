"use client";

import { useEffect, useState } from "react";
import { getExtranetDashboard, getVendorBookings } from "@/lib/api/vendorApi";

const COMMISSION_RATE = 0.15;

export default function ExtranetFinance() {
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    Promise.all([getExtranetDashboard(), getVendorBookings()])
      .then(([dashData, bookData]) => {
        setStats(dashData);
        setBookings(bookData.bookings || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = stats?.total_revenue || 0;
  const commission = Math.round(totalRevenue * COMMISSION_RATE);
  const netBalance = totalRevenue - commission;

  // Lịch sử lọc theo tab
  const completedBookings = bookings.filter((b) => b.status === "completed");
  const filteredBookings =
    activeTab === "all"
      ? bookings
      : bookings.filter((b) => b.status === activeTab);

  // Tháng này
  const now = new Date();
  const thisMonthRevenue = bookings
    .filter((b) => {
      if (b.status !== "completed") return false;
      const d = new Date(b.created_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, b) => sum + (b.total || 0), 0);

  const lastMonthRevenue = bookings
    .filter((b) => {
      if (b.status !== "completed") return false;
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
                {netBalance.toLocaleString("vi-VN")} ₫
              </h2>
              <button className="btn btn-light btn-rounded">Rút tiền về Ngân hàng</button>
            </div>
          </div>
        </div>

        {/* Tổng doanh thu tháng này */}
        <div className="col-xl-4 col-lg-4">
          <div className="card">
            <div className="card-body">
              <i className="ri-line-chart-line text-muted float-end fs-3"></i>
              <h6 className="text-uppercase mt-0">Tổng doanh thu (Tháng này)</h6>
              <h2 className="my-2">{thisMonthRevenue.toLocaleString("vi-VN")} ₫</h2>
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
                {commission > 0 ? `- ${commission.toLocaleString("vi-VN")} ₫` : "0 ₫"}
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
              <h4 className="header-title mb-0">Lịch sử Giao dịch</h4>
            </div>
            <div className="card-body pt-0">
              <ul className="nav nav-tabs nav-bordered mb-3">
                {[
                  { key: "all", label: "Tất cả" },
                  { key: "completed", label: "Thành công" },
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
                        const fee = b.status === "completed" ? Math.round(b.total * COMMISSION_RATE) : 0;
                        const net = b.status === "completed" ? b.total - fee : 0;
                        return (
                          <tr key={b.booking_id}>
                            <td><b>#{b.booking_id}</b></td>
                            <td>{new Date(b.created_at).toLocaleDateString("vi-VN")}</td>
                            <td>{b.check_in} → {b.check_out}</td>
                            <td>{b.total?.toLocaleString("vi-VN")} ₫</td>
                            <td className="text-danger">
                              {fee > 0 ? `- ${fee.toLocaleString("vi-VN")} ₫` : "—"}
                            </td>
                            <td className="text-success fw-bold">
                              {net > 0 ? `${net.toLocaleString("vi-VN")} ₫` : "—"}
                            </td>
                            <td>
                              <span className={`badge ${
                                b.status === "completed" ? "bg-success" :
                                b.status === "confirmed" ? "bg-info" :
                                b.status === "pending" ? "bg-warning text-dark" : "bg-danger"
                              }`}>
                                {b.status === "completed" ? "Thành công" :
                                 b.status === "confirmed" ? "Đã xác nhận" :
                                 b.status === "pending" ? "Đang xử lý" : "Đã hủy"}
                              </span>
                            </td>
                          </tr>
                        );
                      })
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
