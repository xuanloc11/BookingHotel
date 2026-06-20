"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getVendorRooms, createVendorRoom, updateVendorRoom, deleteVendorRoom } from "@/lib/api/vendorApi";

export default function VendorRoomsManage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const fetchRooms = () => {
    setLoading(true);
    getVendorRooms()
      .then((res) => setRooms(res.rooms))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFeaturesChange = (e: any) => {
    const features = e.target.value.split(',').map((s: string) => s.trim());
    setFormData((prev: any) => ({ ...prev, features }));
  };

  const openAddForm = () => {
    setFormData({ name: '', price: 0, capacity: 2, available_rooms: 1, features: [] });
    setEditingRoom('new');
  };

  const openEditForm = (room: any) => {
    setFormData({ ...room });
    setEditingRoom(room.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa phòng này?')) return;
    try {
      await deleteVendorRoom(id);
      fetchRooms();
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingRoom === 'new') {
        await createVendorRoom(formData);
      } else {
        await updateVendorRoom(editingRoom, formData);
      }
      setEditingRoom(null);
      fetchRooms();
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Link href="/extranet/hotels" className="text-neutral-500 hover-text-main-600 mb-1 d-inline-block"><i className="ph ph-arrow-left" /> Quay lại khách sạn</Link>
          <h3 className="fw-bold m-0">Quản lý Kho phòng</h3>
        </div>
        {!editingRoom && (
          <button onClick={openAddForm} className="btn btn-primary d-flex align-items-center tw-gap-2">
            <i className="ph ph-plus" /> Thêm phòng mới
          </button>
        )}
      </div>

      {editingRoom ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-4">{editingRoom === 'new' ? "Thêm phòng mới" : "Chỉnh sửa phòng"}</h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-medium">Tên phòng *</label>
                  <input type="text" className="form-control" name="name" value={formData.name || ''} onChange={handleChange} required placeholder="VD: Standard Double Room" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-medium">Giá / đêm (VNĐ) *</label>
                  <input type="number" className="form-control" name="price" value={formData.price || 0} onChange={handleChange} required />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-medium">Sức chứa (Người) *</label>
                  <input type="number" className="form-control" name="capacity" value={formData.capacity || 2} onChange={handleChange} required min="1" />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-medium">Số lượng phòng trống *</label>
                  <input type="number" className="form-control" name="available_rooms" value={formData.available_rooms || 1} onChange={handleChange} required min="0" />
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium">Tiện nghi phòng (Cách nhau dấu phẩy)</label>
                  <input type="text" className="form-control" value={formData.features?.join(', ') || ''} onChange={handleFeaturesChange} placeholder="Tivi, Điều hòa, Bồn tắm..." />
                </div>
                
                <div className="col-12 d-flex tw-gap-3 mt-4">
                  <button type="submit" className="btn btn-primary px-4" disabled={saving}>
                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                  <button type="button" onClick={() => setEditingRoom(null)} className="btn btn-light px-4">
                    Hủy bỏ
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {rooms.length === 0 ? (
            <div className="col-12 text-center py-5 bg-white rounded shadow-sm">
              <p className="text-neutral-500 mb-0">Chưa có loại phòng nào.</p>
            </div>
          ) : (
            rooms.map((room) => (
              <div key={room.id} className="col-12 col-md-6 col-xl-4">
                <div className="card border-0 shadow-sm h-100 position-relative">
                  {room.available_rooms === 0 && (
                     <span className="position-absolute top-0 end-0 badge bg-danger m-2">Hết phòng</span>
                  )}
                  <div className="card-body">
                    <h5 className="fw-bold mb-1">{room.name}</h5>
                    <p className="text-main-600 fw-bold mb-3">{room.price.toLocaleString('vi-VN')} ₫ / đêm</p>
                    
                    <div className="d-flex tw-gap-4 mb-3 text-neutral-600 tw-text-sm">
                      <div><i className="ph ph-users" /> {room.capacity} người</div>
                      <div><i className="ph ph-door" /> Còn {room.available_rooms} phòng</div>
                    </div>
                    
                    <div className="d-flex flex-wrap tw-gap-1 mb-4">
                      {room.features?.slice(0, 3).map((f: string, i: number) => (
                        <span key={i} className="badge bg-light text-dark border">{f}</span>
                      ))}
                      {room.features?.length > 3 && <span className="badge bg-light text-dark border">+{room.features.length - 3}</span>}
                    </div>
                    
                    <div className="d-flex tw-gap-2">
                      <button onClick={() => openEditForm(room)} className="btn btn-outline-primary btn-sm flex-grow-1">Sửa</button>
                      <button onClick={() => handleDelete(room.id)} className="btn btn-outline-danger btn-sm"><i className="ph ph-trash" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
