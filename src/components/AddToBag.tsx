"use client";

import { useState } from "react";
import { cart } from "@/lib/cart";
import type { Dictionary } from "@/lib/i18n";

type Props = { productId: string; sizes: string[]; labels: Dictionary["product"] };

export function AddToBag({ productId, sizes, labels }: Props) {
  const hasOneSize = sizes.length === 1;
  const [size, setSize] = useState<string | null>(hasOneSize ? sizes[0] : null);
  const [needsSize, setNeedsSize] = useState(false);

  const addToBag = () => {
    if (!size) {
      setNeedsSize(true);
      return;
    }
    cart.add(productId, size);
    cart.open();
  };

  const pickSize = (next: string) => {
    setSize(next);
    setNeedsSize(false);
  };

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="label text-ash">{labels.size}</p>
        {needsSize && (
          <p role="alert" className="text-sm font-medium">
            {labels.pickSize}
          </p>
        )}
      </div>

      {hasOneSize ? (
        <p className="mt-3 text-sm">{labels.oneSize}</p>
      ) : (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {sizes.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={size === option}
              onClick={() => pickSize(option)}
              className={`latin h-12 border text-sm font-semibold transition-colors ${
                size === option
                  ? "border-paper bg-paper text-ink"
                  : needsSize
                    ? "border-paper text-paper"
                    : "border-line text-paper hover:border-paper"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={addToBag}
        className="label mt-6 flex h-14 w-full items-center justify-center bg-paper text-ink transition-colors hover:bg-white"
      >
        {labels.add}
      </button>
    </div>
  );
}
