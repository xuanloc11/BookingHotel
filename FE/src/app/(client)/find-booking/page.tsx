import { Metadata } from "next";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FindBookingForm from "./FindBookingForm";

export const metadata: Metadata = {
  title: "Tra cứu đơn hàng",
  description: "Tra cứu thông tin đơn đặt phòng của bạn",
};

export default function FindBookingPage() {
  return (
    <>
      <Header />
      <Breadcrumb title="Tra cứu đơn hàng" titleKey="findBooking.title" sub_title="Tra cứu" subTitleKey="findBooking.subtitle" />
      <section className="bg_2 pt-120 pb-120">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-8">
              <div className="bg-white tw-rounded-lg tw-p-8 tw-shadow-sm border border-neutral">
                <h2 className="tw-text-6 fw-bold tw-mb-4 text-center">Tra cứu thông tin đặt phòng</h2>
                <p className="text-secondary text-center tw-mb-8">
                  Vui lòng nhập mã đơn hàng (Booking ID) và Email hoặc Số điện thoại bạn đã sử dụng khi đặt phòng.
                </p>
                <FindBookingForm />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
