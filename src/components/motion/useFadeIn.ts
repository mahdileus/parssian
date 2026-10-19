"use client";

import { useLayoutEffect, useRef } from "react";
import { animateFadeIn, type FadeInOptions } from "./fade";

export type FadeInSettings = FadeInOptions & { replayKey?: string | number };

/** Replay on a tab change without unmounting its children or clearing form state. */
export function useFadeIn<T extends HTMLElement = HTMLDivElement>({ duration, delay, distance, replayKey }: FadeInSettings = {}) {
  const ref = useRef<T>(null);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const animation = animateFadeIn(element, { duration, delay, distance });
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onPreferenceChange = () => { if (preference.matches) animation?.cancel(); };
    preference.addEventListener("change", onPreferenceChange);
    return () => {
      preference.removeEventListener("change", onPreferenceChange);
      animation?.cancel();
    };
  }, [duration, delay, distance, replayKey]);
  return ref;
}
