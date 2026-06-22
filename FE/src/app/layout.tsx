import { AuthProvider } from "@/lib/auth/AuthContext";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { Toaster } from "react-hot-toast";
import { Inter, Outfit } from "next/font/google";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--body-font" });
const outfit = Outfit({ subsets: ["latin", "latin-ext"], variable: "--heading-font" });

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
    <html lang='vi' className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
          <Toaster position="top-right" />
        </LanguageProvider>
      </body>
    </html>
  );
}
