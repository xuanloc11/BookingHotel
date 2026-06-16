import type { Metadata } from "next";

import Breadcrumb from "@/components/layout/Breadcrumb";
import BookingSuccessDetails from "@/components/booking/BookingSuccessDetails";
import FooterOne from "@/components/layout/FooterOne";
import HeaderTwo from "@/components/layout/HeaderTwo";
import AOSWrap from "@/helper/AOSWrap";
import Preloader from "@/helper/Preloader";
import type { PageSearchParams } from "@/lib/hotelSearchParams";

interface BookingSuccessPageProps {
  searchParams: Promise<PageSearchParams>;
}

export const metadata: Metadata = {
  title: "Booking Success",
  description: "Booking confirmation details.",
};

function firstValue(
  params: PageSearchParams,
  key: string,
): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function BookingSuccessPage({
  searchParams,
}: BookingSuccessPageProps) {
  const params = await searchParams;

  return (
    <AOSWrap>
      <Preloader />
      <HeaderTwo />
      <Breadcrumb title='Booking Success' sub_title='Confirmation' />
      <BookingSuccessDetails
        bookingId={firstValue(params, "bookingId")}
        checkIn={firstValue(params, "checkIn")}
        checkOut={firstValue(params, "checkOut")}
        hotelName={firstValue(params, "hotelName")}
        status={firstValue(params, "status")}
      />
      <FooterOne />
    </AOSWrap>
  );
}
