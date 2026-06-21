import React from "react";
import type { Metadata } from "next";
import AOSWrap from "@/helper/AOSWrap";
import Preloader from "@/helper/Preloader";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Footer from "@/components/layout/Footer";
import DestinationInner from "@/components/destination/DestinationInner";
import Checkout from "@/components/booking/Checkout";
import Marquee from "@/components/home/Marquee";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title:
      "Destination | EliteStay - Hotel Booking Multi-Purpose Next Js Template",
    description:
      "EliteStay is a professional Next JS Template for Hotel Booking Multi-Purpose services. Clean design, responsive layout, and modern UI components included.",
    openGraph: {
      title: "Destination | EliteStay",
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
      <Breadcrumb title='Destination' sub_title='Experience the Story' />

      {/* Checkout */}
      <section className=' bg_2'>
        <Checkout />
      </section>

      {/* DestinationInner */}
      <DestinationInner />

      {/* MarqueeFour */}
      <Marquee />

      {/* FooterOne */}
      <Footer />
    </AOSWrap>
  );
};

export default Page;
