import Link from "next/link";
import Logo from "@/components/layout/Logo";
export const metadata = { title: "ورود نمایشی | پارسیان" };
export default function LoginPage() {
  return <main className="flex min-h-screen items-center justify-center bg-[#f3f2ef] p-5"><div className="w-full max-w-lg rounded-3xl border border-black/5 bg-white p-8 shadow-sm md:p-12"><Link href="/"><Logo /></Link><p className="mt-10 text-sm text-bronze">پارسیان همراه شما</p><h1 className="mt-2 text-3xl font-bold">به پنل خود خوش آمدید</h1><p className="mt-4 text-sm text-ink/60">برای مشاهده نسخه نمایشی، یکی از پنل‌ها را انتخاب کنید. این نسخه ورود واقعی ندارد و تمام اطلاعات آن نمونه است.</p><div className="mt-8 space-y-3"><Link href="/dashboard" className="block rounded-xl bg-ink px-5 py-4 text-white transition hover:bg-bronze">ورود به پنل کاربر ←</Link><Link href="/admin" className="block rounded-xl border border-bronze/30 px-5 py-4 text-bronze transition hover:bg-bronze/5">ورود به پنل ادمین ←</Link></div><Link href="/" className="mt-8 inline-block text-sm text-ink/50 hover:text-bronze">بازگشت به سایت</Link></div></main>;
}
