"use client";

import { useState, type FormEvent } from "react";

type Draft = { title: string; recipient: string; body: string };
export default function AdminEditor({ mode, draft, onChange }: { mode: "letter" | "news" | "notice"; draft?: Draft; onChange: (draft: Draft) => void }) {
  const value = draft ?? { title: "", recipient: "", body: "" };
  const [notice, setNotice] = useState("");
  function update(field: keyof Draft, text: string) { onChange({ ...value, [field]: text }); setNotice(""); }
  function preview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!value.title.trim() || !value.body.trim() || (mode === "letter" && !value.recipient.trim())) { setNotice("فیلدهای ضروری را تکمیل کنید."); return; }
    setNotice("پیش‌نویس در همین صفحه نگهداری می‌شود؛ با بازخوانی صفحه پاک می‌شود. ارسال یا انتشار هنوز فعال نیست.");
  }
  return <section className="glass p-5 md:p-7"><form method="post" onSubmit={preview} className="max-w-2xl space-y-5">
    {mode === "letter" && <label className="block text-sm">گیرنده<input name="recipient" className="panel-input mt-2" required maxLength={150} value={value.recipient} onChange={event => update("recipient", event.target.value)} placeholder="نام شخص یا سازمان گیرنده" /></label>}
    <label className="block text-sm">{mode === "letter" ? "موضوع نامه" : "عنوان"}<input name="title" className="panel-input mt-2" required maxLength={200} value={value.title} onChange={event => update("title", event.target.value)} /></label>
    <label className="block text-sm">{mode === "letter" ? "متن نامه" : "متن"}<textarea name="body" className="panel-input mt-2" required maxLength={10000} rows={8} value={value.body} onChange={event => update("body", event.target.value)} /></label>
    <button type="submit" className="panel-btn">بررسی پیش‌نویس</button>
    <p role="status" className="panel-muted text-xs leading-7">{notice || "پیش‌نویس شما هنگام جابه‌جایی بین بخش‌های پنل حفظ می‌شود."}</p>
  </form></section>;
}
