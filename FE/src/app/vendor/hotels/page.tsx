"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getVendorHotel, updateVendorHotel, createVendorHotel } from "@/lib/api/vendorApi";
import toast from "react-hot-toast";

export default function VendorHotelManage() {
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const fetchHotel = () => {
    setLoading(true);
    getVendorHotel()
      .then((res) => {
        setHotel(res.hotel);
        if (res.hotel) {
          setFormData(res.hotel);
        } else {
          setIsEditing(true); // Auto-open form if no hotel
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHotel();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleAmenitiesChange = (e: any) => {
    const amenities = e.target.value.split(',').map((s: string) => s.trim());
    setFormData((prev: any) => ({ ...prev, amenities }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (hotel) {
        toast.loading("Đang cập nhật...", { id: "save" });
        await updateVendorHotel(formData);
        toast.success("Cập nhật thành công!", { id: "save" });
      } else {
        toast.loading("Đang tạo...", { id: "save" });
        await createVendorHotel(formData);
        toast.success("Tạo khách sạn thành công!", { id: "save" });
      }
      setIsEditing(false);
      fetchHotel();
    } catch (err: any) {
      toast.error("Lỗi: " + err.message, { id: "save" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="text-center">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="mt-3 text-muted">Đang tải dữ liệu khách sạn...</h5>
      </div>
    </div>
  );

  return (
    <>
      <div className="row mt-4">
        <div className="col-12">
          <div className="page-title-box d-flex justify-content-between align-items-center">
            <h4 className="page-title">Quản lý Khách sạn</h4>
            {hotel && !isEditing && (
              <button onClick={() => setIsEditing(true)} className="btn btn-primary d-flex align-items-center gap-2">
                <i className="ri-edit-box-line" /> Chỉnh sửa thông tin
              </button>
            )}
          </div>
        </div>
      </div>

      {!isEditing && hotel ? (
        <div className="row g-4">
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm overflow-hidden h-100">
              <img src={hotel.thumbnail || "https://placehold.co/600x400?text=No+Image"} alt={hotel.name} className="card-img-top object-fit-cover" style={{ height: 250 }} />
              <div className="card-body">
                <h5 className="card-title fw-bold">{hotel.name}</h5>
                <p className="text-muted mb-2"><i className="ri-map-pin-line" /> {hotel.address}</p>
                <div className="d-flex align-items-center gap-1 text-warning mb-3">
                  <i className="ri-star-fill" />
                  <span className="text-dark fw-medium">{hotel.rating}</span>
                </div>
                <h5 className="text-primary fw-bold mb-0">{hotel.price_per_night?.toLocaleString('vi-VN')} ₫ <span className="fs-6 text-muted fw-normal">/ đêm (mặc định)</span></h5>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-bottom pt-4 pb-3">
                <h5 className="fw-bold m-0">Thông tin chi tiết</h5>
              </div>
              <div className="card-body">
                <p>{hotel.description || "Chưa có mô tả."}</p>
                <h6 className="fw-bold mt-4 mb-3">Tiện ích</h6>
                <div className="d-flex flex-wrap gap-2">
                  {hotel.amenities?.map((am: string, i: number) => (
                    <span key={i} className="badge bg-light text-dark border px-3 py-2">{am}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm bg-primary-subtle border-primary">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold m-0 text-primary mb-1">Quản lý kho phòng</h5>
                  <p className="m-0 text-muted">Thêm, sửa, xóa các loại phòng của khách sạn</p>
                </div>
                <Link href="/vendor/hotels/rooms" className="btn btn-primary px-4">Quản lý Phòng</Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">{hotel ? "Chỉnh sửa khách sạn" : "Tạo khách sạn mới"}</h5>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-medium">Tên khách sạn *</label>
                      <input type="text" className="form-control" name="name" value={formData.name || ''} onChange={handleChange} required />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-medium">Tỉnh/Thành phố *</label>
                      <input type="text" className="form-control" name="province" value={formData.province || ''} onChange={handleChange} required placeholder="VD: Đà Nẵng" />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium">Địa chỉ cụ thể *</label>
                      <input type="text" className="form-control" name="address" value={formData.address || ''} onChange={handleChange} required />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-medium">Giá thấp nhất / đêm (VNĐ)</label>
                      <input type="number" className="form-control" name="price_per_night" value={formData.price_per_night || 0} onChange={handleChange} />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-medium">Ảnh đại diện (URL)</label>
                      <input type="url" className="form-control" name="thumbnail" value={formData.thumbnail || ''} onChange={handleChange} placeholder="https://..." />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium">Tiện ích (Cách nhau bằng dấu phẩy)</label>
                      <input type="text" className="form-control" value={formData.amenities?.join(', ') || ''} onChange={handleAmenitiesChange} placeholder="Hồ bơi, Spa, Gym..." />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium">Mô tả</label>
                      <textarea className="form-control" name="description" rows={5} value={formData.description || ''} onChange={handleChange}></textarea>
                    </div>
                    <div className="col-12 d-flex gap-3 mt-4">
                      <button type="submit" className="btn btn-primary px-5" disabled={saving}>
                        {saving ? "Đang lưu..." : "Lưu thay đổi"}
                      </button>
                      {hotel && (
                        <button type="button" onClick={() => { setIsEditing(false); setFormData(hotel); }} className="btn btn-light">
                          Hủy bỏ
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
