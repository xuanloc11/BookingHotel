"use client";
import { FC } from "react";
import QuickPlanner from "./QuickPlanner";
import FeaturedHotelsCarousel from "./FeaturedHotelsCarousel";
import { Hotel } from "@/types/hotel";
import { ProvinceData } from "@/lib/api/hotelApi";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface ClientHomeProps {
  topHotels: Hotel[];
  lovedHotels: Hotel[];
  provinces: ProvinceData[];
}

const ClientHome: FC<ClientHomeProps> = ({ topHotels, lovedHotels, provinces }) => {
  const { t } = useLanguage();

  return (
    <>
      {/* Lên kế hoạch nhanh (Explore Vietnam) */}
      {provinces.length > 0 && (
        <QuickPlanner provinces={provinces} />
      )}

      {/* Featured Hotels */}
      {topHotels.length > 0 && (
        <FeaturedHotelsCarousel 
          title={t("home.topUniqueProperties")} 
          subtitle={t("home.topUniqueSubtitle")}
          hotels={topHotels} 
        />
      )}

      {/* Guest Loved Hotels */}
      {lovedHotels.length > 0 && (
        <FeaturedHotelsCarousel 
          title={t("home.guestLoved")} 
          hotels={lovedHotels} 
        />
      )}
    </>
  );
};

export default ClientHome;
