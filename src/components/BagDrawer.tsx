"use client";

import Link from "next/link";
import { useEffect } from "react";
import { cart, countItems, subtotalOf, useBagOpen, useCartLines } from "@/lib/cart";
import type { Dictionary, Locale } from "@/lib/i18n";
import { formatPrice } from "@/lib/products";
import { BagLines } from "./BagLines";

type Props = { lang: Locale; bag: Dictionary["bag"]; closeLabel: string };

export function BagDrawer({ lang, bag, closeLabel }: Props) {
  const isOpen = useBagOpen();
  const lines = useCartLines();

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") cart.close();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isEmpty = lines.length === 0;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label={closeLabel}
        className="absolute inset-0 h-full w-full cursor-default bg-black/60"
        onClick={cart.close}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={bag.title}
        className="absolute inset-y-0 end-0 flex w-full max-w-md flex-col bg-paper text-ink"
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-ink/15 px-4 md:h-16 md:px-6">
          <h2 className="label">
            {bag.title} <span className="latin tabular-nums">({countItems(lines)})</span>
          </h2>
          <button type="button" className="label -me-2 px-2 py-3" onClick={cart.close}>
            {closeLabel}
          </button>
        </div>

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
            <p className="text-2xl font-bold uppercase leading-tight">{bag.empty}</p>
            <Link
              href={`/${lang}/shop`}
              onClick={cart.close}
              className="label inline-flex h-12 items-center justify-center bg-ink px-8 text-paper"
            >
              {bag.shop}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 md:px-6">
              <BagLines lines={lines} lang={lang} bag={bag} />
            </div>
            <div className="shrink-0 border-t border-ink/15 px-4 py-4 md:px-6">
              <div className="flex items-baseline justify-between">
                <p className="label">{bag.subtotal}</p>
                <p className="latin text-lg font-bold tabular-nums">{formatPrice(subtotalOf(lines))}</p>
              </div>
              <p className="mt-1 text-sm leading-5 text-ink/60">{bag.deliveryNote}</p>
              <Link
                href={`/${lang}/checkout`}
                onClick={cart.close}
                className="label mt-4 flex h-12 items-center justify-center bg-ink text-paper transition-colors hover:bg-black"
              >
                {bag.checkout}
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
