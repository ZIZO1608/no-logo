import { LoginForm } from "@/components/admin/LoginForm";
import { LogoBadge } from "@/components/Logo";

export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-4 py-10">
      <LogoBadge className="h-14 w-14" />
      <h1 className="mt-8 text-3xl font-bold leading-tight">لوحة التحكم</h1>
      <p className="mt-2 text-sm leading-6 text-ash">أدخل كلمة المرور لعرض الطلبات.</p>
      <LoginForm />
    </main>
  );
}
