"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Keep the content mounted so changing tabs does not reset panel state.
export function usePanelTransition(initialTab: string) {
  const [tab, setTab] = useState(initialTab);
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const contentRef = useRef<HTMLElement>(null);
  const animation = useRef<Animation | null>(null);
  const target = useRef(initialTab);
  const previous = useRef(initialTab);
  const revision = useRef(0);
  const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => () => {
    revision.current += 1;
    animation.current?.cancel();
  }, []);

  useLayoutEffect(() => {
    if (previous.current === tab) return;
    previous.current = tab;
    animation.current?.cancel();
    const element = contentRef.current;
    if (!element || reducedMotion()) return;
    animation.current = element.animate(
      [{ opacity: 0, transform: "translateY(4px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: 180, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
  }, [tab]);

  async function selectTab(next: string, onChange: () => void) {
    if (target.current === next) return;
    target.current = next;
    setSelectedTab(next);
    const currentRevision = ++revision.current;
    animation.current?.cancel();
    const element = contentRef.current;
    if (element && !reducedMotion()) {
      animation.current = element.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 90, easing: "ease-out", fill: "forwards" },
      );
      try {
        await animation.current.finished;
      } catch {
        return; // A newer selection or unmount cancelled this transition.
      }
    }
    if (currentRevision !== revision.current) return;
    animation.current?.cancel();
    onChange();
    setTab(next);
  }

  return { tab, selectedTab, contentRef, selectTab };
}
