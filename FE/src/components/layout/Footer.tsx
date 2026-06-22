"use client";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const Footer: FC = () => {
  const { t } = useLanguage();

  return (
    <footer
      className='footer background-img position-relative z-1 overflow-hidden '
      data-background-image='assets/images/thumbs/footer-bg.jpg'
    >

      <div className='footer-center-space position-relative z-1'>
        <div className='container container-two'>
          <div className='footer-center-border tw-pt-4'>
            <div className='row gy-5'>
              <div
                className='col-xl-6 col-lg-6 col-md-8 col-sm-12 col-xs-12 aos-init aos-animate'
                data-aos='fade-up'
                data-aos-duration={1200}
              >
                <div className='footer-col-1 tw_fade_anim' data-delay='.3'>
                  <h4 className='cursor-big tw-text-9 fw-normal text--white tw-mb-8'>
                    {t("footer.newsletterTitle")}
                    <br /> {t("footer.newsletterSubtitle")}
                  </h4>
                  <form
                    action='#'
                    className='tw-mt-6 position-relative form-submit d-flex tw-gap-2 align-items-center tw-mb-4 flex-wrap'
                  >
                    <input
                      type='email'
                      className='form-control tw-w-288-px  bg-white shadow-none border border-neutral-700 text-heading tw-ps-6 tw-pe-13 focus-border-main-600 tw-h-14 tw-placeholder-text-neutral-700 focus-tw-placeholder-text-hidden tw-placeholder-transition-2'
                      placeholder={t("footer.emailPlaceholder")}
                      required
                    />
                    <button
                      type='submit'
                      className='tw-btn-hover-white bg-main-600 text-heading fw-bold tw-py-4 tw-px-8 tw-rounded-md transition-all d-flex tw-gap-3'
                    >
                      {t("footer.subscribe")}{" "}
                      <span>
                        <i className='ph ph-paper-plane-tilt' />
                      </span>
                    </button>
                  </form>
                  <p className='font-heading fw-normal text-white'>
                    {t("footer.agreeTo")}
                    <Link
                      className='text-main-600 hover-text-white text-decoration-underline'
                      href='#'
                    >
                      {t("footer.privacyPolicy")}
                    </Link>
                  </p>
                </div>
              </div>
              <div
                className='col-xl-2 col-lg-6 col-md-4 col-sm-6 col-xs-6 aos-init aos-animate'
                data-aos='fade-up'
                data-aos-duration={400}
              >
                <div className='footer-col-2 tw_fade_anim' data-delay='.5'>
                  <h4 className='cursor-big tw-text-505 fw-normal text--white tw-mb-8'>
                    {t("footer.aboutUs")}
                  </h4>
                  <ul className='d-flex flex-column tw-gap-4'>
                    <li>
                      <Link
                        href='#'
                        className='text--white hover-text-main-600 hover-underline'
                      >
                        {t("footer.hotelCategories")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='#'
                        className='text--white hover-text-main-600 hover-underline'
                      >
                        {t("footer.featuredHotels")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='#'
                        className='text--white hover-text-main-600 hover-underline'
                      >
                        {t("footer.quickLinks")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='#'
                        className='text--white hover-text-main-600 hover-underline'
                      >
                        {t("footer.importantLinks")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='#'
                        className='text--white hover-text-main-600 hover-underline'
                      >
                        {t("footer.newsEvents")}
                      </Link>
                    </li>
                    <li className='mb-0'>
                      <Link
                        href='#'
                        className='text--white hover-text-main-600 hover-underline'
                      >
                        {t("footer.helpCenter")}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className='col-xl-2 col-lg-6 col-md-8 col-sm-6 col-xs-6 aos-init aos-animate'
                data-aos='fade-up'
                data-aos-duration={600}
              >
                <div className='footer-col-3 tw_fade_anim' data-delay='.7'>
                  <h4 className='cursor-big tw-text-505 fw-normal text--white tw-mb-8'>
                    {t("footer.myAccount")}
                  </h4>
                  <ul className='d-flex flex-column tw-gap-4'>
                    <li>
                      <Link
                        href='/contact'
                        className='text--white hover-text-main-600 hover-underline'
                      >
                        {t("footer.contactUs")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='/faq'
                        className='text--white hover-text-main-600 hover-underline'
                      >
                        {t("footer.faq")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='#'
                        className='text--white hover-text-main-600 hover-underline'
                      >
                        {t("footer.connectNow")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='#'
                        className='text--white hover-text-main-600 hover-underline'
                      >
                        {t("footer.globalNetwork")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='#'
                        className='text--white hover-text-main-600 hover-underline'
                      >
                        {t("footer.support247")}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className='col-xl-2 col-lg-6 col-md-4 col-sm-6 col-xs-6 aos-init aos-animate'
                data-aos='fade-up'
                data-aos-duration={400}
              >
                <div className='footer-col-4 tw_fade_anim' data-delay='.9'>
                  <h4 className='cursor-big tw-text-505 fw-normal text--white tw-mb-8'>
                    {t("footer.services")}
                  </h4>
                  <ul className='d-flex flex-column tw-gap-4'>
                    <li>
                      <Link
                        href='#'
                        className='text--white hover-text-main-600 hover-underline'
                      >
                        {t("footer.supportRequest")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='/service-details'
                        className='text--white hover-text-main-600 hover-underline'
                      >
                        {t("footer.ourServices")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='#'
                        className='text--white hover-text-main-600 hover-underline'
                      >
                        {t("footer.areasOfOperation")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='#'
                        className='text--white hover-text-main-600 hover-underline'
                      >
                        {t("footer.bookingPolicy")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='#'
                        className='text--white hover-text-main-600 hover-underline'
                      >
                        {t("footer.transportation")}
                      </Link>
                    </li>
                    <li className='mb-0'>
                      <Link
                        href='#'
                        className='text--white hover-text-main-600 hover-underline'
                      >
                        {t("footer.flexiblePricing")}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='container'>
        {/* bottom Footer */}
        <div className='footer-bottom tw-py-3'>
          <div className='container container-two'>
            <div className='footer-bottom-wrap d-flex align-items-center justify-content-between tw-gap-4 flex-wrap'>
              <div className='mb-0 aos-init tw_fade_anim' data-delay='.3'>
                <Link href='/'>
                  <div className='d-flex align-items-center gap-2'>
                    <i className='ph-fill ph-buildings tw-text-4xl text-main-600'></i>
                    <span className='fw-bold tw-text-3xl text-white'>VPL Hotel</span>
                  </div>
                </Link>
              </div>
              <ul
                className='footer-bottom-social d-flex align-items-center tw-gap-6 aos-init tw_fade_anim'
                data-delay='.5'
              >
                <li>
                  <Link
                    href='https://www.facebook.com'
                    className='text--white tw-text-lg hover-text-main-600'
                  >
                    <i className='ph-bold ph-facebook-logo' />
                  </Link>
                </li>
                <li>
                  <Link
                    href='https://www.twitter.com'
                    className='text--white tw-text-lg hover-text-main-600'
                  >
                    <i className='ph-bold ph-twitter-logo' />
                  </Link>
                </li>
                <li>
                  <Link
                    href='https://www.linkedin.com'
                    className='text--white tw-text-lg hover-text-main-600'
                  >
                    <i className='ph-bold ph-instagram-logo' />
                  </Link>
                </li>
                <li>
                  <Link
                    href='https://www.pinterest.com'
                    className='text--white tw-text-lg hover-text-main-600'
                  >
                    <i className='ph-bold ph-dribbble-logo' />
                  </Link>
                </li>
                <li>
                  <Link
                    href='https://www.pinterest.com'
                    className='text--white tw-text-lg hover-text-main-600'
                  >
                    <i className='ph-bold ph-youtube-logo' />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
