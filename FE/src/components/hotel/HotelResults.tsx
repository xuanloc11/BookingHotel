import HotelCard from "./HotelCard";
import type { Hotel } from "@/types/hotel";

interface HotelResultsProps {
  hotels: Hotel[];
}

export default function HotelResults({ hotels }: HotelResultsProps) {
  return (
    <section className='py-120 bg_gray_1'>
      <div className='container'>
        <div className='d-flex justify-content-between align-items-end flex-wrap row-gap-3 tw-mb-10'>
          <div>
            <h2 className='section-title fw-normal tw-mb-3'>
              Khách sạn hiện có
            </h2>
            <p className='mb-0'>Tìm thấy {hotels.length} chỗ nghỉ phù hợp với tìm kiếm của bạn.</p>
          </div>
        </div>

        {hotels.length === 0 ? (
          <div className='bg-white tw-rounded-lg tw-p-10 text-center'>
            <h3 className='tw-text-8 fw-normal tw-mb-3'>Không tìm thấy khách sạn</h3>
            <p className='mb-0'>
              Vui lòng điều chỉnh ngày, ngân sách, vị trí hoặc tiện nghi và thử lại.
            </p>
          </div>
        ) : (
          <div className='row'>
            {hotels.map((hotel) => (
              <div className='col-xl-4 col-lg-6 col-md-6' key={hotel.id}>
                <HotelCard hotel={hotel} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
