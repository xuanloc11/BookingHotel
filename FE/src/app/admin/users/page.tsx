"use client";

import { useEffect, useState } from "react";
import { getAdminUsers, updateAdminUser, deleteAdminUser } from "@/lib/api/adminApi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function AdminUsersManage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    setLoading(true);
    getAdminUsers()
      .then((res) => setUsers(res.users))
      .catch((err) => toast.error("Lỗi khi tải dữ liệu người dùng: " + err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (userId: number, role: string) => {
    const result = await Swal.fire({
      title: "Cấp quyền tài khoản?",
      text: `Xác nhận đổi quyền người dùng này thành ${role.toUpperCase()}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      toast.loading("Đang cập nhật...", { id: `update-${userId}` });
      await updateAdminUser(userId, { role });
      toast.success("Cập nhật quyền thành công!", { id: `update-${userId}` });
      fetchUsers();
    } catch (err: any) {
      toast.error("Lỗi: " + err.message, { id: `update-${userId}` });
    }
  };

  const handleUpdateStatus = async (userId: number, is_active: boolean) => {
    const actionText = is_active ? "MỞ KHÓA" : "KHÓA";
    const result = await Swal.fire({
      title: `${actionText} tài khoản?`,
      text: `Xác nhận ${actionText.toLowerCase()} tài khoản này?`,
      icon: is_active ? "info" : "warning",
      showCancelButton: true,
      confirmButtonColor: is_active ? "#28a745" : "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      toast.loading("Đang xử lý...", { id: `status-${userId}` });
      await updateAdminUser(userId, { is_active });
      toast.success(`${actionText} tài khoản thành công!`, { id: `status-${userId}` });
      fetchUsers();
    } catch (err: any) {
      toast.error("Lỗi: " + err.message, { id: `status-${userId}` });
    }
  };

  const handleDelete = async (userId: number) => {
    const result = await Swal.fire({
      title: "Xóa tài khoản này?",
      text: "Hành động này không thể hoàn tác!",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Xóa vĩnh viễn",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      toast.loading("Đang xóa...", { id: `delete-${userId}` });
      await deleteAdminUser(userId);
      toast.success("Đã xóa tài khoản thành công!", { id: `delete-${userId}` });
      fetchUsers();
    } catch (err: any) {
      toast.error("Lỗi: " + err.message, { id: `delete-${userId}` });
    }
  };

  return (
    <>
      <div className="row mt-4">
        <div className="col-12">
          <div className="page-title-box">
            <h4 className="page-title">Quản lý Người dùng</h4>
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
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3">Họ và Tên</th>
                      <th className="py-3">Email</th>
                      <th className="py-3">Vai trò</th>
                      <th className="py-3">Ngày tham gia</th>
                      <th className="py-3 text-center">Trạng thái</th>
                      <th className="py-3 px-4 text-end">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="text-center py-5">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <p className="text-muted mt-2 mb-0">Đang tải danh sách người dùng...</p>
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-5">
                          <div className="text-muted">
                            <i className="ri-group-line display-4"></i>
                            <h5 className="mt-3">Chưa có người dùng nào</h5>
                            <p className="mb-0">Hệ thống hiện tại chưa ghi nhận người dùng nào tham gia.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id}>
                          <td className="px-4">
                            <span className="fw-bold">#{u.id}</span>
                          </td>
                          <td>
                            <div className="fw-medium">{u.full_name}</div>
                          </td>
                          <td>
                            <div className="text-muted">{u.email}</div>
                          </td>
                          <td>
                            <span className={`badge ${
                              u.role === 'admin' ? 'bg-danger' : 
                              u.role === 'vendor' ? 'bg-primary' : 'bg-secondary'
                            }`}>
                              {u.role.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <div className="fs-6 text-muted">{new Date(u.date_joined).toLocaleDateString('vi-VN')}</div>
                          </td>
                          <td className="text-center">
                            <span className={`badge ${u.is_active ? 'bg-success' : 'bg-danger'}`}>
                              {u.is_active ? 'Hoạt động' : 'Đã khóa'}
                            </span>
                          </td>
                          <td className="px-4 text-end">
                            <div className="dropdown">
                              <button className="btn btn-light btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Tùy chọn
                              </button>
                              <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                                <li><h6 className="dropdown-header">Cấp quyền</h6></li>
                                <li><button className="dropdown-item" onClick={() => handleUpdateRole(u.id, 'customer')} disabled={u.role === 'customer'}>Đặt làm Customer</button></li>
                                <li><button className="dropdown-item" onClick={() => handleUpdateRole(u.id, 'vendor')} disabled={u.role === 'vendor'}>Đặt làm Vendor</button></li>
                                <li><button className="dropdown-item text-danger" onClick={() => handleUpdateRole(u.id, 'admin')} disabled={u.role === 'admin'}>Thăng cấp Admin</button></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><h6 className="dropdown-header">Bảo mật</h6></li>
                                {u.is_active ? (
                                  <li><button className="dropdown-item text-warning" onClick={() => handleUpdateStatus(u.id, false)}><i className="ri-lock-line me-2"/> Khóa tài khoản</button></li>
                                ) : (
                                  <li><button className="dropdown-item text-success" onClick={() => handleUpdateStatus(u.id, true)}><i className="ri-lock-unlock-line me-2"/> Mở khóa tài khoản</button></li>
                                )}
                                <li><button className="dropdown-item text-danger" onClick={() => handleDelete(u.id)}><i className="ri-delete-bin-line me-2"/> Xóa tài khoản</button></li>
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
