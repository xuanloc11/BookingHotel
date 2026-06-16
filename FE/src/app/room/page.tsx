import type { Metadata } from "next";
import AOSWrap from "@/helper/AOSWrap";
import Preloader from "@/helper/Preloader";
import HeaderTwo from "@/components/layout/HeaderTwo";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FooterOne from "@/components/layout/FooterOne";
import HotelResults from "@/components/hotel/HotelResults";
import SearchFilters from "@/components/search/SearchFilters";
import { fetchHotelSearchResults } from "@/lib/api/hotelApi";
import {
  parseHotelSearchParams,
  type PageSearchParams,
} from "@/lib/hotelSearchParams";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Room | EliteStay - Hotel Booking Multi-Purpose Next Js Template",
    description:
      "EliteStay is a professional Next JS Template for Hotel Booking Multi-Purpose services. Clean design, responsive layout, and modern UI components included.",
    openGraph: {
      title: "Room | EliteStay",
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

export const dynamic = "force-dynamic";

interface RoomPageProps {
  searchParams: Promise<PageSearchParams>;
}

export default async function Page({ searchParams }: RoomPageProps) {
  const filters = parseHotelSearchParams(await searchParams);
  let hotels: Awaited<ReturnType<typeof fetchHotelSearchResults>>["hotels"] = [];
  let amenities: Awaited<ReturnType<typeof fetchHotelSearchResults>>["amenities"] = [];
  let error: string | null = null;

  try {
    const results = await fetchHotelSearchResults(filters);
    hotels = results.hotels;
    amenities = results.amenities;
  } catch (requestError) {
    error =
      requestError instanceof Error
        ? requestError.message
        : "Unable to load hotels.";
  }

  return (
    <AOSWrap>
      {/* Preloader */}
      <Preloader />

      {/* HeaderTwo */}
      <HeaderTwo />

      {/* Breadcrumb */}
      <Breadcrumb title='Room' sub_title='Experience the Story' />

      <SearchFilters amenities={amenities} filters={filters} />

      {error ? (
        <section className='bg_2 tw-pb-12'>
          <div className='container'>
            <div className='alert alert-danger' role='alert'>
              {error}
            </div>
          </div>
        </section>
      ) : null}

      <HotelResults hotels={hotels} />

      {/* FooterOne */}
      <FooterOne />
    </AOSWrap>
  );
}
