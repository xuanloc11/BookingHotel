import type { Metadata } from "next";
import Preloader from "@/helper/Preloader";
import AOSWrap from "@/helper/AOSWrap";
import HeaderOne from "@/components/HeaderOne";
import BannerOne from "@/components/BannerOne";
import Checkout from "@/components/Checkout";
import AdvanceArea from "@/components/AdvanceArea";
import OfferOne from "@/components/OfferOne";
import FeatureOne from "@/components/FeatureOne";
import PackageOne from "@/components/PackageOne";
import ClientOne from "@/components/ClientOne";
import AboutOne from "@/components/AboutOne";
import CtaOne from "@/components/CtaOne";
import PropertiesInner from "@/components/PropertiesInner";
import PricingOne from "@/components/PricingOne";
import TestimonialOne from "@/components/TestimonialOne";
import MarqueeOne from "@/components/MarqueeOne";
import BlogOne from "@/components/BlogOne";
import FooterOne from "@/components/FooterOne";



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
