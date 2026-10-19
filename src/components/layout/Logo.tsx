import LogoMark from "./LogoMark";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={`brand-logo inline-flex items-center gap-2 font-bold ${light ? "text-paper" : "text-ink"}`}>
      <LogoMark className="text-bronze" />
      معین پارسیان پارس
    </span>
  );
}
