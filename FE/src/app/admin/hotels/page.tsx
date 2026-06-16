"use client";

import { useEffect, useState } from "react";
import { getAdminHotels, deleteAdminHotel } from "@/lib/api/adminApi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function AdminHotelsManage() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHotels = () => {
    setLoading(true);
    getAdminHotels()
      .then((res) => setHotels(res.hotels))
      .catch((err) => toast.error("Lỗi khi tải danh sách khách sạn: " + err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleDelete = async (hotelId: number, hotelName: string) => {
    const result = await Swal.fire({
      title: "Xóa khách sạn này?",
      html: `Bạn sắp xóa khách sạn <b>"${hotelName.toUpperCase()}"</b> khỏi hệ thống.<br/><br/>Hành động này sẽ <b>XÓA TOÀN BỘ PHÒNG VÀ ĐƠN ĐẶT</b> liên quan và không thể hoàn tác!`,
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Đúng, xóa ngay!",
      cancelButtonText: "Hủy bỏ",
    });

    if (!result.isConfirmed) return;

    try {
      toast.loading("Đang xóa khách sạn...", { id: `delete-hotel-${hotelId}` });
      await deleteAdminHotel(hotelId);
      toast.success("Đã xóa khách sạn thành công!", { id: `delete-hotel-${hotelId}` });
      fetchHotels();
    } catch (err: any) {
      toast.error("Lỗi: " + err.message, { id: `delete-hotel-${hotelId}` });
    }
  };

  return (
    <>
      <div className="row mt-4">
        <div className="col-12">
          <div className="page-title-box">
            <h4 className="page-title">Quản lý Khách sạn / Đối tác</h4>
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
                      <th className="py-3">Tên Khách sạn</th>
                      <th className="py-3">Địa điểm</th>
                      <th className="py-3">Chủ sở hữu (Vendor)</th>
                      <th className="py-3">Giá từ</th>
                      <th className="py-3">Đánh giá</th>
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
                          <p className="text-muted mt-2 mb-0">Đang tải danh sách khách sạn...</p>
                        </td>
                      </tr>
                    ) : hotels.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-5">
                          <div className="text-muted">
                            <i className="ri-building-4-line display-4"></i>
                            <h5 className="mt-3">Chưa có khách sạn nào</h5>
                            <p className="mb-0">Hệ thống hiện tại chưa có đối tác khách sạn nào đăng tải.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      hotels.map((h) => (
                        <tr key={h.id}>
                          <td className="px-4">
                            <span className="fw-bold">#{h.id}</span>
                          </td>
                          <td>
                            <div className="fw-medium text-primary">{h.name}</div>
                          </td>
                          <td>
                            <div className="text-muted"><i className="ri-map-pin-line me-1"></i>{h.province}</div>
                          </td>
                          <td>
                            <div className="fw-medium">{h.owner_name}</div>
                            <div className="fs-6 text-muted">{h.owner_email}</div>
                          </td>
                          <td>
                            <div className="fw-medium">{h.price_per_night?.toLocaleString('vi-VN')} ₫</div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-1 text-warning">
                              <i className="ri-star-fill" />
                              <span className="text-dark fw-medium">{h.rating}</span>
                            </div>
                          </td>
                          <td className="px-4 text-end">
                            <button 
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDelete(h.id, h.name)}
                              title="Xóa khách sạn"
                            >
                              <i className="ri-delete-bin-line"></i> Xóa
                            </button>
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
