import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "nologo_admin";
const SESSION_HOURS = 12;
const SESSION_MS = SESSION_HOURS * 60 * 60 * 1000;

const sign = (payload: string, secret: string) => createHmac("sha256", secret).update(payload).digest("hex");

const safeEqual = (a: string, b: string) => {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
};

/** True only when both admin settings exist in the environment. */
export const isAdminConfigured = () =>
  Boolean(process.env.ADMIN_PASSWORD) && Boolean(process.env.SESSION_SECRET);

export const isPasswordCorrect = (candidate: string) => {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  // Compare digests so the check takes the same time whatever the input length.
  return safeEqual(sign(candidate, "password-check"), sign(expected, "password-check"));
};

export const startAdminSession = async () => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");

  const expiresAt = String(Date.now() + SESSION_MS);
  (await cookies()).set(COOKIE_NAME, `${expiresAt}.${sign(expiresAt, secret)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: SESSION_MS / 1000,
  });
};

export const endAdminSession = async () => {
  (await cookies()).set(COOKIE_NAME, "", { path: "/admin", maxAge: 0 });
};

export const isAdmin = async (): Promise<boolean> => {
  const secret = process.env.SESSION_SECRET;
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!secret || !token) return false;

  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature) return false;
  if (!safeEqual(signature, sign(expiresAt, secret))) return false;

  return Number(expiresAt) > Date.now();
};

/** Call first in every admin page and admin action. */
export const requireAdmin = async () => {
  if (!(await isAdmin())) redirect("/admin/login");
};
