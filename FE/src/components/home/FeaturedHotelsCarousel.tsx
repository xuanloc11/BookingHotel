"use client";
import { FC } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Hotel } from "@/types/hotel";

interface FeaturedHotelsCarouselProps {
  title: string;
  subtitle?: string;
  hotels: Hotel[];
}

const moneyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const getRatingText = (rating: number) => {
  if (rating >= 9) return "Tuyệt hảo";
  if (rating >= 8) return "Rất tốt";
  if (rating >= 7) return "Tốt";
  return "Đánh giá";
};

const FeaturedHotelsCarousel: FC<FeaturedHotelsCarouselProps> = ({ title, subtitle, hotels }) => {
  if (!hotels || hotels.length === 0) return null;

  return (
    <section className='tw-my-16'>
      <div className='container'>
        <div className='tw-mb-6'>
          <h2 className='tw-text-2xl fw-bold tw-mb-2'>{title}</h2>
          {subtitle && <p className='text-neutral-500'>{subtitle}</p>}
        </div>

        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {hotels.map((hotel) => (
            <SwiperSlide key={hotel.id}>
              <div className='card border-0 shadow-sm h-100 tw-rounded-xl overflow-hidden d-flex flex-column'>
                <Link href={`/hotel/${hotel.id}`} className='text-decoration-none'>
                  <div className='position-relative' style={{ aspectRatio: "4/3" }}>
                    <img
                      src={hotel.thumbnail || '/assets/images/thumbs/room-details-thumb1.jpg'}
                      alt={hotel.name}
                      className='w-100 h-100 object-fit-cover'
                    />
                    <div className='position-absolute top-0 end-0 p-2'>
                      <button className='btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm' style={{ width: 36, height: 36 }}>
                        <i className='ph ph-heart tw-text-lg' />
                      </button>
                    </div>
                  </div>
                </Link>
                
                <div className='card-body p-3 d-flex flex-column flex-grow-1'>
                  <Link href={`/hotel/${hotel.id}`} className='text-decoration-none text-dark'>
                    <h3 className='tw-text-lg fw-bold tw-mb-1 text-truncate'>{hotel.name}</h3>
                  </Link>
                  <p className='text-neutral-500 tw-text-sm tw-mb-3'>
                    <a href={`/room?location=${encodeURIComponent(hotel.province)}`} className='text-neutral-500 text-decoration-none hover-text-main-600'>
                      {hotel.province}
                    </a>
                    {hotel.address && <span className="tw-truncate d-inline-block w-100">, {hotel.address}</span>}
                  </p>

                  <div className='d-flex align-items-center tw-gap-2 tw-mb-4'>
                    <span className='badge bg-main-600 text-white p-2 tw-text-sm tw-rounded-md d-flex align-items-center justify-content-center' style={{ width: 32, height: 32 }}>
                      {hotel.rating.toFixed(1)}
                    </span>
                    <div>
                      <span className='fw-medium text-dark me-1'>{getRatingText(hotel.rating)}</span>
                      <span className='text-neutral-500 tw-text-sm'>· {hotel.reviews_count} đánh giá</span>
                    </div>
                  </div>

                  <div className='mt-auto text-end'>
                    <span className='text-neutral-500 tw-text-sm d-block'>Bắt đầu từ</span>
                    <strong className='tw-text-lg text-dark'>{moneyFormatter.format(hotel.price_per_night)}</strong>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturedHotelsCarousel;
