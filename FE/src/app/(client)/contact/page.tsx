import React from "react";
import type { Metadata } from "next";
import AOSWrap from "@/helper/AOSWrap";
import Preloader from "@/helper/Preloader";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Footer from "@/components/layout/Footer";
import Reservation from "@/components/home/Reservation";
import ContactInner from "@/components/contact/ContactInner";
import Checkout from "@/components/booking/Checkout";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Contact | EliteStay - Hotel Booking Multi-Purpose Next Js Template",
    description:
      "EliteStay is a professional Next JS Template for Hotel Booking Multi-Purpose services. Clean design, responsive layout, and modern UI components included.",
    openGraph: {
      title: "Contact | EliteStay",
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
      <Breadcrumb title='Liên hệ' sub_title='Kết nối với chúng tôi' />

      {/* Checkout */}
      <section className=' bg_2'>
        <Checkout />
      </section>

      {/* ContactInner */}
      <ContactInner />

      {/* MarqueeFour */}
      <Reservation />

      {/* FooterOne */}
      <Footer />
    </AOSWrap>
  );
};

export default Page;
