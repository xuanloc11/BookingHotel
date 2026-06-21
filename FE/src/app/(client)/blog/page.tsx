import React from "react";
import type { Metadata } from "next";
import AOSWrap from "@/helper/AOSWrap";
import Preloader from "@/helper/Preloader";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Footer from "@/components/layout/Footer";
import BlogInner from "@/components/blog/BlogInner";
import Reservation from "@/components/home/Reservation";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Blog | EliteStay - Hotel Booking Multi-Purpose Next Js Template",
    description:
      "EliteStay is a professional Next JS Template for Hotel Booking Multi-Purpose services. Clean design, responsive layout, and modern UI components included.",
    openGraph: {
      title: "Blog | EliteStay",
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
      <Breadcrumb title='Blog' sub_title='Experience the Story' />

      {/* BlogInner */}
      <BlogInner />

      {/* MarqueeFour */}
      <Reservation />

      {/* FooterOne */}
      <Footer />
    </AOSWrap>
  );
};

export default Page;
