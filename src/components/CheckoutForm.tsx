"use client";

import Link from "next/link";
import { useState, useTransition, type FormEvent } from "react";
import { placeOrder, type OrderField } from "@/app/actions/order";
import { cart, subtotalOf, useCartLines } from "@/lib/cart";
import type { Dictionary, Locale } from "@/lib/i18n";
import { formatPrice } from "@/lib/products";
import { BagLines } from "./BagLines";

type Props = { lang: Locale; labels: Dictionary["checkout"]; bag: Dictionary["bag"] };

const inputClass =
  "mt-2 block w-full border border-line bg-coal px-4 py-3 text-base text-paper outline-none transition-colors placeholder:text-ash focus:border-paper aria-[invalid=true]:border-paper";

export function CheckoutForm({ lang, labels, bag }: Props) {
  const lines = useCartLines();
  const [isPending, startTransition] = useTransition();
  const [invalidFields, setInvalidFields] = useState<OrderField[]>([]);
  const [hasFailed, setHasFailed] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = (key: string) => String(form.get(key) ?? "");

    startTransition(async () => {
      setHasFailed(false);
      try {
        const result = await placeOrder({
          lang,
          name: text("name"),
          phone: text("phone"),
          city: text("city"),
          address: text("address"),
          notes: text("notes"),
          lines: lines.map(({ id, size, qty }) => ({ id, size, qty })),
        });

        if (result.status === "invalid") {
          setInvalidFields(result.fields);
          return;
        }
        if (result.status === "failed") {
          setHasFailed(true);
          return;
        }
        setInvalidFields([]);
        setOrderNumber(result.orderNumber);
        cart.clear();
        window.scrollTo({ top: 0 });
      } catch {
        setHasFailed(true);
      }
    });
  };

  if (orderNumber) {
    return (
      <div className="flex flex-col items-center py-16 text-center md:py-24">
        <p className="label text-ash">{labels.orderNumber}</p>
        <p className="latin mt-2 text-6xl font-black leading-none tracking-tight md:text-8xl">{orderNumber}</p>
        <h1 className="mt-8 text-3xl font-bold uppercase leading-none md:text-5xl">{labels.doneTitle}</h1>
        <p className="mt-4 max-w-sm text-base leading-7 text-paper/70">{labels.doneBody}</p>
        <Link
          href={`/${lang}/shop`}
          className="label mt-8 inline-flex h-12 items-center justify-center border border-paper px-8 transition-colors hover:bg-paper hover:text-ink"
        >
          {labels.keepShopping}
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <p className="max-w-sm text-2xl font-bold uppercase leading-tight">{labels.emptyBag}</p>
        <Link
          href={`/${lang}/shop`}
          className="label mt-8 inline-flex h-12 items-center justify-center bg-paper px-8 text-ink"
        >
          {bag.shop}
        </Link>
      </div>
    );
  }

  const errorFor = (field: OrderField) => {
    if (!invalidFields.includes(field)) return null;
    return field === "phone" ? labels.phoneInvalid : labels.required;
  };

  const field = (name: OrderField, label: string, extra: React.InputHTMLAttributes<HTMLInputElement>) => {
    const error = errorFor(name);
    return (
      <label className="block">
        <span className="label text-ash">{label}</span>
        <input
          name={name}
          required
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          className={inputClass}
          {...extra}
        />
        {error && (
          <span id={`${name}-error`} className="mt-1 block text-sm font-medium">
            {error}
          </span>
        )}
      </label>
    );
  };

  return (
    <>
      <h1 className="text-4xl font-bold uppercase leading-none tracking-tight md:text-6xl">{labels.title}</h1>
      <div className="mt-8 grid gap-10 md:mt-12 md:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] md:gap-16">
        <form onSubmit={submitOrder} className="flex flex-col gap-5">
          <h2 className="label border-b border-line pb-3">{labels.details}</h2>
          {field("name", labels.name, { autoComplete: "name", maxLength: 80, minLength: 2 })}
          <div>
            {field("phone", labels.phone, {
              type: "tel",
              inputMode: "tel",
              autoComplete: "tel",
              dir: "ltr",
              maxLength: 30,
              placeholder: "09xx xxx xxx",
            })}
            <p className="mt-1 text-sm leading-5 text-ash">{labels.phoneHint}</p>
          </div>
          {field("city", labels.city, { autoComplete: "address-level2", maxLength: 60, minLength: 2 })}
          {field("address", labels.address, { autoComplete: "street-address", maxLength: 200, minLength: 4 })}
          <label className="block">
            <span className="label text-ash">{labels.notes}</span>
            <textarea name="notes" rows={3} maxLength={500} className={inputClass} />
          </label>

          {hasFailed && (
            <p role="alert" className="border border-paper px-4 py-3 text-sm leading-6">
              {labels.failed}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="label flex h-14 items-center justify-center bg-paper text-ink transition-colors hover:bg-white disabled:opacity-60"
          >
            {isPending ? labels.placing : labels.place}
          </button>
        </form>

        <aside className="md:order-last">
          <h2 className="label border-b border-line pb-3">{labels.summary}</h2>
          <BagLines lines={lines} lang={lang} bag={bag} isEditable={false} />
          <div className="flex items-baseline justify-between border-t border-line pt-4">
            <p className="label">{bag.subtotal}</p>
            <p className="latin text-lg font-bold tabular-nums">{formatPrice(subtotalOf(lines))}</p>
          </div>
          <p className="mt-1 text-sm leading-5 text-ash">{bag.deliveryNote}</p>
        </aside>
      </div>
    </>
  );
}
