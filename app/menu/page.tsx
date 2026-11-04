import type { Metadata } from "next";
import Display from "@/components/Display";
import MenuGrid from "@/components/MenuGrid";
import Cta from "@/components/Cta";

export const metadata: Metadata = {
  title: "Menu",
  description: "Bread, pastry and sweet things baked fresh each morning.",
};

export default function MenuPage() {
  return (
    <>
      <section className="page-head" data-theme-section="morning">
        <Display as="h1" lines={["Today's", <em key="e">menu</em>]} />
        <p className="page-head__sub reveal" style={{ "--d": ".2s" } as React.CSSProperties}>
          Baked in set amounts and sold until they run out. Add what you like to your box and reserve it for tomorrow.
        </p>
      </section>
      <section className="shelf shelf--page" data-theme-section="day">
        <MenuGrid />
      </section>
      <Cta />
    </>
  );
}
