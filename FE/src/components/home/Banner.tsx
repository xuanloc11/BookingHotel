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
              <div className='d-flex align-items-center flex-wrap row-gap-3 tw-gap-13'>
                <div>
                  <Link
                    className='tw-btn-hover-white bg-main-600 tw-py-5 tw-px-12 text-heading font-heading d-inline-flex align-items-center tw-gap-3 tw-rounded-lg'
                    href='/contact'
                  >
                    {t("banner.bookNow")}{" "}
                    <span className='d-inline-block lh-1 tw-text-lg'>
                      <i className='ph ph-arrow-up-right' />
                    </span>
                  </Link>
                </div>
                <div className=''>
                  <div className='d-flex align-items-center tw-gap-2'>
                    <span className='tw-text-xl text-white font-heading'>
                      5.0
                    </span>
                    <ul className='d-flex tw-gap-1'>
                      <li className='text-white'>
                        <i className='ph-bold ph-star' />
                      </li>
                      <li className='text-white'>
                        <i className='ph-bold ph-star' />
                      </li>
                      <li className='text-white'>
                        <i className='ph-bold ph-star' />
                      </li>
                      <li className='text-white'>
                        <i className='ph-bold ph-star' />
                      </li>
                      <li className='text-white'>
                        <i className='ph-bold ph-star' />
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className='tw-text-xl text-white font-heading'>
                      {t("banner.reviews")}
                    </p>
                  </div>
                </div>
              </div>
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
