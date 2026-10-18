"use client";

import { useState } from "react";
import Section from "./Section";
import Card from "../ui/Card";
import { faq } from "@/content/site";

export default function Faq() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const list = faq.filter((f) => (f.q + f.a).includes(q.trim()));

  return (
    <Section id="faq" title="سوالات متداول" lead="پاسخ به پرسش‌های رایج درباره حوزه فعالیت و خدمات شرکت معین پارسیان پارس.">
      <div className="max-w-3xl">
        <label className="relative mb-5 block">
          <span className="sr-only">جستجو در سوالات</span>
          <input value={q} onChange={(e) => { setQ(e.target.value); setOpen(null); }} placeholder="جستجو در سوالات…"
            className="w-full rounded-full border border-bronze/25 bg-white/60 py-2.5 pe-5 ps-11 text-sm backdrop-blur-md transition-colors placeholder:text-ink/40 focus:border-bronze focus:outline-none" />
          <svg className="absolute start-4 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b17d56" strokeWidth="2" strokeLinecap="round" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        </label>

        <div className="space-y-3">
          {list.map((f) => {
            const isOpen = open === f.q;
            return (
              <Card key={f.q} hover className="p-0">
                <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : f.q)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-start font-semibold focus-visible:outline-2 focus-visible:outline-bronze">
                  {f.q}
                  <span className={`text-2xl leading-none text-bronze transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>+</span>
                </button>
                <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <p className="overflow-hidden px-5 text-ink/65"><span className="block pb-5">{f.a}</span></p>
                </div>
              </Card>
            );
          })}
          {list.length === 0 && <Card className="text-center text-ink/60">موردی پیدا نشد. عبارت دیگری را امتحان کنید.</Card>}
        </div>
      </div>
    </Section>
  );
}
