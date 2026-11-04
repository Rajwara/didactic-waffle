/**
 * Policy pages. DRAFTS written for Didactic Waffle: check every time, fee and
 * condition against how the business really works, fill in the [brackets],
 * and have them reviewed before launch. The page layout reads from here.
 */
import { site } from "./site";

export type PolicyBlock = string | { list: string[] };
export type PolicySection = { id: string; title: string; body: PolicyBlock[] };
export type PolicyIcon = "box" | "clock" | "truck" | "store" | "shield" | "lock" | "user" | "wheat" | "card";
export type Policy = {
  slug: string;
  tab: string;
  title: string;
  intro: string;
  updated: string; // ISO date
  theme: "night" | "plum" | "dawn" | "morning";
  points: { icon: PolicyIcon; title: string; text: string }[];
  sections: PolicySection[];
};

const CONTACT = `${site.email} or WhatsApp on ${site.phone}`;

export const POLICIES: Policy[] = [
  {
    slug: "shipping",
    tab: "Pickup & Delivery",
    title: "Pickup & Delivery",
    intro: "Everything we sell is baked the night before, so here is how to get it while it's still at its best: collected from a shop, or brought to your door.",
    updated: "2026-11-04",
    theme: "dawn",
    points: [
      { icon: "box", title: "Reserve by 6pm", text: "Preorder boxes sent before 6pm are baked overnight and ready from 7am." },
      { icon: "store", title: "Free pickup", text: "Collect from any of our shops. We hold your box until noon." },
      { icon: "truck", title: "Local delivery", text: "Same-morning delivery within [3 km] of the bakehouse, Tuesday to Sunday." },
    ],
    sections: [
      {
        id: "preorders",
        title: "Preorder boxes",
        body: [
          "Build a box on the menu, then send it to us from the preorder form. Orders received by 6pm are baked that night and ready the next morning.",
          "Whole cakes need at least one full day's notice. For large orders and events, please give us three days so we can plan the extra dough.",
        ],
      },
      {
        id: "pickup",
        title: "Collecting from a shop",
        body: [
          "Pickup is free. Your box is ready from opening time and we hold it until noon. After that it goes back on the shelf, so let us know if you're running late.",
          { list: ["Bring your name or order confirmation.", "Boxes are packed in paper and card, so bring a bag if you're cycling.", "Someone else can collect for you: just tell us their name."] },
        ],
      },
      {
        id: "delivery",
        title: "Local delivery",
        body: [
          "We deliver within [3 km] of the bakehouse between [7am and 10am], Tuesday to Sunday. Delivery costs [$4.00], free on boxes over [$40].",
          "We'll message you when your box leaves the shop. If nobody is home, we'll leave it somewhere safe that you choose when ordering.",
        ],
      },
      {
        id: "freshness",
        title: "Freshness and storage",
        body: [
          "Our bread contains no preservatives. It's best on the day, good for three or four days, and freezes perfectly. See our journal for storage tips.",
        ],
      },
      {
        id: "changes",
        title: "Changes and cancellations",
        body: [
          `To change or cancel a preorder, contact us at ${CONTACT} before 6pm the day before. After that the dough is already mixed, so we may not be able to refund the order.`,
        ],
      },
    ],
  },
  {
    slug: "privacy",
    tab: "Privacy",
    title: "Privacy Policy",
    intro: "We collect as little about you as we can, use it only to bake and hand over your order, and never sell it.",
    updated: "2026-11-04",
    theme: "night",
    points: [
      { icon: "lock", title: "Only what we need", text: "Your name, email and order, so we can set your box aside." },
      { icon: "shield", title: "Never sold", text: "We don't sell your details or share them for anyone else's advertising." },
      { icon: "user", title: "You're in control", text: "Ask us any time to see, correct or delete what we hold." },
    ],
    sections: [
      {
        id: "who-we-are",
        title: "Who we are",
        body: [`${site.name} ([legal business name]) runs this website and our shops at ${site.address}. You can reach us at ${CONTACT}.`],
      },
      {
        id: "what-we-collect",
        title: "What we collect",
        body: [
          { list: [
            "Details you give us: your name, email, phone number and order when you use the preorder form, WhatsApp or email.",
            "Delivery details: your address and any instructions, only if you choose delivery.",
            "Basic technical data: pages visited and device type, collected by our hosting provider to keep the site running.",
          ] },
        ],
      },
      {
        id: "how-we-use-it",
        title: "How we use it",
        body: [
          "To bake, set aside and hand over or deliver your order, to answer your messages, and to tell you about a problem with an order.",
          "We only send news or offers if you've asked us to, and every message includes a way to stop them.",
        ],
      },
      {
        id: "sharing",
        title: "Who we share it with",
        body: [
          "Only the services that help us run the bakery, such as our website host, email provider and [payment provider], and only what they need to do their job. We may also share information if the law requires it.",
        ],
      },
      {
        id: "storage",
        title: "Cookies and local storage",
        body: [
          "We don't use advertising cookies. Your browser stores the contents of your box and whether you've seen the intro animation, so they're remembered between pages. This stays on your device and you can clear it at any time.",
        ],
      },
      {
        id: "your-rights",
        title: "Your rights",
        body: [
          `You can ask to see, correct, export or delete the personal information we hold about you. Write to ${site.email} and we'll reply within [30 days].`,
        ],
      },
      {
        id: "changes",
        title: "Changes to this policy",
        body: ["If we change how we use your information, we'll update this page and the date at the top."],
      },
    ],
  },
  {
    slug: "terms",
    tab: "Terms",
    title: "Terms & Conditions",
    intro: "The simple rules for ordering from us, in plain language. By placing an order you agree to them.",
    updated: "2026-11-04",
    theme: "plum",
    points: [
      { icon: "wheat", title: "Baked to order", text: "Preorders are baked overnight in set amounts, just for you." },
      { icon: "card", title: "Clear prices", text: "Prices on the menu include [tax] and are confirmed before you pay." },
      { icon: "shield", title: "Your rights protected", text: "Nothing here affects your statutory rights as a consumer." },
    ],
    sections: [
      {
        id: "about",
        title: "About these terms",
        body: [`These terms apply to orders placed with ${site.name} on this website, by email, on WhatsApp or in our shops.`],
      },
      {
        id: "orders",
        title: "Placing an order",
        body: [
          "Sending the preorder form is a request, not a confirmed order. Your order is confirmed when we reply to you. We bake in set amounts, so occasionally we may not be able to fill an order in full; if so, we'll tell you before the morning.",
        ],
      },
      {
        id: "prices",
        title: "Prices and payment",
        body: [
          "Prices are shown on the menu and may change from time to time. You pay [on collection / when ordering] by [card or cash].",
        ],
      },
      {
        id: "allergens",
        title: "Allergens",
        body: [
          "Our kitchen handles wheat, gluten, dairy, eggs, nuts, seeds and sesame every night. We can't guarantee any product is free from them. Please ask us about ingredients before you order if you have an allergy.",
        ],
      },
      {
        id: "problems",
        title: "If something isn't right",
        body: [
          `If an item is missing, damaged or not what you ordered, tell us the same day at ${CONTACT} and we'll replace it or refund it.`,
        ],
      },
      {
        id: "liability",
        title: "Our responsibility",
        body: [
          "We're responsible for losses that are a foreseeable result of us breaking these terms. We're not responsible for losses we couldn't have foreseen, or for delays caused by events outside our control.",
        ],
      },
      {
        id: "law",
        title: "Governing law",
        body: ["These terms are governed by the laws of [your country/state]."],
      },
    ],
  },
];

export const getPolicy = (slug: string) => POLICIES.find((p) => p.slug === slug);
