"use client";

import { useSyncExternalStore } from "react";

const TICK_MS = 15_000;
const PLACEHOLDER = "--:--";

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Damascus",
  hour: "2-digit",
  minute: "2-digit",
});

const subscribe = (onTick: () => void) => {
  const timer = setInterval(onTick, TICK_MS);
  return () => clearInterval(timer);
};

const readTime = () => formatter.format(new Date());
const readPlaceholder = () => PLACEHOLDER;

/** The time in Damascus right now, where the brand is. Shows a placeholder until the page is live. */
export function LocalTime() {
  const time = useSyncExternalStore(subscribe, readTime, readPlaceholder);

  return <span className="latin tabular-nums">{time}</span>;
}
