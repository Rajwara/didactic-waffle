# Didactic Waffle

A night-bakery website built with **Next.js (App Router) + TypeScript**. As you scroll, the page moves from night to day.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production
```

## Pages

| Route          | Page                                   |
| -------------- | -------------------------------------- |
| `/`            | Home (hero, night shift timeline, shelf, about, CTA) |
| `/menu`        | Full menu with filters                 |
| `/menu/[id]`   | Product details (pre-rendered for every product) |
| `/about`       | About, with counters and parallax      |
| `/faq`         | FAQ                                    |
| `/contact`     | Visit info and preorder form           |
| any other URL  | "Sold out" 404 page                    |

## Where to edit things

- **Business name, address, hours, email, products, prices:** `lib/site.ts`
- **Colors:** the palette tokens at the top of `app/globals.css`
- **Loader:** `components/Loader.tsx` (shown once per browser session, skipped for reduced-motion users)
- **Preorder form:** `components/OrderForm.tsx`. It's front-end only right now, so connect it to your form service in `onSubmit`.

## Replacing the placeholder images

1. Generate each image with `docs/Image-Prompts.pdf`.
2. Put the files in `public/images/`.
3. In `lib/site.ts`, change each path in the `images` object (e.g. `hero.svg` → `hero.jpg`). Every page reads from there.

## Palette

| Color         | Hex       | Used for |
| ------------- | --------- | -------- |
| Night indigo  | `#14173a` | Night background, loader, footer |
| Deep plum     | `#3b1d52` | Plum background |
| Dawn coral    | `#f2704d` | Dawn background, sun on Morning and Day |
| Butter yellow | `#f7cf6b` | Morning background, Night accent, page transition |
| Warm cream    | `#fbf4e4` | Day background, form, box drawer |
| Soft cream    | `#f7eedc` | Text on Night and Plum |
| Dark ink      | `#1b1430` | Text on Dawn, Morning, Day; dark buttons |
| Bright orange | `#ff8a5c` | Plum accent and sun |
| Brick red     | `#c93c25` | Day accent, Add to box, form errors |
| White         | `#ffffff` | Text on red buttons, form fields |

## Motion

- **Loader:** a waffle grid fills cell by cell, the name rises letter by letter, and a 03:00 → 07:00 clock and progress bar run alongside. The panel then lifts away over a butter-yellow layer.
- **Scroll:** theme changes per section, masked headline reveals, fade-up reveals, a pinned night-shift timeline with a sun on an arc, word-by-word light-up, parallax images with a curtain wipe, counters, a progress bar, and a ticker that leans with scroll speed.
- **Hover:** magnetic buttons with a fill sweep, 3D card tilt with glare, a custom "View" cursor on images, a spinning logo waffle, and bouncing footer letters.
- **Page transitions:** a butter-yellow wipe between routes.
- All motion respects `prefers-reduced-motion`.
