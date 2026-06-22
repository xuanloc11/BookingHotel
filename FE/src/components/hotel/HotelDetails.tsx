import Image from "next/image";

import AvailabilityCalendar from "./AvailabilityCalendar";
import type { HotelAvailabilityDay, HotelDetails as HotelDetailsType } from "@/types/hotel";

const moneyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

interface HotelDetailsProps {
  hotel: HotelDetailsType;
  availability: HotelAvailabilityDay[];
}

export default function HotelDetails({ hotel, availability }: HotelDetailsProps) {
  return (
    <>
      <section className='tw-py-14 bg_2'>
        <div className='container'>
          <div className='row g-4'>
            {hotel.images.map((image, index) => (
              <div
                className={index === 0 ? "col-lg-6" : "col-lg-3 col-md-4"}
                key={image}
              >
                <Image
                  alt={`${hotel.name} gallery ${index + 1}`}
                  className='tw-rounded-lg w-100 object-fit-cover'
                  height={index === 0 ? 520 : 250}
                  priority={index === 0}
                  src={image}
                  width={index === 0 ? 760 : 380}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='room-details-area pb-120 bg_2'>
        <div className='container'>
          <div className='row row-gap-5'>
            <div className='col-xl-7'>
              <div className='d-flex justify-content-between align-items-start flex-wrap row-gap-3 border-bottom border-neutral tw-pb-8 tw-mb-9'>
                <div>
                  <span className='bg-main-600 fw-normal tw-px-6 tw-rounded-md text-heading tw-py-1'>
                    {hotel.province}
                  </span>
                  <h1 className='room-details-title tw-text-16 fw-normal tw-mt-5 tw-mb-4'>
                    {hotel.name}
                  </h1>
                  <p className='mb-0'>
                    <i className='ph ph-map-pin' /> {hotel.address}
                  </p>
                </div>
                <div className='text-xl-end'>
                  <div className='tw-mb-3'>
                    <i className='text-main-600 ph-bold ph-star' />{" "}
                    {hotel.rating.toFixed(1)} ({hotel.reviews_count} đánh giá)
                  </div>
                  <h2 className='tw-text-8 fw-normal'>
                    {moneyFormatter.format(hotel.price_per_night)}
                  </h2>
                  <p className='mb-0'>mỗi đêm</p>
                </div>
              </div>

              <div className='tw-mb-12'>
                <h2 className='tw-text-8 fw-normal tw-mb-5'>Mô tả</h2>
                <p className='font-heading fw-normal tw-lh-212'>
                  {hotel.description}
                </p>
              </div>

              <div className='tw-mb-12'>
                <h2 className='tw-text-8 fw-normal tw-mb-5'>Tiện ích</h2>
                <div className='row row-gap-3'>
                  {hotel.amenities.map((amenity) => (
                    <div className='col-md-6' key={amenity}>
                      <span className='d-inline-flex align-items-center tw-gap-3'>
                        <span className='tw-w-5 tw-h-5 lh-1 d-inline-flex align-items-center justify-content-center rounded-circle bg-main-600 text-white tw-text-sm'>
                          <i className='ph ph-check' />
                        </span>
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className='col-xl-5'>
              <AvailabilityCalendar
                availability={availability}
                hotelId={hotel.id}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
