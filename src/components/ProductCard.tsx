import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { formatPrice, type Product } from "@/lib/products";
import { GarmentArt } from "./GarmentArt";
import { reveal, staggerStyle } from "./Motion";

type Props = { product: Product; lang: Locale; newLabel: string; index?: number };

export function ProductCard({ product, lang, newLabel, index = 0 }: Props) {
  return (
    <Link
      href={`/${lang}/product/${product.id}`}
      {...reveal("fade")}
      style={staggerStyle(index)}
      className="group block"
    >
      <div className="relative overflow-hidden">
        <GarmentArt
          garment={product.garment}
          tone={product.tone}
          className="aspect-[4/5] p-6 transition-transform duration-500 ease-out group-hover:scale-[1.04] md:p-10"
        />
        {product.isNew && (
          <span className="label absolute start-3 top-3 bg-ink px-2 py-1 text-paper">{newLabel}</span>
        )}
      </div>
      <div className="flex items-start justify-between gap-3 pt-3">
        <div>
          <h3 className="text-sm font-semibold uppercase leading-5">{product.name[lang]}</h3>
          <p className="text-sm leading-5 text-ash">{product.color[lang]}</p>
        </div>
        <p className="latin text-sm font-medium tabular-nums leading-5">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
