"use client";

import { useState } from "react";
import Section from "./Section";
import Card from "../ui/Card";
import { audiences, services } from "@/content/site";
import { bus } from "../lotus/bus";

const icons: Record<string, React.ReactNode> = {
  app: <><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M11 18h2" /></>,
  bank: <path d="M4 19h16M6 19V9l6-4 6 4v10M10 19v-5h4v5" />,
  team: <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5a3 3 0 0 1 0 6M18 14c2 .8 3 3 3 6" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>,
  trend: <path d="M3 17l5-5 4 4 8-9M15 7h5v5" />,
};

export default function Services() {
  const [aud, setAud] = useState<string>("all");
  const [open, setOpen] = useState<string | null>(null);
  const idxOf = (title: string | null) => (title ? services.findIndex((x) => x.title === title) : -1);
  const list = services.filter((s) => aud === "all" || s.aud === "all" || s.aud === aud);

  return (
    <Section id="services" side="start" title="خدمات" lead="هر خدمت یک مسیر کوتاه دارد. برای دیدن جزئیات، روی کارت بزنید.">
      <div role="tablist" aria-label="نوع مشتری" className="mb-6 inline-flex rounded-full border border-bronze/25 bg-white/60 p-1 backdrop-blur-md">
        {audiences.map((a) => (
          <button key={a.id} role="tab" aria-selected={aud === a.id} onClick={() => { setAud(a.id); setOpen(null); bus.focus = -1; }}
            className={`rounded-full px-4 py-1 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-bronze ${aud === a.id ? "bg-ink text-paper" : "text-ink/65 hover:text-ink"}`}>
            {a.label}
          </button>
        ))}
      </div>

      <ul className="grid items-start gap-4 sm:grid-cols-2">
        {list.map((s) => {
          const isOpen = open === s.title;
          return (
            <li key={s.title} className="sm:[&:last-child:nth-child(odd)]:col-span-2"
              onMouseEnter={() => { bus.focus = idxOf(s.title); }} onMouseLeave={() => { bus.focus = idxOf(open); }}
              onFocus={() => { bus.focus = idxOf(s.title); }} onBlur={() => { bus.focus = idxOf(open); }}>
              <Card hover className="p-0">
                <button type="button" aria-expanded={isOpen} onClick={() => { const n = isOpen ? null : s.title; setOpen(n); bus.focus = idxOf(s.title === n ? n : null); }}
                  className="block w-full p-6 text-start focus-visible:outline-2 focus-visible:outline-bronze">
                  <span className="flex items-center justify-between">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b17d56" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{icons[s.icon]}</svg>
                    <span className={`text-xl leading-none text-bronze transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>+</span>
                  </span>
                  <h3 className="mt-4 font-semibold text-ink">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-ink/60">{s.text}</p>
                  <span className={`mt-5 block h-px bg-bronze transition-all duration-500 ${isOpen ? "w-full" : "w-8 group-hover:w-full"}`} />
                </button>
                <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <ul className="overflow-hidden px-6 text-sm text-ink/75">
                    <li className="h-4" aria-hidden />
                    {s.points.map((pt) => (
                      <li key={pt} className="flex items-center gap-2 py-1"><span className="h-1 w-1 rounded-full bg-bronze" />{pt}</li>
                    ))}
                    <li className="h-5" aria-hidden />
                  </ul>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
