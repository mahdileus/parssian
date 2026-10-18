"use client";
import { useState } from "react";

export const fa = (n: number) => n.toLocaleString("fa-IR");

export type Tx = { id: string; title: string; category: string; amount: number; date: string };
export type Notif = { id: number; text: string; time: string; read: boolean };

export const months = ["اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر"];

/* ---------- small shared pieces ---------- */

const paths = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  bell: '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  moon: '<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path d="M3 3l18 18"/>',
  transfer: '<path d="M7 7h13M16 3l4 4-4 4M17 17H4M8 13l-4 4 4 4"/>',
  bill: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  card: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/>',
  home: '<path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M18 14.3c1.8.8 3 2.6 3 5.7"/>',
  user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7"/>',
  list: '<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r=".8"/><circle cx="4" cy="12" r=".8"/><circle cx="4" cy="18" r=".8"/>',
  chart: '<path d="M4 20V11M10 20V5M16 20v-6M2 20h20"/>',
  message: '<path d="M4 5h16v11H9l-5 4z"/>',
  sliders: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
  grid: '<rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/>',
  file: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>',
  shield: '<path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z"/>',
  activity: '<path d="M3 12h4l3-7 4 14 3-7h4"/>',
} as const;

export const navIcons: Record<string, keyof typeof paths> = {
  "نمای کلی": "home",
  "کاربران": "users",
  "درخواست‌ها": "list",
  "خدمات": "grid",
  "مدیریت محتوا": "file",
  "سطوح دسترسی": "shield",
  "گزارش‌ها": "chart",
  "فعالیت‌ها": "activity",
  "پشتیبانی": "message",
  "اعلان‌ها": "bell",
  "تنظیمات": "sliders",
  "حساب‌ها و کارت‌ها": "card",
  "تراکنش‌ها": "transfer",
  "درخواست‌های من": "list",
  "مخاطبان": "users",
  "پروفایل": "user",
};

export function Ico({ n, size = 17 }: { n: keyof typeof paths; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: paths[n] }}
    />
  );
}

export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" className={className}>
      <path d="M4 12c4 0 7 2 8 6-4 1-7-1-8-6Z" fill="currentColor" opacity=".55" />
      <path d="M24 12c-1 5-4 7-8 6 1-4 4-6 8-6Z" fill="currentColor" opacity=".55" />
      <path d="M14 3c3 4 5 7 5 11a5 5 0 0 1-10 0c0-4 2-7 5-11Z" fill="currentColor" />
    </svg>
  );
}

/** Quiet geometric shapes for the page backdrop. */
export function Shapes() {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 1 } as const;
  return (
    <div className="p-geo" aria-hidden="true">
      <svg className="g1" viewBox="0 0 120 120" {...s}>
        <circle cx="60" cy="60" r="58" />
        <circle cx="60" cy="60" r="38" />
        <circle cx="60" cy="60" r="18" />
      </svg>
      <svg className="g2" viewBox="0 0 40 40" {...s}>
        <path d="M20 6v28M6 20h28" />
      </svg>
      <svg className="g3" viewBox="0 0 40 40" {...s}>
        <rect x="9" y="9" width="22" height="22" transform="rotate(45 20 20)" />
      </svg>
      <svg className="g4" viewBox="0 0 40 40" {...s}>
        <path d="M20 6 35 32H5z" />
      </svg>
      <svg className="g5" viewBox="0 0 20 20" fill="currentColor">
        <circle cx="10" cy="10" r="6" />
      </svg>
      <svg className="g6" viewBox="0 0 90 54" fill="currentColor">
        {Array.from({ length: 15 }, (_, i) => (
          <circle key={i} cx={8 + (i % 5) * 18} cy={9 + Math.floor(i / 5) * 18} r="2" />
        ))}
      </svg>
      <Mark className="g7" />
    </div>
  );
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} className="p-switch" onClick={() => onChange(!checked)} />
  );
}

