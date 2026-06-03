"use client";

import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { fetchFeaturedHotels } from "@/lib/api/hotelApi";
import type { Hotel } from "@/types/hotel";

const moneyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const PropertiesInner: FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHotels = async () => {
      try {
        const featuredHotels = await fetchFeaturedHotels(6);
        setHotels(featuredHotels);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load hotels from backend.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadHotels();
  }, []);

  return (
    <section className='py-120 position-relative z-1 bg_gray_1'>
      <div className='container'>
        <div className='row justify-content-between align-items-center'>
          <div className='col-xl-8 col-lg-8'>
            <div
              className='section-wrapper tw-mb-14 tw_fade_anim'
              data-delay='.3'
            >
              <h6 className='section-subtitle tw-text-xl fw-medium text-uppercase tw-mb-4 text-main-600'>
                Sleep in Style and Serenity
              </h6>
              <h2 className='section-title fw-normal tw-mb-7 tw-char-animation'>
                Luxury, Location &amp; Love Reasons To Stay With Us
              </h2>
            </div>
          </div>
          <div className='col-xl-4 col-lg-4'>
            <div className='service-top-button tw_fade_anim' data-delay='.5'>
              <Link
                className='tw-btn-hover-black bg-main-600 tw-py-5 tw-px-12 text-uppercase text-heading font-heading d-inline-flex align-items-center tw-gap-2 tw-rounded-lg'
                href='/room'
              >
                Booking today{" "}
                <span className='d-inline-block lh-1 tw-text-lg'>
                  <i className='ph ph-arrow-up-right' />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {error ? (
          <div className='bg-white tw-rounded-xl tw-p-8 text-center'>
            <p className='mb-0 text-danger'>{error}</p>
          </div>
        ) : null}

        <div className='row'>
          <div className='col-xl-12'>
            <div className='service-slider tw_fade_anim'>
              <div className='service-active swiper-container'>
                <div className='swiper-wrapper'>
                  <Swiper
                    className='service-active'
                    modules={[Autoplay]}
                    slidesPerView={3}
                    spaceBetween={20}
                    loop={hotels.length > 3}
                    speed={3000}
                    autoplay={{ delay: 2500, disableOnInteraction: false }}
                    breakpoints={{
                      1400: { slidesPerView: 3 },
                      1200: { slidesPerView: 3 },
                      992: { slidesPerView: 2 },
                      768: { slidesPerView: 2 },
                      576: { slidesPerView: 1 },
                      0: { slidesPerView: 1 },
                    }}
                  >
                    {loading ? (
                      <SwiperSlide>
                        <div className='service-wrapper bg-white tw-p-4 tw-rounded-xl tw-mb-8 swiper-slide'>
                          <div className='service-content tw-px-2 tw-py-10 text-center'>
                            <p className='mb-0'>Loading hotels from backend...</p>
                          </div>
                        </div>
                      </SwiperSlide>
                    ) : null}

                    {hotels.map((hotel) => (
                      <SwiperSlide key={hotel.id}>
                        <div className='service-wrapper bg-white tw-p-4 tw-rounded-xl tw-mb-8 swiper-slide'>
                          <div className='service-thumb tw-mb-5 position-relative z-1 overflow-hidden'>
                            <Link href={`/hotel/${hotel.id}`}>
                              <Image
                                width={423}
                                height={308}
                                className='tw-rounded-xl w-100 h-100 object-fit-cover hover-scale-2 tw-duration-500'
                                src={hotel.thumbnail}
                                alt={hotel.name}
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
                              <i className='ph ph-map-pin' /> {hotel.province}
                            </span>
                            <h4 className='service-title tw-text-8 fw-normal text-capitalize tw-mb-2'>
                              <Link
                                className='hover-text-secondary'
                                href={`/hotel/${hotel.id}`}
                              >
                                {hotel.name}
                              </Link>
                            </h4>
                            <p className='service-paragraph tw-mb-5'>
                              {hotel.description}
                            </p>
                            <div className='service-wrap tw-rounded-xl tw-py-4 tw-px-6'>
                              <div className='service-star d-flex tw-gap-6 tw-pb-4 tw-mb-6'>
                                <span className='text-heading fw-normal d-flex tw-gap-2'>
                                  <i className='ph ph-star' /> {hotel.rating.toFixed(1)} ({hotel.reviews_count})
                                </span>
                                <span className='text-heading fw-normal'>
                                  {hotel.amenities.slice(0, 2).join(" • ")}
                                </span>
                              </div>
                              <div className='d-flex align-items-center justify-content-between flex-wrap row-gap-3'>
                                <div className='service-price'>
                                  <h6 className='fw-normal'>
                                    {moneyFormatter.format(hotel.price_per_night)}
                                  </h6>
                                  <p>/ Per Night</p>
                                </div>
                                <div>
                                  <Link
                                    className='font-heading tw-text-sm text-uppercase text-heading fw-normal hover-text-main-600'
                                    href={`/hotel/${hotel.id}`}
                                  >
                                    EXPLORE MORE{" "}
                                    <i className='tw-text-base ph ph-arrow-up-right' />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertiesInner;
