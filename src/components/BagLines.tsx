"use client";

import { cart, MAX_QTY, type DetailedLine } from "@/lib/cart";
import type { Dictionary, Locale } from "@/lib/i18n";
import { formatPrice } from "@/lib/products";
import { GarmentArt } from "./GarmentArt";

type Props = {
  lines: DetailedLine[];
  lang: Locale;
  bag: Dictionary["bag"];
  isEditable?: boolean;
};

export function BagLines({ lines, lang, bag, isEditable = true }: Props) {
  return (
    <ul className="divide-y divide-current/15">
      {lines.map(({ id, size, qty, product }) => (
        <li key={`${id}-${size}`} className="flex gap-4 py-4">
          <GarmentArt garment={product.garment} tone={product.tone} className="h-24 w-20 shrink-0 p-2" />
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold uppercase leading-5">{product.name[lang]}</h3>
              <p className="latin text-sm font-medium tabular-nums leading-5">
                {formatPrice(product.price * qty)}
              </p>
            </div>
            <p className="text-sm leading-5 opacity-60">
              {product.color[lang]} · {bag.size} <span className="latin">{size}</span>
              {!isEditable && <span className="latin"> · ×{qty}</span>}
            </p>
            {isEditable && (
              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex items-center border border-current/25">
                  <button
                    type="button"
                    aria-label={bag.less}
                    className="latin flex h-9 w-9 items-center justify-center text-lg"
                    onClick={() => cart.setQty(id, size, qty - 1)}
                  >
                    −
                  </button>
                  <span className="latin w-6 text-center text-sm tabular-nums">{qty}</span>
                  <button
                    type="button"
                    aria-label={bag.more}
                    disabled={qty >= MAX_QTY}
                    className="latin flex h-9 w-9 items-center justify-center text-lg disabled:opacity-30"
                    onClick={() => cart.setQty(id, size, qty + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="label py-2 underline underline-offset-4 opacity-60 transition-opacity hover:opacity-100"
                  onClick={() => cart.setQty(id, size, 0)}
                >
                  {bag.remove}
                </button>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
