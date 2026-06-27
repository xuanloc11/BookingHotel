"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { format, addDays } from "date-fns";
import { useCurrency } from "@/lib/currency/CurrencyContext";
import type { HotelAvailabilityDay, RoomType } from "@/types/hotel";

interface HotelRoomTableProps {
  hotelId: number;
  roomTypes: RoomType[];
  roomAvailabilities: Record<number, HotelAvailabilityDay[]>;
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function HotelRoomTable({ hotelId, roomTypes, roomAvailabilities, searchParams }: HotelRoomTableProps) {
  const { formatMoney } = useCurrency();
  const router = useRouter();

  // URL parameters parsing
  const paramCheckIn = typeof searchParams?.checkIn === 'string' ? searchParams.checkIn : null;
  const paramCheckOut = typeof searchParams?.checkOut === 'string' ? searchParams.checkOut : null;
  const paramAdults = typeof searchParams?.adults === 'string' ? parseInt(searchParams.adults, 10) : 2;
  const paramChildren = typeof searchParams?.children === 'string' ? parseInt(searchParams.children, 10) : 0;

  // Find earliest available date across all rooms to use as default
  const allAvailabilities = Object.values(roomAvailabilities).flat();
  const firstAvailable = allAvailabilities.find((day) => day.is_available);

  const [checkIn, setCheckIn] = useState(paramCheckIn || firstAvailable?.date || "");
  const [checkOut, setCheckOut] = useState(
    paramCheckOut || (firstAvailable ? addDays(firstAvailable.date, 1).toISOString().split('T')[0] : "")
  );
  
  const [adults, setAdults] = useState<number | string>(isNaN(paramAdults) ? 2 : paramAdults);
  const [children, setChildren] = useState<number | string>(isNaN(paramChildren) ? 0 : paramChildren);

  // Selected rooms mapping: roomId -> quantity
  const [selections, setSelections] = useState<Record<number, number>>({});

  const handleSelectionChange = (roomId: number, quantity: number) => {
    setSelections(prev => {
      const next = { ...prev };
      if (quantity === 0) {
        delete next[roomId];
      } else {
        next[roomId] = quantity;
      }
      return next;
    });
  };

  const calculateAvailableRooms = (roomId: number) => {
    const availability = roomAvailabilities[roomId] || [];
    if (!checkIn || !checkOut || checkOut <= checkIn) return 0;

    let minRooms = Infinity;
    let currentDate = checkIn;
    
    while (currentDate < checkOut) {
      const dayData = availability.find((day) => day.date === currentDate);
      if (!dayData || !dayData.is_available) {
        return 0;
      }
      if (dayData.available_rooms < minRooms) {
        minRooms = dayData.available_rooms;
      }
      // Add 1 day
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 1);
      currentDate = d.toISOString().split('T')[0];
    }
    
    return minRooms === Infinity ? 0 : minRooms;
  };

  const calculatePriceForNights = (roomId: number) => {
    const availability = roomAvailabilities[roomId] || [];
    if (!checkIn || !checkOut || checkOut <= checkIn) return 0;

    let totalPrice = 0;
    let currentDate = checkIn;
    
    while (currentDate < checkOut) {
      const dayData = availability.find((day) => day.date === currentDate);
      if (dayData) {
        totalPrice += dayData.nightly_rate;
      }
      
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 1);
      currentDate = d.toISOString().split('T')[0];
    }
    
