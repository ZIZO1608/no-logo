"use server";

import { refresh } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  endAdminSession,
  isAdminConfigured,
  isPasswordCorrect,
  requireAdmin,
  startAdminSession,
} from "@/lib/admin-auth";
import { isOrderStatus, updateOrderStatus } from "@/lib/db";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

// Failed logins per visitor address. In memory is enough for one server process.
const failedLogins = new Map<string, { count: number; resetAt: number }>();

const visitorKey = async () => {
  const forwardedFor = (await headers()).get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "local";
};

const isLockedOut = (key: string) => {
  const entry = failedLogins.get(key);
  if (!entry) return false;
  if (entry.resetAt < Date.now()) {
    failedLogins.delete(key);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
};

const recordFailure = (key: string) => {
  const entry = failedLogins.get(key);
  if (entry && entry.resetAt >= Date.now()) entry.count += 1;
  else failedLogins.set(key, { count: 1, resetAt: Date.now() + WINDOW_MS });
};

export type LoginState = { error: "wrong" | "locked" | "notConfigured" } | null;

export async function login(_previous: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAdminConfigured()) return { error: "notConfigured" };

  const key = await visitorKey();
  if (isLockedOut(key)) return { error: "locked" };

  const password = String(formData.get("password") ?? "");
  if (!isPasswordCorrect(password)) {
    recordFailure(key);
    return { error: "wrong" };
  }

  failedLogins.delete(key);
  await startAdminSession();
  redirect("/admin");
}

export async function logout() {
  await endAdminSession();
  redirect("/admin/login");
}

export async function setOrderStatus(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const status = formData.get("status");
  if (!Number.isInteger(id) || id < 1 || !isOrderStatus(status)) return;

  updateOrderStatus(id, status);
  refresh();
}
