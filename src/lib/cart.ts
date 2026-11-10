"use client";

import { useSyncExternalStore } from "react";
import { getProduct, type Product } from "./products";

export type CartLine = { id: string; size: string; qty: number };
export type DetailedLine = CartLine & { product: Product };

const STORAGE_KEY = "nologo-bag";
export const MAX_QTY = 10;

const EMPTY: CartLine[] = [];
let lines: CartLine[] = EMPTY;
let isOpen = false;
let hasLoaded = false;
const listeners = new Set<() => void>();

const isValidLine = (line: unknown): line is CartLine => {
  if (typeof line !== "object" || line === null) return false;
  const { id, size, qty } = line as Record<string, unknown>;
  if (typeof id !== "string" || typeof size !== "string" || typeof qty !== "number") return false;
  const product = getProduct(id);
  return Boolean(product?.sizes.includes(size)) && Number.isInteger(qty) && qty >= 1 && qty <= MAX_QTY;
};

const loadOnce = () => {
  if (hasLoaded) return;
  hasLoaded = true;
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (Array.isArray(stored)) lines = stored.filter(isValidLine);
  } catch {
    // Unreadable or blocked storage: start with an empty bag.
  }
};

const emit = () => listeners.forEach((listener) => listener());

const commit = (next: CartLine[]) => {
  lines = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage full or blocked: the bag still works for this visit.
  }
  emit();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getLines = () => {
  loadOnce();
  return lines;
};

const sameLine = (line: CartLine, id: string, size: string) => line.id === id && line.size === size;

export const cart = {
  add(id: string, size: string) {
    const current = getLines();
    const existing = current.find((line) => sameLine(line, id, size));
    const next = existing
      ? current.map((line) =>
          sameLine(line, id, size) ? { ...line, qty: Math.min(line.qty + 1, MAX_QTY) } : line,
        )
      : [...current, { id, size, qty: 1 }];
    commit(next);
  },
  setQty(id: string, size: string, qty: number) {
    const current = getLines();
    const next =
      qty < 1
        ? current.filter((line) => !sameLine(line, id, size))
        : current.map((line) => (sameLine(line, id, size) ? { ...line, qty: Math.min(qty, MAX_QTY) } : line));
    commit(next);
  },
  clear() {
    commit([]);
  },
  open() {
    isOpen = true;
    emit();
  },
  close() {
    isOpen = false;
    emit();
  },
};

export const useCartLines = (): DetailedLine[] => {
  const current = useSyncExternalStore(subscribe, getLines, () => EMPTY);
  return current.flatMap((line) => {
    const product = getProduct(line.id);
    return product ? [{ ...line, product }] : [];
  });
};

export const useBagOpen = () =>
  useSyncExternalStore(
    subscribe,
    () => isOpen,
    () => false,
  );

export const countItems = (detailed: CartLine[]) => detailed.reduce((sum, line) => sum + line.qty, 0);

export const subtotalOf = (detailed: DetailedLine[]) =>
  detailed.reduce((sum, line) => sum + line.qty * line.product.price, 0);
