import type { Locale } from "./i18n";

export type Garment = "tee" | "hoodie" | "pants" | "cap";
export type Tone = "ink" | "paper" | "ash";
export type Category = "tees" | "hoodies" | "bottoms" | "caps";

export const categories: Category[] = ["tees", "hoodies", "bottoms", "caps"];

export const isCategory = (value: string | null): value is Category =>
  value !== null && (categories as string[]).includes(value);

export type Product = {
  id: string;
  category: Category;
  garment: Garment;
  tone: Tone;
  name: Record<Locale, string>;
  color: Record<Locale, string>;
  price: number;
  sizes: string[];
  isNew?: boolean;
};

const APPAREL_SIZES = ["S", "M", "L", "XL"];
const ONE_SIZE = ["OS"];

// Placeholder catalogue: names, colours, sizes and prices are stand-ins until the real products arrive.
// The order in this list is "newest first".
export const products: Product[] = [
  { id: "heavy-tee-black", category: "tees", garment: "tee", tone: "ink", name: { en: "Heavy Tee", ar: "تيشيرت ثقيل" }, color: { en: "Black", ar: "أسود" }, price: 18, sizes: APPAREL_SIZES, isNew: true },
  { id: "box-hoodie-bone", category: "hoodies", garment: "hoodie", tone: "paper", name: { en: "Box Hoodie", ar: "هودي واسع" }, color: { en: "Bone", ar: "عاجي" }, price: 35, sizes: APPAREL_SIZES, isNew: true },
  { id: "wide-pant-ash", category: "bottoms", garment: "pants", tone: "ash", name: { en: "Wide Pant", ar: "بنطال واسع" }, color: { en: "Ash", ar: "رمادي" }, price: 28, sizes: APPAREL_SIZES },
  { id: "mark-cap-black", category: "caps", garment: "cap", tone: "ink", name: { en: "Mark Cap", ar: "قبعة العلامة" }, color: { en: "Black", ar: "أسود" }, price: 12, sizes: ONE_SIZE, isNew: true },
  { id: "heavy-tee-bone", category: "tees", garment: "tee", tone: "paper", name: { en: "Heavy Tee", ar: "تيشيرت ثقيل" }, color: { en: "Bone", ar: "عاجي" }, price: 18, sizes: APPAREL_SIZES },
  { id: "box-hoodie-black", category: "hoodies", garment: "hoodie", tone: "ink", name: { en: "Box Hoodie", ar: "هودي واسع" }, color: { en: "Black", ar: "أسود" }, price: 35, sizes: APPAREL_SIZES },
  { id: "wide-pant-black", category: "bottoms", garment: "pants", tone: "ink", name: { en: "Wide Pant", ar: "بنطال واسع" }, color: { en: "Black", ar: "أسود" }, price: 28, sizes: APPAREL_SIZES },
  { id: "heavy-tee-ash", category: "tees", garment: "tee", tone: "ash", name: { en: "Heavy Tee", ar: "تيشيرت ثقيل" }, color: { en: "Ash", ar: "رمادي" }, price: 18, sizes: APPAREL_SIZES },
];

export const getProduct = (id: string): Product | undefined =>
  products.find((product) => product.id === id);

export const formatPrice = (price: number) => `$${price}`;
