import { Suspense } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { HeroUploader } from "@/components/admin/HeroUploader";
import { BrandLoader } from "@/components/Motion";
import { requireAdmin } from "@/lib/admin-auth";
import { readSetting } from "@/lib/db";
import { HERO_SETTING, parseHeroMedia } from "@/lib/hero";

// Reads the session and the current setting on every request.
export const instant = false;

export default function AdminHeroPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:py-10">
      <AdminHeader active="hero" />
      <h1 className="mt-6 text-2xl font-bold leading-tight">واجهة الصفحة الرئيسية</h1>
      <p className="mt-1 text-sm leading-6 text-ash">
        الفيديو أو الصورة الكبيرة التي تظهر أول ما يفتح الزبون الموقع.
      </p>
      <Suspense fallback={<BrandLoader label="جارٍ التحميل" />}>
        <CurrentHero />
      </Suspense>
    </div>
  );
}

async function CurrentHero() {
  await requireAdmin();
  // Read straight from the database so the admin always sees the latest upload.
  return <HeroUploader current={parseHeroMedia(readSetting(HERO_SETTING))} />;
}
