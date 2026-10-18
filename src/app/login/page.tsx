import Link from "next/link";
import Logo from "@/components/layout/Logo";
import LoginFlower from "@/components/panels/LoginFlower";
import "@/components/panels/panels.css";

export const metadata = { title: "ورود نمایشی | پارسیان" };

export default function LoginPage() {
  return (
    <main className="panel-world login-world flex min-h-screen flex-col justify-center overflow-hidden p-5 md:p-10">
      <div className="p-bg" aria-hidden="true">
        <span className="c1" />
        <span className="c2" />
        <span className="c3" />
        <span className="c4" />
        <span className="c5" />
      </div>

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
        <Link href="/">
          <Logo />
        </Link>
        <Link href="/" className="panel-muted text-xs hover:underline">
          بازگشت به سایت
        </Link>
      </header>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-6 py-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <section className="glass relative z-10 p-7 md:p-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-1 text-xs panel-muted">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }} />
            نسخهٔ نمایشی
          </span>

          <h1 className="mt-8 text-4xl font-extrabold leading-[1.4] tracking-tight md:text-6xl">
            دنیای شما،
            <br />
            <span className="panel-muted">در یک نگاه.</span>
          </h1>

          <p className="panel-muted mt-5 max-w-sm text-sm leading-8">
            مدیریت حساب‌ها، پیگیری درخواست‌ها و گفت‌وگو با پشتیبانی، همه در یک پنل ساده.
          </p>

          <Link
            href="/dashboard"
            className="panel-btn mt-10 w-full justify-between"
            style={{ paddingBlock: 8, paddingInline: "26px 8px", borderRadius: 999 }}
          >
            <span className="text-base">ورود به پنل</span>
            <span
              aria-hidden="true"
              className="grid h-11 w-11 place-items-center rounded-full"
              style={{ background: "var(--paper)", color: "var(--ink)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M11 6l-6 6 6 6" />
              </svg>
            </span>
          </Link>

          <p className="panel-muted mt-7 border-t border-[var(--line)] pt-5 text-xs leading-6">
            ورود نمایشی و بدون رمز عبور است. اطلاعات نمونه‌اند و این صفحه به حساب بانکی واقعی متصل نیست.
          </p>
        </section>

        <section className="relative min-w-0 text-center lg:-ms-10">
          <LoginFlower />

          <span className="glass absolute right-[2%] top-[12%] hidden px-4 py-2 text-xs font-medium md:block" style={{ borderRadius: 999 }}>
            حساب‌ها و کارت‌ها
          </span>
          <span className="glass absolute left-[0%] top-[46%] hidden px-4 py-2 text-xs font-medium md:block" style={{ borderRadius: 999 }}>
            پیگیری درخواست‌ها
          </span>
          <span className="glass absolute bottom-[14%] right-[10%] hidden px-4 py-2 text-xs font-medium md:block" style={{ borderRadius: 999 }}>
            پشتیبانی
          </span>
        </section>
      </div>

      <footer className="panel-muted mx-auto flex w-full max-w-7xl flex-wrap justify-between gap-3 text-xs">
        <span>پارسیان، همراه روزهای شما</span>
        <span>طراحی فارسی و راست‌به‌چپ، نسخهٔ نمایشی</span>
      </footer>
    </main>
  );
}
