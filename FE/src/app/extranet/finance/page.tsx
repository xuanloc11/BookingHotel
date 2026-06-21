"use client";

import { useState } from "react";

export default function ExtranetFinance() {
  const [activeTab, setActiveTab] = useState("all");

  const [transactions, setTransactions] = useState<any[]>([]);
  const filteredTransactions = activeTab === "all" ? transactions : transactions.filter(t => t.status === activeTab);

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="page-title-box">
            <h4 className="page-title">Quản lý Tài chính & Thanh toán</h4>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-4 col-lg-4">
          <div className="card text-center text-white bg-primary">
            <div className="card-body">
              <i className="ri-wallet-3-line fs-1 mb-2"></i>
              <h4 className="font-weight-normal mt-0 text-white" title="Số dư có thể rút">Số dư khả dụng</h4>
              <h2 className="text-white mt-2 mb-3">28,500,000 ₫</h2>
              <button className="btn btn-light btn-rounded">Rút tiền về Ngân hàng</button>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-lg-4">
          <div className="card">
            <div className="card-body">
              <i className="ri-line-chart-line text-muted float-end fs-3"></i>
              <h6 className="text-uppercase mt-0">Tổng doanh thu (Tháng này)</h6>
              <h2 className="my-2">45,000,000 ₫</h2>
              <p className="mb-0 text-muted">
                <span className="text-success me-2"><i className="mdi mdi-arrow-up-bold"></i> 15%</span>
                <span className="text-nowrap">So với tháng trước</span>
              </p>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-lg-4">
          <div className="card">
            <div className="card-body">
              <i className="ri-money-dollar-circle-line text-muted float-end fs-3"></i>
              <h6 className="text-uppercase mt-0">Hoa hồng nền tảng (15%)</h6>
              <h2 className="my-2 text-danger">- 6,750,000 ₫</h2>
              <p className="mb-0 text-muted">
                <span className="text-nowrap">Đã tự động cấn trừ</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="header-title mb-0">Lịch sử Giao dịch</h4>
              <div className="dropdown">
                <a href="#" className="dropdown-toggle arrow-none card-drop" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="mdi mdi-dots-vertical"></i>
                </a>
                <div className="dropdown-menu dropdown-menu-end">
                  <a href="#" className="dropdown-item">Xuất Excel</a>
                  <a href="#" className="dropdown-item">In Báo cáo</a>
                </div>
              </div>
            </div>
            <div className="card-body pt-0">
              <ul className="nav nav-tabs nav-bordered mb-3">
                <li className="nav-item">
                  <button onClick={() => setActiveTab('all')} className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}>
                    Tất cả
                  </button>
                </li>
                <li className="nav-item">
                  <button onClick={() => setActiveTab('completed')} className={`nav-link ${activeTab === 'completed' ? 'active' : ''}`}>
                    Thành công
                  </button>
                </li>
                <li className="nav-item">
                  <button onClick={() => setActiveTab('pending')} className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}>
                    Đang xử lý
                  </button>
                </li>
              </ul>

              <div className="table-responsive">
                <table className="table table-centered mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Mã GD</th>
                      <th>Ngày</th>
                      <th>Nội dung</th>
                      <th>Số tiền</th>
                      <th>Phí hoa hồng</th>
                      <th>Thực nhận</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map(t => (
                      <tr key={t.id}>
                        <td><b>{t.id}</b></td>
                        <td>{t.date}</td>
                        <td>{t.desc}</td>
                        <td>{t.amount}</td>
                        <td className="text-danger">{t.fee !== "0 ₫" ? `- ${t.fee}` : "0 ₫"}</td>
                        <td className="text-success fw-bold">{t.net}</td>
                        <td>
                          {t.status === "completed" ? (
                            <i className="mdi mdi-circle text-success me-1"></i>
                          ) : (
                            <i className="mdi mdi-circle text-warning me-1"></i>
                          )}
                          {t.status === "completed" ? "Thành công" : "Đang xử lý"}
                        </td>
                      </tr>
                    ))}
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
