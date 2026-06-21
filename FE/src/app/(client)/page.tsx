import type { Metadata } from "next";
import Preloader from "@/helper/Preloader";
import AOSWrap from "@/helper/AOSWrap";
import Header from "@/components/layout/Header";
import Banner from "@/components/home/Banner";
import Checkout from "@/components/booking/Checkout";
import AdvanceArea from "@/components/home/AdvanceArea";
import Offer from "@/components/home/Offer";
import Feature from "@/components/home/Feature";
import Package from "@/components/home/Package";
import Client from "@/components/home/Client";
import About from "@/components/about/About";
import Cta from "@/components/home/Cta";
import PropertiesInner from "@/components/PropertiesInner";
import Pricing from "@/components/pricing/Pricing";
import Testimonial from "@/components/Testimonial";
import Marquee from "@/components/home/Marquee";
import Blog from "@/components/blog/Blog";
import Footer from "@/components/layout/Footer";



export default function Home() {
  return (
    <AOSWrap>
      {/* Preloader */}
      <Preloader />

      {/* HeaderOne */}
      <Header />

      {/* BannerOne */}
      <Banner />

      {/* Checkout */}
      <Checkout />

      {/* AdvanceArea */}
      <AdvanceArea />

      {/* OfferOne */}
      <Offer />

      {/* FeatureOne */}
      <Feature />

      {/* PackageOne */}
      <Package />

      {/* ClientOne */}
      <Client />

      {/* AboutOne */}
      <About />

      {/* CtaOne */}
      <Cta />

      {/* PropertiesInner */}
      <PropertiesInner />

      {/* PricingOne */}
      <Pricing />

      {/* TestimonialOne */}
      <Testimonial />

      {/* MarqueeOne */}
      <Marquee />

      {/* BlogOne */}
      <Blog />

      {/* FooterOne */}
      <Footer />
    </AOSWrap>
  );
}
