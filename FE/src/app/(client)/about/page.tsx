import React from "react";
import type { Metadata } from "next";
import AOSWrap from "@/helper/AOSWrap";
import Preloader from "@/helper/Preloader";
import HeaderTwo from "@/components/layout/HeaderTwo";
import Breadcrumb from "@/components/layout/Breadcrumb";
import AboutTwo from "@/components/about/AboutTwo";
import FeatureOne from "@/components/home/FeatureOne";
import AboutOne from "@/components/about/AboutOne";
import MarqueeOne from "@/components/home/MarqueeOne";
import ClientOne from "@/components/home/ClientOne";
import NewsletterOne from "@/components/home/NewsletterOne";
import PricingTwo from "@/components/pricing/PricingTwo";
import ContactTwo from "@/components/contact/ContactTwo";
import ClientTwo from "@/components/home/ClientTwo";
import FooterOne from "@/components/layout/FooterOne";
import Checkout from "@/components/booking/Checkout";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "About | EliteStay - Hotel Booking Multi-Purpose Next Js Template",
    description:
      "EliteStay is a professional Next JS Template for Hotel Booking Multi-Purpose services. Clean design, responsive layout, and modern UI components included.",
    openGraph: {
      title: "About | EliteStay",
      description:
        "EliteStay is a professional Next JS Template for Hotel Booking Multi-Purpose services. Clean design, responsive layout, and modern UI components included.",
      url: "https://nextjs.elitestay.wowtheme7.com",
      type: "website",
      images: [
        {
          url: "https://nextjs.elitestay.wowtheme7.com/images/meta.png",
          width: 1200,
          height: 630,
          alt: "elitestay",
        },
      ],
    },
  };
};

const Page: React.FC = () => {
  return (
    <AOSWrap>
      {/* Preloader */}
      <Preloader />

      {/* HeaderTwo */}
      <HeaderTwo />

      {/* Breadcrumb */}
      <Breadcrumb title='About Us' sub_title='Experience the Story' />

      {/* Checkout */}
      <section className='checkout-area_bg'>
        <Checkout />
      </section>

      {/* AboutTwo */}
      <AboutTwo />

      {/* FeatureOne */}
      <FeatureOne />

      {/* AboutOne */}
      <div className='pt-120'>
        <AboutOne />
      </div>

      {/* MarqueeOne */}
      <MarqueeOne />

      {/* ClientOne */}
      <ClientOne />

      {/* NewsletterOne */}
      <NewsletterOne />

      {/* PricingTwo */}
      <div className='pt-120 pricing-two-area'>
        <PricingTwo />
      </div>

      {/* ContactTwo */}
      <ContactTwo />

      {/* ClientTwo */}
      <div className='pt-60 client_two'>
        <ClientTwo />
      </div>

      {/* FooterOne */}
      <FooterOne />
    </AOSWrap>
  );
};

export default Page;
