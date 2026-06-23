"use client";

import { useEffect, useState } from "react";
import { getAdminHotels, deleteAdminHotel } from "@/lib/api/adminApi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function AdminHotelsManage() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // States for search, filter, pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProvince, setFilterProvince] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterProvince]);

  // Derived state for filtering and pagination
  const filteredHotels = hotels.filter((h) => {
    if (filterProvince !== "all" && h.province !== filterProvince) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = String(h.id).toLowerCase().includes(q);
      const matchName = h.name?.toLowerCase().includes(q);
      const matchOwner = h.owner_name?.toLowerCase().includes(q);
      const matchOwnerEmail = h.owner_email?.toLowerCase().includes(q);
      return matchId || matchName || matchOwner || matchOwnerEmail;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentHotels = filteredHotels.slice(startIndex, startIndex + itemsPerPage);

  const provinces = Array.from(new Set(hotels.map(h => h.province))).filter(Boolean);

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

      {/* Toolbar: Search & Filter */}
      <div className="row mb-4">
        <div className="col-12 col-md-6 mb-3 mb-md-0">
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white border-end-0 text-muted"><i className="ri-search-line"></i></span>
            <input 
              type="text" 
              className="form-control border-start-0 ps-0" 
              placeholder="Tìm theo ID, Tên KS, Tên/Email Chủ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="col-12 col-md-3">
          <select 
            className="form-select shadow-sm"
            value={filterProvince}
            onChange={(e) => setFilterProvince(e.target.value)}
          >
            <option value="all">Tất cả khu vực</option>
            {provinces.map((p: any) => <option key={p} value={p}>{p}</option>)}
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
                            <h5 className="mt-3">Không tìm thấy khách sạn</h5>
                            <p className="mb-0">Vui lòng thử lại với từ khóa hoặc bộ lọc khác.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentHotels.map((h) => (
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
