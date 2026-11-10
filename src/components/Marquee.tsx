import { LogoMark } from "./Logo";

const REPEATS = 8;

type Props = { tone?: "paper" | "ink" };

/** Endless brand strip. Always runs left-to-right text, even on Arabic pages. */
export function Marquee({ tone = "paper" }: Props) {
  const colors = tone === "paper" ? "bg-paper text-ink" : "bg-ink text-paper border-y border-line";

  const half = (
    <div className="flex shrink-0 items-center">
      {Array.from({ length: REPEATS }, (_, index) => (
        <span key={index} className="latin flex items-center gap-6 pe-6 text-2xl font-black uppercase tracking-tight md:text-4xl">
          NO LOGO™
          <LogoMark className="h-6 w-6 md:h-8 md:w-8" />
        </span>
      ))}
    </div>
  );

  return (
    <div dir="ltr" aria-hidden="true" className={`overflow-hidden py-3 md:py-4 ${colors}`}>
      <div className="flex w-max animate-marquee">
        {half}
        {half}
      </div>
    </div>
  );
}
