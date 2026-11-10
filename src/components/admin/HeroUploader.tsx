"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { HeroMedia } from "@/lib/hero";
import { HeroVideo } from "../HeroVideo";

const UPLOAD_URL = "/admin/hero/upload";

const errorMessages: Record<string, string> = {
  tooLarge: "الملف كبير جداً. الحد الأقصى: 8 ميغابايت للصورة و60 ميغابايت للفيديو.",
  badType: "نوع الملف غير مدعوم. استخدم JPG أو PNG أو WebP للصور، و MP4 أو WebM للفيديو.",
  missing: "اختر ملفاً أولاً.",
  unauthorized: "انتهت الجلسة. سجّل الدخول من جديد.",
  forbidden: "تعذّر تنفيذ الطلب من هذه الصفحة.",
};
const FALLBACK_ERROR = "تعذّر حفظ الملف. تحقّق من الاتصال وحاول مرة أخرى.";

type Props = { current: HeroMedia | null };

export function HeroUploader({ current }: Props) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<"upload" | "remove" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const send = async (action: "upload" | "remove", init: RequestInit) => {
    setBusy(action);
    setError(null);
    try {
      const response = await fetch(UPLOAD_URL, init);
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(errorMessages[body?.error ?? ""] ?? FALLBACK_ERROR);
        return;
      }
      if (fileInput.current) fileInput.current.value = "";
      router.refresh();
    } catch {
      setError(FALLBACK_ERROR);
    } finally {
      setBusy(null);
    }
  };

  const upload = (file: File | undefined) => {
    if (!file) return;
    const body = new FormData();
    body.set("file", file);
    void send("upload", { method: "POST", body });
  };

  const source = current ? `/media/${current.file}` : null;

  return (
    <div className="mt-6 grid gap-6 md:grid-cols-2">
      <div className="flex aspect-video items-center justify-center overflow-hidden border border-line bg-coal">
        {current && source ? (
          current.kind === "video" ? (
            <HeroVideo src={source} className="h-full w-full object-cover" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- uploaded at runtime, served from /media
            <img src={source} alt="" className="h-full w-full object-cover" />
          )
        ) : (
          <p className="px-6 text-center text-sm leading-6 text-ash">
            لا توجد صورة أو فيديو بعد. الموقع يعرض الشعار الدوّار حالياً.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <label className="block">
          <span className="text-sm text-ash">اختر فيديو أو صورة للواجهة</span>
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
            disabled={busy !== null}
            onChange={(event) => upload(event.target.files?.[0])}
            className="mt-2 block w-full border border-line bg-coal text-sm file:me-4 file:h-12 file:cursor-pointer file:border-0 file:bg-paper file:px-5 file:text-sm file:font-bold file:text-ink disabled:opacity-60"
          />
        </label>

        <ul className="list-disc space-y-1 ps-5 text-sm leading-6 text-ash">
          <li>الفيديو: MP4 أو WebM، حتى 60 ميغابايت. يُعرض بلا صوت ويتكرّر تلقائياً.</li>
          <li>الصورة: JPG أو PNG أو WebP، حتى 8 ميغابايت.</li>
          <li>الأفضل مقاس عريض للحاسوب يبقى موضوعه في الوسط ليظهر جيداً على الهاتف.</li>
        </ul>

        {busy === "upload" && <p role="status">جارٍ رفع الملف…</p>}
        {error && (
          <p role="alert" className="border border-paper px-4 py-3 text-sm leading-6">
            {error}
          </p>
        )}

        {current && (
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => void send("remove", { method: "DELETE" })}
            className="h-11 self-start border border-line px-4 text-sm transition-colors hover:border-paper disabled:opacity-60"
          >
            {busy === "remove" ? "جارٍ الحذف…" : "احذف واعرض الشعار الدوّار"}
          </button>
        )}
      </div>
    </div>
  );
}
