import type { Metadata } from "next";
import { Archivo, IBM_Plex_Sans_Arabic } from "next/font/google";
import "../globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "NO LOGO™ — لوحة التحكم",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="ar" dir="rtl" className={`${archivo.variable} ${plexArabic.variable} antialiased`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
