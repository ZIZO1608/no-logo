"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/actions/admin";

const errorMessages: Record<NonNullable<LoginState>["error"], string> = {
  wrong: "كلمة المرور غير صحيحة.",
  locked: "محاولات كثيرة. انتظر ربع ساعة ثم حاول مرة أخرى.",
  notConfigured: "لوحة التحكم غير مفعّلة: أضف ADMIN_PASSWORD و SESSION_SECRET إلى إعدادات الخادم.",
};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-4">
      <label className="block">
        <span className="label text-ash">كلمة المرور</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          dir="ltr"
          className="mt-2 block w-full border border-line bg-coal px-4 py-3 text-base text-paper outline-none focus:border-paper"
        />
      </label>
      {state && (
        <p role="alert" className="border border-paper px-4 py-3 text-sm leading-6">
          {errorMessages[state.error]}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="label flex h-12 items-center justify-center bg-paper text-ink transition-colors hover:bg-white disabled:opacity-60"
      >
        {isPending ? "جارٍ الدخول…" : "دخول"}
      </button>
    </form>
  );
}
