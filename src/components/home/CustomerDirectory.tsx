"use client";

import { useState } from "react";
import { customers, customerDescriptions } from "@/content/site";
import Card from "@/components/ui/Card";

function normalize(value: string) {
  return value.normalize("NFKC").replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/[\u064B-\u065F]/g, "").replace(/[\s\u200c]+/g, " ").trim();
}

export default function CustomerDirectory() {
  const [query, setQuery] = useState("");
  const list = customers.filter(name => normalize(name).includes(normalize(query)));
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <label className="block w-full sm:max-w-sm"><span className="text-sm text-ink/70">جست‌وجوی مشتریان</span><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="نام بانک یا شرکت را بنویسید" className="mt-2 w-full rounded-xl border border-bronze/30 bg-white/80 p-3 text-sm focus-visible:outline-2 focus-visible:outline-bronze" /></label>
        <p role="status" className="text-xs text-ink/55">{list.length.toLocaleString("fa-IR")} مورد از {customers.length.toLocaleString("fa-IR")} مشتری</p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {list.map(name => <li key={name}><Card hover className="flex h-full flex-col">
          <span aria-hidden="true" className="grid h-11 w-11 place-items-center rounded-full border border-bronze/40 text-lg font-bold text-bronze">{name.replace(/^شرکت /, "").charAt(0)}</span>
          <h3 className="mt-5 font-semibold text-ink">{name}</h3>
          {customerDescriptions[name] && <details className="mt-4 text-sm text-ink/65"><summary className="cursor-pointer text-bronze focus-visible:outline-2 focus-visible:outline-bronze">معرفی مشتری</summary><p className="mt-3 whitespace-pre-line leading-8">{customerDescriptions[name]}</p></details>}
          <span className="mt-5 block h-px w-8 bg-bronze" />
        </Card></li>)}
      </ul>
      {!list.length && <div className="rounded-2xl border border-bronze/20 p-8 text-center"><p className="text-sm text-ink/65">مشتری‌ای با این نام پیدا نشد.</p><button type="button" onClick={() => setQuery("")} className="mt-3 text-sm text-bronze underline underline-offset-4">نمایش همه مشتریان</button></div>}
    </div>
  );
}
