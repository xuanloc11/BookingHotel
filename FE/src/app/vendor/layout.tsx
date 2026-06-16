"use client";

import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

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
    { label: "Dashboard", href: "/vendor/dashboard", icon: "ph-squares-four" },
    { label: "Quản lý khách sạn", href: "/vendor/hotels", icon: "ph-buildings" },
    { label: "Quản lý đơn đặt", href: "/vendor/bookings", icon: "ph-calendar-check" },
  ];

  return (
    <div className="d-flex vh-100 bg-light overflow-hidden">
      {/* Sidebar */}
      <div className="bg-dark text-white d-flex flex-column" style={{ width: "260px" }}>
        <div className="p-4 border-bottom border-secondary text-center">
          <h4 className="m-0 font-heading fw-bold text-white">Vendor Portal</h4>
        </div>
        <ul className="nav nav-pills flex-column mb-auto p-3 tw-gap-2">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <li className="nav-item" key={link.href}>
                <Link
                  href={link.href}
                  className={`nav-link text-white d-flex align-items-center tw-gap-3 ${isActive ? "bg-main-600 fw-bold" : ""}`}
                >
                  <i className={`ph ${link.icon} tw-text-xl`} />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="p-4 border-top border-secondary">
          <Link href="/" className="btn btn-outline-light w-100 mb-2 d-flex align-items-center justify-content-center tw-gap-2">
            <i className="ph ph-house" /> Về trang chủ
          </Link>
          <button onClick={handleLogout} className="btn btn-danger w-100 d-flex align-items-center justify-content-center tw-gap-2">
            <i className="ph ph-sign-out" /> Đăng xuất
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white shadow-sm p-3 d-flex justify-content-between align-items-center sticky-top">
          <h5 className="m-0 font-heading fw-bold">Xin chào, {user.full_name}</h5>
          <div className="d-flex align-items-center tw-gap-2">
            <span className="bg-main-600 text-heading fw-bold rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
              {(user.full_name?.[0] || "U").toUpperCase()}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
