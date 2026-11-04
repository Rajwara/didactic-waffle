/* ---------- Brand + shop details: edit these to change them everywhere ---------- */
export const site = {
  name: "Didactic Waffle",
  first: "Didactic",
  second: "Waffle",
  tagline: "Baked while you slept",
  description:
    "A neighborhood night bakery. Slow-fermented bread and pastry, out of the oven by morning and gone by afternoon.",
  address: "12 Example Street, Your City",
  hours: "Tuesday to Sunday, 7am until sold out",
  email: "hello@example.com",
  phone: "+1 555 010 0123",
  /* WhatsApp number in international format, digits only (no +, spaces or dashes).
     PLACEHOLDER: replace with your real WhatsApp number. */
  whatsapp: "15550100123",
};

/** WhatsApp chat link, optionally with a ready-written message. */
export const whatsappUrl = (text = `Hi ${site.name}! I'd like to ask about a preorder box.`) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

/* ---------- Images ----------
 * Every image on the site is listed here. When you upload your own photos,
 * drop them in /public/images and change the path below (e.g. ".svg" -> ".jpg").
 */
export const images = {
  hero: "/images/hero.webp",
  aboutBakery: "/images/about-bakery.webp",
  aboutFlour: "/images/about-flour.webp",
  visitShopfront: "/images/visit-shopfront.webp",
  shiftMix: "/images/shift-mix.webp",
  shiftFold: "/images/shift-fold.webp",
  shiftOven: "/images/shift-oven.webp",
  shiftDoors: "/images/shift-doors.webp",
  shiftLastLoaf: "/images/shift-last-loaf.webp",
  productCountryLoaf: "/images/product-country-loaf.webp",
  productBaguette: "/images/product-baguette.webp",
  productSeededRye: "/images/product-seeded-rye.webp",
  productButterCrescent: "/images/product-butter-crescent.webp",
  productCardamomSwirl: "/images/product-cardamom-swirl.webp",
  productLemonTart: "/images/product-lemon-tart.webp",
  productCookie: "/images/product-cookie.webp",
  productMorningCake: "/images/product-morning-cake.webp",
} as const;

/* ---------- Products: edit this list to change the menu ---------- */
export type Category = "bread" | "pastry" | "sweet";
export type Product = {
  id: string;
  name: string;
  note: string;
  price: number;
  cat: Category;
  img: string;
  about: string;
};

export const products: Product[] = [
  { id: "country",  name: "Country loaf",     note: "36-hour sourdough",        price: 9,   cat: "bread",  img: images.productCountryLoaf,    about: "Our daily loaf: flour, water, salt and starter. A dark, crackling crust around a soft, tangy crumb." },
  { id: "baguette", name: "Night baguette",   note: "Thin crust, open crumb",   price: 4.5, cat: "bread",  img: images.productBaguette,       about: "Shaped by hand and baked hard. Best eaten the same day, ideally before you get home." },
  { id: "rye",      name: "Seeded rye",       note: "Fridays only",             price: 10,  cat: "bread",  img: images.productSeededRye,      about: "Dense and deeply savory, packed with sunflower and flax seeds. It slices best on the second day." },
  { id: "butter",   name: "Butter crescent",  note: "27 layers, hand rolled",   price: 5,   cat: "pastry", img: images.productButterCrescent, about: "Laminated over two days with cold butter, then baked until the outer layers shatter." },
  { id: "bun",      name: "Cardamom swirl",   note: "Sticky and fragrant",      price: 5.5, cat: "pastry", img: images.productCardamomSwirl,  about: "A soft, twisted bun with freshly crushed cardamom and a thin coat of sugar glaze." },
  { id: "tart",     name: "Lemon tart",       note: "Sharp, set and glossy",    price: 7,   cat: "sweet",  img: images.productLemonTart,      about: "A bright lemon curd in a crisp, dark-edged pastry shell. Sharp first, sweet after." },
  { id: "cookie",   name: "Dark chip cookie", note: "Salted and underbaked",    price: 3.5, cat: "sweet",  img: images.productCookie,         about: "Thick and soft in the center, with pools of dark chocolate and a pinch of flaky salt." },
  { id: "cake",     name: "Morning cake",     note: "Whole, order a day ahead", price: 32,  cat: "sweet",  img: images.productMorningCake,    about: "A simple layered cake with whipped cream frosting. Serves eight to ten." },
];

export const byId = (id: string | null | undefined) => products.find((p) => p.id === id);
export const money = (n: number) => `$${n.toFixed(2)}`;

export const navLinks = [
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Journal" },
  { href: "/branches", label: "Branches" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

/* ---------- Branches ----------
 * SAMPLE DATA: replace names, addresses, hours, phone numbers and coordinates
 * with your real shops. lat/lng place each pin on the map and power
 * "Use my location"; get them by right-clicking a spot in Google Maps.
 */
export type Branch = {
  id: string;
  name: string;
  area: string;
  address: string;
  hours: string;
  phone: string;
  lat: number;
  lng: number;
  img: string;
  note: string;
};

export const branches: Branch[] = [
  { id: "example-street", name: "The Bakehouse",  area: "Old Town",     address: "12 Example Street, Your City",   hours: "Tue–Sun, 7am until sold out", phone: "+1 555 010 0123", lat: 40.7128, lng: -74.006,  img: images.visitShopfront, note: "Where the ovens are. Watch the night shift through the window." },
  { id: "market-square",  name: "Market Square",  area: "City Centre",  address: "3 Market Square, Your City",     hours: "Tue–Sat, 7:30am until sold out", phone: "+1 555 010 0124", lat: 40.7191, lng: -73.9973, img: images.shiftDoors,     note: "Our busiest counter. Preorder boxes are collected here." },
  { id: "riverside",      name: "Riverside",      area: "Riverside",    address: "48 River Walk, Your City",       hours: "Wed–Sun, 8am until sold out",  phone: "+1 555 010 0125", lat: 40.7069, lng: -74.0154, img: images.shiftLastLoaf,  note: "A small kiosk by the water, with coffee and pastry." },
  { id: "north-station",  name: "North Station",  area: "Northside",    address: "Platform Arcade, North Station", hours: "Mon–Fri, 6:30am until sold out", phone: "+1 555 010 0126", lat: 40.7306, lng: -73.9952, img: images.aboutBakery,    note: "For the early commute: baguettes, crescents and cardamom swirls." },
];

/** Google Maps directions to a branch, from the visitor's location if known. */
export const directionsUrl = (b: Branch, from?: { lat: number; lng: number }) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(b.address)}${from ? `&origin=${from.lat},${from.lng}` : ""}`;
