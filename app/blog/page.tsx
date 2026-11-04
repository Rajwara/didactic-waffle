import type { Metadata } from "next";
import Link from "next/link";
import Display from "@/components/Display";
import ImageSlot from "@/components/ImageSlot";
import PillButton from "@/components/PillButton";
import BlogList from "@/components/blog/BlogList";
import { Avatar, type PostSummary } from "@/components/blog/PostCard";
import { AUTHOR, CATEGORIES, POSTS, formatDate, readTime, type Post } from "@/lib/blog";
import "./blog.css";

export const metadata: Metadata = {
  title: "Journal",
  description: "Bread basics, pastry notes and stories from the night shift.",
};

const summary = (p: Post): PostSummary => ({
  slug: p.slug, title: p.title, excerpt: p.excerpt, category: p.category,
  date: formatDate(p.date), readTime: readTime(p), image: p.image,
});

export default function BlogPage() {
  const sorted = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
  const featured = sorted.find((p) => p.featured) ?? sorted[0];
  const rest = sorted.filter((p) => p !== featured).map(summary);
  const used = CATEGORIES.filter((c) => rest.some((p) => p.category === c));
  const f = summary(featured);

  return (
    <>
      <section className="page-head jr-head" data-theme-section="morning">
        <span className="eyebrow reveal">From the bench</span>
        <Display as="h1" lines={["The night", <em key="e">journal</em>]} />
        <p className="page-head__sub reveal" style={{ "--d": ".2s" } as React.CSSProperties}>
          Bread basics, pastry notes and stories from the night shift, written between the last fold and the first customer.
        </p>
      </section>

      <section className="jr-section" data-theme-section="day">
        <article className="jr-featured reveal">
          <Link className="jr-featured__media" href={`/blog/${f.slug}`} tabIndex={-1} aria-hidden="true">
            <ImageSlot src={f.image} alt="" width={1448} height={1086} priority />
            <span className="jr-tag jr-tag--badge">Featured</span>
          </Link>
          <div className="jr-featured__body">
            <span className="jr-eyebrow">{f.category}</span>
            <h2><Link href={`/blog/${f.slug}`}>{f.title}</Link></h2>
            <p>{f.excerpt}</p>
            <div className="jr-featured__foot">
              <div className="jr-author">
                <Avatar large />
                <div><b>{AUTHOR.name}</b><small>{f.date} · {f.readTime} min read</small></div>
              </div>
              <PillButton href={`/blog/${f.slug}`}>Read the story</PillButton>
            </div>
          </div>
        </article>

        <div className="jr-list">
          <BlogList posts={rest} categories={used} author={AUTHOR.name} />
        </div>
      </section>
    </>
  );
}
