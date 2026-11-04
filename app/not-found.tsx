import Link from "next/link";
import Display from "@/components/Display";

export default function NotFound() {
  return (
    <section className="missing" data-theme-section="night">
      <Display as="h1" lines={["Sold", <em key="e">out</em>]} />
      <p className="reveal">This page isn&apos;t on the shelf.</p>
      <Link className="btn magnetic reveal" href="/"><span>Back to the bakery</span></Link>
    </section>
  );
}
