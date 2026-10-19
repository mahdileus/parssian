export const FADE_IN = {
  duration: 1200,
  delay: 0,
  easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
} as const;

export type FadeInOptions = { duration?: number; delay?: number; distance?: number };

/** Optional upward travel uses translate independently of existing transforms. */
export function animateFadeIn(element: HTMLElement, options: FadeInOptions = {}): Animation | undefined {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !element.animate) return;
  const duration = Number.isFinite(options.duration) ? Math.max(0, options.duration!) : FADE_IN.duration;
  const delay = Number.isFinite(options.delay) ? Math.max(0, options.delay!) : FADE_IN.delay;
  const distance = Number.isFinite(options.distance) ? Math.max(0, options.distance!) : 0;
  const frames = distance > 0
    ? [{ opacity: 0, translate: `0 ${distance}px` }, { opacity: 1, translate: "0 0" }]
    : [{ opacity: 0 }, { opacity: 1 }];
  return element.animate(frames, {
    duration,
    delay,
    easing: FADE_IN.easing,
    fill: "backwards",
  });
}
