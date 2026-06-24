import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Breadcrumb from "@/components/layout/Breadcrumb";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import HotelDetails from "@/components/hotel/HotelDetails";
import AOSWrap from "@/helper/AOSWrap";
import Preloader from "@/helper/Preloader";
import { fetchHotelAvailability, fetchHotelBySlug } from "@/lib/api/hotelApi";
import type { HotelAvailabilityDay } from "@/types/hotel";

interface HotelDetailsPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: HotelDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `Hotel ${slug}`,
    description: "Hotel details, amenities, gallery, and availability.",
  };
}

export default async function HotelDetailsPage({
  params,
  searchParams,
}: HotelDetailsPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  try {
    const hotel = await fetchHotelBySlug(slug);
    
    const roomAvailabilities: Record<number, HotelAvailabilityDay[]> = {};
    if (hotel.room_types && hotel.room_types.length > 0) {
      await Promise.all(
        hotel.room_types.map(async (room) => {
          roomAvailabilities[room.id] = await fetchHotelAvailability(slug, room.id);
        })
      );
    } else {
      roomAvailabilities[0] = await fetchHotelAvailability(slug);
    }

    return (
      <AOSWrap>
        <Preloader />
        <Header />
        <Breadcrumb title={hotel.name} sub_title='Chi tiết khách sạn' subTitleKey='breadcrumb.hotelDetails' imageUrl={hotel.thumbnail} />
        <HotelDetails 
          roomAvailabilities={roomAvailabilities} 
          hotel={hotel} 
          searchParams={resolvedSearchParams} 
        />
        <Footer />
      </AOSWrap>
    );
  } catch {
    notFound();
  }
}
