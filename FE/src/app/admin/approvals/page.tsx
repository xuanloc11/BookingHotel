"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";

interface ApprovalItem {
  id: number;
  name: string;
  owner_name: string;
  owner_email: string;
  company_name: string;
  tax_id: string;
  created_at: string;
  status: string;
}

export default function ApprovalsPage() {
  const { user } = useAuth();
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovals = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/system-admin/approvals/", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setApprovals(data.approvals || []);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách chờ duyệt", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchApprovals();
    }
  }, [user]);

  const handleUpdateStatus = async (hotelId: number, status: "approved" | "rejected") => {
    const confirmMessage = status === "approved" 
      ? "Bạn có chắc chắn muốn PHÊ DUYỆT khách sạn này để hiển thị trên hệ thống?" 
      : "Bạn có chắc chắn muốn TỪ CHỐI khách sạn này?";
      
    if (!window.confirm(confirmMessage)) return;

    try {
      const res = await fetch(`http://localhost:8000/api/system-admin/approvals/${hotelId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        alert(status === "approved" ? "Đã duyệt khách sạn thành công!" : "Đã từ chối khách sạn!");
        // Refresh danh sách
        fetchApprovals();
      } else {
        const err = await res.json();
        alert(`Lỗi: ${err.error || "Không thể cập nhật"}`);
      }
    } catch (error) {
      alert("Đã xảy ra lỗi hệ thống.");
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="page-title-box">
            <h4 className="page-title">Kiểm duyệt Khách sạn & KYC</h4>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h4 className="header-title mb-4">Danh sách Đối tác chờ duyệt</h4>
              
              {loading ? (
                <div className="text-center p-4">
                  <div className="spinner-border text-primary" role="status"></div>
                </div>
              ) : approvals.length === 0 ? (
                <div className="alert alert-info text-center">
                  Hiện không có hồ sơ khách sạn nào đang chờ phê duyệt.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-centered mb-0 align-middle table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Khách sạn</th>
                        <th>Pháp nhân / Công ty</th>
                        <th>Mã số thuế</th>
                        <th>Người đăng ký</th>
                        <th>Ngày gửi</th>
                        <th>Trạng thái</th>
                        <th className="text-center" style={{ width: "200px" }}>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvals.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <h5 className="m-0 font-14 text-dark">{item.name}</h5>
                            <span className="text-muted font-13">ID: #{item.id}</span>
                          </td>
                          <td>
                            {item.company_name ? (
                              <span className="fw-semibold">{item.company_name}</span>
                            ) : (
                              <span className="text-warning"><i className="mdi mdi-alert"></i> Chưa cập nhật</span>
                            )}
                          </td>
                          <td>{item.tax_id || "N/A"}</td>
                          <td>
                            <h5 className="m-0 font-14">{item.owner_name}</h5>
                            <span className="text-muted font-13">{item.owner_email}</span>
                          </td>
                          <td>{new Date(item.created_at).toLocaleDateString('vi-VN')}</td>
                          <td>
                            <span className="badge bg-warning text-dark">Chờ duyệt</span>
                          </td>
                          <td className="text-center">
                            <button 
                              className="btn btn-success btn-sm me-1" 
                              onClick={() => handleUpdateStatus(item.id, "approved")}
                              title="Phê duyệt"
                            >
                              <i className="mdi mdi-check-circle"></i> Duyệt
                            </button>
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={() => handleUpdateStatus(item.id, "rejected")}
                              title="Từ chối"
                            >
                              <i className="mdi mdi-close-circle"></i> Từ chối
                            </button>
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
      </div>
    </>
  );
}
