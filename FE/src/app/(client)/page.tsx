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

      {/* Booking.com Style Home Layout */}
      
      {/* Lên kế hoạch nhanh (Explore Vietnam) */}
      {provinces.length > 0 && (
        <QuickPlanner provinces={provinces} />
      )}

      {/* Featured Hotels */}
      {topHotels.length > 0 && (
        <FeaturedHotelsCarousel 
          title="Lưu trú tại các chỗ nghỉ độc đáo hàng đầu" 
          subtitle="Từ biệt thự, lâu đài cho đến nhà thuyền, igloo, chúng tôi đều có hết"
          hotels={topHotels} 
        />
      )}

      {/* Guest Loved Hotels */}
      {lovedHotels.length > 0 && (
        <FeaturedHotelsCarousel 
          title="Nhà ở mà khách yêu thích" 
          hotels={lovedHotels} 
        />
      )}

      {/* FooterOne */}
      <Footer />
    </AOSWrap>
  );
}
