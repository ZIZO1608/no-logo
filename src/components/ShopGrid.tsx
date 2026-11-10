"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Dictionary, Locale } from "@/lib/i18n";
import { categories, isCategory, products, type Product } from "@/lib/products";
import { Dropdown } from "./Dropdown";
import { ProductCard } from "./ProductCard";

type SortKey = "newest" | "priceLow" | "priceHigh";

const sortKeys: SortKey[] = ["newest", "priceLow", "priceHigh"];
const isSortKey = (value: string | null): value is SortKey => sortKeys.includes(value as SortKey);

const sorters: Record<SortKey, (a: Product, b: Product) => number> = {
  newest: () => 0,
  priceLow: (a, b) => a.price - b.price,
  priceHigh: (a, b) => b.price - a.price,
};

type Props = {
  lang: Locale;
  shop: Dictionary["shop"];
  categoryLabels: Dictionary["categories"];
  newLabel: string;
};

export function ShopGrid({ lang, shop, categoryLabels, newLabel }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category");
  const sortParam = searchParams.get("sort");
  const activeCategory = isCategory(categoryParam) ? categoryParam : null;
  const activeSort = isSortKey(sortParam) ? sortParam : "newest";

  const setParam = (key: "category" | "sort", value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const visible = products
    .filter((product) => !activeCategory || product.category === activeCategory)
    .toSorted(sorters[activeSort]);

  const chipClass = (isActive: boolean) =>
    `label h-9 shrink-0 border px-4 transition-colors ${
      isActive ? "border-paper bg-paper text-ink" : "border-line text-paper/70 hover:border-paper hover:text-paper"
    }`;

  return (
    <>
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
          <button type="button" className={chipClass(!activeCategory)} onClick={() => setParam("category", null)}>
            {categoryLabels.all}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={chipClass(activeCategory === category)}
              onClick={() => setParam("category", category)}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="label text-ash">
            <span className="latin tabular-nums">{visible.length}</span> {shop.items}
          </p>
          <Dropdown
            label={shop.sort}
            value={activeSort}
            options={sortKeys.map((key) => ({ value: key, label: shop[key] }))}
            onChange={(key) => setParam("sort", key === "newest" ? null : key)}
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="py-24 text-center text-ash">{shop.empty}</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-5 md:gap-y-12">
          {visible.map((product, index) => (
            <ProductCard key={product.id} product={product} lang={lang} newLabel={newLabel} index={index % 4} />
          ))}
        </div>
      )}
    </>
  );
}
