"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCurrency } from "@/lib/currency/CurrencyContext";

import type { Hotel } from "@/types/hotel";

interface HotelCardProps {
  hotel: Hotel;
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const { formatMoney } = useCurrency();
  const searchParams = useSearchParams();
  
  const href = searchParams.toString() 
    ? `/hotel/${hotel.slug}?${searchParams.toString()}`
    : `/hotel/${hotel.slug}`;

  return (
    <article className='service-wrapper bg-white tw-p-4 tw-rounded-xl tw-mb-8 h-100 d-flex flex-column'>
      <div className='service-thumb tw-mb-5 position-relative z-1 overflow-hidden'>
        <Link href={href}>
          <img
            alt={hotel.name}
            className='tw-rounded-xl w-100 object-fit-cover hover-scale-2 tw-duration-500'
            style={{ height: '308px' }}
            src={hotel.thumbnail}
          />
        </Link>
        <div className='service-tag position-absolute start-0 top-0 tw-mt-2 tw-ms-2'>
          <span className='bg-white text-heading tw-py-1 tw-px-5 tw-rounded-lg tw-text-lg text-capitalize'>
            {hotel.province}
          </span>
        </div>
      </div>

      <div className='service-content tw-px-2 tw-mb-2 d-flex flex-column flex-grow-1'>
        <span className='service-location tw-mb-3 d-block' style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          <i className='ph ph-map-pin' /> {hotel.province}
        </span>
        <h3 
          className='service-title tw-text-8 fw-normal text-capitalize tw-mb-2'
          style={{ minHeight: '60px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          <Link className='hover-text-secondary' href={href}>
            {hotel.name}
          </Link>
          <span className='d-inline-flex align-items-center tw-gap-1 tw-text-sm tw-ms-2' style={{ color: "#fbb03b", verticalAlign: 'middle', position: 'relative', top: '-2px' }}>
            {Array.from({ length: hotel.stars || 0 }).map((_, i) => (
              <i key={i} className='ph-fill ph-star' />
            ))}
          </span>
        </h3>
        <p className='service-paragraph tw-mb-5'>{hotel.description}</p>

        <div className='service-wrap tw-rounded-xl tw-py-4 tw-px-6 mt-auto d-flex flex-column'>
          <div className='service-star d-flex tw-gap-6 tw-pb-4 tw-mb-6 flex-wrap'>
            <span className='text-heading fw-normal d-flex tw-gap-2 fw-medium'>
              <span className='bg-warning text-white tw-px-2 tw-rounded tw-font-bold'>{hotel.rating.toFixed(1)}</span>
              Đánh giá · {hotel.reviews_count} đánh giá
            </span>
            <span 
              className='text-heading fw-normal'
              style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
            >
              {hotel.amenities.slice(0, 2).join(" / ")}
            </span>
          </div>

          {hotel.available_rooms !== undefined && (
            <div className='tw-mb-4 tw-px-3 tw-py-2 tw-bg-green-50 tw-text-green-700 tw-rounded-lg tw-text-sm d-flex align-items-center tw-gap-2'>
              <i className='ph ph-check-circle tw-text-lg' />
              <span>Còn <strong>{hotel.available_rooms}</strong> phòng trống phù hợp</span>
            </div>
          )}

          <div className='d-flex align-items-center justify-content-between flex-wrap row-gap-3 mt-auto'>
            <div className='service-price'>
              <h6 className='fw-normal'>
                {formatMoney(hotel.price_per_night)}
              </h6>
              <p>/ Đêm</p>
            </div>
            <Link
              className='font-heading tw-text-sm text-uppercase text-heading fw-normal hover-text-main-600'
              href={href}
            >
              Xem chi tiết <i className='tw-text-base ph ph-arrow-up-right' />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
