import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="footer" data-theme-section="night">
      <div className="footer__grid">
        <nav aria-label="Footer">
          <Link href="/">Home</Link>
          <Link href="/menu">Menu</Link>
          <Link href="/about">About</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <p>
          {site.address}<br />
          {site.hours}<br />
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      </div>
      <div className="footer__row">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <a href="#main">Back to the top ↑</a>
      </div>
      <div className="footer__mark" aria-hidden="true">
        {site.second.split("").map((c, i) => (
          <span key={i} style={{ "--i": i } as React.CSSProperties}>{c}</span>
        ))}
      </div>
    </footer>
  );
}
