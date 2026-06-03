import type { Metadata } from "next";

import AuthForm from "@/components/auth/AuthForm";
import Breadcrumb from "@/components/Breadcrumb";
import FooterOne from "@/components/FooterOne";
import HeaderTwo from "@/components/HeaderTwo";
import AOSWrap from "@/helper/AOSWrap";
import Preloader from "@/helper/Preloader";
import type { PageSearchParams } from "@/lib/hotelSearchParams";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a hotel booking account.",
};

interface RegisterPageProps {
  searchParams: Promise<PageSearchParams>;
}

function firstValue(
  params: PageSearchParams,
  key: string,
): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;

  return (
    <AOSWrap>
      <Preloader />
      <HeaderTwo />
      <Breadcrumb title='Register' sub_title='Account' />
      <AuthForm mode='register' nextPath={firstValue(params, "next")} />
      <FooterOne />
    </AOSWrap>
  );
}
