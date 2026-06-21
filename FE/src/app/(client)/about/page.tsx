import React from "react";
import type { Metadata } from "next";
import AOSWrap from "@/helper/AOSWrap";
import Preloader from "@/helper/Preloader";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/layout/Breadcrumb";
import About from "@/components/about/About";
import Feature from "@/components/home/Feature";
import Marquee from "@/components/home/Marquee";
import Client from "@/components/home/Client";
import Newsletter from "@/components/home/Newsletter";
import Pricing from "@/components/pricing/Pricing";
import Contact from "@/components/contact/Contact";
import Footer from "@/components/layout/Footer";
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
      <Header />

      {/* Breadcrumb */}
      <Breadcrumb title='About Us' sub_title='Experience the Story' />

      {/* Checkout */}
      <section className='checkout-area_bg'>
        <Checkout />
      </section>

      {/* AboutTwo */}
      <About />

      {/* FeatureOne */}
      <Feature />

      {/* AboutOne */}
      <div className='pt-120'>
        <About />
      </div>

      {/* MarqueeOne */}
      <Marquee />

      {/* ClientOne */}
      <Client />

      {/* NewsletterOne */}
      <Newsletter />

      {/* PricingTwo */}
      <div className='pt-120 pricing-two-area'>
        <Pricing />
      </div>

      {/* ContactTwo */}
      <Contact />

      {/* ClientTwo */}
      <div className='pt-60 client_two'>
        <Client />
      </div>

      {/* FooterOne */}
      <Footer />
    </AOSWrap>
  );
};

export default Page;
