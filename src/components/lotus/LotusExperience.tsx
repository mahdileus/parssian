"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { bus } from "./bus";

gsap.registerPlugin(ScrollTrigger, useGSAP);
const LotusScene = dynamic(() => import("./LotusScene"), { ssr: false });

// Story progress at: hero, services, insights, about, group, faq start, faq end (petals have fallen), renew top at the viewport top (new flower fully open; the rest of renew is a hold with falling dew)
const KNOTS = [0, 0.2, 0.36, 0.52, 0.68, 0.72, 0.88, 1];

export default function LotusExperience() {
  const wrap = useRef<HTMLDivElement>(null);
  const progress = useRef({ v: 0 });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      bus.nx = (e.clientX / window.innerWidth) * 2 - 1;
      bus.ny = -(e.clientY / window.innerHeight) * 2 + 1;
      bus.last = performance.now();
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useGSAP(() => {
    const el = (id: string) => document.getElementById(id)!;
    const top = (id: string) => el(id).getBoundingClientRect().top + window.scrollY;
    const bottom = (id: string) => top(id) + el(id).offsetHeight;

    const update = () => {
      const vh = window.innerHeight;
      const tops = [vh * 0.5, top("services"), top("insights"), top("about"), top("group"), top("faq"), bottom("faq") - vh * 0.5, top("renew") + vh * 0.55];
      const y = window.scrollY + vh * 0.5;
      let p = 1;
      if (y <= tops[0]) p = 0;
      else for (let i = 1; i < tops.length; i++) {
        if (y <= tops[i]) { p = KNOTS[i - 1] + ((KNOTS[i] - KNOTS[i - 1]) * (y - tops[i - 1])) / (tops[i] - tops[i - 1]); break; }
      }
      gsap.to(progress.current, { v: p, duration: 0.9, ease: "power2.out", overwrite: true });
    };

    ScrollTrigger.create({ start: 0, end: "max", onUpdate: update, onRefresh: update });
    // The scene fades out as the footer arrives; scrolling back up brings it back.
    gsap.to(wrap.current, { opacity: 0, ease: "none", scrollTrigger: { trigger: "#renew", start: "bottom 45%", end: "bottom 10%", scrub: true } });
    update();
  });

  return (
    <div ref={wrap} className="pointer-events-none fixed inset-0 z-0">
      <LotusScene progress={progress} />
    </div>
  );
}
