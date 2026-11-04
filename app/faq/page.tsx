import type { Metadata } from "next";
import Link from "next/link";
import Display from "@/components/Display";
import Cta from "@/components/Cta";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about preorders, storing bread and catering.",
};

export default function FaqPage() {
  return (
    <>
      <section className="faq" data-theme-section="day">
        <Display as="h1" lines={["Good to", <em key="e">know</em>]} />
        <div className="faq__list">
          <details className="reveal" open>
            <summary>Can I reserve bread for tomorrow?</summary>
            <p>Yes. Fill in the <Link href="/contact#orderForm">preorder form</Link> by 6pm and we&apos;ll set your box aside until noon the next day.</p>
          </details>
          <details className="reveal"><summary>Do you make anything without gluten?</summary><p>We bake with wheat flour all night, so we can&apos;t promise anything is free from it.</p></details>
          <details className="reveal"><summary>How should I store a loaf?</summary><p>Cut side down on a board for two days. After that, slice it, freeze it and toast it straight from the freezer.</p></details>
          <details className="reveal"><summary>Do you cater events?</summary><p>For breakfasts and small gatherings, yes. Give us at least three days&apos; notice so we can plan the extra dough.</p></details>
          <details className="reveal"><summary>When does the rye come out?</summary><p>Seeded rye is baked on Fridays only. It usually sells out first, so we recommend reserving one.</p></details>
        </div>
      </section>
      <Cta />
    </>
  );
}
