import Link from "next/link";

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6" /></svg>
);

/** Pill button with a rolling label and an arrow that turns on hover. */
export default function PillButton({ href, children, external, light }: { href: string; children: string; external?: boolean; light?: boolean }) {
  const cls = `pill-btn magnetic${light ? " pill-btn--light" : ""}`;
  const inner = (
    <>
      <span className="pill-roll"><span data-t={children}>{children}</span></span>
      <span className="pill-ico"><Arrow /></span>
    </>
  );
  return external ? (
    <a className={cls} href={href} target="_blank" rel="noopener noreferrer">{inner}</a>
  ) : (
    <Link className={cls} href={href}>{inner}</Link>
  );
}
