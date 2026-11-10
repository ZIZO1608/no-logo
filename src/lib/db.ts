import "server-only";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

// NOLOGO_DATA_DIR lets a production build run against an empty folder, so local test data is never baked into pages.
const DATA_DIR = process.env.NOLOGO_DATA_DIR ?? path.join(process.cwd(), "data");
const FIRST_ORDER_NUMBER = 1000;

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number TEXT UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'delivered', 'cancelled')),
    lang TEXT NOT NULL CHECK (lang IN ('ar', 'en')),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    notes TEXT NOT NULL DEFAULT '',
    subtotal INTEGER NOT NULL CHECK (subtotal >= 0)
  );
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    product_id TEXT NOT NULL,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    size TEXT NOT NULL,
    qty INTEGER NOT NULL CHECK (qty > 0),
    unit_price INTEGER NOT NULL CHECK (unit_price >= 0)
  );
  CREATE INDEX IF NOT EXISTS order_items_order_id ON order_items(order_id);
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`;

// Keep one connection across hot reloads in development.
const globalForDb = globalThis as unknown as { nologoDb?: DatabaseSync };

const getDb = (): DatabaseSync => {
  if (globalForDb.nologoDb) return globalForDb.nologoDb;

  mkdirSync(DATA_DIR, { recursive: true });
  const db = new DatabaseSync(path.join(DATA_DIR, "nologo.db"));
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
  db.exec(SCHEMA);
  globalForDb.nologoDb = db;
  return db;
};

export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

export const readSetting = (key: string): string | null => {
  const row = getDb().prepare("SELECT value FROM settings WHERE key = ?").get(key) as
    | { value: string }
    | undefined;
  return row?.value ?? null;
};

export const writeSetting = (key: string, value: string | null): void => {
  const db = getDb();
  if (value === null) {
    db.prepare("DELETE FROM settings WHERE key = ?").run(key);
    return;
  }
  db.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").run(
    key,
    value,
  );
};

export const orderStatuses =["new", "confirmed", "delivered", "cancelled"] as const;
export type OrderStatus = (typeof orderStatuses)[number];

export const isOrderStatus = (value: unknown): value is OrderStatus =>
  (orderStatuses as readonly unknown[]).includes(value);

export type OrderItem = {
  productId: string;
  name: string;
  color: string;
  size: string;
  qty: number;
  unitPrice: number;
};

export type Order = {
  id: number;
  number: string;
  createdAt: string;
  status: OrderStatus;
  lang: "ar" | "en";
  name: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
  subtotal: number;
  items: OrderItem[];
};

const ORDER_COLUMNS =
  "id, number, created_at AS createdAt, status, lang, name, phone, city, address, notes, subtotal";
const MAX_LISTED_ORDERS = 200;

/** Newest first. Pass a status to show only that group. */
export const listOrders = (status?: OrderStatus): Order[] => {
  const db = getDb();
  const rows = (
    status
      ? db
          .prepare(`SELECT ${ORDER_COLUMNS} FROM orders WHERE status = ? ORDER BY id DESC LIMIT ?`)
          .all(status, MAX_LISTED_ORDERS)
      : db.prepare(`SELECT ${ORDER_COLUMNS} FROM orders ORDER BY id DESC LIMIT ?`).all(MAX_LISTED_ORDERS)
  ) as unknown as Omit<Order, "items">[];

  const selectItems = db.prepare(
    "SELECT product_id AS productId, name, color, size, qty, unit_price AS unitPrice FROM order_items WHERE order_id = ? ORDER BY id",
  );
  return rows.map((row) => ({ ...row, items: selectItems.all(row.id) as unknown as OrderItem[] }));
};

export const countOrdersByStatus = (): Record<OrderStatus, number> => {
  const rows = getDb().prepare("SELECT status, COUNT(*) AS total FROM orders GROUP BY status").all() as unknown as {
    status: OrderStatus;
    total: number;
  }[];
  const counts: Record<OrderStatus, number> = { new: 0, confirmed: 0, delivered: 0, cancelled: 0 };
  for (const row of rows) counts[row.status] = row.total;
  return counts;
};

export const updateOrderStatus = (id: number, status: OrderStatus): void => {
  getDb().prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, id);
};

export type NewOrder = {
  lang: "ar" | "en";
  name: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
  subtotal: number;
  items: { productId: string; name: string; color: string; size: string; qty: number; unitPrice: number }[];
};

/** Saves the order with its items in one transaction and returns the order number, e.g. "NL-1001". */
export const insertOrder = (order: NewOrder): string => {
  const db = getDb();
  db.exec("BEGIN IMMEDIATE");
  try {
    const { lastInsertRowid } = db
      .prepare("INSERT INTO orders (lang, name, phone, city, address, notes, subtotal) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run(order.lang, order.name, order.phone, order.city, order.address, order.notes, order.subtotal);

    const orderId = Number(lastInsertRowid);
    const number = `NL-${FIRST_ORDER_NUMBER + orderId}`;
    db.prepare("UPDATE orders SET number = ? WHERE id = ?").run(number, orderId);

    const insertItem = db.prepare(
      "INSERT INTO order_items (order_id, product_id, name, color, size, qty, unit_price) VALUES (?, ?, ?, ?, ?, ?, ?)",
    );
    for (const item of order.items) {
      insertItem.run(orderId, item.productId, item.name, item.color, item.size, item.qty, item.unitPrice);
    }

    db.exec("COMMIT");
    return number;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
};
