"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  { title: "غنچه", text: "ساده و بسته، روی ساقه" },
  { title: "شکفتن", text: "هر لایه یک خدمت را باز می‌کند" },
  { title: "جدا شدن", text: "گل به سمت خدمات می‌رود" },
];

const facts = [
  { title: "پارسیان من", text: "اپلیکیشن بانکی" },
  { title: "خدمات غیرحضوری", text: "اینترنت بانک و پارس واریز" },
  { title: "گروه مالی پارسیان", text: "لیزینگ، لوتوس، داده‌پردازی" },
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const [p, setP] = useState(0);

  useEffect(() => {
    setReady(true);
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const total = el.offsetHeight - window.innerHeight;
        setP(Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  const active = p < 0.33 ? 0 : p < 0.66 ? 1 : 2;
  // One orchestrated entrance: each block rises in with a small delay.
  const rise = (i: number) => ({
    opacity: ready ? 1 : 0,
    transform: ready ? "none" : "translateY(18px)",
    transition: `opacity .9s ease ${i * 0.12}s, transform .9s cubic-bezier(.2,.7,.2,1) ${i * 0.12}s`,
  });

  return (
    <section ref={ref} id="hero" className="relative h-[170vh]">
      <div className="sticky top-0 flex h-screen items-start px-6 pt-28 md:items-center md:px-20 md:pt-0">
        <div className="w-full max-w-lg">
          <h1 style={rise(0)} className="text-5xl font-bold leading-[1.15] text-ink md:text-7xl">معین پارسیان پارس</h1>
          <span style={rise(1)} className="mt-5 block h-px w-14 bg-bronze" />
          <p style={rise(2)} className="mt-5 max-w-md text-lg text-ink/65">
            بانکداری ساده و آرام؛ از اپلیکیشن تا شعبه، یک مسیر روشن برای کارهای بانکی شما.
          </p>

          <div style={rise(3)} className="mt-8 flex flex-wrap gap-3">
            <a href="#services" className="rounded-full bg-ink px-7 py-2.5 text-sm text-paper transition-colors hover:bg-bronze focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze">
              مشاهده خدمات
            </a>
            <a href="#insights" className="rounded-full border border-bronze/50 px-7 py-2.5 text-sm text-ink transition-colors hover:border-bronze hover:bg-bronze/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze">
              آمار و نمودار
            </a>
          </div>

          <ul style={rise(4)} className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-bronze/25 bg-bronze/20 backdrop-blur-md sm:grid-cols-3">
            {facts.map((f) => (
              <li key={f.title} className="bg-white/60 px-4 py-3 transition-colors hover:bg-white/90">
                <p className="text-sm font-semibold text-ink">{f.title}</p>
                <p className="mt-0.5 text-xs text-ink/55">{f.text}</p>
              </li>
            ))}
          </ul>

          {/* Follows the flower: the active step changes as the page scrolls */}
          <div style={rise(5)} className="mt-10 hidden md:block" aria-hidden>
            <div className="h-px w-full bg-ink/10">
              <div className="h-px bg-bronze transition-[width] duration-300" style={{ width: `${p * 100}%` }} />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-4">
              {steps.map((s, i) => (
                <div key={s.title} className={`transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-35"}`}>
                  <p className="text-sm font-semibold text-ink">{s.title}</p>
                  <p className="text-xs text-ink/60">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
