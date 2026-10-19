# Shared fade-in

This utility is intentionally not connected to any page yet.

Defaults live in `src/components/motion/fade.ts`: 900ms duration, zero delay and a gentle ease-in-out curve. Only opacity animates; layout, blur and transforms are untouched. Content stays visible without JavaScript and when reduced motion is enabled. Switching to reduced motion during playback cancels the animation.

```tsx
import FadeIn from "@/components/motion/FadeIn";

<FadeIn><LoginForm /></FadeIn>
<FadeIn delay={120}><Card /></FadeIn>
<FadeIn replayKey={activeTab}>{children}</FadeIn>
```

`replayKey` replays the animation without assigning a React key or remounting children. It does not preserve children that the caller itself removes from the tree. For an existing container, attach the ref returned by `useFadeIn<HTMLDivElement>({ replayKey: activeTab })`. Animation cleanup cancels previous playback on a change or unmount. Duration and delay are optional, in milliseconds.
