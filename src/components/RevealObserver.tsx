"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const INTRO_MS = 2600;

/** Marks every [data-reveal] element as visible when it scrolls into view. Mount once per layout. */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    // The intro delays the first reveals; later ones must not wait for it.
    const introTimer = window.setTimeout(() => root.classList.remove("intro"), INTRO_MS);
    return () => window.clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    const visibility = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          visibility.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    const watchNew = () => {
      document
        .querySelectorAll("[data-reveal]:not(.is-visible)")
        .forEach((element) => visibility.observe(element));
    };

    watchNew();
    // Filters and client navigation add elements after the first scan.
    const additions = new MutationObserver(watchNew);
    additions.observe(document.body, { childList: true, subtree: true });

    return () => {
      visibility.disconnect();
      additions.disconnect();
    };
  }, [pathname]);

  return null;
}
