import type { Dictionary } from "@/lib/i18n";
import { LogoMark } from "./Logo";

const RING_TEXT = "NO LOGO™ · STREETWEAR · SYRIA · NO LOGO™ · STREETWEAR · SYRIA · ";
// Circumference of the r=184 ring path, so the text closes the circle exactly.
const RING_LENGTH = Math.round(2 * Math.PI * 184);

type Props = { hero: Dictionary["hero"] };

export function Hero({ hero }: Props) {
  return (
    <section className="relative flex min-h-[calc(100svh-5.5rem)] flex-col overflow-hidden md:min-h-[calc(100svh-6rem)]">
      <div className="relative flex flex-1 items-center justify-center px-4 py-10">
        <p
          dir="ltr"
          aria-hidden="true"
          className="latin pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center text-[23vw] font-black uppercase leading-none tracking-tighter text-coal"
        >
          NO LOGO
        </p>
        <div className="relative aspect-square w-[min(78vw,56svh,520px)]">
          <svg
            viewBox="0 0 400 400"
            direction="ltr"
            className="absolute inset-0 h-full w-full animate-spin-slow"
            aria-hidden="true"
          >
            <defs>
              <path id="hero-ring" d="M200 200 m-184 0 a184 184 0 1 1 368 0 a184 184 0 1 1 -368 0" />
            </defs>
            <text className="latin fill-paper text-[17px] font-semibold uppercase">
              <textPath href="#hero-ring" textLength={RING_LENGTH} lengthAdjust="spacing">
                {RING_TEXT}
              </textPath>
            </text>
          </svg>
          <div className="absolute inset-[11%] flex items-center justify-center rounded-full bg-paper text-ink">
            <LogoMark className="h-[64%] w-[64%]" />
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 pb-8 md:flex-row md:items-end md:justify-between md:px-8 md:pb-10">
        <div>
          <p className="label text-ash">{hero.kicker}</p>
          <h1 className="mt-2 text-4xl font-bold uppercase leading-[1.05] tracking-tight md:text-6xl">
            {hero.title}
          </h1>
        </div>
        <a
          href="#drop"
          className="label inline-flex h-12 items-center justify-center bg-paper px-8 text-ink transition-colors hover:bg-white"
        >
          {hero.cta}
        </a>
      </div>
    </section>
  );
}
