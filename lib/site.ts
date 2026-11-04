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
};

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
  productCardamomSwirl: "/images/product-cardamom-swirl.svg",
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
  { href: "/#night-shift", label: "The night shift" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];
