"use client";
import { FC, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ProvinceData } from "@/lib/api/hotelApi";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface QuickPlannerProps {
  provinces: ProvinceData[];
}

const getCityImage = (name: string) => {
  const images: Record<string, string> = {
    'hà nội': 'https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=400&auto=format&fit=crop&q=80',
    'đà nẵng': 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&auto=format&fit=crop&q=80',
    'vũng tàu': 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&auto=format&fit=crop&q=80',
    'đà lạt': 'https://images.unsplash.com/photo-1697030817096-73f658acd5a5?w=400&auto=format&fit=crop&q=80',
    'nha trang': 'https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=400&auto=format&fit=crop&q=80',
    'hồ chí minh': 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&auto=format&fit=crop&q=80',
    'hải phòng': 'https://images.unsplash.com/photo-1564596823821-79b28f179b47?w=400&auto=format&fit=crop&q=80',
    'hội an': 'https://images.unsplash.com/photo-1594464983455-5cb1b2a1d252?w=400&auto=format&fit=crop&q=80',
    'khánh hòa': 'https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=400&auto=format&fit=crop&q=80',
    'kiên giang': 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400&auto=format&fit=crop&q=80',
    'ninh thuận': 'https://images.unsplash.com/photo-1596822560476-ea7a2fcee978?w=400&auto=format&fit=crop&q=80',
    'bà rịa': 'https://images.unsplash.com/photo-1576016847748-9f0c40d0e41f?w=400&auto=format&fit=crop&q=80',
  };
  const key = name.toLowerCase();
  for (const [k, v] of Object.entries(images)) {
    if (key.includes(k)) return v;
  }
  return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop&q=80';
};

const QuickPlanner: FC<QuickPlannerProps> = ({ provinces }) => {
  const { t } = useLanguage();

  return (
    <section className='tw-my-16'>
      <div className='container'>
        <div className='tw-mb-6'>
          <h2 className='tw-text-2xl fw-bold tw-mb-2'>{t("home.exploreVietnam")}</h2>
          <p className='text-neutral-500'>{t("home.exploreSubtitle")}</p>
        </div>

        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={20}
          slidesPerView={2}
          breakpoints={{
            576: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1200: { slidesPerView: 6 },
          }}
        >
          {provinces.map((province, index) => (
            <SwiperSlide key={index}>
              <Link href={`/room?location=${encodeURIComponent(province.name)}`} className='d-block text-decoration-none'>
                <div className='tw-rounded-xl overflow-hidden tw-mb-3 position-relative' style={{ aspectRatio: "1/1" }}>
                  <img
                    src={getCityImage(province.name)}
                    alt={province.name}
                    className='w-100 h-100 object-fit-cover tw-transition-transform hover-tw-scale-110'
                  />
                </div>
                <h3 className='tw-text-lg fw-bold text-dark tw-mb-1'>{province.name}</h3>
                <p className='text-neutral-500 tw-text-sm'>{province.hotel_count} {t("home.propertiesCount")}</p>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default QuickPlanner;
