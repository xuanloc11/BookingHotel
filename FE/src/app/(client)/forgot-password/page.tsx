import type { Metadata } from "next";

import AuthForm from "@/components/auth/AuthForm";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FooterOne from "@/components/layout/FooterOne";
import HeaderTwo from "@/components/layout/HeaderTwo";
import AOSWrap from "@/helper/AOSWrap";
import Preloader from "@/helper/Preloader";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Request a password reset link for your booking account.",
};

export default function ForgotPasswordPage() {
  return (
    <AOSWrap>
      <Preloader />
      <HeaderTwo />
      <Breadcrumb title='Forgot Password' sub_title='Account' />
      <AuthForm mode='forgot-password' />
      <FooterOne />
    </AOSWrap>
  );
}
