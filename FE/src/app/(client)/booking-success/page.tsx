import type { Metadata } from "next";

import Breadcrumb from "@/components/layout/Breadcrumb";
import BookingSuccessDetails from "@/components/booking/BookingSuccessDetails";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import AOSWrap from "@/helper/AOSWrap";
import Preloader from "@/helper/Preloader";
import type { PageSearchParams } from "@/lib/hotelSearchParams";

interface BookingSuccessPageProps {
  searchParams: Promise<PageSearchParams>;
}

export const metadata: Metadata = {
  title: "Đặt phòng thành công",
  description: "Chi tiết xác nhận đặt phòng của bạn.",
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
      <Header />
      <Breadcrumb title='Đặt phòng thành công' titleKey='success.title' sub_title='Xác nhận' subTitleKey='success.subtitle' />
      <BookingSuccessDetails
        bookingId={firstValue(params, "bookingId")}
        checkIn={firstValue(params, "checkIn")}
        checkOut={firstValue(params, "checkOut")}
        hotelName={firstValue(params, "hotelName")}
        status={firstValue(params, "status")}
        contact={firstValue(params, "contact")}
      />
      <Footer />
    </AOSWrap>
  );
}
