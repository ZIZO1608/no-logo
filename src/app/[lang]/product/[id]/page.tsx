import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToBag } from "@/components/AddToBag";
import { GarmentArt } from "@/components/GarmentArt";
import { ProductCard } from "@/components/ProductCard";
import { getDictionary, isLocale } from "@/lib/i18n";
import { formatPrice, getProduct, products } from "@/lib/products";

const RELATED_COUNT = 4;

// Every product page is prerendered per language.
export const instant = false;

export const generateStaticParams = () => products.map((product) => ({ id: product.id }));

export async function generateMetadata({ params }: PageProps<"/[lang]/product/[id]">): Promise<Metadata> {
  const { lang, id } = await params;
  const product = getProduct(id);
  if (!product || !isLocale(lang)) return {};

  return { title: `${product.name[lang]} — ${product.color[lang]} | NO LOGO™` };
}

export default async function ProductPage({ params }: PageProps<"/[lang]/product/[id]">) {
  const { lang, id } = await params;
  const product = getProduct(id);
  if (!product || !isLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const related = products.filter((other) => other.id !== product.id).slice(0, RELATED_COUNT);

  return (
    <>
      <section className="mx-auto grid max-w-[1600px] md:grid-cols-2">
        <GarmentArt garment={product.garment} tone={product.tone} className="aspect-[4/5] p-10 md:p-20" />

        <div className="px-4 py-8 md:px-12 md:py-16">
          <div className="md:sticky md:top-28 md:max-w-md">
            <Link
              href={`/${lang}/shop`}
              className="label text-ash underline underline-offset-4 transition-colors hover:text-paper"
            >
              {dict.product.back}
            </Link>
            <h1 className="mt-6 text-4xl font-bold uppercase leading-none tracking-tight md:text-5xl">
              {product.name[lang]}
            </h1>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="text-base text-ash">{product.color[lang]}</p>
              <p className="latin text-xl font-semibold tabular-nums">{formatPrice(product.price)}</p>
            </div>

            <div className="mt-8 border-t border-line pt-6">
              <AddToBag productId={product.id} sizes={product.sizes} labels={dict.product} />
            </div>
            <p className="mt-5 text-sm leading-6 text-ash">{dict.product.note}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] border-t border-line px-4 py-14 md:px-8 md:py-20">
        <h2 className="text-2xl font-bold uppercase leading-none tracking-tight md:text-4xl">
          {dict.product.more}
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-5">
          {related.map((other) => (
            <ProductCard key={other.id} product={other} lang={lang} newLabel={dict.drop.isNew} />
          ))}
        </div>
      </section>
    </>
  );
}
