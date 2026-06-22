"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { UserProfile } from "@/types/user";
import { BookingSummary } from "@/types/booking";
import { updateCurrentUser } from "@/lib/api/userApi";
import { useAuth } from "@/lib/auth/AuthContext";
import toast from "react-hot-toast";

const moneyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

interface ProfileDashboardProps {
  user: UserProfile;
  bookings?: BookingSummary[];
}

export default function ProfileDashboard({ user, bookings = [] }: ProfileDashboardProps) {
  const { handleLogout, setUser } = useAuth();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"profile" | "bookings">(tabParam === "bookings" ? "bookings" : "profile");

  useEffect(() => {
    if (tabParam === "bookings") {
      setActiveTab("bookings");
    } else if (tabParam === "profile") {
      setActiveTab("profile");
    }
  }, [tabParam]);
  const [formData, setFormData] = useState({
    full_name: user.full_name || "",
    phone: user.phone || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser = await updateCurrentUser({
        full_name: formData.full_name,
        phone: formData.phone,
      });
      setUser(updatedUser); // Update AuthContext state
      toast.success("Cập nhật hồ sơ thành công!");
    } catch (error: any) {
      toast.error(error.message || "Cập nhật hồ sơ thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container tw-my-16">
      <div className="row justify-content-center">
        <div className="col-lg-10">

          <ul className="nav nav-tabs tw-mb-6 border-bottom-0 tw-gap-2">
            <li className="nav-item">
              <button 
                className={`nav-link tw-rounded-t-lg tw-px-6 tw-py-3 fw-medium ${activeTab === 'profile' ? 'active bg-white text-main-600 border-bottom-0 shadow-sm' : 'text-neutral-500 bg-neutral-100 border-0'}`} 
                onClick={() => setActiveTab('profile')}
              >
                Hồ sơ cá nhân
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link tw-rounded-t-lg tw-px-6 tw-py-3 fw-medium ${activeTab === 'bookings' ? 'active bg-white text-main-600 border-bottom-0 shadow-sm' : 'text-neutral-500 bg-neutral-100 border-0'}`} 
                onClick={() => setActiveTab('bookings')}
              >
                Đơn đặt của tôi
              </button>
            </li>
          </ul>

          <div className="card border-0 shadow-sm tw-rounded-xl tw-rounded-tl-none">
            <div className="card-body tw-p-8">
              
              {activeTab === 'profile' && (
                <>
                  <h3 className="tw-mb-6">Thông tin tài khoản</h3>
                  
                  <div className="d-flex align-items-center tw-gap-4 tw-mb-8">
                    <div 
                      className="bg-main-600 text-white rounded-circle d-flex justify-content-center align-items-center fw-bold"
                      style={{ width: 80, height: 80, fontSize: 32 }}
                    >
                      {(user.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}
                    </div>
                    <div>
                      <h4 className="tw-mb-1">{user.full_name || user.email}</h4>
                      <p className="text-neutral-500 tw-mb-0">{user.email}</p>
                      <span className="badge bg-primary tw-mt-2">{user.role?.toUpperCase() || 'CUSTOMER'}</span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="form-label fw-semibold">Email (Không thể thay đổi)</label>
                      <input type="email" className="form-control bg-light" value={user.email} disabled />
                    </div>
                    
                    <div className="mb-4">
                      <label className="form-label fw-semibold">Họ và Tên</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={formData.full_name}
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                        placeholder="Nhập họ và tên của bạn"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold">Số điện thoại</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="Nhập số điện thoại"
                      />
                    </div>

                    <div className="d-flex align-items-center justify-content-between tw-mt-8 pt-4 border-top">
                      <button type="button" onClick={handleLogout} className="btn btn-outline-danger">
                        Đăng xuất
                      </button>
                      <button type="submit" disabled={loading} className="btn btn-main">
                        {loading ? "Đang lưu..." : "Lưu thay đổi"}
                      </button>
                    </div>
                  </form>
                </>
              )}

              {activeTab === 'bookings' && (
                <>
                  <div className="d-flex justify-content-between align-items-center tw-mb-6">
                    <h3 className="mb-0">Lịch sử đặt phòng</h3>
                    <Link className="btn btn-outline-main" href="/room">
                      Đặt phòng mới
                    </Link>
                  </div>

                  {bookings.length === 0 ? (
                    <div className='bg-neutral-100 tw-rounded-lg tw-p-10 text-center'>
                      <h4 className='fw-normal tw-mb-3'>Chưa có đơn đặt phòng</h4>
                      <p className='tw-mb-6'>
                        Các đơn đặt phòng đã xác nhận và chờ xử lý sẽ xuất hiện ở đây sau khi thanh toán.
                      </p>
                      <Link className='text-main-600 fw-bold hover-text-main-800' href='/room'>
                        Duyệt khách sạn ngay
                      </Link>
                    </div>
                  ) : (
                    <div className='d-flex flex-column tw-gap-5'>
                      {bookings.map((booking) => (
                        <article
                          className='bg-neutral-50 border tw-rounded-lg tw-p-5 d-flex flex-wrap tw-gap-5 align-items-center'
                          key={booking.booking_id}
                        >
                          {booking.hotel_thumbnail ? (
                            <Image
                              alt={booking.hotel_name}
                              className='tw-rounded-lg object-fit-cover'
                              height={130}
                              src={booking.hotel_thumbnail}
                              width={170}
                            />
                          ) : null}
                          <div className='flex-grow-1'>
                            <div className='d-flex align-items-center tw-gap-3 flex-wrap tw-mb-2'>
                              <h4 className='fw-normal mb-0'>
                                {booking.hotel_name}
                              </h4>
                              <span className='badge bg-warning text-dark text-capitalize'>
                                {booking.status}
                              </span>
                            </div>
                            <p className='tw-mb-2'>
                              <i className="ph ph-calendar-blank tw-me-2"></i>
                              {booking.check_in} — {booking.check_out}
                            </p>
                            <p className='mb-0 text-neutral-500'>
                              Mã đơn: <strong className="text-dark">{booking.booking_id}</strong>
                            </p>
                          </div>
                          <div className='text-xl-end d-flex flex-column justify-content-between h-100 align-items-end'>
                            <strong className='tw-text-xl text-main-600 d-block tw-mb-3'>
                              {moneyFormatter.format(booking.total)}
                            </strong>
                            <Link
                              className='font-heading text-heading hover-text-main-600 d-flex align-items-center tw-gap-1'
                              href={`/hotel/${booking.hotel_id}`}
                            >
                              Xem khách sạn <i className='ph ph-arrow-up-right' />
                            </Link>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
