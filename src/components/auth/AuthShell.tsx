import Link from "next/link";
import type { ReactNode } from "react";
import AuthBackground from "./AuthBackground";
import Logo from "@/components/layout/Logo";
import FadeIn from "@/components/motion/FadeIn";
import "./auth.css";

export default function AuthShell({ children, title, description }: { children: ReactNode; title: string; description: string }) {
  return (
    <div className="auth-page">
      <AuthBackground />
      <header className="auth-header"><Link href="/" aria-label="معین پارسیان پارس؛ صفحه اصلی"><Logo /></Link><Link href="/" className="auth-back">بازگشت به سایت <span aria-hidden="true">←</span></Link></header>
      <main className="auth-main">
        <FadeIn className="auth-card" distance={18}>
          <p className="auth-eyebrow">معین پارسیان پارس</p>
          <h1>{title}</h1><p className="auth-description">{description}</p>
          {children}
        </FadeIn>
        <p className="auth-help">برای راهنمایی، با <Link href="/#contact">شرکت در ارتباط باشید.</Link></p>
      </main>
      <footer className="auth-footer"><span>© معین پارسیان پارس</span><span>همراه شما در مسیر خدمت</span></footer>
    </div>
  );
}
