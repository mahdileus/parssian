"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useFadeIn, type FadeInSettings } from "./useFadeIn";

type Props = ComponentPropsWithoutRef<"div"> & FadeInSettings;

/** Shared slow fade, ready to wrap forms, cards, or changing tab content. */
export default function FadeIn({ children, duration, delay, replayKey, ...props }: Props) {
  const ref = useFadeIn({ duration, delay, replayKey });
  return <div ref={ref} {...props}>{children}</div>;
}
