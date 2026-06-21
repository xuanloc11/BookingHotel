"use client";

import { useState } from "react";

export default function ExtranetPromotions() {
  const [promotions, setPromotions] = useState<any[]>([]);

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="page-title-box">
            <div className="page-title-right">
              <button className="btn btn-primary">
                <i className="ri-add-line me-1"></i> Tạo khuyến mãi mới
              </button>
            </div>
            <h4 className="page-title">Quản lý Khuyến mãi & Vouchers</h4>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-sm-4">
                  <div className="input-group">
                    <input type="text" className="form-control" placeholder="Tìm mã khuyến mãi..." />
                    <button className="btn btn-primary" type="button"><i className="ri-search-line"></i></button>
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="text-sm-end mt-2 mt-sm-0">
                    <button type="button" className="btn btn-light mb-2 me-1">Tất cả</button>
                    <button type="button" className="btn btn-light mb-2 me-1">Đang chạy</button>
                    <button type="button" className="btn btn-light mb-2">Đã kết thúc</button>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-centered table-nowrap table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Mã Code</th>
                      <th>Tên chương trình</th>
                      <th>Loại giảm giá</th>
                      <th>Giá trị</th>
                      <th>Thời gian áp dụng</th>
                      <th>Đã dùng</th>
                      <th>Trạng thái</th>
                      <th style={{ width: "125px" }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promotions.map(promo => (
                      <tr key={promo.id}>
                        <td>
                          <span className="badge badge-outline-primary fs-14">{promo.id}</span>
                        </td>
                        <td>
                          <h5 className="font-14 my-1"><a href="#" className="text-body">{promo.name}</a></h5>
                        </td>
                        <td>{promo.type}</td>
                        <td><b>{promo.value}</b></td>
                        <td>
                          {promo.startDate} - {promo.endDate}
                        </td>
                        <td>{promo.usageCount} lần</td>
                        <td>
                          {promo.status === 'active' ? (
                            <span className="badge bg-success-lighten text-success">Đang diễn ra</span>
                          ) : (
                            <span className="badge bg-secondary-lighten text-secondary">Đã kết thúc</span>
                          )}
                        </td>
                        <td>
                          <a href="#" className="action-icon text-info"> <i className="mdi mdi-square-edit-outline"></i></a>
                          <a href="#" className="action-icon text-danger"> <i className="mdi mdi-delete"></i></a>
                        </td>
                      </tr>
                    ))}
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
