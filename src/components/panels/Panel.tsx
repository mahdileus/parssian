"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent, type KeyboardEvent } from "react";
import Logo from "@/components/layout/Logo";
import Extras, { BarChart, BankCard, Ico, Mark, Shapes, months, fa, navIcons, type Notif, type Tx } from "./Extras";
import "./panels.css";

type Request = {
  id: number;
  title: string;
  name: string;
  status: string;
  date: string;
  details?: string;
};

const ME = "سارا احمدی";
const PENDING = "در حال بررسی";
const DONE = "تکمیل شده";
const REJECTED = "رد شده";
const STATUSES = [PENDING, DONE, REJECTED];

const initialRequests: Request[] = [
  { id: 1024, title: "درخواست تسهیلات", name: ME, status: PENDING, date: "۱۴۰۵/۰۷/۲۰" },
  { id: 1023, title: "افتتاح حساب", name: "علی رضایی", status: DONE, date: "۱۴۰۵/۰۷/۱۸" },
  { id: 1022, title: "فعال‌سازی اینترنت بانک", name: ME, status: DONE, date: "۱۴۰۵/۰۷/۱۵" },
  { id: 1021, title: "درخواست کارت اعتباری", name: "مریم محمدی", status: REJECTED, date: "۱۴۰۵/۰۷/۱۲" },
];

const initialUsers = [
  { id: 1, name: ME, email: "sara@example.com", active: true, lastLogin: "۲ ساعت پیش" },
  { id: 2, name: "علی رضایی", email: "ali@example.com", active: true, lastLogin: "دیروز" },
  { id: 3, name: "مریم محمدی", email: "maryam@example.com", active: false, lastLogin: "۵ روز پیش" },
];

const initialTxs: Tx[] = [
  { title: "خرید اینترنتی", category: "خرید", amount: -1250000, date: "۲۰ مهر", id: "TR-2041" },
  { title: "واریز حقوق", category: "واریز", amount: 28000000, date: "۱۹ مهر", id: "TR-2040" },
  { title: "پرداخت قبض", category: "قبض", amount: -340000, date: "۱۸ مهر", id: "TR-2039" },
  { title: "انتقال به پس‌انداز", category: "انتقال", amount: -5000000, date: "۱۷ مهر", id: "TR-2038" },
];

const initialNotifs: Notif[] = [
  { id: 1, text: "به نسخه جدید پارسیان خوش آمدید", time: "۱ ساعت پیش", read: false },
  { id: 2, text: "وضعیت درخواست تسهیلات به‌روزرسانی شد", time: "۲ ساعت پیش", read: false },
  { id: 3, text: "راهنمای امنیت حساب در دسترس است", time: "۳ ساعت پیش", read: false },
];

