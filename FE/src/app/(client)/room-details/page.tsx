import React from "react";
import type { Metadata } from "next";
import AOSWrap from "@/helper/AOSWrap";
import Preloader from "@/helper/Preloader";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Footer from "@/components/layout/Footer";
import RoomDetailsInner from "@/components/room/RoomDetailsInner";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title:
      "Room Details | EliteStay - Hotel Booking Multi-Purpose Next Js Template",
    description:
      "EliteStay is a professional Next JS Template for Hotel Booking Multi-Purpose services. Clean design, responsive layout, and modern UI components included.",
    openGraph: {
      title: "Room Details | EliteStay",
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
      <Breadcrumb title='Room Details' sub_title='Service' />

      {/* RoomDetailsInner */}
      <RoomDetailsInner />

      {/* FooterOne */}
      <Footer />
    </AOSWrap>
  );
};

export default Page;
