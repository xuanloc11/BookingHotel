"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminDashboard } from "@/lib/api/adminApi";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend
} from "recharts";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all");

  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  useEffect(() => {
    if (period === 'custom' && (!customStart || !customEnd)) {
      return;
    }
    
    setLoading(true);
    getAdminDashboard(period, customStart, customEnd)
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [period, customStart, customEnd]);

  const periods = [
    { value: "day", label: "Hôm nay" },
    { value: "week", label: "7 ngày qua" },
    { value: "month", label: "30 ngày qua" },
    { value: "year", label: "1 năm qua" },
    { value: "custom", label: "Tùy chọn ngày..." },
    { value: "all", label: "Toàn thời gian" },
  ];

  const getChartTitleSuffix = () => {
    switch (period) {
      case 'day': return 'hôm nay';
      case 'week': return '7 ngày qua';
      case 'month': return '30 ngày qua';
      case 'year': return '1 năm qua';
      case 'custom': return `tùy chọn (${customStart} - ${customEnd})`;
      case 'all': 
      default: 
        return '6 tháng gần nhất';
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <>
      <div className="row mt-4">
        <div className="col-12">
          <div className="page-title-box d-flex align-items-center justify-content-between">
            <h4 className="page-title">Tổng quan Hệ thống</h4>
            <div className="d-flex align-items-center gap-2">
              <i className="ri-calendar-line text-primary fs-4"></i>
              <select 
                className="form-select border shadow-sm bg-white fw-medium text-dark cursor-pointer"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                style={{ minWidth: '160px' }}
              >
                {periods.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              
              {period === 'custom' && (
                <div className="d-flex align-items-center gap-2 ms-2">
                  <input 
                    type="date" 
                    className="form-control form-control-sm border shadow-sm" 
                    value={customStart}
                    onChange={e => setCustomStart(e.target.value)}
                  />
                  <span>-</span>
                  <input 
                    type="date" 
                    className="form-control form-control-sm border shadow-sm" 
                    value={customEnd}
                    onChange={e => setCustomEnd(e.target.value)}
                    min={customStart}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-xxl-3 col-sm-6">
          <div className="card widget-flat">
            <div className="card-body">
              <div className="float-end">
                <i className="ri-group-line widget-icon bg-primary-lighten text-primary"></i>
              </div>
              <h5 className="text-muted fw-normal mt-0" title="Tổng người dùng">Người dùng</h5>
              <h3 className="mt-3 mb-3">{data?.total_users || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-xxl-3 col-sm-6">
          <div className="card widget-flat">
            <div className="card-body">
              <div className="float-end">
                <i className="ri-building-4-line widget-icon bg-info-lighten text-info"></i>
              </div>
              <h5 className="text-muted fw-normal mt-0" title="Tổng đối tác/khách sạn">Khách sạn đối tác</h5>
              <h3 className="mt-3 mb-3">{data?.total_hotels || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-xxl-3 col-sm-6">
          <div className="card widget-flat">
            <div className="card-body">
              <div className="float-end">
                <i className="ri-calendar-check-line widget-icon bg-warning-lighten text-warning"></i>
              </div>
              <h5 className="text-muted fw-normal mt-0" title="Tổng đơn đặt phòng">Đơn đặt phòng</h5>
              <h3 className="mt-3 mb-3">{data?.total_bookings || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-xxl-3 col-sm-6">
          <div className="card widget-flat">
            <div className="card-body">
              <div className="float-end">
                <i className="ri-money-dollar-box-line widget-icon bg-success-lighten text-success"></i>
              </div>
              <h5 className="text-muted fw-normal mt-0" title="Tổng doanh thu toàn sàn">Doanh thu sàn</h5>
              <h3 className="mt-3 mb-3">{data?.total_revenue?.toLocaleString('vi-VN') || 0} ₫</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-bottom pt-4 pb-3">
              <h5 className="fw-bold m-0">Doanh thu sàn {getChartTitleSuffix()}</h5>
            </div>
            <div className="card-body">
              {data?.chart_data && data.chart_data.length > 0 ? (
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <AreaChart data={data.chart_data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => new Intl.NumberFormat('vi-VN', { notation: "compact", compactDisplay: "short" }).format(value)} />
                      <Tooltip formatter={(value: any) => value.toLocaleString('vi-VN') + ' ₫'} />
                      <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke="#0acf97" fill="#0acf97" fillOpacity={0.2} isAnimationActive={true} animationDuration={1500} animationEasing="ease-out" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-5 text-muted">Chưa có dữ liệu doanh thu.</div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-xl-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-bottom pt-4 pb-3">
              <h5 className="fw-bold m-0">Đơn đặt phòng toàn hệ thống {getChartTitleSuffix()}</h5>
            </div>
            <div className="card-body">
              {data?.chart_data && data.chart_data.length > 0 ? (
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={data.chart_data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="bookings" name="Đơn đặt phòng" fill="#727cf5" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={1500} animationEasing="ease-out" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-5 text-muted">Chưa có dữ liệu đặt phòng.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom pt-4 pb-3">
              <h5 className="fw-bold m-0">Giao dịch gần đây trên hệ thống</h5>
            </div>
            <div className="card-body">
              {!data?.recent_bookings || data.recent_bookings.length === 0 ? (
                <p className="text-muted text-center py-4">Chưa có giao dịch nào.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-centered align-middle table-nowrap mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Mã đơn</th>
                        <th>Khách sạn</th>
                        <th>Khách hàng</th>
                        <th>Ngày nhận/trả</th>
                        <th className="text-end">Tổng tiền</th>
                        <th className="text-center">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recent_bookings.map((b: any) => (
                        <tr key={b.booking_id}>
                          <td><span className="fw-medium">#{b.booking_id}</span></td>
                          <td>{b.hotel_name}</td>
                          <td>{b.guests.adults} NL, {b.guests.children} TE</td>
                          <td>{b.check_in} &rarr; {b.check_out}</td>
                          <td className="fw-medium text-primary text-end">{b.total.toLocaleString('vi-VN')} ₫</td>
                          <td className="text-center">
                            <span className={`badge ${
                              b.status === 'confirmed' ? 'bg-primary' : 
                              b.status === 'pending' ? 'bg-warning text-dark' : 
                              b.status === 'completed' ? 'bg-success' : 'bg-danger'
                            }`}>
                              {b.status === 'confirmed' ? 'ĐÃ XÁC NHẬN' : 
                               b.status === 'pending' ? 'CHỜ DUYỆT' : 
                               b.status === 'completed' ? 'HOÀN TẤT' : 
                               b.status === 'cancelled' ? 'ĐÃ HỦY' : b.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="text-center mt-3">
                <Link href="/admin/bookings" className="btn btn-outline-primary btn-sm">Xem tất cả đơn</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
