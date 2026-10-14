"use client";
import Card from "../ui/Card";
import { useInView } from "@/hooks/useInView";

const values = [
  { title: "ساده", text: "مسیرهای کوتاه و زبان روشن برای هر کار بانکی.", d: <path d="M5 12h14M12 5v14" /> },
  { title: "قابل‌اعتماد", text: "امنیت و شفافیت در هر مرحله از خدمت.", d: <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" /> },
  { title: "نزدیک", text: "از اپلیکیشن تا شعبه، همیشه در دسترس.", d: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></> },
];

// The text comes into focus as the flower floats beside it.
export default function About() {
  const { ref, seen } = useInView<HTMLDivElement>(0.3);
  const focus = (delay: number): React.CSSProperties => ({
    filter: seen ? "blur(0)" : "blur(10px)", opacity: seen ? 1 : 0,
    transform: seen ? "none" : "translateY(16px)",
    transition: `all 1.1s cubic-bezier(.2,.7,.2,1) ${delay}s`,
  });
  return (
    <section id="about" className="scroll-mt-16 py-28 md:flex md:min-h-screen md:items-center">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div ref={ref} className="md:w-[52%]">
          <Card className="p-8 md:p-10">
            <div style={focus(0)}>
              <h2 className="text-3xl font-bold text-ink md:text-4xl">درباره ما</h2>
              <span className="mt-4 block h-px bg-bronze transition-all delay-500 duration-1000" style={{ width: seen ? "100%" : "3rem" }} />
              <p className="mt-6 text-lg text-ink/70">
                بانک پارسیان یکی از بانک‌های خصوصی کشور است. این بخش را با متن رسمی معرفی بانک، چشم‌انداز و ارزش‌های سازمانی پر کنید.
              </p>
            </div>
            <ul className="mt-8 grid gap-4 sm:grid-cols-3">
              {values.map((v, i) => (
                <li key={v.title} style={focus(0.25 + i * 0.15)} className="border-t border-bronze/25 pt-4">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b17d56" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{v.d}</svg>
                  <h3 className="mt-3 font-semibold text-ink">{v.title}</h3>
                  <p className="mt-1 text-sm text-ink/60">{v.text}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
}
