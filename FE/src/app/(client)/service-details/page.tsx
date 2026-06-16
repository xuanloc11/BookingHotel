import React from "react";
import type { Metadata } from "next";
import AOSWrap from "@/helper/AOSWrap";
import Preloader from "@/helper/Preloader";
import HeaderTwo from "@/components/layout/HeaderTwo";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FooterOne from "@/components/layout/FooterOne";
import Checkout from "@/components/booking/Checkout";
import ServiceDetailsInner from "@/components/service/ServiceDetailsInner";
import MarqueeFour from "@/components/home/MarqueeFour";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Service Details | EliteStay - Hotel Booking Multi-Purpose Next Js Template",
    description:
      "EliteStay is a professional Next JS Template for Hotel Booking Multi-Purpose services. Clean design, responsive layout, and modern UI components included.",
    openGraph: {
      title: "Service Details | EliteStay",
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
      <Breadcrumb title='Service Details' sub_title='Service' />

      {/* Checkout */}
      <section className='pb-120 bg_2'>
        <Checkout />
      </section>

      <section className=''>
        {/* ServiceDetailsInner */}
        <ServiceDetailsInner />
      </section>

      {/* MarqueeFour */}
      <MarqueeFour />

      {/* FooterOne */}
      <FooterOne />
    </AOSWrap>
  );
};

export default Page;
