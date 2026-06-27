"use client";

import { useEffect, useState } from "react";
import { getAdminWithdrawals, approveWithdrawal, rejectWithdrawal } from "@/lib/api/adminApi";
import toast from "react-hot-toast";

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = () => {
    setLoading(true);
    getAdminWithdrawals()
      .then((res) => {
        setWithdrawals(res.withdrawals || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleApprove = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn DUYỆT yêu cầu này? Hệ thống sẽ trừ tiền của Chủ khách sạn.")) return;
    try {
      const res = await approveWithdrawal(id);
      if (res.error) toast.error(res.error);
      else {
        toast.success(res.message || "Duyệt thành công!");
        fetchWithdrawals();
      }
    } catch (err) {
      toast.error("Lỗi khi duyệt");
    }
  };

  const handleReject = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn TỪ CHỐI yêu cầu này?")) return;
    try {
      const res = await rejectWithdrawal(id);
      if (res.error) toast.error(res.error);
      else {
        toast.success(res.message || "Từ chối thành công!");
        fetchWithdrawals();
      }
    } catch (err) {
      toast.error("Lỗi khi từ chối");
    }
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="page-title-box">
            <h4 className="page-title">Quản lý Yêu cầu Rút tiền</h4>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-centered align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Chủ khách sạn</th>
                      <th>Ngày yêu cầu</th>
                      <th className="text-end">Số tiền rút</th>
                      <th>Thông tin Ngân hàng</th>
                      <th className="text-center">Trạng thái</th>
                      <th className="text-end">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4">Không có yêu cầu nào.</td>
                      </tr>
                    ) : (
                      withdrawals.map((w) => (
                        <tr key={w.id}>
                          <td><b>#{w.id}</b></td>
                          <td>{w.vendor_name}</td>
                          <td>{new Date(w.created_at).toLocaleString("vi-VN")}</td>
                          <td className="text-danger fw-bold text-end">{formatMoney(w.amount)}</td>
                          <td>
                            <div><b>{w.bank_name}</b></div>
                            <div className="text-muted small">{w.account_number} - {w.account_name}</div>
                          </td>
                          <td className="text-center">
                            <span className={`badge ${
                              w.status === 'approved' ? 'bg-success' :
                              w.status === 'rejected' ? 'bg-danger' : 'bg-warning text-dark'
                            }`}>
                              {w.status === 'approved' ? 'Đã duyệt' :
                               w.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
                            </span>
                          </td>
                          <td className="text-end">
                            {w.status === 'pending' && (
                              <div className="d-flex justify-content-end gap-1">
                                <button className="btn btn-sm btn-success" onClick={() => handleApprove(w.id)}>
                                  <i className="ri-check-line"></i> Duyệt
                                </button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleReject(w.id)}>
                                  <i className="ri-close-line"></i> Từ chối
                                </button>
                              </div>
                            )}
                            {w.status !== 'pending' && w.processed_at && (
                              <span className="small text-muted">Xử lý lúc {new Date(w.processed_at).toLocaleString("vi-VN")}</span>
                            )}
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
