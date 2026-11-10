"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cart, countItems, useCartLines } from "@/lib/cart";
import { INSTAGRAM_URL, navLinks, type Dictionary, type Locale } from "@/lib/i18n";
import { LogoBadge } from "./Logo";

type Props = { lang: Locale; nav: Dictionary["nav"] };

export function Header({ lang, nav }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const itemCount = countItems(useCartLines());

  const otherLang: Locale = lang === "ar" ? "en" : "ar";
  const switchHref = pathname.replace(/^\/(ar|en)(?=\/|$)/, `/${otherLang}`);
  const links = navLinks(lang, nav);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur">
      <div className="mx-auto grid h-14 max-w-[1600px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-4 md:h-16 md:px-8">
        <div className="flex items-center gap-6">
          <button
            type="button"
            className="label -ms-2 px-2 py-3 md:hidden"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(true)}
          >
            {nav.menu}
          </button>
          <nav className="hidden items-center gap-7 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="label text-paper/70 transition-colors hover:text-paper"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <Link href={`/${lang}`} aria-label="NO LOGO" className="flex items-center">
          <LogoBadge className="h-9 w-9 md:h-10 md:w-10" />
        </Link>

        <div className="flex items-center justify-end gap-1 md:gap-5">
          <Link
            href={switchHref}
            lang={otherLang}
            className={`px-2 py-3 text-paper/70 transition-colors hover:text-paper ${
              otherLang === "ar" ? "font-[family-name:var(--font-arabic)] text-sm" : "label latin"
            }`}
          >
            {nav.switchTo}
          </Link>
          <button type="button" className="label -me-2 px-2 py-3" onClick={cart.open}>
            {nav.bag} <span className="latin tabular-nums">({itemCount})</span>
          </button>
        </div>
      </div>

      <span aria-hidden="true" className="scroll-progress absolute inset-x-0 -bottom-px h-0.5 bg-paper" />

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex h-dvh flex-col bg-ink px-4 md:hidden">
          <div className="flex h-14 items-center justify-between">
            <LogoBadge className="h-9 w-9" />
            <button type="button" className="label -me-2 px-2 py-3" onClick={closeMenu}>
              {nav.close}
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="border-b border-line py-5 text-4xl font-bold uppercase leading-none"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="py-5 text-4xl font-bold uppercase leading-none text-ash"
            >
              {nav.instagram}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
