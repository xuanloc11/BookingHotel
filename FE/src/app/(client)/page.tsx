import type { Metadata } from "next";
import Preloader from "@/helper/Preloader";
import AOSWrap from "@/helper/AOSWrap";
import Header from "@/components/layout/Header";
import Banner from "@/components/home/Banner";
import Checkout from "@/components/booking/Checkout";
import Footer from "@/components/layout/Footer";
import QuickPlanner from "@/components/home/QuickPlanner";
import FeaturedHotelsCarousel from "@/components/home/FeaturedHotelsCarousel";
import { fetchProvinces, fetchHotels } from "@/lib/api/hotelApi";
import ClientHome from "@/components/home/ClientHome";

export default async function Home() {
  const provinces = await fetchProvinces().catch(() => []);
  const hotels = await fetchHotels({ limit: 16 }).catch(() => []);
  
  // Lấy dữ liệu thật từ DB, chia nửa để hiện thị trên 2 thanh cuộn khác nhau
  const topHotels = hotels.slice(0, 8);
  const lovedHotels = hotels.slice(8, 16);

  return (
    <AOSWrap>
      {/* Preloader */}
      <Preloader />

      {/* HeaderOne */}
      <Header />

      {/* BannerOne */}
      <Banner />

      {/* Checkout (Search Filter) */}
      <Checkout />

      {/* Booking.com Style Home Layout wrapped in Client Component to access useLanguage */}
      <ClientHome topHotels={topHotels} lovedHotels={lovedHotels} provinces={provinces} />

      {/* FooterOne */}
      <Footer />
    </AOSWrap>
  );
}
