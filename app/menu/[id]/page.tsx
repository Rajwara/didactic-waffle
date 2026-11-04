import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Display from "@/components/Display";
import ProductDetail from "@/components/ProductDetail";
import ProductGrid from "@/components/ProductGrid";
import Cta from "@/components/Cta";
import { byId, products } from "@/lib/site";

type Params = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = byId((await params).id);
  return p ? { title: p.name, description: p.about } : {};
}

export default async function ProductPage({ params }: Params) {
  const p = byId((await params).id);
  if (!p) notFound();
  const related = products
    .filter((x) => x.id !== p.id && x.cat === p.cat)
    .concat(products.filter((x) => x.cat !== p.cat))
    .slice(0, 4);

  return (
    <>
      <ProductDetail p={p} />
      <section className="shelf shelf--related" data-theme-section="day">
        <div className="shelf__head">
          <Display className="display--sm" lines={["Also on", <em key="e">the shelf</em>]} />
          <Link className="text-link reveal" href="/menu">See the full menu <span aria-hidden="true">→</span></Link>
        </div>
        <ProductGrid items={related} />
      </section>
      <Cta />
    </>
  );
}
