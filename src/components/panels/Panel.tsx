"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import Logo from "@/components/layout/Logo";

type Request = { id: number; title: string; name: string; status: string; date: string; details?: string };
const initialRequests: Request[] = [
  { id: 1024, title: "درخواست تسهیلات", name: "سارا احمدی", status: "در حال بررسی", date: "۱۴۰۵/۰۷/۲۰" },
  { id: 1023, title: "افتتاح حساب", name: "علی رضایی", status: "تکمیل شده", date: "۱۴۰۵/۰۷/۱۸" },
  { id: 1022, title: "فعال‌سازی اینترنت بانک", name: "سارا احمدی", status: "تکمیل شده", date: "۱۴۰۵/۰۷/۱۵" },
];
const initialUsers = [
  { id: 1, name: "سارا احمدی", email: "sara@example.com", active: true },
  { id: 2, name: "علی رضایی", email: "ali@example.com", active: true },
  { id: 3, name: "مریم محمدی", email: "maryam@example.com", active: false },
];
const input = "w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-bronze focus:ring-2 focus:ring-bronze/20";
const button = "rounded-xl bg-ink px-5 py-2.5 text-sm text-white transition hover:bg-bronze focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bronze";

function Badge({ children }: { children: string }) {
  return <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs ${children === "تکمیل شده" || children === "فعال" ? "bg-emerald-50 text-emerald-800" : children === "رد شده" || children === "غیرفعال" ? "bg-rose-50 text-rose-800" : "bg-amber-50 text-amber-800"}`}>{children}</span>;
}

export default function Panel({ admin = false }: { admin?: boolean }) {
  const tabs = admin ? ["نمای کلی", "کاربران", "درخواست‌ها", "پشتیبانی"] : ["نمای کلی", "درخواست‌های من", "پروفایل", "پشتیبانی"];
  const [tab, setTab] = useState("نمای کلی");
  const [requests, setRequests] = useState(initialRequests);
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [name, setName] = useState("سارا احمدی");
  const [email, setEmail] = useState("sara@example.com");
  const [messages, setMessages] = useState([{ id: 1, body: "سلام، برای پیگیری درخواست تسهیلات راهنمایی می‌خواهم.", reply: "درخواست شما در حال بررسی است. نتیجه در همین پنل اعلام می‌شود." }]);
  const visibleRequests = requests.filter(r => (admin || r.name === "سارا احمدی") && `${r.title} ${r.name} ${r.id}`.includes(search));
  const myRequests = requests.filter(r => r.name === "سارا احمدی");
  function submitRequest(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setRequests(prev => [{ id: Math.max(...prev.map(r => r.id)) + 1, title: String(data.get("service")), details: String(data.get("details")).trim(), name: "سارا احمدی", status: "در حال بررسی", date: new Intl.DateTimeFormat("fa-IR").format(new Date()) }, ...prev]);
    setNotice("درخواست نمونه ثبت شد و در فهرست قابل پیگیری است.");
    form.reset();
  }
  function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = String(new FormData(e.currentTarget).get("message")).trim();
    if (!body) return;
    setMessages(prev => [...prev, { id: Math.max(...prev.map(m => m.id)) + 1, body, reply: "" }]);
    setNotice("پیام نمونه ارسال شد.");
    e.currentTarget.reset();
  }
  const stats = admin
    ? [["کاربران نمونه", users.length], ["درخواست‌ها", requests.length], ["در انتظار بررسی", requests.filter(r => r.status === "در حال بررسی").length], ["پیام‌های بی‌پاسخ", messages.filter(m => !m.reply).length]]
    : [["درخواست‌های من", myRequests.length], ["در حال بررسی", myRequests.filter(r => r.status === "در حال بررسی").length], ["تکمیل شده", myRequests.filter(r => r.status === "تکمیل شده").length], ["پیام‌های پشتیبانی", messages.length]];

  return <div className="min-h-screen bg-[#f3f2ef]">
    <header className="border-b border-black/5 bg-white px-5 py-4"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4"><Link href="/"><Logo /></Link><div className="flex items-center gap-3 text-sm"><span className="rounded-full bg-bronze/10 px-3 py-1 text-bronze">نسخه نمایشی</span><Link href="/login" className="text-ink/60 hover:text-bronze">بازگشت به انتخاب پنل</Link></div></div></header>
    <div className="mx-auto grid max-w-7xl gap-6 p-4 md:p-8 lg:grid-cols-[230px_1fr]">
      <aside className="self-start rounded-2xl bg-ink p-5 text-white lg:sticky lg:top-8"><p className="text-xs text-white/50">پارسیان همراه شما</p><h2 className="mt-1 text-xl font-bold">{admin ? "پنل مدیریت" : "پنل کاربری"}</h2><div className="my-5 border-t border-white/10" /><nav aria-label="منوی پنل" className="flex flex-wrap gap-2 lg:flex-col">{tabs.map((t, i) => <button key={t} onClick={() => { setTab(t); setSearch(""); setNotice(""); }} aria-current={tab === t ? "page" : undefined} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-right text-sm transition ${tab === t ? "bg-bronze text-white" : "text-white/70 hover:bg-white/10"}`}><span aria-hidden className="text-xs opacity-60">۰{i + 1}</span>{t}</button>)}</nav><p className="mt-8 text-xs leading-6 text-white/40">{admin ? "مدیریت خدمات و ارتباط با کاربران" : "خدمات شما، در یک نگاه"}</p></aside>
      <main className="min-w-0 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm text-ink/50">{admin ? "مرکز مدیریت پارسیان" : `خوش آمدید، ${name}`}</p><h1 className="mt-1 text-2xl font-bold md:text-3xl">{tab}</h1></div><span className="text-sm text-ink/50">{admin ? "مدیر نمونه" : "حساب کاربری نمونه"}</span></div>
        <p className="rounded-xl border border-bronze/20 bg-bronze/5 px-4 py-3 text-xs text-ink/65">تمام اطلاعات نمونه هستند. تغییرات فقط تا زمان بازخوانی صفحه باقی می‌مانند و عملیات بانکی واقعی انجام نمی‌شود.</p>
        {notice && <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p>}
        {tab === "نمای کلی" && <><div className="grid grid-cols-2 gap-4 xl:grid-cols-4">{stats.map(([label, value]) => <div key={label} className="rounded-2xl border border-black/5 bg-white p-5"><p className="text-xs text-ink/50">{label}</p><p className="mt-3 text-3xl font-bold">{Number(value).toLocaleString("fa-IR")}</p><div className="mt-4 h-1 w-9 rounded-full bg-bronze" /></div>)}</div><section className="rounded-2xl bg-ink p-6 text-white"><p className="text-xs text-bronze">یک قدم نزدیک‌تر</p><h2 className="mt-2 text-xl font-bold">{admin ? "درخواست‌های کاربران را بررسی کنید" : "خدمات غیرحضوری، ساده‌تر از همیشه"}</h2><p className="mt-2 text-sm text-white/60">{admin ? "وضعیت درخواست‌ها را تغییر دهید و پاسخ‌گوی پیام‌ها باشید." : "درخواست جدید ثبت کنید و روند رسیدگی را در پنل خود ببینید."}</p><button onClick={() => setTab(admin ? "درخواست‌ها" : "درخواست‌های من")} className="mt-5 rounded-xl bg-bronze px-5 py-2 text-sm">{admin ? "بررسی درخواست‌ها" : "ثبت و پیگیری درخواست"} ←</button></section></>}
        {(tab === "نمای کلی" || tab.includes("درخواست")) && <section className="rounded-2xl border border-black/5 bg-white p-5 md:p-6"><div className="mb-5 flex flex-wrap items-center justify-between gap-4"><h2 className="font-bold">{tab === "نمای کلی" ? "آخرین درخواست‌ها" : "فهرست درخواست‌ها"}</h2><label className="w-full sm:w-64"><span className="sr-only">جستجوی درخواست</span><input className={input} placeholder="جستجوی عنوان یا کد پیگیری" value={search} onChange={e => setSearch(e.target.value)} /></label></div><div className="overflow-x-auto"><table className="w-full text-right text-sm"><thead className="border-b border-black/10 text-xs text-ink/45"><tr>{["کد پیگیری", "خدمت", ...(admin ? ["کاربر"] : []), "تاریخ", "وضعیت"].map(c => <th key={c} className="whitespace-nowrap px-3 py-3 font-normal">{c}</th>)}</tr></thead><tbody>{visibleRequests.map(r => <tr key={r.id} className="border-b border-black/5 last:border-0"><td className="px-3 py-4 text-bronze">{r.id.toLocaleString("fa-IR", { useGrouping: false })}</td><td className="whitespace-nowrap px-3 py-4">{r.title}{r.details && <details className="mt-1 whitespace-normal text-xs text-ink/50"><summary className="cursor-pointer">توضیحات درخواست</summary><p className="mt-2 max-w-xs whitespace-pre-wrap">{r.details}</p></details>}</td>{admin && <td className="whitespace-nowrap px-3 py-4">{r.name}</td>}<td className="whitespace-nowrap px-3 py-4 text-ink/50">{r.date}</td><td className="px-3 py-4">{admin ? <select aria-label={`وضعیت درخواست ${r.id}`} className="rounded-lg border border-black/10 p-2" value={r.status} onChange={e => { setRequests(prev => prev.map(item => item.id === r.id ? { ...item, status: e.target.value } : item)); setNotice("وضعیت درخواست نمونه به‌روزرسانی شد."); }}>{["در حال بررسی", "تکمیل شده", "رد شده"].map(s => <option key={s}>{s}</option>)}</select> : <Badge>{r.status}</Badge>}</td></tr>)}</tbody></table>{visibleRequests.length === 0 && <p className="py-10 text-center text-sm text-ink/50">درخواستی پیدا نشد.</p>}</div></section>}
        {!admin && tab === "درخواست‌های من" && <section className="rounded-2xl bg-white p-6"><h2 className="mb-4 font-bold">ثبت درخواست جدید</h2><form onSubmit={submitRequest} className="space-y-4"><label className="block text-sm">نوع خدمت<select name="service" className={`${input} mt-2`}>{["درخواست تسهیلات", "افتتاح حساب", "فعال‌سازی اینترنت بانک"].map(s => <option key={s}>{s}</option>)}</select></label><label className="block text-sm">توضیحات<textarea name="details" required maxLength={1000} rows={3} className={`${input} mt-2`} placeholder="درخواست خود را شرح دهید؛ اطلاعات حساس وارد نکنید." /></label><button className={button}>ثبت درخواست نمونه</button></form></section>}
        {tab === "کاربران" && <section className="rounded-2xl bg-white p-6"><label className="block max-w-sm"><span className="sr-only">جستجوی کاربر</span><input className={input} placeholder="جستجوی نام یا ایمیل" value={search} onChange={e => setSearch(e.target.value)} /></label><div className="mt-5 space-y-3">{users.filter(u => `${u.name} ${u.email}`.includes(search)).map(u => <div key={u.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-black/5 p-4"><div><p className="font-medium">{u.name}</p><p className="text-xs text-ink/50" dir="ltr">{u.email}</p></div><div className="flex items-center gap-4"><Badge>{u.active ? "فعال" : "غیرفعال"}</Badge><button className="text-sm text-bronze" onClick={() => { setUsers(prev => prev.map(item => item.id === u.id ? { ...item, active: !item.active } : item)); setNotice("وضعیت کاربر نمونه تغییر کرد."); }}>{u.active ? "غیرفعال کردن" : "فعال کردن"}</button></div></div>)}{!users.some(u => `${u.name} ${u.email}`.includes(search)) && <p className="py-8 text-center text-ink/50">کاربری پیدا نشد.</p>}</div></section>}
        {tab === "پروفایل" && <section className="rounded-2xl bg-white p-6"><h2 className="mb-5 font-bold">اطلاعات فردی نمونه</h2><form className="max-w-xl space-y-5" onSubmit={e => { e.preventDefault(); setNotice("پروفایل نمونه ذخیره شد."); }}><label className="block text-sm">نام و نام خانوادگی<input required maxLength={80} className={`${input} mt-2`} value={name} onChange={e => setName(e.target.value)} /></label><label className="block text-sm">ایمیل<input type="email" required className={`${input} mt-2`} dir="ltr" value={email} onChange={e => setEmail(e.target.value)} /></label><button className={button}>ذخیره تغییرات</button></form></section>}
        {tab === "پشتیبانی" && <section className="space-y-5 rounded-2xl bg-white p-6"><h2 className="font-bold">پیام‌های پشتیبانی</h2>{messages.map(m => <article key={m.id} className="rounded-xl border border-black/10 p-4"><p className="text-xs text-ink/40">سارا احمدی · پیام نمونه</p><p className="mt-2 whitespace-pre-wrap text-sm">{m.body}</p>{m.reply ? <div className="mt-4 rounded-lg bg-bronze/5 p-3"><p className="text-xs text-bronze">پاسخ پشتیبانی</p><p className="mt-1 whitespace-pre-wrap text-sm">{m.reply}</p></div> : admin ? <form className="mt-4 space-y-3" onSubmit={e => { e.preventDefault(); const reply = String(new FormData(e.currentTarget).get("reply")).trim(); if (!reply) return; setMessages(prev => prev.map(item => item.id === m.id ? { ...item, reply } : item)); setNotice("پاسخ نمونه ثبت شد."); }}><label className="block text-sm">پاسخ شما<textarea name="reply" required maxLength={1000} className={`${input} mt-2`} /></label><button className={button}>ارسال پاسخ</button></form> : <p className="mt-3 text-xs text-amber-700">در انتظار پاسخ</p>}</article>)}{!admin && <form onSubmit={sendMessage} className="space-y-3"><label className="block text-sm">پیام جدید<textarea name="message" required maxLength={1000} rows={3} className={`${input} mt-2`} placeholder="پیام خود را بنویسید؛ اطلاعات حساس وارد نکنید." /></label><button className={button}>ارسال پیام نمونه</button></form>}{admin && <button className="text-sm text-bronze" onClick={() => setMessages(prev => [...prev, { id: Math.max(...prev.map(m => m.id)) + 1, body: "لطفاً وضعیت درخواست من را بررسی کنید.", reply: "" }])}>افزودن پیام نمونه برای تمرین پاسخ‌گویی</button>}</section>}
      </main>
    </div>
  </div>;
}
