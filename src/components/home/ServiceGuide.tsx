"use client";

import { useState } from "react";
import { services } from "@/content/site";
import Card from "@/components/ui/Card";

const needs = [
  "برای سازمان خود به نیروی انسانی نیاز دارم",
  "به مدیریت یک مرکز اقامتی یا رفاهی نیاز دارم",
  "به پشتیبانی اداری و اجرایی نیاز دارم",
  "به خدمات شهری، نظافت یا فضای سبز نیاز دارم",
  "به خدمات فنی، تأسیسات یا بازسازی نیاز دارم",
];

export default function ServiceGuide() {
  const [choice, setChoice] = useState("");
  const service = choice === "" ? null : services[Number(choice)];
  return (
    <Card className="mb-8">
      <h3 className="text-lg font-semibold text-ink">چه خدمتی نیاز دارید؟</h3>
      <p className="mt-2 text-sm text-ink/60">نیاز خود را انتخاب کنید تا حوزه مرتبط را بشناسید.</p>
      <label htmlFor="service-need" className="mt-5 block text-sm text-ink/75">نیاز سازمان شما</label>
      <select id="service-need" value={choice} onChange={e => setChoice(e.target.value)} className="mt-2 w-full rounded-xl border border-bronze/30 bg-white p-3 text-sm text-ink focus-visible:outline-2 focus-visible:outline-bronze">
        <option value="">انتخاب کنید</option>
        {needs.map((need, index) => <option key={need} value={index}>{need}</option>)}
      </select>
      <div aria-live="polite" aria-atomic="true">
        {service && <div className="mt-5 border-t border-bronze/20 pt-5">
          <p className="text-xs text-bronze">حوزه مرتبط</p>
          <h4 className="mt-1 font-semibold text-ink">{service.title}</h4>
          <p className="mt-2 text-sm leading-7 text-ink/65">{service.text}</p>
          <a href="#cooperation" className="mt-4 inline-block text-sm text-bronze underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-bronze">آماده‌کردن درخواست همکاری ←</a>
        </div>}
      </div>
    </Card>
  );
}
