import Link from "next/link";
import Hero from "@/components/Hero";
import NightShift from "@/components/NightShift";
import ProductGrid from "@/components/ProductGrid";
import Display from "@/components/Display";
import WordLight from "@/components/WordLight";
import ImageSlot from "@/components/ImageSlot";
import Cta from "@/components/Cta";
import { images, products } from "@/lib/site";

const tickerText = "Sourdough ✺ Laminated by hand ✺ Rye on Fridays ✺ No shortcuts ✺ Gone by two ✺ ";

export default function Home() {
  return (
    <>
      <Hero />

      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          <span>{tickerText}</span>
          <span>{tickerText}</span>
        </div>
      </div>

      <NightShift />

      <section className="shelf" data-theme-section="day">
        <div className="shelf__head">
          <Display lines={["Today's", <em key="e">shelf</em>]} />
          <Link className="text-link reveal" href="/menu">See the full menu <span aria-hidden="true">→</span></Link>
        </div>
        <ProductGrid items={products.slice(0, 4)} />
      </section>

      <section className="about" data-theme-section="morning">
        <WordLight text="We make fewer things, and we make them slowly. Long ferments, good flour, real butter, and a rule that nothing leaves the bench until we would eat it ourselves." />
        <ImageSlot className="about__wide" wipe speed={0.08} src={images.aboutBakery} alt="Small bakery kitchen before dawn with a glowing oven" width={2000} height={1125} />
        <Link className="text-link reveal" href="/about">Read our story <span aria-hidden="true">→</span></Link>
      </section>

      <Cta />
    </>
  );
}
