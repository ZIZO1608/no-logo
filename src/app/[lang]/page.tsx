import Link from "next/link";
import { notFound } from "next/navigation";
import { GarmentArt } from "@/components/GarmentArt";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { ProductCard } from "@/components/ProductCard";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, getDictionary, isLocale } from "@/lib/i18n";
import { products, type Category, type Garment } from "@/lib/products";

const categoryTiles: { key: Category; garment: Garment }[] = [
  { key: "tees", garment: "tee" },
  { key: "hoodies", garment: "hoodie" },
  { key: "bottoms", garment: "pants" },
  { key: "caps", garment: "cap" },
];

// The page is fully prerendered per language; it only reads `lang` from the URL.
export const instant = false;

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);

  return (
    <>
      <Hero hero={dict.hero} />
      <Marquee />

      <section id="drop" className="mx-auto max-w-[1600px] scroll-mt-16 px-4 py-14 md:px-8 md:py-24">
        <div className="flex items-end justify-between">
          <div>
            <p className="label text-ash">{dict.drop.kicker}</p>
            <h2 className="mt-2 text-3xl font-bold uppercase leading-none tracking-tight md:text-5xl">
              {dict.drop.title}
            </h2>
          </div>
          <Link
            href={`/${lang}/shop`}
            className="label underline underline-offset-4 transition-colors hover:text-white"
          >
            {dict.drop.all}
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 md:mt-12 md:grid-cols-4 md:gap-x-5 md:gap-y-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} lang={lang} newLabel={dict.drop.isNew} />
          ))}
        </div>
      </section>

      <section id="categories" className="scroll-mt-16 border-t border-line">
        <div className="mx-auto max-w-[1600px] px-4 py-14 md:px-8 md:py-24">
          <h2 className="text-3xl font-bold uppercase leading-none tracking-tight md:text-5xl">
            {dict.categories.title}
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-3 md:mt-12 md:grid-cols-4 md:gap-5">
            {categoryTiles.map((tile, index) => (
              <Link
                key={tile.key}
                href={`/${lang}/shop?category=${tile.key}`}
                className="group relative block overflow-hidden"
              >
                <GarmentArt
                  garment={tile.garment}
                  tone="paper"
                  className="aspect-[3/4] border border-line p-8 transition-transform duration-500 ease-out group-hover:scale-[1.04] md:p-12"
                />
                <span className="absolute inset-x-0 bottom-0 flex items-baseline justify-between p-3 md:p-4">
                  <span className="text-lg font-bold uppercase leading-none md:text-2xl">
                    {dict.categories[tile.key]}
                  </span>
                  <span className="label latin text-ash">0{index + 1}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="order" className="scroll-mt-16 bg-paper text-ink">
        <div className="mx-auto max-w-[1600px] px-4 py-14 md:px-8 md:py-24">
          <h2 className="text-3xl font-bold uppercase leading-none tracking-tight md:text-5xl">
            {dict.order.title}
          </h2>
          <ol className="mt-8 grid gap-px bg-ink/15 md:mt-12 md:grid-cols-3">
            {dict.order.steps.map((step, index) => (
              <li key={step.title} className="bg-paper py-6 md:px-6 md:py-2 md:first:ps-0">
                <p className="latin text-5xl font-black leading-none md:text-7xl">0{index + 1}</p>
                <h3 className="mt-4 text-lg font-bold uppercase leading-6">{step.title}</h3>
                <p className="mt-1 max-w-xs text-sm leading-6 text-ink/70">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto flex max-w-[1600px] flex-col items-center px-4 py-16 text-center md:px-8 md:py-28">
        <p className="label text-ash">{dict.instagram.body}</p>
        <h2 className="mt-3 text-3xl font-bold uppercase leading-none tracking-tight md:text-5xl">
          {dict.instagram.title}
        </h2>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="label mt-8 inline-flex h-12 items-center justify-center gap-2 border border-paper px-8 transition-colors hover:bg-paper hover:text-ink"
        >
          {dict.instagram.cta} <span className="latin">{INSTAGRAM_HANDLE}</span>
        </a>
      </section>

      <Marquee tone="ink" />
    </>
  );
}