export function BarChart({ data, labels, unit = "" }: { data: number[]; labels: string[]; unit?: string }) {
  const max = Math.max(...data);
  return (
    <div>
      <div
        className="flex h-44 items-end gap-3"
        role="img"
        aria-label={`نمودار: ${labels.map((l, i) => `${l} ${fa(data[i])}`).join("، ")}`}
      >
        {data.map((v, i) => (
          <div key={labels[i]} className="flex h-full flex-1 flex-col items-center justify-end gap-2" title={`${labels[i]}: ${fa(v)} ${unit}`}>
            <span className="text-xs panel-muted">{fa(v)}</span>
            <div className={`panel-bar w-full max-w-12 ${i === data.length - 1 ? "is-now" : ""}`} style={{ height: `${(v / max) * 78}%` }} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-3 text-xs panel-muted">
        {labels.map((l) => (
          <span key={l} className="flex-1 text-center">
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

export function BankCard({
  holder,
  frozen,
  balance,
  hidden,
  onToggle,
}: {
  holder: string;
  frozen: boolean;
  balance: number;
  hidden: boolean;
  onToggle: () => void;
}) {
  return (
    <section className={`panel-card ${frozen ? "is-frozen" : ""}`} aria-label="کارت بانکی نمونه">
      <Mark className="card-mark" />
      <div className="flex items-start justify-between text-sm">
        <span className="font-semibold tracking-wide">PARSIAN BLACK</span>
        <span className="opacity-80">{frozen ? "مسدود موقت" : "فعال"}</span>
      </div>
      <div>
        <p className="text-xs opacity-70">موجودی نمونه (تومان)</p>
        <div className="mt-1 flex items-center gap-3">
          <p className="text-4xl font-bold tracking-tight">{hidden ? "••••••••" : fa(balance)}</p>
          <button type="button" onClick={onToggle} aria-label={hidden ? "نمایش موجودی" : "پنهان کردن موجودی"} className="p-icon-btn on-dark">
            <Ico n={hidden ? "eyeOff" : "eye"} />
          </button>
        </div>
      </div>
      <div className="flex items-end justify-between text-sm">
        <span>{holder}</span>
        <span dir="ltr" className="tracking-widest opacity-80">
          6221 •••• •••• 4820
        </span>
      </div>
    </section>
  );
}

/* ---------- tabs ---------- */

export type ExtraProps = {
  tab: string;
  admin: boolean;
  onNotice: (s: string) => void;
  txs: Tx[];
  balance: number;
  hidden: boolean;
  setHidden: (v: boolean) => void;
  frozen: boolean;
  setFrozen: (v: boolean) => void;
  holder: string;
  contacts: string[];
  setContacts: (c: string[]) => void;
  notifs: Notif[];
  setNotifs: (n: Notif[]) => void;
  dark: boolean;
  setDark: (v: boolean) => void;
  spend: (amount: number, title: string, category: string) => boolean;
  onPay: (mode: "transfer" | "bill", contact?: string) => void;
};

const GOAL = 30_000_000;

export default function Extras(p: ExtraProps) {
  const { tab, admin, onNotice, txs, contacts, notifs } = p;
  const [filter, setFilter] = useState("همه");
  const [q, setQ] = useState("");
  const [saved, setSaved] = useState(18_000_000);
  const [content, setContent] = useState([
    { title: "خدمات دیجیتال پارسیان", published: true },
    { title: "راهنمای درخواست تسهیلات", published: false },
  ]);
  const [services, setServices] = useState([true, true, false]);
  const [roles, setRoles] = useState(["مدیر", "پشتیبان", "ناظر"]);
  const [settings, setSettings] = useState({ sms: true, email: false, motion: true });

  function exportReport() {
    const csv =
      "\uFEFFعنوان,مبلغ (تومان),تاریخ\n" + txs.map((t) => `${t.title},${t.amount},${t.date}`).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "parsian-demo-report.csv";
    a.click();
    URL.revokeObjectURL(url);
    onNotice("گزارش داده‌های نمونه دانلود شد.");
  }

  /* Accounts & cards */
  if (tab === "حساب‌ها و کارت‌ها") {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <BankCard holder={p.holder} frozen={p.frozen} balance={p.balance} hidden={p.hidden} onToggle={() => p.setHidden(!p.hidden)} />
          <section className="glass flex flex-col gap-4 p-6">
            <h2 className="font-bold">کنترل کارت</h2>
            <p className="panel-muted text-sm leading-7">
              {p.frozen ? "کارت نمونه موقتاً مسدود است و تا فعال‌سازی، انتقال و پرداختی انجام نمی‌شود." : "کارت نمونه فعال است. هر زمان بخواهید می‌توانید آن را موقتاً مسدود کنید."}
            </p>
            <div className="mt-auto flex flex-wrap gap-3">
              <button
                className="panel-btn"
                onClick={() => {
                  p.setFrozen(!p.frozen);
                  onNotice(p.frozen ? "کارت نمونه فعال شد." : "کارت نمونه موقتاً مسدود شد.");
                }}
              >
                {p.frozen ? "فعال‌سازی کارت" : "مسدودسازی موقت"}
              </button>
              <button className="panel-btn-secondary" onClick={() => p.onPay("transfer")}>
                انتقال وجه
              </button>
            </div>
          </section>
        </div>

        <section className="glass p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-bold">هدف پس‌انداز: سفر</h2>
              <p className="panel-muted mt-1 text-sm">
                {fa(saved)} از {fa(GOAL)} تومان
              </p>
            </div>
            <span className="text-2xl font-bold">{fa(Math.round((saved / GOAL) * 100))}٪</span>
          </div>
          <div
            className="p-progress mt-5"
            role="progressbar"
            aria-valuenow={Math.round((saved / GOAL) * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="پیشرفت پس‌انداز"
          >
            <span style={{ width: `${(saved / GOAL) * 100}%` }} />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="panel-muted ml-1 text-sm">واریز به هدف:</span>
            {[500_000, 1_000_000, 5_000_000].map((a) => (
              <button
                key={a}
                className="p-chip"
                disabled={saved >= GOAL}
                onClick={() => {
                  const amt = Math.min(a, GOAL - saved);
                  if (p.spend(amt, "واریز به هدف پس‌انداز", "انتقال")) setSaved((s) => s + amt);
                }}
              >
                {fa(a)}
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  /* Transactions */
  if (tab === "تراکنش‌ها") {
    const income = txs.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const expense = txs.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
    const list = txs.filter((t) => (filter === "همه" || t.category === filter) && `${t.title} ${t.id}`.includes(q.trim()));
    return (
      <section className="glass p-5 md:p-6">
        <div className="grid grid-cols-2 gap-4 border-b border-[var(--line)] pb-5">
          <div>
            <p className="panel-muted text-xs">واریز</p>
            <p className="mt-1 text-xl font-bold" style={{ color: "var(--accent)" }}>
              {fa(income)}
            </p>
          </div>
          <div>
            <p className="panel-muted text-xs">برداشت</p>
            <p className="mt-1 text-xl font-bold">{fa(expense)}</p>
          </div>
        </div>
        <div className="my-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2" role="group" aria-label="فیلتر دسته‌بندی">
            {["همه", "واریز", "خرید", "قبض", "انتقال"].map((x) => (
              <button key={x} className="p-chip" aria-pressed={filter === x} onClick={() => setFilter(x)}>
                {x}
              </button>
            ))}
          </div>
          <label className="w-full sm:w-60">
            <span className="sr-only">جستجوی تراکنش</span>
            <input className="panel-input" placeholder="جستجوی عنوان یا کد" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
        </div>
        <ul>
          {list.map((t) => (
            <li className="panel-row flex flex-wrap items-center justify-between gap-3 py-4" key={t.id}>
              <div>
                <p className="text-sm font-medium">{t.title}</p>
                <p className="panel-muted mt-1 text-xs">
                  {t.date} {t.id}
                </p>
              </div>
              <span className="text-sm font-semibold" style={{ color: t.amount > 0 ? "var(--accent)" : "var(--ink)" }} dir="ltr">
                {fa(t.amount)} تومان
              </span>
            </li>
          ))}
        </ul>
        {!list.length && <p className="panel-muted py-10 text-center text-sm">تراکنشی پیدا نشد.</p>}
        <button className="panel-btn-secondary mt-4" onClick={exportReport}>
          دریافت صورت‌حساب CSV
        </button>
      </section>
    );
  }

  /* Contacts */
  if (tab === "مخاطبان") {
    return (
      <section className="glass p-5 md:p-6">
        <h2 className="mb-2 font-bold">مخاطبان منتخب</h2>
        <ul>
          {contacts.map((c) => (
            <li key={c} className="panel-row flex items-center justify-between gap-3 py-4">
              <span className="flex items-center gap-3 text-sm font-medium">
                <span className="p-avatar">{c.charAt(0)}</span>
                {c}
              </span>
              <span className="flex items-center gap-4">
                <button className="p-link" onClick={() => p.onPay("transfer", c)}>
                  انتقال وجه
                </button>
                <button className="p-link is-bad" onClick={() => p.setContacts(contacts.filter((x) => x !== c))}>
                  حذف
                  <span className="sr-only"> {c}</span>
                </button>
              </span>
            </li>
          ))}
        </ul>
        {!contacts.length && <p className="panel-muted py-8 text-center text-sm">هنوز مخاطبی ندارید. اولین مخاطب را اضافه کنید.</p>}
        <form
          className="mt-5 flex flex-wrap gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const name = String(new FormData(form).get("contact")).trim();
            if (!name) return;
            if (contacts.includes(name)) {
              onNotice("این مخاطب از قبل وجود دارد.");
              return;
            }
            p.setContacts([...contacts, name]);
            form.reset();
            onNotice("مخاطب نمونه اضافه شد.");
          }}
        >
          <label className="grow">
            <span className="sr-only">نام مخاطب</span>
            <input required name="contact" maxLength={60} className="panel-input" placeholder="نام مخاطب جدید" />
          </label>
          <button className="panel-btn">افزودن مخاطب</button>
        </form>
      </section>
    );
  }

  /* Notifications */
  if (tab === "اعلان‌ها") {
    const unread = notifs.filter((n) => !n.read).length;
    return (
      <section className="glass p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-bold">مرکز اعلان‌ها</h2>
          <button
            className="panel-btn-secondary"
            disabled={!unread}
            onClick={() => {
              p.setNotifs(notifs.map((n) => ({ ...n, read: true })));
              onNotice("همه اعلان‌ها خوانده شدند.");
            }}
          >
            {unread ? "خواندن همه" : "همه خوانده شده‌اند"}
          </button>
        </div>
        <ul className="mt-2">
          {notifs.map((n) => (
            <li key={n.id} className="panel-row">
              <button
                className="flex w-full items-start gap-4 py-5 text-start"
                style={{ background: "none", border: 0, font: "inherit", color: "inherit", cursor: "pointer" }}
                onClick={() => p.setNotifs(notifs.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}
              >
                <span
                  className="mt-2 h-2 w-2 shrink-0 rounded-full"
                  style={{ background: n.read ? "var(--line)" : "var(--accent)" }}
                  aria-label={n.read ? "خوانده شده" : "خوانده نشده"}
                />
                <span>
                  <span className="block text-sm" style={{ fontWeight: n.read ? 400 : 600 }}>
                    {n.text}
                  </span>
                  <span className="panel-muted mt-1 block text-xs">{n.time}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  /* Settings */
  if (tab === "تنظیمات") {
    const rows: { label: string; hint: string; checked: boolean; set: (v: boolean) => void }[] = [
      { label: "تم تیره", hint: "ظاهر پنل را برای نور کم راحت‌تر می‌کند.", checked: p.dark, set: p.setDark },
      { label: "اعلان پیامکی", hint: "در این نسخه فقط ثبت نمایشی می‌شود.", checked: settings.sms, set: (v) => setSettings({ ...settings, sms: v }) },
      { label: "اعلان ایمیلی", hint: "در این نسخه فقط ثبت نمایشی می‌شود.", checked: settings.email, set: (v) => setSettings({ ...settings, email: v }) },
      { label: "نمایش انیمیشن", hint: "در این نسخه فقط ثبت نمایشی می‌شود.", checked: settings.motion, set: (v) => setSettings({ ...settings, motion: v }) },
    ];
    return (
      <section className="glass p-5 md:p-6">
        <h2 className="mb-2 font-bold">ترجیحات پنل</h2>
        <ul>
          {rows.map((r) => (
            <li key={r.label} className="panel-row flex items-center justify-between gap-4 py-5">
              <div>
                <p className="text-sm font-medium">{r.label}</p>
                <p className="panel-muted mt-1 text-xs">{r.hint}</p>
              </div>
              <Switch
                checked={r.checked}
                label={r.label}
                onChange={(v) => {
                  r.set(v);
                  onNotice("تنظیمات نمونه ذخیره شد.");
                }}
              />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  /* Reports */
  if (tab === "گزارش‌ها") {
    const byCat = Object.entries(
      txs.filter((t) => t.amount < 0).reduce<Record<string, number>>((a, t) => ({ ...a, [t.category]: (a[t.category] || 0) + Math.abs(t.amount) }), {})
    ).sort((a, b) => b[1] - a[1]);
    const top = byCat[0]?.[1] || 1;
    return (
      <div className="space-y-6">
        <section className="glass p-5 md:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-bold">{admin ? "گزارش عملکرد خدمات" : "گزارش هزینه‌های نمونه"}</h2>
              <p className="panel-muted mt-1 text-xs">شش ماه گذشته، اطلاعات نمایشی</p>
            </div>
            <button className="panel-btn-secondary" onClick={exportReport}>
              خروجی CSV تراکنش‌ها
            </button>
          </div>
          <BarChart data={[42, 68, 55, 88, 74, 95]} labels={months} unit={admin ? "درخواست" : "میلیون تومان"} />
        </section>
        {!admin && (
          <section className="glass p-5 md:p-6">
            <h2 className="mb-5 font-bold">هزینه به تفکیک دسته</h2>
            <ul className="space-y-4">
              {byCat.map(([c, v]) => (
                <li key={c}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>{c}</span>
                    <span className="panel-muted">{fa(v)} تومان</span>
                  </div>
                  <div className="p-progress">
                    <span style={{ width: `${(v / top) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    );
  }

  /* Content (admin) */
  if (tab === "مدیریت محتوا") {
    return (
      <section className="glass p-5 md:p-6">
        <h2 className="mb-2 font-bold">محتوای سایت، پیش‌نمایش مدیریت</h2>
        <ul>
          {content.map((c, i) => (
            <li className="panel-row flex flex-wrap items-center justify-between gap-3 py-4" key={c.title}>
              <div>
                <p className="text-sm font-medium">{c.title}</p>
                <p className="panel-muted mt-1 text-xs">{c.published ? "منتشرشده (نمونه)" : "پیش‌نویس"}</p>
              </div>
              <button
                className="panel-btn-secondary"
                onClick={() => {
                  setContent((prev) => prev.map((x, j) => (i === j ? { ...x, published: !x.published } : x)));
                  onNotice("وضعیت انتشار نمونه تغییر کرد؛ محتوای سایت اصلی تغییر نکرده است.");
                }}
              >
                {c.published ? "تبدیل به پیش‌نویس" : "انتشار نمونه"}
              </button>
            </li>
          ))}
        </ul>
        <form
          className="mt-5 flex flex-wrap gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const title = String(new FormData(form).get("title")).trim();
            if (!title) return;
            if (content.some((c) => c.title === title)) {
              onNotice("این عنوان از قبل وجود دارد.");
              return;
            }
            setContent([...content, { title, published: false }]);
            form.reset();
            onNotice("پیش‌نویس جدید اضافه شد.");
          }}
        >
          <label className="grow">
            <span className="sr-only">عنوان مطلب</span>
            <input name="title" required maxLength={100} className="panel-input" placeholder="عنوان مطلب جدید" />
          </label>
          <button className="panel-btn">افزودن پیش‌نویس</button>
        </form>
      </section>
    );
  }

  /* Services (admin) */
  if (tab === "خدمات") {
    return (
      <section className="glass p-5 md:p-6">
        <h2 className="mb-2 font-bold">مدیریت خدمات نمونه</h2>
        <ul>
          {["تسهیلات", "افتتاح حساب", "بانکداری سازمانی"].map((s, i) => (
            <li key={s} className="panel-row flex items-center justify-between py-5">
              <div>
                <p className="text-sm font-medium">{s}</p>
                <p className="panel-muted mt-1 text-xs">{services[i] ? "فعال" : "غیرفعال"}</p>
              </div>
              <Switch
                checked={services[i]}
                label={s}
                onChange={(v) => {
                  setServices((prev) => prev.map((x, j) => (j === i ? v : x)));
                  onNotice("وضعیت خدمت نمونه تغییر کرد.");
                }}
              />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  /* Roles (admin) */
  if (tab === "سطوح دسترسی") {
    return (
      <section className="glass p-5 md:p-6">
        <h2 className="font-bold">نقش‌های تیم مدیریت</h2>
        <p className="panel-muted mt-2 text-xs">این تنظیمات نمایشی هستند و مجوز واقعی ایجاد نمی‌کنند.</p>
        <ul className="mt-2">
          {["مدیر سیستم", "کارشناس پشتیبانی", "کارشناس خدمات"].map((n, i) => (
            <li key={n} className="panel-row flex flex-wrap items-center justify-between gap-3 py-4">
              <span className="text-sm font-medium">{n}</span>
              <select
                className="panel-input max-w-40"
                aria-label={`نقش ${n}`}
                value={roles[i]}
                onChange={(e) => {
                  setRoles((prev) => prev.map((x, j) => (j === i ? e.target.value : x)));
                  onNotice("نقش نمونه به‌روزرسانی شد.");
                }}
              >
                {["مدیر", "پشتیبان", "ناظر"].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  /* Activity (admin) */
  if (tab === "فعالیت‌ها") {
    return (
      <section className="glass p-5 md:p-6">
        <h2 className="mb-5 font-bold">تاریخچه فعالیت نمونه</h2>
        <ol>
          {["بررسی درخواست تسهیلات توسط کارشناس", "ورود کاربر نمونه به پنل", "ثبت پاسخ پشتیبانی", "ایجاد پیش‌نویس محتوای جدید"].map((s, i) => (
            <li key={s} className="relative py-4 pr-6" style={{ borderInlineStart: "1px solid var(--line)", paddingInlineStart: 24, paddingRight: 0 }}>
              <span className="absolute top-7 h-2 w-2 rounded-full" style={{ insetInlineStart: -4.5, background: "var(--accent)" }} />
              <p className="text-sm">{s}</p>
              <p className="panel-muted mt-1 text-xs">{fa(i + 1)} ساعت پیش</p>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return null;
}
