import Link from "next/link";
import ImageSlot from "../ImageSlot";

export type PostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: number;
  image: string;
};

export function Avatar({ large }: { large?: boolean }) {
  return <span className={`jr-avatar${large ? " jr-avatar--lg" : ""}`} aria-hidden="true" />;
}

export default function PostCard({ post, author, index = 0 }: { post: PostSummary; author: string; index?: number }) {
  const href = `/blog/${post.slug}`;
  return (
    <article className="jr-card reveal" style={{ "--d": `${(index % 3) * 0.08}s` } as React.CSSProperties}>
      <Link className="jr-card__media" href={href} tabIndex={-1} aria-hidden="true">
        <ImageSlot src={post.image} alt="" width={1200} height={825} />
        <span className="jr-tag">{post.category}</span>
      </Link>
      <div className="jr-card__body">
        <h3><Link href={href}>{post.title}</Link></h3>
        <p>{post.excerpt}</p>
        <div className="jr-card__foot">
          <span className="jr-author"><Avatar /> {author}</span>
          <span className="jr-meta">{post.date} · {post.readTime} min read</span>
        </div>
      </div>
    </article>
  );
}
