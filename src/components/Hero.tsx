import Link from "next/link";
import type { HeroMedia } from "@/lib/hero";
import type { Dictionary, Locale } from "@/lib/i18n";
import { HeroVideo } from "./HeroVideo";
import { LogoMark } from "./Logo";
import { reveal, SplitText } from "./Motion";

const RING_TEXT = "NO LOGO™ · STREETWEAR · SYRIA · NO LOGO™ · STREETWEAR · SYRIA · ";
// Circumference of the r=184 ring path, so the text closes the circle exactly.
const RING_LENGTH = Math.round(2 * Math.PI * 184);

// Screen height minus the announcement bar (two lines on small phones) and the header.
const SECTION_HEIGHT = "min-h-[calc(100svh-7rem)] md:min-h-[calc(100svh-6rem)]";

/** The Ø badge with the brand line rotating around it. */
function RingBadge({ className }: { className: string }) {
  return (
    <div className={`aspect-square ${className}`}>
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
  );
}

type Props = { lang: Locale; hero: Dictionary["hero"]; media: HeroMedia | null };

export function Hero({ lang, hero, media }: Props) {
  const cta = (
    <Link
      href={`/${lang}/shop`}
      {...reveal("fade")}
      className="label inline-flex h-12 items-center justify-center bg-paper px-8 text-ink transition-colors hover:bg-white"
    >
      {hero.cta}
    </Link>
  );

  if (media) {
    const source = `/media/${media.file}`;

    return (
      <section className={`relative flex flex-col justify-end overflow-hidden ${SECTION_HEIGHT}`}>
        <div className="hero-media absolute inset-0">
          {media.kind === "video" ? (
            <HeroVideo src={source} className="h-full w-full object-cover" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- uploaded at runtime, served from /media
            <img src={source} alt="" fetchPriority="high" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/25" />

        <RingBadge className="absolute end-4 top-4 w-24 md:end-8 md:top-8 md:w-36" />

        <div className="relative mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 pb-8 md:flex-row md:items-end md:justify-between md:px-8 md:pb-12">
          <div>
            <p {...reveal("fade")} className="label text-paper/80">
              {hero.kicker}
            </p>
            <h1
              {...reveal("split")}
              className="mt-3 text-6xl font-black uppercase leading-[1] tracking-tight md:text-8xl lg:text-9xl"
            >
              <SplitText text={hero.title} />
            </h1>
          </div>
          {cta}
        </div>
      </section>
    );
  }

  return (
    <section className={`relative flex flex-col overflow-hidden ${SECTION_HEIGHT}`}>
      <div className="relative flex flex-1 items-center justify-center px-4 py-10">
        <p
          dir="ltr"
          aria-hidden="true"
          className="latin pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center text-[23vw] font-black uppercase leading-none tracking-tighter text-coal"
        >
          NO LOGO
        </p>
        <RingBadge className="relative w-[min(78vw,56svh,520px)]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 pb-8 md:flex-row md:items-end md:justify-between md:px-8 md:pb-10">
        <div>
          <p {...reveal("fade")} className="label text-ash">
            {hero.kicker}
          </p>
          <h1
            {...reveal("split")}
            className="mt-2 text-4xl font-bold uppercase leading-[1.05] tracking-tight md:text-6xl"
          >
            <SplitText text={hero.title} />
          </h1>
        </div>
        {cta}
      </div>
    </section>
  );
}
