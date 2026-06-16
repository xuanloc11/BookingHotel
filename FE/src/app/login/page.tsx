import type { Metadata } from "next";

import AuthForm from "@/components/auth/AuthForm";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FooterOne from "@/components/layout/FooterOne";
import HeaderTwo from "@/components/layout/HeaderTwo";
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
      <HeaderTwo />
      <Breadcrumb title='Login' sub_title='Account' />
      <AuthForm mode='login' nextPath={firstValue(params, "next")} />
      <FooterOne />
    </AOSWrap>
  );
}
