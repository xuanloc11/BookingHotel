import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Header />

      <main
        className='error-page d-flex align-items-center justify-content-center position-relative'
        style={{ minHeight: "100vh" }}
      >
        {/* Background image */}
        <div className='error-bg position-absolute w-100 h-100 top-0 start-0'>
          <Image
            src='/assets/images/thumbs/bg_404.png'
            fill
            style={{ objectFit: "cover" }}
            alt='404 Background'
          />
          <div className='overlay'></div> {/* optional overlay for contrast */}
        </div>

        {/* Content */}
        <div className='container text-center text-white position-relative'>
          <div className='row justify-content-center'>
            <div className='col-lg-6 col-md-8'>
              <h1 className='display-1 mb-4 text-warning'>404!</h1>
              <p className='lead mb-4'>
                Rất tiếc! Trang bạn đang tìm kiếm không tồn tại.
              </p>
              <Link
                href='/'
                className='tw-btn-hover-white bg-main-600 tw-py-5 tw-px-14 text-capitalize text-heading font-heading d-inline-flex align-items-center tw-gap-2 tw-rounded-lg'
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
