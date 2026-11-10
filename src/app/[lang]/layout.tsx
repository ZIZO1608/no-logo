import type { Metadata } from "next";
import { Archivo, IBM_Plex_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { BagDrawer } from "@/components/BagDrawer";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BootScript, IntroScreen } from "@/components/Motion";
import { RevealObserver } from "@/components/RevealObserver";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
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

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const { meta } = getDictionary(lang);
  return { title: meta.title, description: meta.description };
}

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);

  return (
    <html
      lang={lang}
      dir={dict.dir}
      className={`${archivo.variable} ${plexArabic.variable} antialiased`}
      // The boot script adds classes to <html> before React loads.
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col">
        <BootScript />
        <IntroScreen />
        <RevealObserver />
        <p className="label bg-paper px-4 py-2 text-center text-ink">{dict.announce}</p>
        <Header lang={lang} nav={dict.nav} />
        <main className="site-main flex-1">{children}</main>
        <Footer lang={lang} dict={dict} />
        <BagDrawer lang={lang} bag={dict.bag} closeLabel={dict.nav.close} />
      </body>
    </html>
  );
}
