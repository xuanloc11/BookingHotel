"use client";

import { useEffect, useState } from "react";
import { getAdminHotels, deleteAdminHotel } from "@/lib/api/adminApi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import AdminPagination from "@/components/layout/AdminPagination";

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
      title: "Đình chỉ khách sạn này?",
      html: `Bạn sắp đình chỉ hoạt động khách sạn <b>"${hotelName.toUpperCase()}"</b> khỏi hệ thống.<br/><br/>Khách sạn này sẽ không thể nhận thêm đơn đặt phòng mới, nhưng lịch sử giao dịch vẫn được giữ lại.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Đúng, đình chỉ ngay!",
      cancelButtonText: "Hủy bỏ",
    });

    if (!result.isConfirmed) return;

    try {
      toast.loading("Đang đình chỉ khách sạn...", { id: `delete-hotel-${hotelId}` });
      await deleteAdminHotel(hotelId);
      toast.success("Đã đình chỉ khách sạn thành công!", { id: `delete-hotel-${hotelId}` });
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
                <table className="table table-hover table-centered align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3">Tên Khách sạn</th>
                      <th className="py-3">Địa điểm</th>
                      <th className="py-3">Chủ sở hữu (Vendor)</th>
                      <th className="py-3 text-end">Giá từ</th>
                      <th className="py-3 text-center">Đánh giá</th>
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
                          <td className="text-end">
                            <div className="fw-medium">{h.price_per_night?.toLocaleString('vi-VN')} ₫</div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center gap-1 text-warning">
                              <i className="ri-star-fill" />
                              <span className="text-dark fw-medium">{h.rating}</span>
                            </div>
                          </td>
                          <td className="px-4 text-end">
                            <button 
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDelete(h.id, h.name)}
                              title="Đình chỉ khách sạn"
                            >
                              <i className="ri-delete-bin-line"></i> Đình chỉ
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <AdminPagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                setCurrentPage={setCurrentPage} 
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
