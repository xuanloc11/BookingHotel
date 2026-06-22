import Image from "next/image";
import Link from "next/link";

import type { Hotel } from "@/types/hotel";

const moneyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

interface HotelCardProps {
  hotel: Hotel;
}

export default function HotelCard({ hotel }: HotelCardProps) {
  return (
    <article className='service-wrapper bg-white tw-p-4 tw-rounded-xl tw-mb-8 h-100'>
      <div className='service-thumb tw-mb-5 position-relative z-1 overflow-hidden'>
        <Link href={`/hotel/${hotel.id}`}>
          <Image
            alt={hotel.name}
            className='tw-rounded-xl w-100 object-fit-cover hover-scale-2 tw-duration-500'
            height={308}
            src={hotel.thumbnail}
            width={423}
          />
        </Link>
        <div className='service-tag position-absolute start-0 top-0 tw-mt-2 tw-ms-2'>
          <span className='bg-white text-heading tw-py-1 tw-px-5 tw-rounded-lg tw-text-lg text-capitalize'>
            {hotel.province}
          </span>
        </div>
      </div>

      <div className='service-content tw-px-2 tw-mb-2'>
        <span className='service-location'>
          <i className='ph ph-map-pin' /> {hotel.address}
        </span>
        <h3 className='service-title tw-text-8 fw-normal text-capitalize tw-mb-2 d-flex flex-wrap align-items-center tw-gap-2'>
          <Link className='hover-text-secondary' href={`/hotel/${hotel.id}`}>
            {hotel.name}
          </Link>
          <span className='d-flex align-items-center tw-gap-1 tw-text-sm' style={{ color: "#fbb03b" }}>
            {Array.from({ length: hotel.stars || 0 }).map((_, i) => (
              <i key={i} className='ph-fill ph-star' />
            ))}
          </span>
        </h3>
        <p className='service-paragraph tw-mb-5'>{hotel.description}</p>

        <div className='service-wrap tw-rounded-xl tw-py-4 tw-px-6'>
          <div className='service-star d-flex tw-gap-6 tw-pb-4 tw-mb-6 flex-wrap'>
            <span className='text-heading fw-normal d-flex tw-gap-2'>
              <i className='ph ph-star' /> {hotel.rating.toFixed(1)} (
              {hotel.reviews_count})
            </span>
            <span className='text-heading fw-normal'>
              {hotel.amenities.slice(0, 2).join(" / ")}
            </span>
          </div>

          <div className='d-flex align-items-center justify-content-between flex-wrap row-gap-3'>
            <div className='service-price'>
              <h6 className='fw-normal'>
                {moneyFormatter.format(hotel.price_per_night)}
              </h6>
              <p>/ Đêm</p>
            </div>
            <Link
              className='font-heading tw-text-sm text-uppercase text-heading fw-normal hover-text-main-600'
              href={`/hotel/${hotel.id}`}
            >
              Xem chi tiết <i className='tw-text-base ph ph-arrow-up-right' />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
