import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ShopGrid } from "@/components/ShopGrid";
import { getDictionary, isLocale } from "@/lib/i18n";

// Prerendered per language; the filters read the URL on the client.
export const instant = false;

export default async function ShopPage({ params }: PageProps<"/[lang]/shop">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);

  return (
    <section className="mx-auto max-w-[1600px] px-4 py-10 md:px-8 md:py-16">
      <h1 className="text-4xl font-bold uppercase leading-none tracking-tight md:text-6xl">{dict.shop.title}</h1>
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <ShopGrid lang={lang} shop={dict.shop} categoryLabels={dict.categories} newLabel={dict.drop.isNew} />
      </Suspense>
    </section>
  );
}
