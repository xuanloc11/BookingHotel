"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { getVendorSettings, updateVendorSettings } from "@/lib/api/vendorApi";

export default function ExtranetSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    company_name: "",
    tax_id: "",
    bank_name: "",
    bank_branch: "",
    account_name: "",
    account_number: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getVendorSettings().then(res => {
      if (res.settings) {
        setSettings({
          company_name: res.settings.company_name || "",
          tax_id: res.settings.tax_id || "",
          bank_name: res.settings.bank_name || "",
          bank_branch: res.settings.bank_branch || "",
          account_name: res.settings.account_name || "",
          account_number: res.settings.account_number || "",
        });
      }
    }).catch(console.error);
  }, []);

  const handleChange = (e: any) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveSettings = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateVendorSettings(settings);
      alert("Đã cập nhật cài đặt thành công!");
    } catch (err: any) {
      alert("Lỗi cập nhật cài đặt: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="page-title-box">
            <h4 className="page-title">Cài đặt Tài khoản & Hồ sơ</h4>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-4 col-lg-5">
          <div className="card text-center">
            <div className="card-body">
              {user?.avatar_url ? (
                <img src={user.avatar_url} className="rounded-circle avatar-lg img-thumbnail" alt="profile-image" />
              ) : (
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: 88, height: 88, fontSize: 32 }}>
                  {(user?.full_name?.[0] || "U").toUpperCase()}
                </div>
              )}

              <h4 className="mb-0 mt-2">{settings.company_name || "Chưa cập nhật tên công ty"}</h4>

              <div className="text-start mt-3">
                <h4 className="font-13 text-uppercase">Thông tin liên hệ:</h4>
                <p className="text-muted mb-2 font-13"><strong>Tên người đại diện :</strong> <span className="ms-2">{user?.full_name}</span></p>
                <p className="text-muted mb-2 font-13"><strong>Số điện thoại :</strong><span className="ms-2">{user?.phone || "Chưa cập nhật"}</span></p>
                <p className="text-muted mb-2 font-13"><strong>Email :</strong> <span className="ms-2">{user?.email}</span></p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-8 col-lg-7">
          <div className="card">
            <div className="card-body">
              <ul className="nav nav-pills bg-nav-pills nav-justified mb-3">
                <li className="nav-item">
                  <a href="#profile" data-bs-toggle="tab" aria-expanded="true" className="nav-link rounded-0 active">
                    Thông tin doanh nghiệp
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#payment" data-bs-toggle="tab" aria-expanded="false" className="nav-link rounded-0">
                    Tài khoản Ngân hàng
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#security" data-bs-toggle="tab" aria-expanded="false" className="nav-link rounded-0">
                    Bảo mật
                  </a>
                </li>
              </ul>

              <div className="tab-content">
                <div className="tab-pane show active" id="profile">
                  <form onSubmit={handleSaveSettings}>
                    <h5 className="mb-4 text-uppercase"><i className="mdi mdi-account-circle me-1"></i> Thông tin pháp lý</h5>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Tên doanh nghiệp / Pháp nhân</label>
                          <input type="text" className="form-control" name="company_name" value={settings.company_name} onChange={handleChange} placeholder="Nhập tên công ty" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Mã số thuế</label>
                          <input type="text" className="form-control" name="tax_id" value={settings.tax_id} onChange={handleChange} placeholder="Nhập mã số thuế" />
                        </div>
                      </div>
                    </div>

                    <h5 className="mb-3 text-uppercase bg-light p-2"><i className="mdi mdi-office-building me-1"></i> Thông tin Người đại diện</h5>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Họ và tên</label>
                          <input type="text" className="form-control" value={user?.full_name || ""} disabled />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Email đăng nhập</label>
                          <input type="text" className="form-control" value={user?.email || ""} disabled />
                        </div>
                      </div>
                    </div>

                    <div className="text-end">
                      <button type="submit" className="btn btn-success mt-2" disabled={isLoading}>
                        <i className="mdi mdi-content-save"></i> Cập nhật
                      </button>
                    </div>
                  </form>
                </div>

                <div className="tab-pane" id="payment">
                  <form onSubmit={handleSaveSettings}>
                    <h5 className="mb-4 text-uppercase"><i className="mdi mdi-bank me-1"></i> Tài khoản nhận thanh toán (Payouts)</h5>
                    <p className="text-muted font-14 mb-3">
                      Tiền doanh thu từ các đơn đặt phòng (sau khi trừ phí nền tảng) sẽ được tự động chuyển khoản về tài khoản này vào ngày 1 và 15 hàng tháng.
                    </p>
                    
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Tên Ngân hàng</label>
                          <select className="form-select" name="bank_name" value={settings.bank_name} onChange={handleChange}>
                            <option value="">Chọn ngân hàng</option>
                            <option value="VCB">Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)</option>
                            <option value="TCB">Ngân hàng TMCP Kỹ thương Việt Nam (Techcombank)</option>
                            <option value="BIDV">Ngân hàng TMCP Đầu tư và Phát triển (BIDV)</option>
                            <option value="CTG">Ngân hàng TMCP Công Thương Việt Nam (VietinBank)</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Chi nhánh</label>
                          <input type="text" className="form-control" name="bank_branch" value={settings.bank_branch} onChange={handleChange} placeholder="VD: Chi nhánh Thăng Long" />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Tên chủ tài khoản</label>
                          <input type="text" className="form-control" name="account_name" value={settings.account_name} onChange={handleChange} placeholder="VD: NGUYEN VAN A" />
                          <small className="form-text text-muted">Phải trùng khớp với tên trên giấy phép đăng ký kinh doanh hoặc CMND/CCCD.</small>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Số tài khoản</label>
                          <input type="text" className="form-control" name="account_number" value={settings.account_number} onChange={handleChange} placeholder="Nhập số tài khoản" />
                        </div>
                      </div>
                    </div>

                    <div className="text-end">
                      <button type="submit" className="btn btn-success mt-2" disabled={isLoading}>
                        <i className="mdi mdi-content-save"></i> Cập nhật
                      </button>
                    </div>
                  </form>
                </div>

                <div className="tab-pane" id="security">
                  <form>
                    <h5 className="mb-4 text-uppercase"><i className="mdi mdi-lock me-1"></i> Đổi mật khẩu</h5>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">Mật khẩu hiện tại</label>
                          <input type="password" className="form-control" />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Mật khẩu mới</label>
                          <input type="password" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Xác nhận mật khẩu mới</label>
                          <input type="password" className="form-control" />
                        </div>
                      </div>
                    </div>
                    <div className="text-end">
                      <button type="submit" className="btn btn-success mt-2"><i className="mdi mdi-content-save"></i> Đổi mật khẩu</button>
                    </div>
                  </form>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
