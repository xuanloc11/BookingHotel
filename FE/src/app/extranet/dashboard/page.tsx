"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getExtranetDashboard } from "@/lib/api/vendorApi";
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
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function ExtranetDashboard() {
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
    getExtranetDashboard(period, customStart, customEnd)
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

  if (loading && !data) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="text-center">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="mt-3 text-muted">Đang tải dữ liệu tổng quan...</h5>
      </div>
    </div>
  );

  if (!data?.has_hotel) {
    return (
      <div className="row mt-4">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center py-5">
              <div className="display-4 text-muted mb-3"><i className="ri-building-4-line" /></div>
              <h4 className="card-title fw-bold">Chưa có khách sạn nào</h4>
              <p className="card-text text-muted mb-4">Bạn cần thêm khách sạn của mình để bắt đầu quản lý và nhận đơn đặt phòng.</p>
              <Link href="/extranet/hotels" className="btn btn-primary fw-medium px-4">
                Thêm khách sạn ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Data processing for new charts
  const statusData = data?.status_distribution ? Object.entries(data.status_distribution).map(([key, value]) => ({
    name: key === 'completed' ? 'Hoàn tất' : key === 'confirmed' ? 'Đã xác nhận' : key === 'cancelled' ? 'Đã hủy' : 'Chờ duyệt',
    value,
    color: key === 'completed' ? '#0acf97' : key === 'confirmed' ? '#39afd1' : key === 'cancelled' ? '#fa5c7c' : '#ffbc00'
  })) : [];

  const roomTypeData = data?.room_type_stats || [];

  return (
    <>
      <div className="row mt-4">
        <div className="col-12">
          <div className="page-title-box d-flex align-items-center justify-content-between">
            <h4 className="page-title">Tổng quan: {data.hotel_name}</h4>
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
      
      <div className="row g-4 mb-4">
        <div className="col-xxl-4 col-sm-6">
          <div className="card widget-flat">
            <div className="card-body">
              <div className="float-end">
                <i className="ri-money-dollar-box-line widget-icon bg-success-lighten text-success"></i>
              </div>
              <h5 className="text-muted fw-normal mt-0" title="Tổng doanh thu">Tổng doanh thu</h5>
              <h3 className="mt-3 mb-3">{data.total_revenue.toLocaleString('vi-VN')} ₫</h3>
            </div>
          </div>
        </div>

        <div className="col-xxl-4 col-sm-6">
          <div className="card widget-flat">
            <div className="card-body">
              <div className="float-end">
                <i className="ri-calendar-check-line widget-icon bg-info-lighten text-info"></i>
              </div>
              <h5 className="text-muted fw-normal mt-0" title="Đơn đặt phòng">Đơn đặt phòng</h5>
              <h3 className="mt-3 mb-3">{data.total_bookings}</h3>
            </div>
          </div>
        </div>

        <div className="col-xxl-4 col-sm-6">
          <div className="card widget-flat">
            <div className="card-body">
              <div className="float-end">
                <i className="ri-door-open-line widget-icon bg-warning-lighten text-warning"></i>
              </div>
              <h5 className="text-muted fw-normal mt-0" title="Số loại phòng">Số loại phòng</h5>
              <h3 className="mt-3 mb-3">{data.rooms_count}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-bottom pt-4 pb-3">
              <h5 className="fw-bold m-0">Doanh thu {getChartTitleSuffix()}</h5>
            </div>
            <div className="card-body">
              {data.chart_data && data.chart_data.length > 0 ? (
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <AreaChart data={data.chart_data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => new Intl.NumberFormat('vi-VN', { notation: "compact", compactDisplay: "short" }).format(value)} />
                      <Tooltip formatter={(value: any) => value.toLocaleString('vi-VN') + ' ₫'} />
                      <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke="#0acf97" fill="#0acf97" fillOpacity={0.2} />
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
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-bottom pt-4 pb-3">
              <h5 className="fw-bold m-0">Đơn đặt phòng {getChartTitleSuffix()}</h5>
            </div>
            <div className="card-body">
              {data.chart_data && data.chart_data.length > 0 ? (
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={data.chart_data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="bookings" name="Đơn đặt phòng" fill="#39afd1" radius={[4, 4, 0, 0]} />
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

      <div className="row g-4 mb-4">
        <div className="col-xl-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-bottom pt-4 pb-3">
              <h5 className="fw-bold m-0">Trạng thái đơn hàng</h5>
            </div>
            <div className="card-body d-flex align-items-center justify-content-center">
              {statusData.length > 0 ? (
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-5 text-muted">Chưa có dữ liệu trạng thái.</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-xl-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-bottom pt-4 pb-3">
              <h5 className="fw-bold m-0">Cơ cấu doanh thu (Thực nhận & Hoa hồng)</h5>
            </div>
            <div className="card-body">
              {data.chart_data && data.chart_data.length > 0 ? (
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={data.chart_data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => new Intl.NumberFormat('vi-VN', { notation: "compact", compactDisplay: "short" }).format(value)} />
                      <Tooltip formatter={(value: any) => value.toLocaleString('vi-VN') + ' ₫'} />
                      <Legend />
                      <Bar dataKey="net_revenue" stackId="a" name="Thực nhận" fill="#0acf97" />
                      <Bar dataKey="commission" stackId="a" name="Hoa hồng" fill="#ffbc00" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-5 text-muted">Chưa có dữ liệu.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-bottom pt-4 pb-3">
              <h5 className="fw-bold m-0">Tỷ lệ đặt theo loại phòng</h5>
            </div>
            <div className="card-body d-flex align-items-center justify-content-center">
              {roomTypeData.length > 0 ? (
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={roomTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="bookings_count"
                        nameKey="name"
                        label
                      >
                        {roomTypeData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={['#727cf5', '#0acf97', '#fa5c7c', '#ffbc00', '#39afd1'][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-5 text-muted">Chưa có dữ liệu phòng.</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-xl-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-bottom pt-4 pb-3">
              <h5 className="fw-bold m-0">Doanh thu theo loại phòng</h5>
            </div>
            <div className="card-body">
              {roomTypeData.length > 0 ? (
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart layout="vertical" data={roomTypeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" tickFormatter={(value) => new Intl.NumberFormat('vi-VN', { notation: "compact", compactDisplay: "short" }).format(value)} />
                      <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
                      <Tooltip formatter={(value: any) => value.toLocaleString('vi-VN') + ' ₫'} />
                      <Bar dataKey="revenue" name="Doanh thu" fill="#727cf5" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-5 text-muted">Chưa có dữ liệu doanh thu phòng.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom pt-4 pb-3">
              <h5 className="fw-bold m-0">Đơn đặt phòng gần đây</h5>
            </div>
            <div className="card-body">
              {data.recent_bookings.length === 0 ? (
                <p className="text-muted text-center py-4">Chưa có đơn đặt phòng nào.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-centered align-middle table-nowrap mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="text-start">Mã đơn</th>
                        <th>Ngày nhận</th>
                        <th>Ngày trả</th>
                        <th>Khách</th>
                        <th className="text-end">Tổng tiền</th>
                        <th className="text-center">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recent_bookings.map((b: any) => (
                        <tr key={b.booking_id}>
                          <td className="text-start"><span className="fw-medium">#{b.booking_id}</span></td>
                          <td>{b.check_in}</td>
                          <td>{b.check_out}</td>
                          <td>{b.guests.adults} NL, {b.guests.children} TE</td>
                          <td className="fw-medium text-primary text-end">{b.total.toLocaleString('vi-VN')} ₫</td>
                          <td className="text-center">
                            <span className={`badge ${
                              b.status === 'confirmed' ? 'bg-success' : 
                              b.status === 'pending' ? 'bg-warning text-dark' : 
                              b.status === 'completed' ? 'bg-info' : 'bg-danger'
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
                <Link href="/extranet/bookings" className="btn btn-outline-primary btn-sm">Xem tất cả đơn</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
