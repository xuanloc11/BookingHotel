import Link from "next/link";
import type { Metadata } from "next";

import Breadcrumb from "@/components/layout/Breadcrumb";
import CheckoutForm from "@/components/booking/CheckoutForm";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import AOSWrap from "@/helper/AOSWrap";
import Preloader from "@/helper/Preloader";
import { fetchHotelBySlug } from "@/lib/api/hotelApi";
import { parseCheckoutParams } from "@/lib/checkout/checkoutParams";
import { calculateBookingPrice } from "@/lib/checkout/pricing";
import type { PageSearchParams } from "@/lib/hotelSearchParams";

interface CheckoutPageProps {
  searchParams: Promise<PageSearchParams>;
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Review selected room, dates, guest details, and submit booking.",
};

function CheckoutMissingState() {
  return (
    <section className='bg_2 pt-120 pb-120'>
      <div className='container'>
        <div className='bg-white tw-rounded-lg tw-p-10 text-center'>
          <h1 className='tw-text-10 fw-normal tw-mb-4'>No stay selected</h1>
          <p className='tw-mb-6'>
            Choose a hotel, dates, and guest count before checkout.
          </p>
          <Link
            className='tw-btn-hover-black bg-main-600 tw-py-4 tw-px-8 text-heading font-heading tw-rounded-lg'
            href='/room'
          >
            Search hotels
          </Link>
        </div>
      </div>
    </section>
  );
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const selection = parseCheckoutParams(await searchParams);

  if (!selection) {
    return (
      <AOSWrap>
        <Preloader />
        <Header />
        <Breadcrumb title='Thanh toán' sub_title='Đặt phòng' titleKey='checkout.title' subTitleKey='checkout.booking' />
        <CheckoutMissingState />
        <Footer />
      </AOSWrap>
    );
  }

  const hotel = await fetchHotelBySlug(selection.hotel_id.toString());
  const price = calculateBookingPrice({
    nightlyRate: hotel.price_per_night,
    checkIn: selection.check_in,
    checkOut: selection.check_out,
    guests: selection.guests,
  });

  return (
    <AOSWrap>
      <Preloader />
      <Header />
      <Breadcrumb title='Thanh toán' sub_title='Đặt phòng' titleKey='checkout.title' subTitleKey='checkout.booking' />
      <CheckoutForm hotel={hotel} price={price} selection={selection} />
      <Footer />
    </AOSWrap>
  );
}
