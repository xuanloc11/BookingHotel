import type { Metadata } from "next";

import AuthForm from "@/components/auth/AuthForm";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
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
      <Header />
      <Breadcrumb title='Quên mật khẩu' sub_title='Tài khoản' />
      <AuthForm mode='forgot-password' />
      <Footer />
    </AOSWrap>
  );
}
