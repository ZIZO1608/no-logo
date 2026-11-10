import Link from "next/link";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, navLinks, type Dictionary, type Locale } from "@/lib/i18n";
import { LogoMark } from "./Logo";

type Props = { lang: Locale; dict: Dictionary };

export function Footer({ lang, dict }: Props) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[1600px] px-4 pt-12 md:px-8 md:pt-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <LogoMark className="h-14 w-14" />
          <nav className="flex flex-col gap-3 md:flex-row md:gap-8">
            {navLinks(lang, dict.nav).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="label text-paper/70 transition-colors hover:text-paper"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="label latin text-paper/70 transition-colors hover:text-paper"
            >
              {INSTAGRAM_HANDLE}
            </a>
          </nav>
        </div>

        <p
          dir="ltr"
          aria-hidden="true"
          className="latin mt-10 select-none text-center text-[19.5vw] font-black uppercase leading-[0.8] tracking-tighter text-coal min-[1600px]:text-[312px]"
        >
          NO LOGO
        </p>
      </div>
      <p className="label border-t border-line px-4 py-4 text-center text-ash">
        <span className="latin">© 2026 NO LOGO™</span> — {dict.footer.rights}
      </p>
    </footer>
  );
}