    return totalPrice;
  };

  const nights = useMemo(() => {
    if (!checkIn || !checkOut || checkOut <= checkIn) return 0;
    const diffTime = Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [checkIn, checkOut]);

  const hasSelections = Object.keys(selections).length > 0;

  const handleBook = () => {
    const totalRooms = Object.values(selections).reduce((a, b) => a + b, 0);
    const roomSelectionsArray = Object.entries(selections).map(([id, qty]) => ({
      room_type_id: parseInt(id),
      quantity: qty
    }));

    const searchParams = new URLSearchParams({
      hotelId: hotelId.toString(),
      roomSelections: JSON.stringify(roomSelectionsArray),
      checkIn,
      checkOut,
      adults: (adults || 1).toString(),
      children: (children || 0).toString(),
      rooms: totalRooms.toString(),
    });
    router.push(`/checkout?${searchParams.toString()}`);
  };

  return (
    <div className="tw-mb-12">
      <h2 className='tw-text-8 fw-normal tw-mb-5'>Phòng trống</h2>
      
      {/* Search Bar */}
      <div className="bg-white tw-p-4 tw-rounded-lg tw-shadow-sm border border-neutral tw-mb-6 d-flex flex-wrap tw-gap-4 align-items-end">
        <div>
          <label className="tw-text-sm fw-semibold d-block tw-mb-1">Ngày nhận phòng</label>
          <input 
            type="date" 
            className="form-control" 
            value={checkIn} 
            onChange={e => setCheckIn(e.target.value)} 
          />
        </div>
        <div>
          <label className="tw-text-sm fw-semibold d-block tw-mb-1">Ngày trả phòng</label>
          <input 
            type="date" 
            className="form-control" 
            value={checkOut} 
            onChange={e => setCheckOut(e.target.value)} 
            min={checkIn ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0] : undefined}
          />
        </div>
        <div>
          <label className="tw-text-sm fw-semibold d-block tw-mb-1">Người lớn</label>
          <input 
            type="number" 
            className="form-control" 
            value={adults} 
            min={1}
            onChange={e => {
              const val = e.target.value;
              setAdults(val === "" ? "" : parseInt(val));
            }} 
          />
        </div>
        <div>
          <label className="tw-text-sm fw-semibold d-block tw-mb-1">Trẻ em</label>
          <input 
            type="number" 
            className="form-control" 
            value={children} 
            min={0}
            onChange={e => {
              const val = e.target.value;
              setChildren(val === "" ? "" : parseInt(val));
            }} 
          />
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setSelections({})}
        >
          Thay đổi tìm kiếm
        </button>
      </div>

      {/* Table */}
      <div className="table-responsive bg-white tw-shadow-sm tw-rounded-lg border border-neutral">
        <table className="table table-bordered mb-0 align-middle">
          <thead className="table-primary">
            <tr>
              <th scope="col" className="tw-w-1/3">Loại chỗ nghỉ</th>
              <th scope="col" className="tw-w-16 text-center">Số lượng khách</th>
              <th scope="col" className="tw-w-48">Giá cho {nights} đêm</th>
              <th scope="col" className="tw-w-1/4">Các lựa chọn</th>
              <th scope="col" className="tw-w-32 text-center">Chọn phòng</th>
              <th scope="col" className="tw-w-40 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {roomTypes.map((room, index) => {
              const availableRooms = calculateAvailableRooms(room.id);
              const isAvailable = availableRooms > 0;
              const dynamicPriceForNights = calculatePriceForNights(room.id);
              const priceForNights = dynamicPriceForNights > 0 ? dynamicPriceForNights : room.price * nights;
              const selectedQty = selections[room.id] || 0;

              return (
                <tr key={room.id}>
                  {/* Cột 1: Thông tin phòng */}
                  <td className="tw-p-4">
                    <h3 className="tw-text-lg fw-bold text-primary tw-mb-2 text-decoration-underline cursor-pointer">{room.name}</h3>
                    
                    {!isAvailable && (
                      <p className="text-danger fw-bold tw-text-sm tw-mb-3">
                        <i className="ph ph-warning-circle tw-mr-1"></i>
                        Chúng tôi đã hết phòng trống cho những ngày này.
                      </p>
                    )}

                    <div className="d-flex flex-wrap tw-gap-2 tw-mb-3">
                      <span className="badge border text-dark tw-bg-neutral-50"><i className="ph ph-door tw-mr-1"></i>Phòng {room.capacity} người</span>
                    </div>

                    {room.features && room.features.length > 0 && (
                      <div className="d-flex flex-wrap tw-gap-1">
                        {room.features.map(f => (
                          <span key={f} className="badge border text-dark tw-bg-neutral-50 tw-text-xs fw-normal">
                            <i className="ph ph-check text-success tw-mr-1"></i>{f}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Cột 2: Số khách */}
                  <td className="text-center tw-p-4">
                    <div className="d-flex justify-content-center tw-text-xl">
                      {Array.from({ length: Math.min(room.capacity, 4) }).map((_, i) => (
                        <i key={i} className="ph-fill ph-user text-dark"></i>
                      ))}
                      {room.capacity > 4 && <span className="tw-text-sm ms-1">+{room.capacity - 4}</span>}
                    </div>
                  </td>

                  {/* Cột 3: Giá tiền */}
                  <td className="tw-p-4">
                    {isAvailable && nights > 0 && (
                      <>
                        <div className="fw-bold tw-text-lg">{formatMoney(priceForNights)}</div>
                        <div className="tw-text-xs text-secondary mt-1">+ Thuế và phí</div>
                      </>
                    )}
                  </td>

                  {/* Cột 4: Lựa chọn */}
                  <td className="tw-p-4">
                    {isAvailable && (
                      <>
                        <p className="tw-text-sm fw-medium text-success tw-mb-1">
                          <i className="ph ph-coffee tw-mr-1"></i>
                          Bao gồm bữa sáng
                        </p>
                        <p className="tw-text-sm fw-medium text-success tw-mb-1">
                          <i className="ph ph-check tw-mr-1"></i>
                          Miễn phí hủy phòng
                        </p>
                        <p className="tw-text-sm text-secondary">
                          Không cần thanh toán trước - thanh toán tại chỗ nghỉ
                        </p>
                      </>
                    )}
                  </td>

                  {/* Cột 5: Dropdown chọn phòng */}
                  <td className="text-center tw-p-4">
                    {isAvailable && (
                      <select 
                        className="form-select form-select-sm border-primary"
                        value={selectedQty}
                        onChange={(e) => handleSelectionChange(room.id, parseInt(e.target.value))}
                      >
                        <option value="0">0</option>
                        {Array.from({ length: availableRooms }).map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                    )}
                  </td>

                  {/* Cột 6: Nút đặt phòng chung (chỉ hiện ở hàng đầu tiên hoặc rowspan) */}
                  {index === 0 && (
                    <td rowSpan={roomTypes.length} className="text-center align-middle tw-p-4 tw-bg-neutral-50">
                      {hasSelections ? (
                        <>
                          <div className="tw-mb-2 fw-semibold text-secondary">
                            Bạn đã chọn {Object.values(selections).reduce((a, b) => a + b, 0)} phòng
                          </div>
                          <button 
                            className="btn btn-primary w-100 fw-bold tw-py-2"
                            onClick={handleBook}
                          >
                            Tôi sẽ đặt
                          </button>
                        </>
                      ) : (
                        <p className="text-muted tw-text-sm mb-0">Vui lòng chọn số lượng phòng để tiếp tục</p>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
