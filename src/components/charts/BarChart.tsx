"use client";
import { useState } from "react";
import { useInView } from "@/hooks/useInView";

export default function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const { ref, seen } = useInView<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div ref={ref} className="space-y-4" onMouseLeave={() => setHover(null)}>
      {data.map((d, i) => (
        <div key={d.label} onMouseEnter={() => setHover(i)} className="transition-opacity duration-300" style={{ opacity: hover === null || hover === i ? 1 : 0.35 }}>
          <div className="mb-1 flex justify-between text-sm"><span>{d.label}</span><span className="text-bronze">{d.value.toLocaleString("fa-IR")}٪</span></div>
          <div className="h-1.5 rounded-full bg-bronze/10">
            <div className="h-full origin-right rounded-full bg-bronze transition-transform duration-1000 ease-out motion-reduce:transition-none"
              style={{ width: `${(d.value / max) * 100}%`, transform: `scaleX(${seen ? 1 : 0})`, transitionDelay: `${i * 110}ms` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
