import Link from "next/link";
import { logout } from "@/app/actions/admin";
import { LogoBadge } from "../Logo";

const sections = [
  { key: "orders", href: "/admin", label: "الطلبات" },
  { key: "hero", href: "/admin/hero", label: "واجهة الموقع" },
] as const;

type Props = { active: (typeof sections)[number]["key"] };

export function AdminHeader({ active }: Props) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-line pb-4">
      <div className="flex items-center gap-4">
        <LogoBadge className="h-10 w-10 shrink-0" />
        <nav className="flex gap-1">
          {sections.map((section) => (
            <Link
              key={section.key}
              href={section.href}
              aria-current={section.key === active ? "page" : undefined}
              className={`px-3 py-2 text-base transition-colors ${
                section.key === active ? "bg-paper font-bold text-ink" : "text-ash hover:text-paper"
              }`}
            >
              {section.label}
            </Link>
          ))}
        </nav>
      </div>
      <form action={logout}>
        <button
          type="submit"
          className="px-2 py-3 text-sm text-ash underline underline-offset-4 hover:text-paper"
        >
          تسجيل الخروج
        </button>
      </form>
    </header>
  );
}
