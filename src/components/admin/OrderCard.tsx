import { setOrderStatus } from "@/app/actions/admin";
import { statusLabels, whatsAppUrl } from "@/lib/admin";
import { orderStatuses, type Order } from "@/lib/db";
import { formatPrice } from "@/lib/products";

const dateFormat = new Intl.DateTimeFormat("ar", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Damascus",
  numberingSystem: "latn",
});

// SQLite stores "YYYY-MM-DD HH:MM:SS" in UTC.
const formatDate = (createdAt: string) => dateFormat.format(new Date(`${createdAt.replace(" ", "T")}Z`));

type Props = { order: Order };

export function OrderCard({ order }: Props) {
  return (
    <article className="border border-line bg-coal">
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line px-4 py-3">
        <div className="flex items-baseline gap-3">
          <h2 className="latin text-xl font-black tracking-tight">{order.number}</h2>
          <span className="bg-paper px-2 py-0.5 text-xs font-bold text-ink">{statusLabels[order.status]}</span>
        </div>
        <time className="text-sm text-ash">{formatDate(order.createdAt)}</time>
      </header>

      <div className="grid gap-6 px-4 py-4 md:grid-cols-2">
        <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm leading-6">
          <dt className="text-ash">الاسم</dt>
          <dd className="font-medium">{order.name}</dd>
          <dt className="text-ash">الهاتف</dt>
          <dd dir="ltr" className="latin text-end font-medium tabular-nums">
            {order.phone}
          </dd>
          <dt className="text-ash">المدينة</dt>
          <dd>{order.city}</dd>
          <dt className="text-ash">العنوان</dt>
          <dd className="break-words">{order.address}</dd>
          {order.notes && (
            <>
              <dt className="text-ash">ملاحظات</dt>
              <dd className="break-words">{order.notes}</dd>
            </>
          )}
        </dl>

        <div>
          <ul className="divide-y divide-line text-sm leading-6">
            {order.items.map((item, index) => (
              <li key={index} className="flex items-baseline justify-between gap-3 py-1.5">
                <span dir="ltr" className="latin min-w-0 break-words">
                  {item.name} · {item.color} · {item.size} × {item.qty}
                </span>
                <span className="latin tabular-nums">{formatPrice(item.unitPrice * item.qty)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 flex items-baseline justify-between border-t border-line pt-2 font-bold">
            <span>المجموع</span>
            <span className="latin text-lg tabular-nums">{formatPrice(order.subtotal)}</span>
          </p>
        </div>
      </div>

      <footer className="flex flex-col gap-3 border-t border-line px-4 py-3 md:flex-row md:items-center md:justify-between">
        <a
          href={whatsAppUrl(order)}
          target="_blank"
          rel="noreferrer"
          className="flex h-11 items-center justify-center bg-paper px-6 text-sm font-bold text-ink transition-colors hover:bg-white"
        >
          راسل الزبون على واتساب
        </a>
        <form action={setOrderStatus} className="flex flex-wrap gap-2">
          <input type="hidden" name="id" value={order.id} />
          {orderStatuses
            .filter((status) => status !== order.status)
            .map((status) => (
              <button
                key={status}
                type="submit"
                name="status"
                value={status}
                className="h-11 border border-line px-4 text-sm transition-colors hover:border-paper"
              >
                {statusLabels[status]}
              </button>
            ))}
        </form>
      </footer>
    </article>
  );
}
