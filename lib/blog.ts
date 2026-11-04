/**
 * Journal posts. Starter articles written for Didactic Waffle: edit, replace or add freely.
 * Images come from the `images` list in lib/site.ts.
 */
import { images, site } from "./site";

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] }
  | { type: "figure"; image: string; caption: string };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO yyyy-mm-dd
  image: string;
  featured?: boolean;
  body: Block[];
};

export const AUTHOR = {
  name: "The Night Shift",
  bio: `Notes from the bakers at ${site.name}, written somewhere between the last fold and the first customer.`,
};

export const CATEGORIES = ["Bread Basics", "At Home", "Behind the Bench", "Pastry"];

export const POSTS: Post[] = [
  {
    slug: "why-we-bake-at-night",
    title: "Why We Bake at Night",
    excerpt: "Long ferments, cool kitchens and a quiet street: the reasons our day starts when everyone else's ends.",
    category: "Behind the Bench",
    date: "2026-10-30",
    image: images.shiftOven,
    featured: true,
    body: [
      { type: "p", text: "People assume we bake at night because bread should be fresh in the morning. That's true, but it's only half the reason. The other half is that dough behaves better when the world is quiet." },
      { type: "p", text: "Our country loaf is mixed the afternoon before, then left to ferment slowly in the cold. By the time we arrive at three, it has had the better part of a day to build flavor. All we have to do is shape it and give it heat." },
      { type: "h2", text: "A cool kitchen is a calm kitchen" },
      { type: "p", text: "Butter starts to soften at around 15°C. Laminating croissant dough in a warm afternoon kitchen means fighting the clock with every fold. At four in the morning, the bench is cold, the butter stays in its layers, and the crescents bake up with the shattering crust we're after." },
      { type: "quote", text: "“The oven doesn't care what time it is. The dough does.”" },
      { type: "h2", text: "What a night looks like" },
      {
        type: "list",
        items: [
          "03:00 — Doors locked, ovens on, yesterday's dough comes out of the cold.",
          "04:30 — Shaping loaves and rolling pastry while the butter is still firm.",
          "05:45 — Into the stone deck oven with plenty of steam.",
          "07:00 — Shelves full, coffee on, doors open.",
        ],
      },
      { type: "figure", image: images.shiftFold, caption: "Folding laminated dough before dawn, while the bench is still cold." },
      { type: "h2", text: "And then we stop" },
      { type: "p", text: "We bake a set amount every night and close when it sells out. It keeps waste close to zero, and it means everything on the shelf was made a few hours before you bought it." },
    ],
  },
  {
    slug: "how-to-store-a-sourdough-loaf",
    title: "How to Store a Sourdough Loaf",
    excerpt: "Skip the fridge. Here's how to keep a crust crisp and a crumb soft for days, and what to do on day four.",
    category: "At Home",
    date: "2026-10-22",
    image: images.productCountryLoaf,
    body: [
      { type: "p", text: "A naturally leavened loaf keeps far better than most bread, thanks to the acidity built up during a long ferment. Treat it right and it'll be good for three or four days." },
      { type: "h2", text: "Days one and two: cut side down" },
      { type: "p", text: "Leave the loaf on a wooden board, cut side down. The crust protects the crumb, and the board lets it breathe. No bag needed." },
      { type: "h2", text: "Day three: wrap it in cloth" },
      { type: "p", text: "Once the crust starts to soften, wrap the loaf in a linen tea towel or a bread bag. It slows moisture loss without trapping it the way plastic does." },
      { type: "quote", text: "“The fridge is where bread goes to go stale. Freeze it or eat it.”" },
      { type: "h2", text: "Day four and beyond" },
      {
        type: "list",
        items: [
          "Slice the rest of the loaf and freeze it in a sealed bag.",
          "Toast slices straight from frozen, no thawing needed.",
          "Turn stale ends into breadcrumbs, croutons or a panzanella.",
        ],
      },
    ],
  },
  {
    slug: "what-makes-a-crust-dark",
    title: "Why We Bake Our Crusts So Dark",
    excerpt: "That deep mahogany color isn't a mistake. It's where most of the flavor in a loaf comes from.",
    category: "Bread Basics",
    date: "2026-10-14",
    image: images.hero,
    body: [
      { type: "p", text: "Every so often someone asks if a loaf is burnt. It isn't. We take our crusts darker than most bakeries on purpose." },
      { type: "h2", text: "Color is flavor" },
      { type: "p", text: "As the crust heats up, sugars and proteins in the dough react and brown. The longer that reaction runs, the more complex the flavors get: toasty, nutty, a little bitter in a good way, like dark coffee or chocolate." },
      { type: "p", text: "A pale crust tastes of very little. A dark one makes the soft, tangy crumb inside taste brighter by contrast." },
      { type: "h2", text: "Steam does the rest" },
      { type: "p", text: "We load the stone deck with plenty of steam for the first few minutes. It keeps the surface soft so the loaf can rise fully, then lets the crust set thin and crackly instead of thick and tough." },
    ],
  },
  {
    slug: "inside-a-butter-crescent",
    title: "Inside a Butter Crescent: 27 Layers by Hand",
    excerpt: "Two days, one block of cold butter and three folds. A look at how our crescents get their layers.",
    category: "Pastry",
    date: "2026-10-05",
    image: images.productButterCrescent,
    body: [
      { type: "p", text: "Laminated dough is just dough and butter, folded over and over until there are dozens of paper-thin layers of each. In the oven, water in the butter turns to steam and pushes the layers apart." },
      { type: "h2", text: "The folds" },
      {
        type: "list",
        items: [
          "Day one: mix the dough and rest it cold overnight.",
          "Day two: wrap it around a flat sheet of cold butter.",
          "Three letter folds, resting in between, give us 27 butter layers.",
          "Cut, roll and proof, then bake until the outside shatters.",
        ],
      },
      { type: "quote", text: "“If the butter melts into the dough, you've made bread. If it stays in its layers, you've made pastry.”" },
      { type: "figure", image: images.shiftFold, caption: "The second fold, with the butter still cold and pliable." },
    ],
  },
  {
    slug: "meet-our-starter",
    title: "Meet Our Starter, Older Than the Shop",
    excerpt: "Every loaf we bake begins with a jar of flour and water we've fed every single day for years.",
    category: "Bread Basics",
    date: "2026-09-26",
    image: images.shiftMix,
    body: [
      { type: "p", text: "A sourdough starter is a living culture of wild yeast and bacteria. It raises the bread instead of commercial yeast, and it's responsible for the gentle tang in our country loaf." },
      { type: "h2", text: "Feeding time" },
      { type: "p", text: "We feed ours twice a day with flour and water. In return it doubles in size, smells faintly of yogurt and apples, and makes every loaf we sell." },
      { type: "p", text: "When we close the shop for a holiday, someone takes the starter home. It has never missed a feed." },
    ],
  },
  {
    slug: "build-the-perfect-preorder-box",
    title: "How to Build the Perfect Preorder Box",
    excerpt: "A loaf for the week, something flaky for the morning and one sweet thing. Our bakers' favorite combinations.",
    category: "At Home",
    date: "2026-09-18",
    image: images.shiftDoors,
    body: [
      { type: "p", text: "The best things on the shelf go in the first hour, so a box reserved the night before is the surest way to get them. Here's how we'd fill one." },
      { type: "h2", text: "Our favorite boxes" },
      {
        type: "list",
        items: [
          "The weekday: a country loaf, two butter crescents and a dark chip cookie.",
          "The Friday: a seeded rye, a baguette and a lemon tart to share.",
          "The weekend: a morning cake, ordered a day ahead, and a cardamom swirl for the baker.",
        ],
      },
      { type: "p", text: "Add what you like to your box on the menu, then send it to us from the preorder form by 6pm. We'll set it aside until noon the next day." },
    ],
  },
];

const WORDS_PER_MINUTE = 200;
export function readTime(p: Post) {
  const text = p.body.map((b) => ("text" in b ? b.text : "items" in b ? b.items.join(" ") : b.caption)).join(" ");
  return Math.max(2, Math.round(text.split(/\s+/).length / WORDS_PER_MINUTE) + 1);
}

export const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);
