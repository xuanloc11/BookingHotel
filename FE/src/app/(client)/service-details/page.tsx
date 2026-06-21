import React from "react";
import type { Metadata } from "next";
import AOSWrap from "@/helper/AOSWrap";
import Preloader from "@/helper/Preloader";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Footer from "@/components/layout/Footer";
import Checkout from "@/components/booking/Checkout";
import ServiceDetailsInner from "@/components/service/ServiceDetailsInner";
import Marquee from "@/components/home/Marquee";

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
      <Header />

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
      <Marquee />

      {/* FooterOne */}
      <Footer />
    </AOSWrap>
  );
};

export default Page;
