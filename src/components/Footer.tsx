import Link from "next/link";
import type { ReactNode } from "react";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, type Dictionary, type Locale } from "@/lib/i18n";
import { categories } from "@/lib/products";
import { HeroLens } from "./HeroLens";
import { LocalTime } from "./LocalTime";
import { LogoBadge, LogoMark } from "./Logo";

// The giant closing wordmark, spelled with the mark. The roaming mark draws a second copy in negative.
const WORDMARK_TEXT = "NØ LØGØ";
const WORDMARK =
  "latin select-none whitespace-nowrap text-center text-[19vw] font-black uppercase leading-[0.82] tracking-tighter min-[1600px]:text-[304px]";

const LINK_CLASS =
  "group flex w-fit items-center text-lg font-semibold uppercase leading-7 text-paper/70 transition-colors hover:text-paper";

/** The Ø mark slides in before a footer link when it is hovered or focused. */
function LinkMark() {
  return (
    <LogoMark className="h-3.5 w-0 shrink-0 opacity-0 transition-all duration-300 group-hover:me-2 group-hover:w-3.5 group-hover:opacity-100 group-focus-visible:me-2 group-focus-visible:w-3.5 group-focus-visible:opacity-100" />
  );
}

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="label border-b border-line pb-3 text-ash">{title}</h2>
      <ul className="mt-4 flex flex-col gap-1">{children}</ul>
    </div>
  );
}

type Props = { lang: Locale; dict: Dictionary };

export function Footer({ lang, dict }: Props) {
  const { footer, nav } = dict;

  const infoLinks = [
    { href: `/${lang}#drop`, label: nav.drop },
    { href: `/${lang}#order`, label: nav.order },
    { href: `/${lang}/checkout`, label: dict.bag.checkout },
  ];

  return (
    <footer className="site-footer border-t border-line bg-ink">
      <div className="mx-auto max-w-[1600px] px-4 pt-12 md:px-8 md:pt-16">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.7fr)_repeat(3,minmax(0,1fr))] md:gap-8">
          <div>
            <LogoBadge className="h-14 w-14" />
            <p className="mt-6 max-w-md text-4xl font-bold uppercase leading-none tracking-tight md:text-5xl">
              {dict.hero.title}
            </p>
            <p className="mt-4 max-w-xs text-sm leading-6 text-ash">{dict.announce}</p>
          </div>

          <Column title={footer.shop}>
            <li>
              <Link href={`/${lang}/shop`} className={LINK_CLASS}>
                <LinkMark />
                {dict.categories.all}
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category}>
                <Link href={`/${lang}/shop?category=${category}`} className={LINK_CLASS}>
                  <LinkMark />
                  {dict.categories[category]}
                </Link>
              </li>
            ))}
          </Column>

          <Column title={footer.info}>
            {infoLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={LINK_CLASS}>
                  <LinkMark />
                  {link.label}
                </Link>
              </li>
            ))}
          </Column>

          <Column title={footer.follow}>
            <li>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className={LINK_CLASS}>
                <LinkMark />
                {nav.instagram}
              </a>
            </li>
            <li className="label latin mt-1 text-ash">{INSTAGRAM_HANDLE}</li>
          </Column>
        </div>

        <div dir="ltr" aria-hidden="true" className="relative mt-12 overflow-hidden md:mt-16">
          <p className={`${WORDMARK} text-coal`}>{WORDMARK_TEXT}</p>
          <HeroLens className="footer-lens">
            <p className={`${WORDMARK} text-ink`}>{WORDMARK_TEXT}</p>
          </HeroLens>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="label mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-4 text-ash md:px-8">
          <p>
            <span className="latin">© 2026 NO LOGO™</span> — {footer.rights}
          </p>
          <p>
            {footer.city} <LocalTime />
          </p>
          <a href="#top" className="text-paper transition-colors hover:text-white">
            {footer.top} <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
