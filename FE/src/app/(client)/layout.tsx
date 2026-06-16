import BootstrapInit from "@/helper/BootstrapInit";
import RouteScrollToTop from "@/helper/RouteScrollToTop";
import ErrorBoundary from "@/helper/ErrorBoundary";
import CustomGSAP from "@/helper/CustomGsap";
import { Marcellus } from "next/font/google";
import "../globals.css";

/* Marcellus – Google Font */
const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marcellus",
  display: "swap",
});

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${marcellus.variable}`}>
      <ErrorBoundary>
        <BootstrapInit />
        <RouteScrollToTop />
        <CustomGSAP />
      </ErrorBoundary>

      {children}
    </div>
  );
}
