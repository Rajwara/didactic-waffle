import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Display from "@/components/Display";
import ImageSlot from "@/components/ImageSlot";
import PillButton from "@/components/PillButton";
import PostCard, { Avatar } from "@/components/blog/PostCard";
import ReadingProgress from "@/components/blog/ReadingProgress";
import { AUTHOR, POSTS, formatDate, getPost, readTime, type Block } from "@/lib/blog";
import "../blog.css";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPost((await params).slug);
  return p ? { title: p.title, description: p.excerpt } : {};
}

function Content({ block }: { block: Block }) {
  switch (block.type) {
    case "p": return <p className="reveal">{block.text}</p>;
    case "h2": return <h2 className="reveal">{block.text}</h2>;
    case "quote": return <blockquote className="reveal">{block.text}</blockquote>;
    case "list": return <ul className="reveal">{block.items.map((i) => <li key={i}>{i}</li>)}</ul>;
    case "figure":
      return (
        <figure className="jr-figure">
          <ImageSlot className="jr-figure__img" wipe src={block.image} alt={block.caption} width={1600} height={900} />
          <figcaption>{block.caption}</figcaption>
        </figure>
      );
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const related = POSTS.filter((p) => p.slug !== post.slug)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category) || b.date.localeCompare(a.date))
    .slice(0, 3)
    .map((p) => ({ slug: p.slug, title: p.title, excerpt: p.excerpt, category: p.category, date: formatDate(p.date), readTime: readTime(p), image: p.image }));

  // Split long titles into two masked lines
  const words = post.title.split(" ");
  const cut = Math.ceil(words.length / 2);
  const lines = [words.slice(0, cut).join(" "), <em key="e">{words.slice(cut).join(" ")}</em>];

  return (
    <>
      <ReadingProgress />
      <section className="page-head jr-post-head" data-theme-section="plum">
        <p className="crumbs reveal"><Link href="/blog">Journal</Link> / {post.category}</p>
        <Display as="h1" className="display--sm" lines={lines} />
        <p className="jr-post-meta reveal" style={{ "--d": ".2s" } as React.CSSProperties}>
          {AUTHOR.name} · {formatDate(post.date)} · {readTime(post)} min read
        </p>
      </section>

      <section className="jr-section jr-article-wrap" data-theme-section="day">
        <ImageSlot className="jr-post-hero" wipe speed={0.06} src={post.image} alt="" width={1600} height={686} priority />
        <article className="jr-article" id="article">
          {post.body.map((b, i) => <Content key={i} block={b} />)}

          <aside className="jr-author-card reveal" aria-label="About the author">
            <Avatar large />
            <div className="jr-author-card__info">
              <span className="jr-eyebrow">Written by</span>
              <h2>{AUTHOR.name}</h2>
              <p>{AUTHOR.bio}</p>
            </div>
            <dl className="jr-author-card__stats">
              <div><dd>{formatDate(post.date)}</dd><dt>Published</dt></div>
              <div><dd>{readTime(post)} min</dd><dt>Read</dt></div>
            </dl>
          </aside>
          <div className="jr-back reveal"><PillButton href="/blog">All stories</PillButton></div>
        </article>
      </section>

      <section className="jr-section jr-related" data-theme-section="morning">
        <div className="shelf__head">
          <Display className="display--sm" lines={["Keep", <em key="e">reading</em>]} />
          <Link className="text-link reveal" href="/blog">All stories <span aria-hidden="true">→</span></Link>
        </div>
        <div className="jr-grid">
          {related.map((p, i) => <PostCard key={p.slug} post={p} author={AUTHOR.name} index={i} />)}
        </div>
      </section>
    </>
  );
}
