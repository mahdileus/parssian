"use client";
import { useState } from "react";
import { useInView } from "@/hooks/useInView";

export default function LineChart({ data, labels }: { data: number[]; labels: string[] }) {
  const { ref, seen } = useInView<SVGSVGElement>();
  const [hi, setHi] = useState<number | null>(null);
  const W = 400, H = 160, P = 14, max = Math.max(...data) * 1.1;
  // RTL: time runs right to left
  const pts = data.map((v, i) => [W - P - (i / (data.length - 1)) * (W - 2 * P), H - P - (v / max) * (H - 2 * P)]);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${d} L${pts[pts.length - 1][0]},${H - P} L${pts[0][0]},${H - P} Z`;
  const step = data.length > 8 ? 3 : 1;

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    let best = 0;
    pts.forEach((p, i) => { if (Math.abs(p[0] - x) < Math.abs(pts[best][0] - x)) best = i; });
    setHi(best);
  };

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H + 18}`} className="w-full touch-none" role="img" aria-label="نمودار خطی نمونه"
      onPointerMove={onMove} onPointerLeave={() => setHi(null)}>
      <defs><linearGradient id="a" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#b17d56" stopOpacity=".22" /><stop offset="1" stopColor="#b17d56" stopOpacity="0" /></linearGradient></defs>
      {[0.25, 0.5, 0.75].map((g) => <line key={g} x1={P} x2={W - P} y1={H * g} y2={H * g} stroke="#000007" strokeOpacity=".07" />)}
      <path d={area} fill="url(#a)" style={{ opacity: seen ? 1 : 0, transition: "opacity 1s ease .7s" }} />
      <path d={d} fill="none" stroke="#b17d56" strokeWidth="2" strokeLinecap="round" pathLength={1}
        strokeDasharray={1} strokeDashoffset={seen ? 0 : 1} style={{ transition: "stroke-dashoffset 1.8s ease-out" }} />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={hi === i ? 4.5 : 2.5} fill={hi === i ? "#000007" : "#b17d56"} style={{ opacity: seen ? 1 : 0, transition: `opacity .5s ease ${0.9 + i * 0.07}s, r .2s` }} />)}
      {hi !== null && (
        <g pointerEvents="none">
          <line x1={pts[hi][0]} x2={pts[hi][0]} y1={P} y2={H - P} stroke="#000007" strokeOpacity=".25" strokeDasharray="3 3" />
          <g transform={`translate(${Math.min(W - 60, Math.max(4, pts[hi][0] - 28))},${Math.max(2, pts[hi][1] - 36)})`}>
            <rect width="56" height="28" rx="6" fill="#000007" />
            <text x="28" y="12" fontSize="8" textAnchor="middle" fill="#f7f7f7" opacity=".7">{labels[hi]}</text>
            <text x="28" y="23" fontSize="10" fontWeight="600" textAnchor="middle" fill="#f7f7f7">{data[hi].toLocaleString("fa-IR")}</text>
          </g>
        </g>
      )}
      {pts.map((p, i) => i % step === 0 && <text key={i} x={p[0]} y={H + 14} fontSize="9" textAnchor="middle" fill="#000007" opacity=".55">{labels[i]}</text>)}
    </svg>
  );
}
