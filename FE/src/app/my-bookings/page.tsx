import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import Breadcrumb from "@/components/layout/Breadcrumb";
import MyBookingsDashboard from "@/components/booking/MyBookingsDashboard";
import FooterOne from "@/components/layout/FooterOne";
import HeaderTwo from "@/components/layout/HeaderTwo";
import AOSWrap from "@/helper/AOSWrap";
import Preloader from "@/helper/Preloader";
import { AUTH_ACCESS_TOKEN_COOKIE } from "@/lib/api/authApi";
import { fetchMyBookings } from "@/lib/api/bookingApi";
import { fetchCurrentUser } from "@/lib/api/userApi";
import type { BookingSummary } from "@/types/booking";
import type { UserProfile } from "@/types/user";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Bookings",
  description: "View booking history and reservation status.",
};

export default async function MyBookingsPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_ACCESS_TOKEN_COOKIE)?.value;
  const sessionId = cookieStore.get("sessionid")?.value;

  if (!accessToken && !sessionId) {
    redirect("/login?next=/my-bookings");
  }

  const authHeaders = !accessToken && sessionId ? { Cookie: `sessionid=${sessionId}` } : undefined;
  let bookings: BookingSummary[] = [];
  let user: UserProfile | undefined;
  let loadError: string | undefined;

  try {
    [bookings, user] = await Promise.all([
      fetchMyBookings({ authToken: accessToken, headers: authHeaders }),
      fetchCurrentUser({ authToken: accessToken, headers: authHeaders }),
    ]);
  } catch (requestError) {
    loadError =
      requestError instanceof Error
        ? requestError.message
        : "Unable to load booking history.";
  }

  return (
    <AOSWrap>
      <Preloader />
      <HeaderTwo />
      <Breadcrumb title='My Bookings' sub_title='Dashboard' />
      <MyBookingsDashboard bookings={bookings} error={loadError} user={user} />
      <FooterOne />
    </AOSWrap>
  );
}
