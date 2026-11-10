import Link from "next/link";
import { Suspense } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OrderCard } from "@/components/admin/OrderCard";
import { BrandLoader } from "@/components/Motion";
import { statusLabels } from "@/lib/admin";
import { requireAdmin } from "@/lib/admin-auth";
import { countOrdersByStatus, isOrderStatus, listOrders, orderStatuses } from "@/lib/db";

// Reads the session and live orders on every request.
export const instant = false;

export default function AdminPage({ searchParams }: PageProps<"/admin">) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:py-10">
      <AdminHeader active="orders" />

      <Suspense fallback={<BrandLoader label="جارٍ تحميل الطلبات" />}>
        <Orders searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Orders({ searchParams }: Pick<PageProps<"/admin">, "searchParams">) {
  await requireAdmin();

  const { status } = await searchParams;
  const activeStatus = isOrderStatus(status) ? status : undefined;
  const orders = listOrders(activeStatus);
  const counts = countOrdersByStatus();
  const total = orderStatuses.reduce((sum, key) => sum + counts[key], 0);

  const tabs = [
    { href: "/admin", label: "الكل", count: total, isActive: !activeStatus },
    ...orderStatuses.map((key) => ({
      href: `/admin?status=${key}`,
      label: statusLabels[key],
      count: counts[key],
      isActive: activeStatus === key,
    })),
  ];

  return (
    <>
      <nav className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex h-10 shrink-0 items-center gap-2 border px-4 text-sm transition-colors ${
              tab.isActive ? "border-paper bg-paper font-bold text-ink" : "border-line hover:border-paper"
            }`}
          >
            {tab.label}
            <span className="latin tabular-nums opacity-70">{tab.count}</span>
          </Link>
        ))}
      </nav>

      {orders.length === 0 ? (
        <p className="py-24 text-center text-ash">لا توجد طلبات هنا.</p>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </>
  );
}
