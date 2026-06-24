import type { Metadata } from "next";
import { Suspense } from "react";

import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import AOSWrap from "@/helper/AOSWrap";
import Preloader from "@/helper/Preloader";

export const metadata: Metadata = {
  title: "Đặt lại mật khẩu",
  description: "Đặt lại mật khẩu mới cho tài khoản của bạn.",
};

export default function ResetPasswordPage() {
  return (
    <AOSWrap>
      <Preloader />
      <Header />
      <Breadcrumb title='Đặt lại mật khẩu' titleKey='auth.resetTitle' sub_title='Bảo mật' />
      <Suspense fallback={<div className="container tw-py-20 text-center"><span className="spinner-border text-primary"></span></div>}>
        <ResetPasswordForm />
      </Suspense>
      <Footer />
    </AOSWrap>
  );
}
