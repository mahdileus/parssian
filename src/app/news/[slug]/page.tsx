import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Logo from "@/components/layout/Logo";
import Footer from "@/components/layout/Footer";
import { news } from "@/content/news";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return news.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = news.find((item) => item.slug === slug);
  return { title: article ? `${article.title} | معین پارسیان پارس` : "خبر یافت نشد", description: article?.summary };
}

export default async function NewsPage({ params }: Props) {
  const { slug } = await params;
  const article = news.find((item) => item.slug === slug);
  if (!article) notFound();

  return (
    <div id="top" className="min-h-screen bg-ink text-paper">
      <header className="border-b border-paper/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6">
          <Link href="/" aria-label="صفحه اصلی"><Logo light /></Link>
          <Link href="/#news" className="text-sm text-bronze transition-colors hover:text-paper">بازگشت به اخبار ←</Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <article>
          <div className="flex flex-wrap items-center gap-4 text-sm"><span className="text-bronze">{article.category}</span><time dateTime={article.isoDate} className="text-paper/50">{article.date}</time><span className="rounded-full border border-bronze/30 px-3 py-1 text-xs text-bronze">خبر آزمایشی</span></div>
          <h1 className="mt-6 text-3xl font-bold leading-relaxed md:text-5xl md:leading-relaxed">{article.title}</h1>
          <p className="mt-6 text-lg leading-9 text-paper/60">{article.summary}</p>
          <div aria-hidden="true" className="news-art relative my-10 flex h-56 items-end justify-between overflow-hidden rounded-2xl border border-bronze/25 p-8 md:h-72"><span className="relative z-10 text-bronze">معین پارسیان پارس</span><span className="relative z-10 text-7xl text-bronze/50">{article.number}</span></div>
          <div className="space-y-6 text-base leading-9 text-paper/75">{article.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </article>
        <aside aria-label="سایر اخبار" className="mt-16 border-t border-paper/15 pt-8">
          <h2 className="text-xl font-semibold">سایر اخبار</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">{news.filter((item) => item.slug !== slug).slice(0, 2).map((item) => <Link key={item.slug} href={`/news/${item.slug}`} className="rounded-xl border border-paper/10 p-5 text-sm leading-7 transition-colors hover:border-bronze hover:text-bronze">{item.title}<span aria-hidden="true" className="mr-3">←</span></Link>)}</div>
        </aside>
      </main>
      <Footer homePath="/" />
    </div>
  );
}
