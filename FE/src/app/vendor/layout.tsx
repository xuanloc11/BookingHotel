"use client";

import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import Script from "next/script";

export default function VendorLayout({ children }: { children: ReactNode }) {
  const { user, loading, handleLogout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "vendor" && user.role !== "admin") {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || (user.role !== "vendor" && user.role !== "admin")) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const navLinks = [
    { label: "Tổng quan", href: "/vendor/dashboard", icon: "ri-dashboard-2-line" },
    { label: "Quản lý khách sạn", href: "/vendor/hotels", icon: "ri-building-line" },
    { label: "Quản lý đơn đặt", href: "/vendor/bookings", icon: "ri-calendar-check-line" },
  ];

  return (
    <>
      <head>
        {/* Template CSS */}
        <link href="/admin-assets/css/app.min.css" rel="stylesheet" type="text/css" />
        <link href="/admin-assets/css/icons.min.css" rel="stylesheet" type="text/css" />
        <Script src="/admin-assets/js/config.js" strategy="beforeInteractive" />
      </head>
      {/* Wrapper */}
      <div className="wrapper">
        {/* Topbar */}
        <div className="navbar-custom">
          <div className="topbar container-fluid">
            <div className="d-flex align-items-center gap-1">
              <div className="logo-topbar">
                <Link href="/vendor/dashboard" className="logo-light">
                  <span className="logo-lg">
                    <h3 className="text-white mt-3">Booking Vendor</h3>
                  </span>
                  <span className="logo-sm">
                    <h3 className="text-white mt-3">BV</h3>
                  </span>
                </Link>
                <Link href="/vendor/dashboard" className="logo-dark">
                  <span className="logo-lg">
                    <h3 className="mt-3">Booking Vendor</h3>
                  </span>
                  <span className="logo-sm">
                    <h3 className="mt-3">BV</h3>
                  </span>
                </Link>
              </div>

              <button className="button-toggle-menu">
                <i className="mdi mdi-menu"></i>
              </button>

              <h4 className="page-title d-none d-sm-block">Cổng Đối Tác</h4>
            </div>

            <ul className="topbar-menu d-flex align-items-center gap-3">
              <li className="dropdown">
                <a className="nav-link dropdown-toggle arrow-none nav-user" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">
                  <span className="account-user-avatar">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                      {(user.full_name?.[0] || "U").toUpperCase()}
                    </div>
                  </span>
                  <span className="d-lg-block d-none">
                    <h5 className="my-0 fw-normal">{user.full_name} <i className="ri-arrow-down-s-line fs-22 d-none d-sm-inline-block align-middle"></i></h5>
                  </span>
                </a>
                <div className="dropdown-menu dropdown-menu-end dropdown-menu-animated profile-dropdown">
                  <div className="dropdown-header noti-title">
                    <h6 className="text-overflow m-0">Xin chào!</h6>
                  </div>
                  <Link href="/" className="dropdown-item">
                    <i className="ri-home-4-line fs-16 align-middle me-1"></i>
                    <span>Về trang chủ khách</span>
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item">
                    <i className="ri-logout-circle-r-line align-middle me-1"></i>
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
        {/* End Topbar */}

        {/* Left Sidebar */}
        <div className="leftside-menu">
          <Link href="/vendor/dashboard" className="logo logo-light">
            <span className="logo-lg">
              <h3 className="text-white mt-3 text-center">Booking</h3>
            </span>
            <span className="logo-sm">
              <h3 className="text-white mt-3 text-center">B</h3>
            </span>
          </Link>
          <Link href="/vendor/dashboard" className="logo logo-dark">
            <span className="logo-lg">
              <h3 className="mt-3 text-center">Booking</h3>
            </span>
            <span className="logo-sm">
              <h3 className="mt-3 text-center">B</h3>
            </span>
          </Link>

          <div data-simplebar>
            <ul className="side-nav">
              <li className="side-nav-title">Menu Chính</li>
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <li className="side-nav-item" key={link.href}>
                    <Link href={link.href} className={`side-nav-link ${isActive ? "active" : ""}`}>
                      <i className={link.icon}></i>
                      <span> {link.label} </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        {/* End Left Sidebar */}

        {/* Content Page */}
        <div className="content-page">
          <div className="content">
            <div className="container-fluid">
              {children}
            </div>
          </div>
          {/* Footer */}
          <footer className="footer">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12 text-center">
                  <script>document.write(new Date().getFullYear())</script> © BookingHotel - Vendor Portal
                </div>
              </div>
            </div>
          </footer>
          </div>
          {/* End Content Page */}
        </div>

        {/* Template Scripts */}
        <Script src="/admin-assets/js/vendor.min.js" strategy="lazyOnload" />
        <Script src="/admin-assets/js/app.min.js" strategy="lazyOnload" />
    </>
  );
}
