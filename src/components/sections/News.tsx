"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation, Pagination } from "swiper/modules";
import { news } from "@/content/news";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function News() {
  return (
    <section id="news" aria-labelledby="news-heading" className="news-section relative overflow-hidden border-b border-paper/10 bg-ink py-20 text-paper md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="text-xs tracking-widest text-bronze">روایت مسیر ما</span>
            <h2 id="news-heading" className="mt-3 text-3xl font-bold md:text-5xl">اخبار <span className="font-light text-bronze">و تازه‌ها</span></h2>
            <p className="mt-4 text-sm text-paper/55">تازه‌ترین رویدادها و داستان‌های معین پارسیان پارس</p>
          </div>
          <div className="flex gap-3">
            <button type="button" aria-label="خبر قبلی" className="news-prev grid size-12 place-items-center rounded-full border border-paper/20 text-xl transition-colors hover:border-bronze hover:text-bronze disabled:opacity-30">→</button>
            <button type="button" aria-label="خبر بعدی" className="news-next grid size-12 place-items-center rounded-full border border-paper/20 text-xl transition-colors hover:border-bronze hover:text-bronze disabled:opacity-30">←</button>
          </div>
        </div>
        <Swiper dir="rtl" modules={[Navigation, Pagination, A11y]} spaceBetween={24} slidesPerView={1} breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }} navigation={{ prevEl: ".news-prev", nextEl: ".news-next" }} pagination={{ clickable: true }} a11y={{ prevSlideMessage: "خبر قبلی", nextSlideMessage: "خبر بعدی", paginationBulletMessage: "رفتن به صفحه {{index}}" }} className="news-slider">
          {news.map((item) => (
            <SwiperSlide key={item.slug}>
              <article className="h-full">
                <Link href={`/news/${item.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-paper/10 bg-paper/[0.025] transition-colors hover:border-bronze/60 focus-visible:outline-2 focus-visible:outline-bronze">
                  <div aria-hidden="true" className="news-art relative flex h-48 items-end justify-between overflow-hidden border-b border-paper/10 p-6">
                    <span className="relative z-10 text-xs text-bronze">معین پارسیان پارس</span>
                    <span className="relative z-10 text-5xl font-light text-bronze/55 transition-transform duration-500 group-hover:-translate-y-2">{item.number}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between gap-3 text-xs"><span className="text-bronze">{item.category}</span><time dateTime={item.isoDate} className="text-paper/45">{item.date}</time></div>
                    <h3 className="mt-5 text-lg font-semibold leading-8 transition-colors group-hover:text-bronze">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-paper/55">{item.summary}</p>
                    <span className="mt-auto flex items-center justify-between border-t border-paper/10 pt-5 text-sm text-bronze"><span className="pt-4">ادامه خبر</span><span aria-hidden="true" className="pt-4">↖</span></span>
                  </div>
                </Link>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
