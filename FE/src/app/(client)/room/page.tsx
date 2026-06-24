import type { Metadata } from "next";
import AOSWrap from "@/helper/AOSWrap";
import Preloader from "@/helper/Preloader";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Footer from "@/components/layout/Footer";
import HotelResults from "@/components/hotel/HotelResults";
import SearchFilters from "@/components/search/SearchFilters";
import { fetchHotelSearchResults } from "@/lib/api/hotelApi";
import {
  parseHotelSearchParams,
  type PageSearchParams,
} from "@/lib/hotelSearchParams";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Phòng | VPL Hotel",
    description:
      "VPL Hotel là nền tảng đặt phòng khách sạn tiện lợi và nhanh chóng.",
    openGraph: {
      title: "Phòng | VPL Hotel",
      description:
        "VPL Hotel là nền tảng đặt phòng khách sạn tiện lợi và nhanh chóng.",
      url: "https://booking.xloc.id.vn",
      type: "website",
      images: [
        {
          url: "https://booking.xloc.id.vn/images/meta.png",
          width: 1200,
          height: 630,
          alt: "vplhotel",
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
      <Header />

      {/* Breadcrumb */}
      <Breadcrumb 
        title='Phòng nghỉ' 
        sub_title='Danh sách phòng' 
        titleKey='menu.rooms'
        subTitleKey='menu.roomList'
        imageUrl={hotels[0]?.thumbnail} 
      />

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
      <Footer />
    </AOSWrap>
  );
}
