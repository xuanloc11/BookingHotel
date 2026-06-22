import type { Metadata } from "next";

import AuthForm from "@/components/auth/AuthForm";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import AOSWrap from "@/helper/AOSWrap";
import Preloader from "@/helper/Preloader";
import type { PageSearchParams } from "@/lib/hotelSearchParams";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to manage hotel bookings and profile details.",
};

interface LoginPageProps {
  searchParams: Promise<PageSearchParams>;
}

function firstValue(
  params: PageSearchParams,
  key: string,
): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <AOSWrap>
      <Preloader />
      <Header />
      <Breadcrumb title='Đăng nhập' sub_title='Tài khoản' />
      <AuthForm mode='login' nextPath={firstValue(params, "next")} />
      <Footer />
    </AOSWrap>
  );
}
