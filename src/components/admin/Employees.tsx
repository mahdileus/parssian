"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Ico } from "@/components/panels/Extras";
import "./employees.css";

export type Employee = { id: number; name: string; nationalId: string; phone: string; organization: string; qr: boolean; created: string; updated: string; canEdit: boolean; blocked: boolean };
export const initialEmployees: Employee[] = [
  { id: 1, name: "کارمند نمونه اول", nationalId: "نمونه-۰۰۱", phone: "۰۹•••••••۰۱", organization: "بانک پارسیان", qr: false, created: "۱۴۰۵/۰۷/۰۱", updated: "۱۴۰۵/۰۷/۱۱", canEdit: false, blocked: false },
  { id: 2, name: "کارمند نمونه دوم", nationalId: "نمونه-۰۰۲", phone: "۰۹•••••••۰۲", organization: "معین پارسیان پارس", qr: true, created: "۱۴۰۵/۰۷/۰۲", updated: "۱۴۰۵/۰۷/۱۲", canEdit: true, blocked: false },
  { id: 3, name: "کارمند نمونه سوم", nationalId: "نمونه-۰۰۳", phone: "۰۹•••••••۰۳", organization: "بانک پارسیان", qr: false, created: "۱۴۰۵/۰۷/۰۳", updated: "۱۴۰۵/۰۷/۱۳", canEdit: false, blocked: true },
];
function normalize(value: string) { return value.replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/[\s\u200c-]+/g, "").replace(/[۰-۹]/g, digit => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))).trim(); }

function Dialog({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = ref.current; dialog?.showModal(); return () => dialog?.close(); }, []);
  return <dialog ref={ref} className="employee-dialog" aria-labelledby="employee-dialog-title" onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) { const box = event.currentTarget.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose(); } }}><header><h2 id="employee-dialog-title">{title}</h2><button type="button" className="p-icon-btn" aria-label="بستن پنجره" onClick={onClose}>×</button></header>{children}</dialog>;
}

