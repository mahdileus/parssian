"use client";

import Link from "next/link";
import { useState } from "react";
import ResponsiveSidebar from "@/components/panels/ResponsiveSidebar";
import LogoMark from "@/components/layout/LogoMark";
import Logo from "@/components/layout/Logo";
import { Ico, Shapes } from "@/components/panels/Extras";
import { useFadeIn } from "@/components/motion/useFadeIn";
import Employees, { initialEmployees } from "./Employees";
import AdminEditor from "./AdminEditor";
import { adminSections } from "./sections";
import "@/components/panels/panels.css";
import "./admin.css";

function normalize(value: string) { return value.replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/[\s\u200c]+/g, "").trim(); }

export default function AdminPanel() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [active, setActive] = useState("dashboard");
  const [query, setQuery] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [dark, setDark] = useState(false);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [drafts, setDrafts] = useState<Record<string, { title: string; recipient: string; body: string }>>({});
  const allSections = adminSections.flatMap(item => [item, ...(item.children ?? [])]);
  const section = allSections.find(item => item.id === active)!;
  const parent = adminSections.find(item => item.children?.some(child => child.id === active));
  const matches = adminSections.filter(item => normalize(item.title).includes(normalize(query)) || item.children?.some(child => normalize(child.title).includes(normalize(query))));
  const contentRef = useFadeIn<HTMLElement>({ replayKey: active });
  function navigate(id: string) {
    setActive(id); setMobileMenu(false);
    const group = adminSections.find(item => item.id === id || item.children?.some(child => child.id === id));
    if (group?.children) setExpanded(current => current.includes(group.id) ? current : [...current, group.id]);
  }
  function toggle(id: string) { setExpanded(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]); }

  return (
    <div className="panel-world admin-world" data-theme={dark ? "dark" : "light"}>
      <Shapes />
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-6 p-4 md:p-6 lg:grid-cols-[280px_1fr]">
        <ResponsiveSidebar className="admin-sidebar" open={mobileMenu} onOpenChange={setMobileMenu}>
          <Link href="/" className="inline-flex px-2" aria-label="معین پارسیان پارس؛ صفحه اصلی"><Logo light /></Link>
          <p className="p-side-sub px-2">پنل ادمین</p>
          <div id="admin-menu" className="admin-menu-container" data-open={mobileMenu}>
            <label className="admin-menu-search"><span className="sr-only">جست‌وجوی بخش‌های مدیریت</span><Ico n="search" size={15} /><input type="search" placeholder="جست‌وجوی بخش‌ها…" value={query} onChange={event => setQuery(event.target.value)} /></label>
            <nav aria-label="منوی مدیریت" className="admin-menu">
              {matches.map(item => {
                const open = expanded.includes(item.id) || !!query.trim();
                const children = item.children?.filter(child => normalize(item.title).includes(normalize(query)) || normalize(child.title).includes(normalize(query)));
                return <div key={item.id} className="admin-menu-group">
                  <button type="button" className="panel-nav" onClick={() => item.children ? toggle(item.id) : navigate(item.id)} aria-expanded={item.children ? open : undefined} aria-controls={item.children ? `submenu-${item.id}` : undefined} aria-current={!item.children && active === item.id ? "page" : undefined} data-active={parent?.id === item.id || active === item.id}>
                    <Ico n={item.icon} size={17} /><span>{item.title}</span>{item.children && <span className="admin-chevron" data-open={open} aria-hidden="true">⌄</span>}
                  </button>
                  {item.children && <div id={`submenu-${item.id}`} hidden={!open} className="admin-submenu">{children?.map(child => <button type="button" key={child.id} className="panel-nav" aria-current={active === child.id ? "page" : undefined} onClick={() => navigate(child.id)}>{child.title}</button>)}</div>}
                </div>;
              })}
              {!matches.length && <p className="px-3 py-5 text-xs text-white/60">بخشی پیدا نشد.</p>}
            </nav>
          </div>
          <LogoMark className="brand-watermark admin-brand-watermark" size={160} />
          <div className="admin-sidebar-footer"><Link href="/dashboard">پنل کاربر ←</Link><Link href="/">بازگشت به سایت</Link></div>
        </ResponsiveSidebar>
        <main ref={contentRef} className="min-w-0 space-y-6">
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div><p className="panel-muted text-xs">معین پارسیان پارس · مدیریت</p>{parent && <p className="panel-muted mt-2 text-xs">{parent.title}</p>}<h1 className="p-title mt-2 text-2xl font-bold md:text-3xl">{section.title}</h1><p className="panel-muted mt-3 text-sm">{section.description}</p></div>
            <button type="button" className="p-icon-btn" aria-label={dark ? "تم روشن" : "تم تیره"} onClick={() => setDark(value => !value)}><Ico n={dark ? "sun" : "moon"} /></button>
          </header>
          <p className="admin-preview text-xs leading-7">پیش‌نمایش پنل مدیریت · بخش‌ها هنوز به دیتابیس متصل نیستند و اطلاعات واقعی نمایش داده نمی‌شود.</p>
          {section.children && <div className="flex flex-wrap gap-2" aria-label={`بخش‌های ${section.title}`}>{section.children.map(child => <button type="button" key={child.id} className="p-chip" onClick={() => navigate(child.id)}>{child.title}</button>)}</div>}
          {active === "dashboard" ? <>
            <section className="glass p-6"><h2 className="font-semibold">دسترسی سریع</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{["employees", "payslips", "attendance", "letters"].map(id => { const item = adminSections.find(value => value.id === id)!; return <button type="button" key={id} className="glass-light flex items-center gap-3 p-4 text-start text-sm" onClick={() => navigate(id)}><Ico n={item.icon} /><span>{item.title}</span><span className="ms-auto" aria-hidden="true">←</span></button>; })}</div></section>
            <section><h2 className="mb-4 font-semibold">بخش‌های مدیریت</h2><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{adminSections.slice(1).map(item => <button type="button" key={item.id} className="glass admin-module-card p-5 text-start" onClick={() => navigate(item.id)}><Ico n={item.icon} size={22} /><h3 className="mt-4 text-sm font-semibold">{item.title}</h3><p className="panel-muted mt-2 text-xs leading-6">{item.description}</p></button>)}</div></section>
          </> : active === "employee-list" ? <Employees employees={employees} onChange={setEmployees} /> : section.editor ? <AdminEditor key={section.id} mode={section.editor} draft={drafts[section.id]} onChange={draft => setDrafts(current => ({ ...current, [section.id]: draft }))} /> : <section className="glass overflow-hidden">
            <div className="flex items-center gap-3 border-b border-[var(--line)] p-5"><Ico n={section.icon} /><h2 className="text-sm font-semibold">{section.title}</h2></div>
            <div className="overflow-x-auto"><table className="w-full text-start text-sm"><caption className="sr-only">فهرست {section.title}</caption><thead><tr>{section.columns.map(column => <th key={column} className="whitespace-nowrap px-5 py-4 text-start text-xs font-medium panel-muted">{column}</th>)}</tr></thead><tbody><tr><td colSpan={section.columns.length} className="px-5 py-16 text-center"><div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full border border-[var(--line)]"><Ico n={section.icon} size={22} /></div><p className="text-sm">هنوز اطلاعاتی برای نمایش وجود ندارد.</p><p className="panel-muted mx-auto mt-2 max-w-md text-xs leading-7">ساختار بخش «{section.title}» آماده است؛ ورود اطلاعات و عملیات این بخش در مرحله بعد تکمیل می‌شود.</p></td></tr></tbody></table></div>
          </section>}
        </main>
      </div>
    </div>
  );
}
