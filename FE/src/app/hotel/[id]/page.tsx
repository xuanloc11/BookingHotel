import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Breadcrumb from "@/components/Breadcrumb";
import FooterOne from "@/components/FooterOne";
import HeaderTwo from "@/components/HeaderTwo";
import HotelDetails from "@/components/hotel/HotelDetails";
import AOSWrap from "@/helper/AOSWrap";
import Preloader from "@/helper/Preloader";
import { fetchHotelAvailability, fetchHotelById } from "@/lib/api/hotelApi";

interface HotelDetailsPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: HotelDetailsPageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Hotel ${id}`,
    description: "Hotel details, amenities, gallery, and availability.",
  };
}

export default async function HotelDetailsPage({
  params,
}: HotelDetailsPageProps) {
  const { id } = await params;
  const hotelId = Number(id);

  if (!Number.isInteger(hotelId) || hotelId <= 0) {
    notFound();
  }

  try {
    const [hotel, availability] = await Promise.all([
      fetchHotelById(hotelId),
      fetchHotelAvailability(hotelId),
    ]);

    return (
      <AOSWrap>
        <Preloader />
        <HeaderTwo />
        <Breadcrumb title={hotel.name} sub_title='Hotel Details' />
        <HotelDetails availability={availability} hotel={hotel} />
        <FooterOne />
      </AOSWrap>
    );
  } catch {
    notFound();
  }
}
