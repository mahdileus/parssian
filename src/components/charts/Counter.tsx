"use client";
import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";

// Counts up once when it scrolls into view.
export default function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const { ref, seen } = useInView<HTMLSpanElement>();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(value); return; }
    let raf = 0, start = 0;
    const tick = (t: number) => {
      start ||= t;
      const k = Math.min(1, (t - start) / 1400);
      setN(Math.round(value * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, value]);
  return <span ref={ref}>{n.toLocaleString("fa-IR")}{suffix}</span>;
}
