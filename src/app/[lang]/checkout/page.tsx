import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/CheckoutForm";
import { getDictionary, isLocale } from "@/lib/i18n";

// Prerendered per language; the bag is read in the browser.
export const instant = false;

export default async function CheckoutPage({ params }: PageProps<"/[lang]/checkout">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-10 md:px-8 md:py-16">
      <CheckoutForm lang={lang} labels={dict.checkout} bag={dict.bag} />
    </section>
  );
}
