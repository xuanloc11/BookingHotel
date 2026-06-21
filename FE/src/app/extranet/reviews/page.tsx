"use client";

import { useState } from "react";

export default function ExtranetReviews() {
  const [activeTab, setActiveTab] = useState("all");

  const [reviews, setReviews] = useState<any[]>([]);
  const filteredReviews = activeTab === "all" ? reviews : reviews.filter(r => r.status === activeTab);

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="page-title-box">
            <h4 className="page-title">Đánh giá của khách hàng</h4>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-xl-3 col-lg-4">
          <div className="card tilebox-one">
            <div className="card-body">
              <i className="ri-star-smile-line float-end text-muted fs-3"></i>
              <h6 className="text-uppercase mt-0">Điểm đánh giá trung bình</h6>
              <h2 className="my-2">4.5 <span className="fs-16 text-muted">/ 5.0</span></h2>
              <p className="mb-0 text-muted">
                <span className="text-success me-2"><i className="mdi mdi-arrow-up-bold"></i> +0.2</span>
                <span className="text-nowrap">So với tháng trước</span>
              </p>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-lg-4">
          <div className="card tilebox-one">
            <div className="card-body">
              <i className="ri-message-3-line float-end text-muted fs-3"></i>
              <h6 className="text-uppercase mt-0">Tổng lượt đánh giá</h6>
              <h2 className="my-2">1,284</h2>
              <p className="mb-0 text-muted">
                <span className="text-success me-2"><i className="mdi mdi-arrow-up-bold"></i> +45</span>
                <span className="text-nowrap">Tháng này</span>
              </p>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-lg-4">
          <div className="card tilebox-one">
            <div className="card-body">
              <i className="ri-reply-all-line float-end text-muted fs-3"></i>
              <h6 className="text-uppercase mt-0">Tỷ lệ phản hồi</h6>
              <h2 className="my-2">92%</h2>
              <p className="mb-0 text-muted">
                <span className="text-danger me-2"><i className="mdi mdi-arrow-down-bold"></i> -2%</span>
                <span className="text-nowrap">Cần cái thiện</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <ul className="nav nav-pills bg-nav-pills nav-justified mb-3 w-50">
                <li className="nav-item">
                  <button onClick={() => setActiveTab('all')} className={`nav-link rounded-0 ${activeTab === 'all' ? 'active' : ''}`}>
                    Tất cả đánh giá
                  </button>
                </li>
                <li className="nav-item">
                  <button onClick={() => setActiveTab('pending')} className={`nav-link rounded-0 ${activeTab === 'pending' ? 'active' : ''}`}>
                    Chưa trả lời
                  </button>
                </li>
                <li className="nav-item">
                  <button onClick={() => setActiveTab('replied')} className={`nav-link rounded-0 ${activeTab === 'replied' ? 'active' : ''}`}>
                    Đã trả lời
                  </button>
                </li>
              </ul>

              <div className="tab-content">
                <div className="table-responsive">
                  <table className="table table-centered mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Khách sạn</th>
                        <th>Khách hàng</th>
                        <th>Đánh giá</th>
                        <th style={{ width: "40%" }}>Nội dung</th>
                        <th>Ngày gửi</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReviews.map((review) => (
                        <tr key={review.id}>
                          <td><b>{review.hotelName}</b></td>
                          <td>{review.customer}</td>
                          <td>
                            <div className="text-warning">
                              {[...Array(5)].map((_, i) => (
                                <i key={i} className={i < review.rating ? "ri-star-fill" : "ri-star-line"}></i>
                              ))}
                            </div>
                          </td>
                          <td>
                            <p className="mb-1 text-wrap">{review.content}</p>
                            {review.reply && (
                              <div className="bg-light p-2 rounded mt-2">
                                <strong>Phản hồi của bạn:</strong>
                                <p className="mb-0 text-muted fst-italic">{review.reply}</p>
                              </div>
                            )}
                          </td>
                          <td>{review.date}</td>
                          <td>
                            {review.status === "replied" ? (
                              <span className="badge bg-success">Đã trả lời</span>
                            ) : (
                              <span className="badge bg-warning text-dark">Chưa trả lời</span>
                            )}
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary">
                              {review.status === "replied" ? "Sửa phản hồi" : "Trả lời"}
                            </button>
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
      </div>
    </>
  );
}
