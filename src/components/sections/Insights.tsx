"use client";

import { useState } from "react";
import Section from "./Section";
import Card from "../ui/Card";
import Segmented from "../ui/Segmented";
import BarChart from "../charts/BarChart";
import LineChart from "../charts/LineChart";
import Counter from "../charts/Counter";
import { bars, kpis, line, months, table } from "@/content/site";

const ranges = [{ id: "6", label: "۶ ماه" }, { id: "12", label: "۱۲ ماه" }] as const;

export default function Insights() {
  const [range, setRange] = useState<"6" | "12">("12");
  const n = Number(range);

  return (
    <Section id="insights" side="end" title="آمار و نمودار" lead="همه‌ی اعداد این بخش نمونه است و باید با آمار رسمی جایگزین شود.">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          {kpis.map((k) => (
            <Card key={k.label} hover className="p-5">
              <p className="text-xs text-ink/55">{k.label}</p>
              <p className="mt-2 text-2xl font-bold text-ink"><Counter value={k.value} suffix={k.suffix} /></p>
              <span className="mt-2 inline-block rounded-full bg-bronze/15 px-2 py-0.5 text-xs text-bronze">{k.note}</span>
            </Card>
          ))}
        </div>

        <Card>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-ink/70">رشد تراکنش‌های دیجیتال (نمونه)</h3>
            <Segmented items={ranges} value={range} onChange={setRange} label="بازه زمانی" />
          </div>
          <LineChart key={range} data={line.slice(-n)} labels={months.slice(-n)} />
          <p className="mt-2 text-xs text-ink/45">برای دیدن مقدار هر ماه، نشانگر را روی نمودار حرکت دهید.</p>
        </Card>

        <Card><h3 className="mb-6 text-sm font-semibold text-ink/70">سهم بخش‌ها از تسهیلات (نمونه)</h3><BarChart data={bars} /></Card>

        <Card className="overflow-x-auto">
          <h3 className="mb-3 text-sm font-semibold text-ink/70">خدمات به تفکیک کانال (نمونه)</h3>
          <table className="w-full min-w-[420px] text-center text-sm">
            <thead><tr className="border-b border-bronze/30 text-ink/50"><th className="py-2 text-right font-medium">خدمت</th>{table.cols.map((c) => <th key={c} className="font-medium">{c}</th>)}</tr></thead>
            <tbody>{table.rows.map((r) => (
              <tr key={r.name} className="border-b border-ink/5 transition-colors hover:bg-bronze/10">
                <td className="py-2.5 text-right">{r.name}</td>
                {r.v.map((x, i) => <td key={i} className={x ? "text-bronze" : "text-ink/20"}><span className="sr-only">{x ? "دارد" : "ندارد"}</span><span aria-hidden>{x ? "●" : "—"}</span></td>)}
              </tr>))}
            </tbody>
          </table>
        </Card>
      </div>
    </Section>
  );
}
