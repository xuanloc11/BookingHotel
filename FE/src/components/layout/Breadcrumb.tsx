"use client";
import { FC } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { DictionaryKey } from "@/lib/i18n/dictionaries";

interface BreadcrumbProps {
  title: string;
  sub_title: string;
  imageUrl?: string;
  titleKey?: DictionaryKey;
  subTitleKey?: DictionaryKey;
}

const Breadcrumb: FC<BreadcrumbProps> = ({ title, sub_title, imageUrl, titleKey, subTitleKey }) => {
  const { t } = useLanguage();
  return (
    <section
      className='breadcrumb-area background-img position-relative z-1'
      style={{
        backgroundImage: `url('${imageUrl || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&h=400&fit=crop"}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "60px 0 60px 0",
        minHeight: "unset"
      }}
    >
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-lg-12'>
            <div className='text-center'>
              <span className='breadcrumb-subtitle tw-mb-4 text-white text-uppercase tw-text-xl fw-bold'>
                {subTitleKey ? t(subTitleKey) : sub_title}
              </span>

              <h2 className='breadcrumb-title tw-text-25 fw-normal text-white tw-char-animation'>
                {titleKey ? t(titleKey) : title}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Breadcrumb;
