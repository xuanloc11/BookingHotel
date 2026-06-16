import { AuthProvider } from "@/lib/auth/AuthContext";
import { Toaster } from "react-hot-toast";

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
    <html lang='vi'>
      <body>
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
