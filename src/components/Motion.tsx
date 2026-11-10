import type { CSSProperties } from "react";
import { LogoMark } from "./Logo";

/**
 * Runs before first paint. Adds "js" so reveal styles only apply when scripts work,
 * and "intro" so the intro screen plays on every full page load (opening the site or refreshing).
 * Moving between pages inside the site does not reload the document, so it does not replay there.
 */
const BOOT_SCRIPT = `document.documentElement.classList.add("js","intro")`;

export function BootScript() {
  return <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />;
}

/**
 * Full-screen intro, CSS only: the ring draws while a counter runs to 100, the slash strikes
 * through it, then the slash cuts the whole screen and the two halves slide apart.
 */
export function IntroScreen() {
  return (
    <div className="intro-screen" aria-hidden="true">
      <div className="intro-panel intro-panel-a" />
      <div className="intro-panel intro-panel-b" />
      <div className="intro-cut" />
      <div className="intro-center">
        <svg viewBox="0 0 100 100" className="intro-mark">
          <circle cx="50" cy="50" r="27" pathLength={1} fill="none" stroke="currentColor" strokeWidth="15" />
          <line x1="15.4" y1="84.6" x2="84.6" y2="15.4" pathLength={1} stroke="currentColor" strokeWidth="13" />
        </svg>
      </div>
      <p className="intro-count" />
      <p className="intro-word">NO LOGO™</p>
    </div>
  );
}

type SplitTextProps = { text: string };

/** Wraps each word so it can slide up from a clipped line. Put it inside an element with data-reveal="split". */
export function SplitText({ text }: SplitTextProps) {
  const words = text.split(" ");

  return words.map((word, index) => (
    <span key={index}>
      <span className="split-word">
        <span style={{ "--i": index } as CSSProperties}>{word}</span>
      </span>
      {index < words.length - 1 && " "}
    </span>
  ));
}

/**
 * Props for an element that animates in when scrolled into view.
 * The observer adds a class before React finishes loading, so the mismatch warning is silenced here.
 */
export const reveal = (kind: "fade" | "split") => ({ "data-reveal": kind, suppressHydrationWarning: true });

/** Delay for the nth item of a grid so items appear one after another. */
export const staggerStyle = (index: number, stepMs = 70) =>
  ({ "--reveal-delay": `${index * stepMs}ms` }) as CSSProperties;

/** Rotating Ø shown while a page or section is loading. */
export function BrandLoader({ label }: { label: string }) {
  return (
    <div role="status" className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <LogoMark className="h-12 w-12 animate-spin [animation-duration:1.4s]" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
