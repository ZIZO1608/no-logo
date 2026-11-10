import type { Order, OrderStatus } from "./db";
import { formatPrice, getProduct } from "./products";

export const statusLabels: Record<OrderStatus, string> = {
  new: "جديد",
  confirmed: "مؤكَّد",
  delivered: "تم التسليم",
  cancelled: "ملغى",
};

const SYRIA_COUNTRY_CODE = "963";

/** Turns a stored phone into the digits-only international form WhatsApp links need. */
export const toWhatsAppNumber = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  if (phone.startsWith("+")) return digits;
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0")) return SYRIA_COUNTRY_CODE + digits.slice(1);
  return digits;
};

const orderMessage = (order: Order) => {
  const isArabic = order.lang === "ar";

  const itemLines = order.items.map((item) => {
    const product = getProduct(item.productId);
    const name = product?.name[order.lang] ?? item.name;
    const color = product?.color[order.lang] ?? item.color;
    return `• ${name} (${color}) — ${item.size} × ${item.qty}`;
  });

  const lines = isArabic
    ? [
        `مرحباً ${order.name}، معك فريق NO LOGO.`,
        `وصلنا طلبك رقم ${order.number}:`,
        ...itemLines,
        `المجموع: ${formatPrice(order.subtotal)}`,
        `التوصيل إلى: ${order.city}، ${order.address}`,
        "هل نأكّد الطلب؟",
      ]
    : [
        `Hi ${order.name}, this is the NO LOGO team.`,
        `We received your order ${order.number}:`,
        ...itemLines,
        `Total: ${formatPrice(order.subtotal)}`,
        `Delivery to: ${order.city}, ${order.address}`,
        "Shall we confirm it?",
      ];

  return lines.join("\n");
};

/** Opens a WhatsApp chat with the customer, with the order already written in the message. */
export const whatsAppUrl = (order: Order) =>
  `https://wa.me/${toWhatsAppNumber(order.phone)}?text=${encodeURIComponent(orderMessage(order))}`;
