"use client";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface BannerProps {
  imageUrl?: string;
}

const Banner: FC<BannerProps> = ({ imageUrl }) => {
  const { t } = useLanguage();

  return (
    <section className='banner-area background-img position-relative overflow-hidden'>
      <Image
        src={imageUrl || 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&h=960&fit=crop&q=80'}
        alt='Banner background'
        fill
        style={{ objectFit: "cover" }}
        priority
      />
      <div className='container position-relative z-2'>
        <div className='row align-items-center justify-content-between'>
          <div className='col-xl-10 col-lg-10'>
            <div className='position-relative z-2'>
              <h6 className='banner-subtitle tw-text-xl text-uppercase text-white tw-mb-9'>
                {t("banner.subtitle")}
              </h6>
              <h1 
                className='banner-title tw-text-29 text-white fw-normal tw-mb-10 tw-char-animation'
                dangerouslySetInnerHTML={{ __html: t("banner.title") }}
              />

            </div>
          </div>
          <div className='col-xl-3 col-lg-3'>
            {/* Xóa VideoPopup theo yêu cầu */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
