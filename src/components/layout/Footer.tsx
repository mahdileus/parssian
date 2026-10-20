import Logo from "./Logo";
import { nav, contact, services } from "@/content/site";

const col = "mb-4 text-sm font-semibold text-paper";
const link = "text-sm text-paper/65 transition-colors hover:text-bronze";

export default function Footer({ homePath = "" }: { homePath?: string }) {
  return (
    <footer className="bg-ink text-paper/85">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-sm text-paper/60">تأمین نیروی انسانی، اداره مراکز رفاهی و اقامتی و ارائه خدمات اداری، فنی و پشتیبانی به سازمان‌ها.</p>
          <a href="#top" className="mt-6 inline-flex items-center gap-2 rounded-full border border-paper/20 px-4 py-1.5 text-sm text-paper transition-colors hover:border-bronze hover:text-bronze">
            بازگشت به بالا <span aria-hidden>↑</span>
          </a>
        </div>
        <div><h3 className={col}>دسترسی سریع</h3><ul className="space-y-2">{nav.map((n) => <li key={n.href}><a className={link} href={`${homePath}${n.href}`}>{n.label}</a></li>)}</ul></div>
        <div><h3 className={col}>خدمات</h3><ul className="space-y-2">{services.map((s) => <li key={s.title}><a className={link} href={`${homePath}#services`}>{s.title}</a></li>)}</ul></div>
        <div><h3 className={col}>تماس با ما</h3><address className="space-y-3 text-sm not-italic text-paper/65"><p className="leading-7">{contact.address}</p><p><a className={link} href={contact.phoneHref} dir="ltr">{contact.phone}</a></p>{contact.emails.map(email => <p key={email}><a className={`${link} inline-block break-all`} dir="ltr" href={`mailto:${email}`}>{email}</a></p>)}</address></div>
      </div>
      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-5 text-xs text-paper/50">
          <span>© معین پارسیان پارس. همه حقوق محفوظ است.</span>
          <span>شرکت معین پارسیان پارس</span>
        </div>
      </div>
    </footer>
  );
}
