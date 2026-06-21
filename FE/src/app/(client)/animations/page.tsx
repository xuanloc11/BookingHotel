import React from "react";
import type { Metadata } from "next";
import AOSWrap from "@/helper/AOSWrap";
import Preloader from "@/helper/Preloader";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Footer from "@/components/layout/Footer";
import Checkout from "@/components/booking/Checkout";
import Feature from "@/components/home/Feature";
import AdvanceArea from "@/components/home/AdvanceArea";
import Marquee from "@/components/home/Marquee";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title:
      "Amenities | EliteStay - Hotel Booking Multi-Purpose Next Js Template",
    description:
      "EliteStay is a professional Next JS Template for Hotel Booking Multi-Purpose services. Clean design, responsive layout, and modern UI components included.",
    openGraph: {
      title: "Amenities | EliteStay",
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
      <Breadcrumb title='Our amenities' sub_title='Experience the Story' />

      {/* Checkout */}
      <section className=' bg_2'>
        <Checkout />
      </section>

      {/* FeatureTwo */}
      <section className='feature-two-area_bg pt-120'>
        <Feature />
      </section>

      {/* AdvanceAreaTwo */}
      <AdvanceArea />

      {/* FeatureOne */}
      <Feature />

      {/* MarqueeFour */}
      <Marquee />

      {/* FooterOne */}
      <Footer />
    </AOSWrap>
  );
};

export default Page;
