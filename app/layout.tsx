import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/ToastProvider";
import MobileBottomNav from "@/components/ui/MobileBottomNav";
import PageProgressBar from "@/components/ui/PageProgressBar";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TRACE : Tracking Reports & Aggregating Community Environmental Issues",
  description:
    "Platform partisipasi masyarakat berbasis GIS Leaflet untuk memantau dan melaporkan isu lingkungan serta fasilitas publik secara transparan dan aman.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
        <ToastProvider>
          <PageProgressBar />
          {children}
          <MobileBottomNav />
        </ToastProvider>
      </body>
    </html>
  );
}
