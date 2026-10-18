"use client";
import { useInView } from "@/hooks/useInView";

// Transparent closing band, two screens tall: a new flower rises from the pond and opens while dew keeps falling.
// The text is sticky so it stays on screen during the whole hold, and the scene stays fully visible above the footer.
export default function Renew() {
  const { ref, seen } = useInView<HTMLDivElement>(0.3);
  return (
    <section id="renew" className="relative h-[200vh]">
      <div className="sticky top-0 flex h-screen items-start justify-center px-6 pt-[16vh] text-center">
        <div ref={ref} className="max-w-xl" style={{ opacity: seen ? 1 : 0, transform: seen ? "none" : "translateY(14px)", filter: seen ? "blur(0)" : "blur(8px)", transition: "all 1.2s cubic-bezier(.2,.7,.2,1)" }}>
          <h2 className="text-3xl font-bold text-ink md:text-5xl">همراه شما در مسیر خدمت</h2>
          <span className="mx-auto mt-4 block h-px w-12 bg-bronze" />
          <p className="mt-5 text-ink/65">برای ارتباط درباره خدمات و زمینه‌های همکاری، با معین پارسیان پارس در تماس باشید.</p>
          <a href="#contact" className="mt-8 inline-block rounded-full bg-ink px-8 py-2.5 text-sm text-paper transition-colors hover:bg-bronze focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze">
            ارتباط با شرکت
          </a>
        </div>
      </div>
    </section>
  );
}
