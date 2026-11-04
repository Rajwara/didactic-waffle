import type { Metadata } from "next";
import Display from "@/components/Display";
import ImageSlot from "@/components/ImageSlot";
import OrderForm from "@/components/OrderForm";
import { images, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Find the bakery, check opening hours and reserve a box.",
};

export default function ContactPage() {
  return (
    <section className="visit" data-theme-section="dawn">
      <div className="visit__info">
        <Display as="h1" lines={["Come", <em key="e">early</em>]} />
        <ImageSlot className="visit__img" wipe src={images.visitShopfront} alt="Neighborhood bakery shopfront at sunrise" width={1600} height={1000} />
        <dl className="visit__list reveal">
          <div><dt>Find us</dt><dd>{site.address}</dd></div>
          <div><dt>Hours</dt><dd>{site.hours}</dd></div>
          <div><dt>Say hello</dt><dd><a href={`mailto:${site.email}`}>{site.email}</a></dd></div>
        </dl>
      </div>
      <OrderForm />
    </section>
  );
}
