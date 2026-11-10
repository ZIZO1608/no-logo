"use server";

import { insertOrder } from "@/lib/db";
import { isLocale } from "@/lib/i18n";
import { getProduct } from "@/lib/products";

const MAX_LINES = 30;
const MAX_QTY = 10;
const PHONE_PATTERN = /^\+?\d{9,15}$/;

export type OrderField = "name" | "phone" | "city" | "address";

export type OrderResult =
  | { status: "done"; orderNumber: string }
  | { status: "invalid"; fields: OrderField[] }
  | { status: "failed" };

export type OrderInput = {
  lang: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
  lines: { id: string; size: string; qty: number }[];
};

const clean = (value: unknown, maxLength: number) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, maxLength) : "";

const normalizePhone = (value: unknown) => clean(value, 30).replace(/[\s\-()]/g, "");

export async function placeOrder(input: OrderInput): Promise<OrderResult> {
  const lang = isLocale(input?.lang) ? input.lang : "ar";
  const name = clean(input?.name, 80);
  const phone = normalizePhone(input?.phone);
  const city = clean(input?.city, 60);
  const address = clean(input?.address, 200);
  const notes = clean(input?.notes, 500);

  const invalidFields: OrderField[] = [];
  if (name.length < 2) invalidFields.push("name");
  if (!PHONE_PATTERN.test(phone)) invalidFields.push("phone");
  if (city.length < 2) invalidFields.push("city");
  if (address.length < 4) invalidFields.push("address");
  if (invalidFields.length > 0) return { status: "invalid", fields: invalidFields };

  const lines = Array.isArray(input?.lines) ? input.lines.slice(0, MAX_LINES) : [];

  // Prices and names come from the catalogue on the server, never from the browser.
  const items = lines.flatMap((line) => {
    const product = getProduct(String(line?.id));
    const qty = Number(line?.qty);
    const isValid = product?.sizes.includes(line?.size) && Number.isInteger(qty) && qty >= 1 && qty <= MAX_QTY;
    if (!product || !isValid) return [];

    return [
      {
        productId: product.id,
        name: product.name.en,
        color: product.color.en,
        size: line.size,
        qty,
        unitPrice: product.price,
      },
    ];
  });

  if (items.length === 0 || items.length !== lines.length) return { status: "failed" };

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);

  try {
    const orderNumber = insertOrder({ lang, name, phone, city, address, notes, subtotal, items });
    return { status: "done", orderNumber };
  } catch (error) {
    console.error("placeOrder: could not save order", error);
    return { status: "failed" };
  }
}
