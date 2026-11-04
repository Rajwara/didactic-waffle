import type { Metadata } from "next";
import Display from "@/components/Display";
import ImageSlot from "@/components/ImageSlot";
import BranchGlobe from "@/components/branches/BranchGlobe";
import BranchLocator from "@/components/branches/BranchLocator";
import Cta from "@/components/Cta";
import { branches, images, site } from "@/lib/site";
import "./branches.css";

export const metadata: Metadata = {
  title: "Branches",
  description: `Find your nearest ${site.name} shop: addresses, opening hours and directions.`,
};

export default function BranchesPage() {
  return (
    <>
      <section className="br-hero" data-theme-section="night">
        <ImageSlot className="br-hero__img" speed={0.12} src={images.visitShopfront} alt="" width={1586} height={992} priority />
        <div className="br-hero__shade" aria-hidden="true" />
        <div className="br-hero__copy">
          <p className="eyebrow eyebrow-dot reveal">{branches.length} shops · one bakehouse</p>
          <Display as="h1" lines={["Our", <em key="e">branches</em>]} />
          <p className="page-head__sub reveal" style={{ "--d": ".2s" } as React.CSSProperties}>
            Everything is baked overnight at the bakehouse and on the shelves of every shop by morning. Come early, or reserve a box the night before.
          </p>
        </div>
      </section>
      <BranchGlobe />
      <BranchLocator />
      <Cta />
    </>
  );
}
