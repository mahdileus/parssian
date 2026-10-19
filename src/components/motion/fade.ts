export const FADE_IN = {
  duration: 900,
  delay: 0,
  easing: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

export type FadeInOptions = { duration?: number; delay?: number };

/** Opacity only: leaves layout, transforms and existing hover effects untouched. */
export function animateFadeIn(element: HTMLElement, options: FadeInOptions = {}): Animation | undefined {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !element.animate) return;
  const duration = Number.isFinite(options.duration) ? Math.max(0, options.duration!) : FADE_IN.duration;
  const delay = Number.isFinite(options.delay) ? Math.max(0, options.delay!) : FADE_IN.delay;
  return element.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration,
    delay,
    easing: FADE_IN.easing,
    fill: "backwards",
  });
}