export default function Employees({ employees, onChange }: { employees: Employee[]; onChange: (employees: Employee[]) => void }) {
  const [query, setQuery] = useState("");
  const [organization, setOrganization] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [notice, setNotice] = useState("");
  const [action, setAction] = useState<{ kind: "edit" | "delete" | "payslip" | "login"; employee: Employee } | null>(null);
  const selectAll = useRef<HTMLInputElement>(null);
  const list = employees.filter(employee => (!organization || employee.organization === organization) && (!status || (status === "blocked" ? employee.blocked : !employee.blocked)) && normalize(`${employee.name} ${employee.nationalId} ${employee.phone} ${employee.organization}`).includes(normalize(query)));
  const visibleIds = list.map(employee => employee.id);
  const checked = visibleIds.length > 0 && visibleIds.every(id => selected.includes(id));
  const selectedVisible = visibleIds.filter(id => selected.includes(id));
  useEffect(() => { if (selectAll.current) selectAll.current.indeterminate = selectedVisible.length > 0 && !checked; }, [selectedVisible.length, checked]);
  function block(ids: number[], blocked: boolean) { onChange(employees.map(employee => ids.includes(employee.id) ? { ...employee, blocked } : employee)); setNotice(blocked ? "دسترسی ردیف‌های نمونه مسدود شد." : "دسترسی ردیف نمونه فعال شد."); }
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!action) return;
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const org = String(data.get("organization") || "").trim();
    if (!name || !org) return;
    onChange(employees.map(employee => employee.id === action.employee.id ? { ...employee, name, organization: org, phone: String(data.get("phone") || "").trim(), nationalId: String(data.get("nationalId") || "").trim(), canEdit: data.has("canEdit"), updated: new Intl.DateTimeFormat("fa-IR", { timeZone: "Asia/Tehran" }).format(new Date()) } : employee));
    setAction(null); setNotice("اطلاعات نمونه ویرایش شد؛ با بازخوانی صفحه بازنشانی می‌شود.");
  }
  return <section className="glass employee-section">
    <div className="employee-toolbar"><div><h2 className="font-semibold">لیست کارمندان</h2><p className="panel-muted mt-1 text-xs">{list.length.toLocaleString("fa-IR")} نفر از {employees.length.toLocaleString("fa-IR")} ردیف نمونه</p></div><label className="employee-search"><Ico n="search" /><span className="sr-only">جست‌وجوی کارمند</span><input type="search" placeholder="نام، کد ملی، تلفن یا سازمان…" value={query} onChange={event => setQuery(event.target.value)} /></label></div>
    <div className="employee-filters"><label>سازمان<select value={organization} onChange={event => setOrganization(event.target.value)}><option value="">همه سازمان‌ها</option>{[...new Set(employees.map(employee => employee.organization))].map(org => <option key={org}>{org}</option>)}</select></label><label>وضعیت<select value={status} onChange={event => setStatus(event.target.value)}><option value="">همه وضعیت‌ها</option><option value="active">فعال</option><option value="blocked">مسدود</option></select></label><button type="button" className="panel-btn-secondary" disabled={!selectedVisible.length} onClick={() => block(selectedVisible, true)}>مسدودسازی انتخاب‌شده‌ها ({selectedVisible.length.toLocaleString("fa-IR")})</button></div>
    <p className="employee-note">نام‌ها و شناسه‌ها نمونه‌اند. تغییرات این جدول فقط در همین پیش‌نمایش نگهداری می‌شوند.</p>
    <div className="employee-table-scroll" role="region" aria-label="جدول کارمندان؛ قابل پیمایش افقی" tabIndex={0}><table className="employee-table"><caption className="sr-only">اطلاعات و عملیات کارمندان</caption><thead><tr><th scope="col"><input ref={selectAll} type="checkbox" aria-label="انتخاب همه کارمندان نمایش‌داده‌شده" checked={checked} disabled={!list.length} onChange={event => setSelected(current => event.target.checked ? [...new Set([...current, ...visibleIds])] : current.filter(id => !visibleIds.includes(id)))} /></th>{["ردیف", "نام", "کد ملی", "شماره تلفن", "نام سازمان", "QR", "تاریخ ثبت", "تاریخ به‌روزرسانی", "دسترسی ویرایش اطلاعات", "عملیات"].map(title => <th scope="col" key={title}>{title}</th>)}</tr></thead><tbody>{list.map((employee, index) => <tr key={employee.id} data-selected={selected.includes(employee.id)}>
      <td><input type="checkbox" aria-label={`انتخاب ${employee.name}`} checked={selected.includes(employee.id)} onChange={event => setSelected(current => event.target.checked ? [...current, employee.id] : current.filter(id => id !== employee.id))} /></td><td className="panel-muted">{(index + 1).toLocaleString("fa-IR")}</td><th scope="row"><span className="employee-name">{employee.name}</span><span className={`employee-status ${employee.blocked ? "is-blocked" : ""}`}>{employee.blocked ? "مسدود" : "فعال"}</span></th><td>{employee.nationalId}</td><td dir="ltr">{employee.phone}</td><td>{employee.organization}</td><td>{employee.qr ? "دارد" : "ندارد"}</td><td>{employee.created}</td><td>{employee.updated}</td><td><span className={employee.canEdit ? "employee-access" : "panel-muted"}>{employee.canEdit ? "دسترسی دارد" : "دسترسی ندارد"}</span></td><td><div className="employee-actions">
        <button type="button" onClick={() => setAction({ kind: "payslip", employee })} aria-label={`فیش حقوقی ${employee.name}`}><Ico n="file" size={14} />فیش حقوقی</button><button type="button" onClick={() => setAction({ kind: "edit", employee })} aria-label={`ویرایش ${employee.name}`}><Ico n="sliders" size={14} />ویرایش</button><button type="button" className="employee-delete" onClick={() => setAction({ kind: "delete", employee })} aria-label={`حذف ${employee.name}`}>حذف</button><button type="button" onClick={() => setAction({ kind: "login", employee })} aria-label={`ورود ${employee.name}`}>ورود</button><button type="button" aria-label={`${employee.blocked ? "فعال‌سازی" : "مسدودسازی"} ${employee.name}`} onClick={() => block([employee.id], !employee.blocked)}><Ico n="shield" size={14} />{employee.blocked ? "فعال‌سازی" : "مسدود"}</button>
      </div></td></tr>)}</tbody></table>{!list.length && <div className="employee-empty"><p>کارمندی با این مشخصات پیدا نشد.</p><button type="button" className="p-link mt-3" onClick={() => { setQuery(""); setOrganization(""); setStatus(""); }}>پاک‌کردن فیلترها</button></div>}</div>
    <p role="status" className="employee-notice">{notice}</p>
    {action && <Dialog title={`${{ edit: "ویرایش اطلاعات", delete: "حذف کارمند", payslip: "فیش حقوقی", login: "ورود به پنل" }[action.kind]} · ${action.employee.name}`} onClose={() => setAction(null)}>
      {action.kind === "edit" ? <form method="post" onSubmit={save} className="space-y-4"><label className="block text-sm">نام و نام خانوادگی<input className="panel-input mt-2" name="name" required maxLength={100} defaultValue={action.employee.name} /></label><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm">کد ملی<input className="panel-input mt-2" name="nationalId" required maxLength={30} defaultValue={action.employee.nationalId} /></label><label className="block text-sm">شماره تلفن<input className="panel-input mt-2" name="phone" dir="ltr" maxLength={25} defaultValue={action.employee.phone} /></label></div><label className="block text-sm">نام سازمان<input className="panel-input mt-2" name="organization" required maxLength={120} defaultValue={action.employee.organization} /></label><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="canEdit" defaultChecked={action.employee.canEdit} />دسترسی ویرایش اطلاعات</label><div className="flex gap-3"><button className="panel-btn">ذخیره تغییرات نمونه</button><button type="button" className="panel-btn-secondary" onClick={() => setAction(null)}>انصراف</button></div></form> : action.kind === "delete" ? <div><p className="text-sm leading-8">این ردیف از فهرست نمونه حذف شود؟ اطلاعات واقعی تغییر نمی‌کند.</p><div className="mt-6 flex gap-3"><button type="button" className="panel-btn-secondary" onClick={() => setAction(null)}>انصراف</button><button type="button" className="panel-btn" onClick={() => { onChange(employees.filter(employee => employee.id !== action.employee.id)); setSelected(current => current.filter(id => id !== action.employee.id)); setAction(null); setNotice("ردیف نمونه حذف شد."); }}>حذف ردیف نمونه</button></div></div> : action.kind === "payslip" ? <div><p className="panel-muted text-sm leading-8">فیشی برای این کارمند به سامانه متصل نشده است. نمایش و دریافت فیش پس از اتصال اطلاعات حقوق فعال می‌شود.</p><p className="mt-4 text-xs panel-muted">سازمان: {action.employee.organization}</p></div> : <div><p className="panel-muted text-sm leading-8">ورود به حساب این کارمند هنوز به سامانه کاربران متصل نیست. پیوند زیر فقط پنل عمومی نمایشی را باز می‌کند.</p><Link className="panel-btn mt-5" href="/dashboard">بازکردن پنل نمایشی کاربر</Link></div>}
    </Dialog>}
  </section>;
}
