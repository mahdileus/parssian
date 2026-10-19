"use client";

import { useState, type FormEvent } from "react";
import { contact, investments, services } from "@/content/site";
import Card from "@/components/ui/Card";

const topics = [...services.map(service => service.title), ...investments.map(item => item.title)];
const field = "mt-2 w-full rounded-xl border border-bronze/30 bg-white/80 p-3 text-sm text-ink focus-visible:outline-2 focus-visible:outline-bronze";

export default function CooperationRequest() {
  const [draft, setDraft] = useState<{ href: string; body: string } | null>(null);
  const [notice, setNotice] = useState("");
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const organization = String(data.get("organization") || "").trim();
    const details = String(data.get("details") || "").trim();
    const topic = String(data.get("topic") || "");
    if (!organization || !details) { setNotice("نام سازمان و توضیحات درخواست را وارد کنید."); return; }
    const body = `با سلام\nدرخواست همکاری در زمینه ${topic}\nنام سازمان: ${organization}\n\n${details}`;
    setDraft({ body, href: `mailto:${contact.emails[0]}?subject=${encodeURIComponent(`درخواست همکاری ـ ${topic}`)}&body=${encodeURIComponent(body)}` });
    setNotice("متن آماده شد. برای ارسال، برنامه ایمیل خود را باز کنید یا متن را کپی کنید.");
  }
  async function copyDraft() {
    if (!draft) return;
    try { await navigator.clipboard.writeText(draft.body); setNotice("متن درخواست کپی شد؛ آن را در ایمیل خود قرار دهید."); }
    catch { setNotice("کپی خودکار ممکن نیست؛ متن پیش‌نمایش را انتخاب و کپی کنید."); }
  }
  return (
    <Card className="mt-8 scroll-mt-24">
      <div id="cooperation" className="scroll-mt-24">
        <h3 className="text-xl font-semibold text-ink">درخواست همکاری</h3>
        <p className="mt-3 text-sm leading-7 text-ink/65">موضوع و نیاز سازمان را بنویسید تا متن ایمیل آماده شود. ارسال از برنامه ایمیل شما انجام می‌شود؛ این فرم درخواست را در سایت ثبت نمی‌کند.</p>
        <form method="post" onSubmit={prepare} onChange={() => { setDraft(null); setNotice(""); }} className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="text-sm text-ink/75">نام سازمان<input name="organization" required maxLength={120} className={field} autoComplete="organization" placeholder="نام شرکت یا مؤسسه" /></label>
          <label className="text-sm text-ink/75">موضوع همکاری<select name="topic" className={field}>{topics.map(topic => <option key={topic}>{topic}</option>)}</select></label>
          <label className="text-sm text-ink/75 md:col-span-2">شرح نیاز<textarea name="details" required maxLength={800} rows={4} className={field} placeholder="نوع خدمت، محل اجرا و نیاز سازمان را شرح دهید." /></label>
          <button type="submit" className="justify-self-start rounded-full bg-ink px-6 py-2.5 text-sm text-paper transition-colors hover:bg-bronze focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze">آماده‌کردن متن ایمیل</button>
        </form>
        <p role="status" className="mt-4 text-sm text-ink/65">{notice}</p>
        {draft && <div className="mt-4 rounded-xl border border-bronze/25 bg-white/70 p-5">
          <h4 className="text-sm font-semibold text-ink">پیش‌نمایش درخواست</h4><p className="mt-3 whitespace-pre-wrap break-words text-sm leading-8 text-ink/70">{draft.body}</p>
          <div className="mt-5 flex flex-wrap gap-4"><a href={draft.href} className="text-sm text-bronze underline underline-offset-4">بازکردن برنامه ایمیل</a><button type="button" onClick={copyDraft} className="text-sm text-bronze underline underline-offset-4">کپی متن درخواست</button></div>
          <p className="mt-4 break-all text-xs text-ink/55">گیرنده: <span dir="ltr">{contact.emails[0]}</span></p>
        </div>}
      </div>
    </Card>
  );
}
