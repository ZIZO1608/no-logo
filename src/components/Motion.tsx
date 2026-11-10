import type { CSSProperties } from "react";
import { LogoMark } from "./Logo";

/**
 * Runs before first paint. Adds "js" so reveal styles only apply when scripts work,
 * and "intro" on the first page load of a browser session to show the intro screen.
 */
const BOOT_SCRIPT = `(function(){var d=document.documentElement;d.classList.add("js");try{if(!sessionStorage.getItem("nologo-intro")){sessionStorage.setItem("nologo-intro","1");d.classList.add("intro")}}catch(e){}})()`;

export function BootScript() {
  return <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />;
}

/** Full-screen intro: the mark draws itself, a bar fills, then the screen slides away. CSS only. */
export function IntroScreen() {
  return (
    <div className="intro-screen" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="intro-mark h-24 w-24 md:h-32 md:w-32">
        <circle cx="50" cy="50" r="27" pathLength={1} fill="none" stroke="currentColor" strokeWidth="15" />
        <line x1="15.4" y1="84.6" x2="84.6" y2="15.4" pathLength={1} stroke="currentColor" strokeWidth="13" />
      </svg>
      <div className="intro-bar">
        <span />
      </div>
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
