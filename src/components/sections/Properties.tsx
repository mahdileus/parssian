"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import { properties } from "@/content/properties";
import Section from "./Section";

export default function Properties() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowLeft") next = (index + 1) % properties.length;
    else if (event.key === "ArrowRight") next = (index - 1 + properties.length) % properties.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = properties.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <Section id="properties" title="مجموعه‌ها و مراکز" lead="آشنایی با مجتمع‌های تجاری، اداری و اقامتی معرفی‌شده در سبد مجموعه‌های معین پارسیان پارس؛ از تهران تا مشهد.">
      <div className="group rounded-2xl border border-bronze/25 bg-white/60 p-6 backdrop-blur-md  p-8 md:p-10">
        <div role="tablist" aria-label="انتخاب مجموعه" className="flex overflow-x-auto border-b border-bronze/20 px-3 sm:px-6">
          {properties.map((property, index) => (
            <button key={property.id} ref={el => { tabs.current[index] = el; }} type="button" role="tab" id={`property-tab-${property.id}`} aria-controls={`property-panel-${property.id}`} aria-selected={active === index} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => onKeyDown(event, index)} className={`shrink-0 border-b-2 px-4 py-5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-bronze sm:px-6 ${active === index ? "border-bronze font-semibold text-ink" : "border-transparent text-ink/55 hover:text-bronze"}`}>
              <span aria-hidden="true" className="me-2 text-xs text-bronze">{(index + 1).toLocaleString("fa-IR", { minimumIntegerDigits: 2 })}</span>{property.label}
            </button>
          ))}
        </div>
        {properties.map((property, index) => (
          <div key={property.id} role="tabpanel" id={`property-panel-${property.id}`} aria-labelledby={`property-tab-${property.id}`} hidden={active !== index} tabIndex={0} className="p-5 focus-visible:outline-2 focus-visible:outline-bronze sm:p-8 md:p-10">
            <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_1fr]">
              <div>
                <p className="text-xs text-bronze">{property.location}</p>
                <h3 className="mt-3 text-2xl font-semibold leading-relaxed md:text-3xl">{property.title}</h3>
                <div className="mt-5 space-y-4 text-sm leading-8 text-ink/70">{property.description.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
              </div>
              <figure className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-bronze/10">
                <Image src={property.image} alt={`نمای ${property.title}`} fill sizes="(max-width: 1024px) 90vw, 480px" className="object-cover" />
              </figure>
            </div>
            <dl className="my-8 grid grid-cols-2 gap-5 border-y border-bronze/20 py-6 md:grid-cols-4">
              {property.stats.map(stat => <div key={stat.label}><dt className="text-xs text-ink/55">{stat.label}</dt><dd className="mt-2 text-base font-semibold text-ink md:text-lg">{stat.value}</dd></div>)}
            </dl>
            <div className="grid gap-8 md:grid-cols-2">
              {property.groups.map(group => <div key={group.title}><h4 className="mb-4 font-semibold">{group.title}</h4><ul className="space-y-3 text-sm leading-7 text-ink/70">{group.items.map(item => <li key={item} className="flex items-start gap-3"><span aria-hidden="true" className="mt-3 size-1 shrink-0 rounded-full bg-bronze" /><span>{item}</span></li>)}</ul></div>)}
            </div>
            {property.address && <address className="mt-8 border-t border-bronze/20 pt-6 text-sm not-italic leading-8 text-ink/70"><p><span className="font-semibold text-ink">نشانی: </span>{property.address}</p><div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2"><span className="text-ink">تلفن:</span>{property.phones?.map(phone => <a key={phone} href={`tel:+98${phone.slice(1)}`} dir="ltr" className="rounded text-bronze hover:text-ink focus-visible:outline-2 focus-visible:outline-bronze">{phone}</a>)}{property.fax && <span>نمابر: <bdi>{property.fax}</bdi></span>}</div></address>}
            {property.note && <p className="mt-5 rounded-xl border border-bronze/15 bg-bronze/5 px-4 py-3 text-xs leading-7 text-ink/60">{property.note}</p>}
          </div>
        ))}
      </div>
    </Section>
  );
}
