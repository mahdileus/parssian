import "./logo.css";

/** Shared flower artwork; its petals open on pointer hover or keyboard focus. */
export default function LogoMark({ size = 30, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true" className={`brand-mark ${className}`}>
      <path d="M4 12c4 0 7 2 8 6-4 1-7-1-8-6Z" fill="currentColor" opacity=".55" className="brand-petal brand-petal-start" />
      <path d="M24 12c-1 5-4 7-8 6 1-4 4-6 8-6Z" fill="currentColor" opacity=".55" className="brand-petal brand-petal-end" />
      <path d="M14 3c3 4 5 7 5 11a5 5 0 0 1-10 0c0-4 2-7 5-11Z" fill="currentColor" />
    </svg>
  );
}
