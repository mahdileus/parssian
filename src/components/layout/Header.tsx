"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import { nav } from "@/content/site";

export default function Header() {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const [p, setP] = useState(0);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? window.scrollY / max : 0);
      setStuck(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive("#" + e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    nav.forEach((n) => { const el = document.querySelector(n.href); if (el) io.observe(el); });
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md transition-all duration-300 ${stuck ? "border-bronze/20 bg-paper/85" : "border-transparent bg-paper/40"}`}>
      <div className={`mx-auto flex max-w-6xl items-center justify-between px-6 transition-all duration-300 ${stuck ? "h-14" : "h-16"}`}>
        <a href="#top" aria-label="صفحه اصلی"><Logo /></a>
        <nav className="hidden gap-7 text-[0.95rem] md:flex" aria-label="منوی اصلی">
          {nav.map((n) => (
            <a key={n.href} href={n.href} aria-current={active === n.href ? "true" : undefined}
              className={`relative py-1 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-right after:bg-bronze after:transition-transform focus-visible:outline-2 focus-visible:outline-bronze ${active === n.href ? "text-bronze after:scale-x-100" : "text-ink/75 after:scale-x-0 hover:text-ink hover:after:scale-x-100"}`}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href="#services" className="hidden rounded-full bg-ink px-5 py-1.5 text-sm text-paper transition-colors hover:bg-bronze sm:inline-block">ورود / ثبت نام</a>
          <button type="button" aria-label="منو" aria-expanded={open} onClick={() => setOpen(!open)} className="grid h-9 w-9 place-items-center rounded-full border border-bronze/30 md:hidden">
            <span className="relative block h-3 w-4">
              <span className={`absolute inset-x-0 h-px bg-ink transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute inset-x-0 top-1.5 h-px bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`absolute inset-x-0 h-px bg-ink transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>
      <div className={`grid transition-[grid-template-rows] duration-300 md:hidden ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <nav className="overflow-hidden px-6" aria-label="منوی موبایل">
          {nav.map((n) => <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="block border-t border-bronze/15 py-3 text-ink/80">{n.label}</a>)}
        </nav>
      </div>
      <div className="h-0.5 origin-right bg-bronze" style={{ transform: `scaleX(${p})` }} aria-hidden />
    </header>
  );
}
