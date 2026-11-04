"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import PostCard, { type PostSummary } from "./PostCard";

const PER_PAGE = 6;

/** Category filter and pagination for the journal grid. */
export default function BlogList({ posts, categories, author }: { posts: PostSummary[]; categories: string[]; author: string }) {
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(0);
  const top = useRef<HTMLDivElement>(null);

  const matches = useMemo(() => posts.filter((p) => category === "all" || p.category === category), [posts, category]);
  const pages = Math.max(1, Math.ceil(matches.length / PER_PAGE));
  const current = Math.min(page, pages - 1);
  const visible = matches.slice(current * PER_PAGE, (current + 1) * PER_PAGE);
  const grid = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  // The page-wide reveal only watches cards present on load, so bring in cards shown by a filter here
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const id = requestAnimationFrame(() => grid.current?.querySelectorAll(".jr-card").forEach((c) => c.classList.add("is-in")));
    return () => cancelAnimationFrame(id);
  }, [category, current]);

  const turn = (d: number) => { setPage(current + d); top.current?.scrollIntoView({ block: "start" }); };

  return (
    <>
      <div className="filters jr-filters reveal" role="group" aria-label="Filter posts by category" ref={top}>
        {["all", ...categories].map((c) => (
          <button key={c} type="button" className={category === c ? "is-active" : ""} aria-pressed={category === c}
            onClick={() => { setCategory(c); setPage(0); }}>
            {c === "all" ? "All" : c}
          </button>
        ))}
      </div>
      {/* key remounts the grid so a new filter's cards animate in */}
      <div className="jr-grid" key={`${category}-${current}`} ref={grid}>
        {visible.map((p, i) => <PostCard key={p.slug} post={p} author={author} index={i} />)}
      </div>
      {matches.length === 0 && <p className="jr-empty">Nothing in this category yet.</p>}
      {pages > 1 && (
        <div className="jr-pager">
          <button className="btn" type="button" disabled={current === 0} onClick={() => turn(-1)}>← Newer</button>
          <span>{current + 1} / {pages}</span>
          <button className="btn" type="button" disabled={current >= pages - 1} onClick={() => turn(1)}>Older →</button>
        </div>
      )}
    </>
  );
}
