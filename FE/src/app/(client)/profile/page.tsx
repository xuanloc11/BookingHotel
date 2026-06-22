import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import Breadcrumb from "@/components/layout/Breadcrumb";
import ProfileDashboard from "@/components/profile/ProfileDashboard";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import AOSWrap from "@/helper/AOSWrap";
import Preloader from "@/helper/Preloader";
import { AUTH_ACCESS_TOKEN_COOKIE } from "@/lib/api/authApi";
import { fetchCurrentUser } from "@/lib/api/userApi";
import { fetchMyBookings } from "@/lib/api/bookingApi";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hồ sơ cá nhân",
  description: "Quản lý thông tin hồ sơ cá nhân của bạn.",
};

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_ACCESS_TOKEN_COOKIE)?.value;
  const sessionId = cookieStore.get("sessionid")?.value;

  if (!accessToken && !sessionId) {
    redirect("/login?next=/profile");
  }

  const authHeaders = !accessToken && sessionId ? { Cookie: `sessionid=${sessionId}` } : undefined;
  let user;
  let bookings: any[] = [];

  try {
    const [fetchedUser, fetchedBookings] = await Promise.all([
      fetchCurrentUser({ authToken: accessToken, headers: authHeaders }),
      fetchMyBookings({ authToken: accessToken, headers: authHeaders }).catch(() => [])
    ]);
    user = fetchedUser;
    bookings = fetchedBookings;
  } catch (requestError) {
    redirect("/login?next=/profile");
  }

  if (!user) {
    redirect("/login?next=/profile");
  }

  return (
    <AOSWrap>
      <Preloader />
      <Header />
      <Breadcrumb title='Hồ sơ cá nhân' sub_title='Tài khoản' />
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileDashboard user={user} bookings={bookings} />
      </Suspense>
      <Footer />
    </AOSWrap>
  );
}
