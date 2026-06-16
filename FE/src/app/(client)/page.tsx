import type { Metadata } from "next";
import Preloader from "@/helper/Preloader";
import AOSWrap from "@/helper/AOSWrap";
import HeaderOne from "@/components/layout/HeaderOne";
import BannerOne from "@/components/home/BannerOne";
import Checkout from "@/components/booking/Checkout";
import AdvanceArea from "@/components/home/AdvanceArea";
import OfferOne from "@/components/home/OfferOne";
import FeatureOne from "@/components/home/FeatureOne";
import PackageOne from "@/components/home/PackageOne";
import ClientOne from "@/components/home/ClientOne";
import AboutOne from "@/components/about/AboutOne";
import CtaOne from "@/components/home/CtaOne";
import PropertiesInner from "@/components/PropertiesInner";
import PricingOne from "@/components/pricing/PricingOne";
import TestimonialOne from "@/components/TestimonialOne";
import MarqueeOne from "@/components/home/MarqueeOne";
import BlogOne from "@/components/blog/BlogOne";
import FooterOne from "@/components/layout/FooterOne";



export default function Home() {
  return (
    <AOSWrap>
      {/* Preloader */}
      <Preloader />

      {/* HeaderOne */}
      <HeaderOne />

      {/* BannerOne */}
      <BannerOne />

      {/* Checkout */}
      <Checkout />

      {/* AdvanceArea */}
      <AdvanceArea />

      {/* OfferOne */}
      <OfferOne />

      {/* FeatureOne */}
      <FeatureOne />

      {/* PackageOne */}
      <PackageOne />

      {/* ClientOne */}
      <ClientOne />

      {/* AboutOne */}
      <AboutOne />

      {/* CtaOne */}
      <CtaOne />

      {/* PropertiesInner */}
      <PropertiesInner />

      {/* PricingOne */}
      <PricingOne />

      {/* TestimonialOne */}
      <TestimonialOne />

      {/* MarqueeOne */}
      <MarqueeOne />

      {/* BlogOne */}
      <BlogOne />

      {/* FooterOne */}
      <FooterOne />
    </AOSWrap>
  );
}
