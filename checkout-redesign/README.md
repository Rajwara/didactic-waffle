# DRESSUP.GE checkout redesign: 4 concepts

Open `index.html` in any browser to see all four concepts. No build step or server is needed.

```
checkout-redesign/
├── index.html                      overview page linking all concepts
├── assets/                         shared logos + product placeholder
├── variant-1-single-page/          index.html · style.css · script.js
├── variant-2-step-wizard/          index.html · style.css · script.js
├── variant-3-express-minimal/      index.html · style.css · script.js
└── variant-4-brand-split/          index.html · style.css · script.js
```

Each variant folder is self-contained: its own HTML, CSS and JavaScript (only the logo and product image come from `assets/`).

| # | Concept | Idea |
|---|---------|------|
| 1 | Single Page | Every step visible at once; numbered cards turn green when done; sticky summary |
| 2 | Step Wizard | Address → Delivery → Payment → Review, one screen at a time, with a review step |
| 3 | Express Minimal | Express pay buttons first, editorial serif styling, Shopify-style split summary |
| 4 | Brand Split | Navy brand panel with the order; upgraded version of today's accordion flow |

## Things you can try in every concept
- Change quantity, toggle gift wrapping (+5 ₾), switch to Express delivery (+9 ₾)
- Promo codes: `DRESSUP10` (−10%) and `WELCOME20` (−20 ₾)
- Pay-later options show live instalment amounts
- Georgian phone formatting (5XX XX XX XX) and card number formatting
- Place a test order to see the confirmation screen

## Replace before showing real data
- `assets/product-hoodie.svg` → real product photo (update the `<img src>` in each variant)
- Saved addresses, card and names are sample data
