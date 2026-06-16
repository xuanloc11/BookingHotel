import BootstrapInit from "@/helper/BootstrapInit";
import RouteScrollToTop from "@/helper/RouteScrollToTop";
import ErrorBoundary from "@/helper/ErrorBoundary";
import CustomGSAP from "@/helper/CustomGsap";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { Marcellus } from "next/font/google";
import "./globals.css";

/* Marcellus – Google Font */
const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marcellus",
  display: "swap",
});

export async function generateMetadata() {
  return {
    title: {
      default: "Booking Hotel App",
      template: "%s | Booking Hotel",
    },
    description: "Nền tảng đặt phòng khách sạn tiện lợi và nhanh chóng.",
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='vi' className={`${marcellus.variable}`}>
      <body>
        <ErrorBoundary>
          <BootstrapInit />
          <RouteScrollToTop />
          <CustomGSAP />
        </ErrorBoundary>

        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

