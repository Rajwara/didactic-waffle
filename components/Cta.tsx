import Link from "next/link";
import Display from "./Display";

export default function Cta() {
  return (
    <section className="cta" data-theme-section="dawn">
      <span className="cta__sun" aria-hidden="true" />
      <Display lines={["Come", <em key="e">early</em>]} />
      <div className="cta__side reveal">
        <p>The best of the shelf goes in the first hour. Reserve a box the night before and we&apos;ll set it aside for you.</p>
        <Link className="btn magnetic" href="/contact"><span>Plan your visit</span></Link>
      </div>
    </section>
  );
}