function Badge({ children }: { children: string }) {
  const cls = children === DONE || children === "فعال" ? "badge-success" : children === REJECTED || children === "غیرفعال" ? "badge-danger" : "badge-pending";
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${cls}`}>{children}</span>;
}

function Steps({ status }: { status: string }) {
  const s = status === DONE ? ["on", "on", "on"] : status === REJECTED ? ["on", "on", "bad"] : ["on", "now", ""];
  return (
    <div className="p-steps" role="img" aria-label={`مرحله: ${status}`}>
      {s.map((v, i) => (
        <span key={i} data-s={v} />
      ))}
    </div>
  );
}

const digits = (s: string) => s.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/\D/g, "");

/* ---------- transfer / bill dialog ---------- */
function PayDialog({
  mode,
  contacts,
  preset,
  balance,
  onClose,
  onSubmit,
}: {
  mode: "transfer" | "bill";
  contacts: string[];
  preset?: string;
  balance: number;
  onClose: () => void;
  onSubmit: (title: string, amount: number, category: string) => boolean;
}) {
  const targets = mode === "transfer" ? contacts : ["قبض برق", "قبض گاز", "قبض آب", "قبض تلفن"];
  const [target, setTarget] = useState(preset && targets.includes(preset) ? preset : targets[0] ?? "");
  const [amount, setAmount] = useState("");
  const value = Number(digits(amount));
  const tooMuch = value > balance;

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const ok = onSubmit(mode === "transfer" ? `انتقال به ${target}` : `پرداخت ${target}`, value, mode === "transfer" ? "انتقال" : "قبض");
    if (ok) onClose();
  }

  return (
    <div
      className="p-overlay"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <form className="p-dialog space-y-4" role="dialog" aria-modal="true" aria-label={mode === "transfer" ? "انتقال وجه" : "پرداخت قبض"} onSubmit={submit}>
        <h2 className="text-lg font-bold">{mode === "transfer" ? "انتقال وجه" : "پرداخت قبض"}</h2>
        {mode === "transfer" && !contacts.length ? (
          <p className="panel-muted text-sm">برای انتقال، ابتدا از بخش مخاطبان یک مخاطب اضافه کنید.</p>
        ) : (
          <>
            <label className="block text-sm font-medium">
              {mode === "transfer" ? "گیرنده" : "نوع قبض"}
              <select className="panel-input mt-2" value={target} onChange={(e) => setTarget(e.target.value)} autoFocus>
                {targets.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium">
              مبلغ (تومان)
              <input className="panel-input mt-2" dir="ltr" inputMode="numeric" required placeholder="۱٬۰۰۰٬۰۰۰" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </label>
            <p className="text-xs" style={{ color: tooMuch ? "var(--bad)" : "var(--muted)" }}>
              {tooMuch ? "مبلغ از موجودی بیشتر است." : value ? `${fa(value)} تومان` : `موجودی: ${fa(balance)} تومان`}
            </p>
          </>
        )}
        <div className="flex gap-3 pt-1">
          <button className="panel-btn" disabled={!value || tooMuch || !target}>
            {mode === "transfer" ? "انتقال" : "پرداخت"}
          </button>
          <button type="button" className="panel-btn-secondary" onClick={onClose}>
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------- command palette ---------- */
function Palette({ items, onClose }: { items: { label: string; run: () => void }[]; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const list = items.filter((x) => x.label.includes(q.trim()));

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setI((v) => Math.min(v + 1, list.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setI((v) => Math.max(v - 1, 0));
    } else if (e.key === "Enter" && list[i]) {
      e.preventDefault();
      list[i].run();
      onClose();
    } else if (e.key === "Escape") onClose();
  }

  return (
    <div className="p-overlay top" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="p-dialog wide" role="dialog" aria-modal="true" aria-label="جستجو و دستورها">
        <input
          autoFocus
          className="panel-input"
          style={{ border: 0, borderBottom: "1px solid var(--line)", borderRadius: 0, padding: "16px 18px" }}
          placeholder="برو به بخش یا اجرای دستور…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setI(0);
          }}
          onKeyDown={onKey}
          role="combobox"
          aria-expanded="true"
          aria-controls="p-palette-list"
        />
        <div id="p-palette-list" role="listbox" className="max-h-72 overflow-y-auto py-2">
          {list.map((x, idx) => (
            <button
              key={x.label}
              role="option"
              aria-selected={idx === i}
              className="p-opt"
              onMouseEnter={() => setI(idx)}
              onClick={() => {
                x.run();
                onClose();
              }}
            >
              {x.label}
            </button>
          ))}
          {!list.length && <p className="panel-muted px-5 py-6 text-center text-sm">موردی پیدا نشد.</p>}
        </div>
      </div>
    </div>
  );
}

/* ---------- panel ---------- */
export default function Panel({ admin = false }: { admin?: boolean }) {
  const tabs = admin
    ? ["نمای کلی", "کاربران", "درخواست‌ها", "خدمات", "مدیریت محتوا", "سطوح دسترسی", "گزارش‌ها", "فعالیت‌ها", "پشتیبانی", "اعلان‌ها", "تنظیمات"]
    : ["نمای کلی", "حساب‌ها و کارت‌ها", "تراکنش‌ها", "درخواست‌های من", "مخاطبان", "گزارش‌ها", "پروفایل", "پشتیبانی", "اعلان‌ها", "تنظیمات"];

  const [tab, setTab] = useState("نمای کلی");
  const [requests, setRequests] = useState(initialRequests);
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("همه");
  const [notice, setNotice] = useState("");
  const [name, setName] = useState(ME);
  const [email, setEmail] = useState("sara@example.com");
  const [messages, setMessages] = useState([
    { id: 1, body: "سلام، برای پیگیری درخواست تسهیلات راهنمایی می‌خواهم.", reply: "درخواست شما در حال بررسی است. نتیجه در همین پنل اعلام می‌شود." },
  ]);
  const [dark, setDark] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [pay, setPay] = useState<{ mode: "transfer" | "bill"; contact?: string } | null>(null);
  const [txs, setTxs] = useState(initialTxs);
  const [balance, setBalance] = useState(42_850_000);
  const [hidden, setHidden] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [contacts, setContacts] = useState(["علی رضایی", "مریم محمدی"]);
  const [notifs, setNotifs] = useState(initialNotifs);

  // theme: restore + persist
  useEffect(() => {
    try {
      if (localStorage.getItem("panel-theme") === "dark") setDark(true);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("panel-theme", dark ? "dark" : "light");
    } catch {}
  }, [dark]);

  // toast auto-dismiss
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 3800);
    return () => clearTimeout(t);
  }, [notice]);

  // Ctrl/Cmd + K
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const unread = notifs.filter((n) => !n.read).length;

  function go(t: string) {
    setTab(t);
    setSearch("");
    setStatusFilter("همه");
  }

  function spend(amount: number, title: string, category: string) {
    if (frozen) {
      setNotice("کارت نمونه مسدود است؛ ابتدا آن را فعال کنید.");
      return false;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setNotice("مبلغ معتبر وارد کنید.");
      return false;
    }
    if (amount > balance) {
      setNotice("موجودی کافی نیست.");
      return false;
    }
    setBalance((b) => b - amount);
    setTxs((prev) => [
      {
        id: `TR-${Math.max(...prev.map((t) => Number(t.id.slice(3)))) + 1}`,
        title,
        category,
        amount: -amount,
        date: new Intl.DateTimeFormat("fa-IR", { day: "numeric", month: "long" }).format(new Date()),
      },
      ...prev,
    ]);
    setNotice(`${title} ثبت شد.`);
    return true;
  }

  function setStatus(id: number, status: string) {
    setRequests((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    setNotice("وضعیت درخواست با موفقیت به‌روزرسانی شد.");
  }

  const base = requests.filter((r) => (admin || r.name === ME) && `${r.title} ${r.name} ${r.id}`.includes(search));
  const visibleRequests = base.filter((r) => statusFilter === "همه" || r.status === statusFilter);
  const myRequests = requests.filter((r) => r.name === ME);

  function submitRequest(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setRequests((prev) => [
      {
        id: Math.max(...prev.map((r) => r.id)) + 1,
        title: String(data.get("service")),
        details: String(data.get("details")).trim(),
        name: ME,
        status: PENDING,
        date: new Intl.DateTimeFormat("fa-IR").format(new Date()),
      },
      ...prev,
    ]);
    setNotice("درخواست شما ثبت شد و در صف بررسی قرار گرفت.");
    form.reset();
  }

  function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = String(new FormData(form).get("message")).trim();
    if (!body) return;
    setMessages((prev) => [...prev, { id: Math.max(...prev.map((m) => m.id)) + 1, body, reply: "" }]);
    setNotice("پیام شما ارسال شد. همکاران پشتیبانی به زودی پاسخ می‌دهند.");
    form.reset();
  }

  const paletteItems = [
    ...tabs.map((t) => ({ label: t, run: () => go(t) })),
    ...(admin
      ? []
      : [
          { label: "انتقال وجه", run: () => setPay({ mode: "transfer" }) },
          { label: "پرداخت قبض", run: () => setPay({ mode: "bill" }) },
        ]),
    { label: dark ? "تم روشن" : "تم تیره", run: () => setDark((d) => !d) },
  ];

  const kpis: [string, number][] = [
    ["کاربران فعال", users.filter((u) => u.active).length],
    ["درخواست‌های باز", requests.filter((r) => r.status === PENDING).length],
    ["کل درخواست‌ها", requests.length],
    ["پیام‌های بی‌پاسخ", messages.filter((m) => !m.reply).length],
  ];

  const showRequests = tab.includes("درخواست");
  const compact = tab === "نمای کلی";
  const rows = compact ? visibleRequests.slice(0, 3) : visibleRequests;

  return (
    <div className="panel-world" data-theme={dark ? "dark" : "light"}>
      <Shapes />

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 p-4 md:p-6 lg:grid-cols-[250px_1fr]">
        {/* Sidebar */}
        <aside className="panel-sidebar self-start lg:sticky lg:top-6">
          <Link href="/" aria-label="صفحهٔ اصلی" className="inline-flex px-1.5">
            <Logo light />
          </Link>
          <p className="p-side-sub">{admin ? "پنل مدیریت" : "پنل کاربری"}</p>
          <nav aria-label="منوی پنل" className="flex flex-wrap gap-1 lg:flex-col">
            {tabs.map((t) => (
              <button key={t} onClick={() => go(t)} aria-current={tab === t ? "page" : undefined} className="panel-nav">
                <Ico n={navIcons[t] ?? "list"} size={16} />
                {t}
              </button>
            ))}
          </nav>
          <div className="p-side-foot hidden lg:block">
            <Link href="/login" className="p-side-link">
              خروج از نسخهٔ نمایشی
            </Link>
            <Mark className="p-side-mark" />
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm panel-muted">{admin ? "مرکز مدیریت پارسیان" : `خوش آمدید، ${name}`}</p>
              <h1 className="p-title mt-1 text-2xl font-bold tracking-tight md:text-3xl">{tab}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-icon-btn" onClick={() => setPaletteOpen(true)} aria-label="جستجو و دستورها (Ctrl K)">
                <Ico n="search" size={16} />
              </button>
              <button className="p-icon-btn" onClick={() => setDark((d) => !d)} aria-label={dark ? "تم روشن" : "تم تیره"}>
                <Ico n={dark ? "sun" : "moon"} size={16} />
              </button>
              <button className="p-icon-btn" onClick={() => go("اعلان‌ها")} aria-label={`اعلان‌ها، ${fa(unread)} خوانده‌نشده`}>
                <Ico n="bell" size={16} />
                {unread > 0 && <span className="p-dot-count">{fa(unread)}</span>}
              </button>
            </div>
          </div>

          {/* Overview: user */}
          {tab === "نمای کلی" && !admin && (
            <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
              <div className="space-y-4">
                <BankCard holder={name} frozen={frozen} balance={balance} hidden={hidden} onToggle={() => setHidden(!hidden)} />
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ["transfer", "انتقال وجه", () => setPay({ mode: "transfer" })],
                      ["bill", "پرداخت قبض", () => setPay({ mode: "bill" })],
                      ["plus", "درخواست جدید", () => go("درخواست‌های من")],
                      ["card", "کنترل کارت", () => go("حساب‌ها و کارت‌ها")],
                    ] as const
                  ).map(([icon, label, run]) => (
                    <button key={label} className="p-chip inline-flex items-center gap-2" onClick={run}>
                      <Ico n={icon} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <section className="glass p-6">
                <div className="mb-6 flex items-baseline justify-between">
                  <h2 className="font-bold">هزینه‌های شش ماه اخیر</h2>
                  <span className="text-xs panel-muted">میلیون تومان</span>
                </div>
                <BarChart data={[42, 68, 55, 88, 74, 95]} labels={months} unit="میلیون تومان" />
              </section>
            </div>
          )}

          {tab === "نمای کلی" && !admin && (
            <section className="glass p-5 md:p-6">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="font-bold">آخرین تراکنش‌ها</h2>
                <button className="p-link" onClick={() => go("تراکنش‌ها")}>
                  همه تراکنش‌ها
                </button>
              </div>
              <ul>
                {txs.slice(0, 4).map((t) => (
                  <li key={t.id} className="panel-row flex items-center justify-between gap-3 py-4">
                    <div>
                      <p className="text-sm font-medium">{t.title}</p>
                      <p className="mt-1 text-xs panel-muted">{t.date}</p>
                    </div>
                    <span className="text-sm font-semibold" dir="ltr" style={{ color: t.amount > 0 ? "var(--accent)" : "var(--ink)" }}>
                      {fa(t.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Overview: admin */}
          {tab === "نمای کلی" && admin && (
            <>
              <section className="glass p-kpis" aria-label="آمار کلی">
                {kpis.map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs panel-muted">{label}</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight">{fa(value)}</p>
                  </div>
                ))}
              </section>
              <div className="grid gap-6">
                <section className="glass p-5 md:p-6">
                  <h2 className="mb-2 font-bold">نیازمند بررسی</h2>
                  <ul>
                    {requests
                      .filter((r) => r.status === PENDING)
                      .map((r) => (
                        <li key={r.id} className="panel-row flex flex-wrap items-center justify-between gap-3 py-4">
                          <div>
                            <p className="text-sm font-medium">{r.title}</p>
                            <p className="mt-1 text-xs panel-muted">
                              {r.name}، کد {r.id.toLocaleString("fa-IR", { useGrouping: false })}
                            </p>
                          </div>
                          <div className="flex gap-4">
                            <button className="p-link" onClick={() => setStatus(r.id, DONE)}>
                              تأیید
                            </button>
                            <button className="p-link is-bad" onClick={() => setStatus(r.id, REJECTED)}>
                              رد
                            </button>
                          </div>
                        </li>
                      ))}
                  </ul>
                  {!requests.some((r) => r.status === PENDING) && <p className="py-8 text-center text-sm panel-muted">درخواست بازی باقی نمانده است.</p>}
                </section>
              </div>
            </>
          )}

          {/* Requests */}
          {showRequests && (
            <section className="glass p-5 md:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-lg font-bold">{compact ? "درخواست‌های اخیر" : "فهرست درخواست‌ها"}</h2>
                {!compact && (
                  <label className="w-full sm:w-64">
                    <span className="sr-only">جستجوی درخواست</span>
                    <input className="panel-input" placeholder="جستجوی عنوان یا کد پیگیری" value={search} onChange={(e) => setSearch(e.target.value)} />
                  </label>
                )}
                {compact && (
                  <button className="p-link" onClick={() => go("درخواست‌های من")}>
                    همه درخواست‌ها
                  </button>
                )}
              </div>
              {!compact && (
                <div className="mb-2 flex flex-wrap gap-2" role="group" aria-label="فیلتر وضعیت">
                  {["همه", ...STATUSES].map((s) => (
                    <button key={s} className="p-chip" aria-pressed={statusFilter === s} onClick={() => setStatusFilter(s)}>
                      {s} {fa(s === "همه" ? base.length : base.filter((r) => r.status === s).length)}
                    </button>
                  ))}
                </div>
              )}
              <ul>
                {rows.map((r) => (
                  <li key={r.id} className="panel-row p-req">
                    <div>
                      <p className="text-sm font-medium">{r.title}</p>
                      <p className="mt-1 text-xs panel-muted">
                        کد {r.id.toLocaleString("fa-IR", { useGrouping: false })}
                        {admin && ` از ${r.name}`} در {r.date}
                      </p>
                      {r.details && (
                        <details className="mt-2 text-xs panel-muted">
                          <summary className="cursor-pointer">توضیحات</summary>
                          <p className="mt-2 max-w-sm whitespace-pre-wrap">{r.details}</p>
                        </details>
                      )}
                    </div>
                    <Steps status={r.status} />
                    <div>
                      {admin ? (
                        <select
                          aria-label={`وضعیت درخواست ${r.id}`}
                          className="panel-input py-1.5 text-xs"
                          value={r.status}
                          onChange={(e) => setStatus(r.id, e.target.value)}
                        >
                          {STATUSES.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      ) : (
                        <Badge>{r.status}</Badge>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              {rows.length === 0 && <p className="py-10 text-center text-sm panel-muted">درخواستی پیدا نشد.</p>}
            </section>
          )}

          {/* New request form (user) */}
          {!admin && tab === "درخواست‌های من" && (
            <section className="glass p-6">
              <h2 className="mb-4 text-lg font-bold">ثبت درخواست جدید</h2>
              <form onSubmit={submitRequest} className="max-w-xl space-y-4">
                <label className="block text-sm font-medium">
                  نوع خدمت
                  <select name="service" className="panel-input mt-2">
                    {["درخواست تسهیلات", "افتتاح حساب", "فعال‌سازی اینترنت بانک", "درخواست کارت اعتباری"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-medium">
                  توضیحات
                  <textarea
                    name="details"
                    required
                    maxLength={1000}
                    rows={3}
                    className="panel-input mt-2"
                    placeholder="درخواست خود را شرح دهید؛ اطلاعات حساس وارد نکنید."
                  />
                </label>
                <button className="panel-btn">ثبت درخواست</button>
              </form>
            </section>
          )}

          {/* Users (admin) */}
          {tab === "کاربران" && (
            <section className="glass p-5 md:p-6">
              <label className="block max-w-sm">
                <span className="sr-only">جستجوی کاربر</span>
                <input className="panel-input" placeholder="جستجوی نام یا ایمیل" value={search} onChange={(e) => setSearch(e.target.value)} />
              </label>
              <ul className="mt-3">
                {users
                  .filter((u) => `${u.name} ${u.email}`.includes(search))
                  .map((u) => (
                    <li key={u.id} className="panel-row flex flex-wrap items-center justify-between gap-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className="p-avatar">{u.name.charAt(0)}</span>
                        <div>
                          <p className="text-sm font-medium">{u.name}</p>
                          <p className="text-xs panel-muted" dir="ltr" style={{ textAlign: "start" }}>
                            {u.email}
                          </p>
                          <p className="mt-1 text-xs panel-muted">آخرین ورود: {u.lastLogin}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge>{u.active ? "فعال" : "غیرفعال"}</Badge>
                        <button
                          className="p-link"
                          onClick={() => {
                            setUsers((prev) => prev.map((item) => (item.id === u.id ? { ...item, active: !item.active } : item)));
                            setNotice("وضعیت کاربر با موفقیت تغییر کرد.");
                          }}
                        >
                          {u.active ? "غیرفعال کردن" : "فعال کردن"}
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
              {!users.some((u) => `${u.name} ${u.email}`.includes(search)) && <p className="py-8 text-center text-sm panel-muted">کاربری پیدا نشد.</p>}
            </section>
          )}

          {/* Profile */}
          {tab === "پروفایل" && (
            <section className="glass p-6">
              <div className="mb-6 flex items-center gap-4">
                <span className="p-avatar" style={{ width: 56, height: 56, fontSize: 22 }}>
                  {name.charAt(0)}
                </span>
                <div>
                  <h2 className="text-lg font-bold">{name}</h2>
                  <p className="text-xs panel-muted" dir="ltr" style={{ textAlign: "start" }}>
                    {email}
                  </p>
                </div>
              </div>
              <form
                className="max-w-xl space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  setNotice("پروفایل با موفقیت ذخیره شد.");
                }}
              >
                <label className="block text-sm font-medium">
                  نام و نام خانوادگی
                  <input required maxLength={80} className="panel-input mt-2" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <label className="block text-sm font-medium">
                  ایمیل
                  <input type="email" required className="panel-input mt-2" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <button className="panel-btn">ذخیره تغییرات</button>
              </form>
            </section>
          )}

          {/* Support */}
          {tab === "پشتیبانی" && (
            <section className="glass space-y-6 p-5 md:p-6">
              <h2 className="text-lg font-bold">پیام‌های پشتیبانی</h2>
              {messages.map((m) => (
                <article key={m.id} className="space-y-2">
                  <div className="flex">
                    <div className="p-bubble me whitespace-pre-wrap">{m.body}</div>
                  </div>
                  {m.reply ? (
                    <div className="flex justify-end">
                      <div className="p-bubble team whitespace-pre-wrap">
                        <p className="mb-1 text-xs font-semibold" style={{ color: "var(--accent)" }}>
                          پاسخ پشتیبانی
                        </p>
                        {m.reply}
                      </div>
                    </div>
                  ) : admin ? (
                    <form
                      className="space-y-3 pt-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const reply = String(new FormData(e.currentTarget).get("reply")).trim();
                        if (!reply) return;
                        setMessages((prev) => prev.map((item) => (item.id === m.id ? { ...item, reply } : item)));
                        setNotice("پاسخ با موفقیت ثبت شد.");
                      }}
                    >
                      <label className="block text-sm font-medium">
                        پاسخ شما
                        <textarea name="reply" required maxLength={1000} rows={3} className="panel-input mt-2" />
                      </label>
                      <button className="panel-btn">ارسال پاسخ</button>
                    </form>
                  ) : (
                    <p className="text-xs" style={{ color: "var(--warn)" }}>
                      در انتظار پاسخ
                    </p>
                  )}
                </article>
              ))}
              {!admin && (
                <form onSubmit={sendMessage} className="space-y-3 border-t border-[var(--line)] pt-6">
                  <label className="block text-sm font-medium">
                    پیام جدید
                    <textarea name="message" required maxLength={1000} rows={3} className="panel-input mt-2" placeholder="پیام خود را بنویسید؛ اطلاعات حساس وارد نکنید." />
                  </label>
                  <button className="panel-btn">ارسال پیام</button>
                </form>
              )}
            </section>
          )}

          <Extras
            tab={tab}
            admin={admin}
            onNotice={setNotice}
            txs={txs}
            balance={balance}
            hidden={hidden}
            setHidden={setHidden}
            frozen={frozen}
            setFrozen={setFrozen}
            holder={name}
            contacts={contacts}
            setContacts={setContacts}
            notifs={notifs}
            setNotifs={setNotifs}
            dark={dark}
            setDark={setDark}
            spend={spend}
            onPay={(mode, contact) => setPay({ mode, contact })}
          />

          <p className="pt-2 text-xs panel-muted">نسخهٔ نمایشی: اطلاعات نمونه‌اند و با بازخوانی صفحه بازنشانی می‌شوند. عملیات بانکی واقعی انجام نمی‌شود.</p>
        </main>
      </div>

      {pay && <PayDialog mode={pay.mode} contacts={contacts} preset={pay.contact} balance={balance} onClose={() => setPay(null)} onSubmit={spend} />}
      {paletteOpen && <Palette items={paletteItems} onClose={() => setPaletteOpen(false)} />}
      {notice && (
        <div role="status" className="p-toast">
          {notice}
        </div>
      )}
    </div>
  );
}
