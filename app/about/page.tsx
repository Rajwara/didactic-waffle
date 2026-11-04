import type { Metadata } from "next";
import Display from "@/components/Display";
import WordLight from "@/components/WordLight";
import ImageSlot from "@/components/ImageSlot";
import Cta from "@/components/Cta";
import { images } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "Why we bake at night, and why we make fewer things.",
};

const d = (s: string) => ({ "--d": s }) as React.CSSProperties;

export default function AboutPage() {
  return (
    <>
      <section className="page-head" data-theme-section="plum">
        <Display as="h1" lines={["Fewer things,", <em key="e">made slowly</em>]} />
      </section>

      <section className="about" data-theme-section="morning">
        <WordLight text="We make fewer things, and we make them slowly. Long ferments, good flour, real butter, and a rule that nothing leaves the bench until we would eat it ourselves." />
        <div className="about__media">
          <ImageSlot wipe speed={0.08} src={images.aboutBakery} alt="Small bakery kitchen before dawn with a glowing oven" width={2000} height={1125} />
          <ImageSlot wipe speed={-0.08} src={images.aboutFlour} alt="Flour falling from an open hand onto a wooden bench" width={1200} height={1500} />
        </div>
        <dl className="facts">
          <div className="reveal"><dt><span data-count="36">0</span> hrs</dt><dd>Average sourdough ferment</dd></div>
          <div className="reveal" style={d(".1s")}><dt><span data-count="27">0</span></dt><dd>Layers in each croissant</dd></div>
          <div className="reveal" style={d(".2s")}><dt><span data-count="4">0</span></dt><dd>Ingredients in our country loaf</dd></div>
        </dl>
      </section>

      <section className="values" data-theme-section="day">
        <Display className="display--sm" lines={["How we", <em key="e">work</em>]} />
        <div className="values__list">
          <article className="reveal"><span>01</span><h3>Time over additives</h3><p>A long, cold ferment builds flavor and structure, so the recipes can stay short.</p></article>
          <article className="reveal" style={d(".1s")}><span>02</span><h3>A short menu</h3><p>Eight bakes we can make well every day, rather than thirty we can only make quickly.</p></article>
          <article className="reveal" style={d(".2s")}><span>03</span><h3>Sell out, then stop</h3><p>We bake a set amount and close when it&apos;s gone. It keeps waste low and the bread fresh.</p></article>
        </div>
      </section>

      <Cta />
    </>
  );
}
