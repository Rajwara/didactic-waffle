import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Display from "@/components/Display";
import PillButton from "@/components/PillButton";
import PolicyToc from "@/components/policies/PolicyToc";
import { POLICIES, getPolicy, type PolicyIcon } from "@/lib/policies";
import { site, whatsappUrl } from "@/lib/site";
import "./policies.css";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return POLICIES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPolicy((await params).slug);
  return p ? { title: p.title, description: p.intro } : {};
}

const ICONS: Record<PolicyIcon, React.ReactNode> = {
  box: <><path d="M3 8l9-5 9 5v8l-9 5-9-5z" /><path d="M3 8l9 5 9-5M12 13v8" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  truck: <><path d="M2 6h12v11H2zM14 10h4l4 4v3h-8z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
  store: <path d="M4 10v10h16V10M3 10l2-6h14l2 6M3 10h18M9 20v-6h6v6" />,
  shield: <><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6z" /><path d="m9 12 2 2 4-4" /></>,
  lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  wheat: <><path d="M12 21V8" /><path d="M12 8c-2-1-3-3-3-5 2 0 3 2 3 5zM12 8c2-1 3-3 3-5-2 0-3 2-3 5zM12 13c-2-1-4-2-4-5 2 0 4 2 4 5zM12 13c2-1 4-2 4-5-2 0-4 2-4 5zM12 18c-2-1-4-2-4-5 2 0 4 2 4 5zM12 18c2-1 4-2 4-5-2 0-4 2-4 5z" /></>,
  card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h4" /></>,
};

const date = (iso: string) => new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const d = (s: string) => ({ "--d": s }) as React.CSSProperties;

export default async function PolicyPage({ params }: Props) {
  const policy = getPolicy((await params).slug);
  if (!policy) notFound();
  const [first, ...rest] = policy.title.split(" ");

  return (
    <div className="pol">
      <section className="page-head pol-hero" data-theme-section={policy.theme}>
        <nav className="pol-tabs reveal" aria-label="Policies">
          {POLICIES.map((p) => (
            <Link key={p.slug} href={`/policies/${p.slug}`} className={p.slug === policy.slug ? "on" : undefined} aria-current={p.slug === policy.slug ? "page" : undefined}>
              {p.tab}
            </Link>
          ))}
        </nav>
        <Display as="h1" lines={rest.length ? [first, <em key="e">{rest.join(" ")}</em>] : [first]} />
        <p className="page-head__sub reveal" style={d(".2s")}>{policy.intro}</p>
        <span className="pol-updated reveal" style={d(".3s")}>Last updated {date(policy.updated)}</span>
      </section>

      <section className="pol-main" data-theme-section="day">
        <div className="pol-points">
          {policy.points.map((pt, i) => (
            <article className="pol-point reveal" key={pt.title} style={d(`${i * 0.08}s`)}>
              <div className="pol-point__top">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[pt.icon]}</svg>
                <b>{String(i + 1).padStart(2, "0")}</b>
              </div>
              <h3>{pt.title}</h3>
              <p>{pt.text}</p>
            </article>
          ))}
        </div>

        <div className="pol-body">
          <aside className="pol-toc">
            <span className="pol-label">On this page</span>
            <PolicyToc items={policy.sections.map((s) => ({ id: s.id, title: s.title }))} />
            <div className="pol-help">
              <b>Need a hand?</b>
              <p>Message the bakers on WhatsApp.</p>
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">{site.phone}</a>
            </div>
          </aside>
          <article className="pol-article">
            {policy.sections.map((s, i) => (
              <section className="pol-section reveal" id={s.id} key={s.id}>
                <span className="pol-num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h2>{s.title}</h2>
                  {s.body.map((b, j) => typeof b === "string"
                    ? <p key={j}>{b}</p>
                    : <ul key={j}>{b.list.map((li) => <li key={li}>{li}</li>)}</ul>)}
                </div>
              </section>
            ))}
          </article>
        </div>
      </section>

      <section className="pol-cta" data-theme-section="night">
        <div className="pol-cta__row">
          <div className="reveal">
            <span className="pol-label">Still have a question?</span>
            <h2>We&apos;re here <em>to help</em></h2>
            <p>Message us on WhatsApp, drop into a shop, or write to {site.email}.</p>
          </div>
          <div className="pol-cta__btns reveal" style={d(".1s")}>
            <PillButton href={whatsappUrl()} external>WhatsApp us</PillButton>
            <PillButton href="/branches" light>Find a shop</PillButton>
            <PillButton href="/faq" light>Read the FAQ</PillButton>
          </div>
        </div>
      </section>
    </div>
  );
}
