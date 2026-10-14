// Placeholder mark. Swap in the official Parsian logo SVG here.
export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={`group inline-flex items-center gap-2 font-bold ${light ? "text-paper" : "text-ink"}`}>
      <svg width="30" height="30" viewBox="0 0 28 28" fill="none" aria-hidden className="text-bronze">
        <path d="M4 12c4 0 7 2 8 6-4 1-7-1-8-6Z" fill="currentColor" opacity=".55" className="origin-[12px_18px] transition-transform duration-500 group-hover:-rotate-12" />
        <path d="M24 12c-1 5-4 7-8 6 1-4 4-6 8-6Z" fill="currentColor" opacity=".55" className="origin-[16px_18px] transition-transform duration-500 group-hover:rotate-12" />
        <path d="M14 3c3 4 5 7 5 11a5 5 0 0 1-10 0c0-4 2-7 5-11Z" fill="currentColor" />
      </svg>
      بانک پارسیان
    </span>
  );
}
