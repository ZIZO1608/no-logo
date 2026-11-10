export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const INSTAGRAM_URL = "https://www.instagram.com/no_logo__/";
export const INSTAGRAM_HANDLE = "@no_logo__";

const en = {
  dir: "ltr",
  meta: {
    title: "NO LOGO™ — Streetwear",
    description: "NO LOGO streetwear. Order online, confirm on WhatsApp.",
  },
  announce: "Order online — we confirm with you on WhatsApp",
  nav: {
    shop: "Shop",
    drop: "New drop",
    order: "How to order",
    instagram: "Instagram",
    menu: "Menu",
    close: "Close",
    bag: "Bag",
    switchTo: "العربية",
  },
  hero: {
    kicker: "Streetwear — Syria",
    title: "No logo. Just you.",
    cta: "Shop the drop",
  },
  drop: {
    kicker: "Drop 01",
    title: "New drop",
    isNew: "New",
    all: "View all",
  },
  categories: {
    title: "Categories",
    all: "All",
    tees: "Tees",
    hoodies: "Hoodies",
    bottoms: "Bottoms",
    caps: "Caps",
  },
  shop: {
    title: "Shop",
    items: "items",
    sort: "Sort",
    newest: "Newest",
    priceLow: "Price: low to high",
    priceHigh: "Price: high to low",
    empty: "Nothing here yet.",
  },
  product: {
    size: "Size",
    oneSize: "One size",
    pickSize: "Pick a size",
    add: "Add to bag",
    note: "No online payment. We confirm your order with you on WhatsApp.",
    more: "You may also like",
    back: "Back to shop",
  },
  bag: {
    title: "Your bag",
    empty: "Your bag is empty.",
    shop: "Go to shop",
    size: "Size",
    remove: "Remove",
    less: "One less",
    more: "One more",
    subtotal: "Subtotal",
    deliveryNote: "Delivery is agreed with you on WhatsApp.",
    checkout: "Check out",
  },
  checkout: {
    title: "Checkout",
    details: "Your details",
    name: "Full name",
    phone: "Phone (WhatsApp)",
    phoneHint: "We message this number to confirm the order.",
    city: "City",
    address: "Address",
    notes: "Notes (optional)",
    summary: "Order summary",
    place: "Place order",
    placing: "Sending…",
    required: "This field is needed.",
    phoneInvalid: "Enter a valid phone number.",
    failed: "We couldn't save your order. Check your connection and try again.",
    emptyBag: "Your bag is empty, so there is nothing to check out.",
    doneTitle: "Order received",
    doneBody: "We will message you on WhatsApp to confirm it.",
    orderNumber: "Order number",
    keepShopping: "Keep shopping",
  },
  order: {
    title: "How to order",
    steps: [
      { title: "Pick your pieces", body: "Choose the size and add to your bag." },
      { title: "Check out", body: "Name, phone and address. No online payment." },
      { title: "We message you", body: "Our team confirms the order with you on WhatsApp." },
    ],
  },
  instagram: {
    title: "See it worn",
    body: "New pieces land on Instagram first.",
    cta: "Follow",
  },
  footer: {
    rights: "All rights reserved.",
    shop: "Shop",
    info: "Info",
    follow: "Follow",
    city: "Damascus",
    top: "Back to top",
  },
};

export type Dictionary = typeof en;

const ar: Dictionary = {
  dir: "rtl",
  meta: {
    title: "NO LOGO™ — ستريت وير",
    description: "ملابس NO LOGO. اطلب من الموقع وأكّد طلبك عبر واتساب.",
  },
  announce: "اطلب من الموقع — ونأكّد طلبك معك عبر واتساب",
  nav: {
    shop: "المتجر",
    drop: "وصل حديثاً",
    order: "طريقة الطلب",
    instagram: "إنستغرام",
    menu: "القائمة",
    close: "إغلاق",
    bag: "السلة",
    switchTo: "English",
  },
  hero: {
    kicker: "ستريت وير — سوريا",
    title: "بلا شعار. فقط أنت.",
    cta: "تسوّق المجموعة",
  },
  drop: {
    kicker: "المجموعة 01",
    title: "وصل حديثاً",
    isNew: "جديد",
    all: "عرض الكل",
  },
  categories: {
    title: "الأقسام",
    all: "الكل",
    tees: "تيشيرتات",
    hoodies: "هوديات",
    bottoms: "بناطيل",
    caps: "قبعات",
  },
  shop: {
    title: "المتجر",
    items: "قطعة",
    sort: "الترتيب",
    newest: "الأحدث",
    priceLow: "السعر: من الأقل للأعلى",
    priceHigh: "السعر: من الأعلى للأقل",
    empty: "لا توجد قطع هنا بعد.",
  },
  product: {
    size: "المقاس",
    oneSize: "مقاس واحد",
    pickSize: "اختر المقاس",
    add: "أضف إلى السلة",
    note: "بدون دفع إلكتروني. نأكّد طلبك معك عبر واتساب.",
    more: "قد يعجبك أيضاً",
    back: "العودة إلى المتجر",
  },
  bag: {
    title: "سلّتك",
    empty: "سلّتك فارغة.",
    shop: "اذهب إلى المتجر",
    size: "المقاس",
    remove: "حذف",
    less: "إنقاص واحدة",
    more: "زيادة واحدة",
    subtotal: "المجموع",
    deliveryNote: "نتّفق معك على التوصيل عبر واتساب.",
    checkout: "إتمام الطلب",
  },
  checkout: {
    title: "إتمام الطلب",
    details: "بياناتك",
    name: "الاسم الكامل",
    phone: "رقم الهاتف (واتساب)",
    phoneHint: "نراسلك على هذا الرقم لتأكيد الطلب.",
    city: "المدينة",
    address: "العنوان",
    notes: "ملاحظات (اختياري)",
    summary: "ملخّص الطلب",
    place: "أرسل الطلب",
    placing: "جارٍ الإرسال…",
    required: "هذا الحقل مطلوب.",
    phoneInvalid: "أدخل رقم هاتف صحيحاً.",
    failed: "لم نتمكّن من حفظ طلبك. تحقّق من الاتصال وحاول مرة أخرى.",
    emptyBag: "سلّتك فارغة، لا يوجد ما يمكن طلبه.",
    doneTitle: "تم استلام طلبك",
    doneBody: "سنراسلك عبر واتساب لتأكيده.",
    orderNumber: "رقم الطلب",
    keepShopping: "تابع التسوّق",
  },
  order: {
    title: "طريقة الطلب",
    steps: [
      { title: "اختر قطعك", body: "حدّد المقاس وأضف القطعة إلى السلة." },
      { title: "أكمل الطلب", body: "الاسم ورقم الهاتف والعنوان. بدون دفع إلكتروني." },
      { title: "نتواصل معك", body: "فريقنا يأكّد الطلب معك عبر واتساب." },
    ],
  },
  instagram: {
    title: "شاهدها على أرض الواقع",
    body: "القطع الجديدة تنزل على إنستغرام أولاً.",
    cta: "تابعنا",
  },
  footer: {
    rights: "جميع الحقوق محفوظة.",
    shop: "المتجر",
    info: "معلومات",
    follow: "تابعنا",
    city: "دمشق",
    top: "إلى الأعلى",
  },
};

const dictionaries: Record<Locale, Dictionary> = { ar, en };

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];

export const navLinks = (lang: Locale, nav: Dictionary["nav"]) => [
  { href: `/${lang}/shop`, label: nav.shop },
  { href: `/${lang}#drop`, label: nav.drop },
  { href: `/${lang}#order`, label: nav.order },
];
