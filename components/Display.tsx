/** Big headline whose lines slide up out of a mask. `lines` items may contain <em>. */
export default function Display({
  lines,
  as: Tag = "h2",
  className = "",
}: {
  lines: React.ReactNode[];
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <Tag className={`display ${className}`.trim()}>
      {lines.map((l, i) => (
        <span className="line" key={i}><span>{l}</span></span>
      ))}
    </Tag>
  );
}
