# Shared fade-in

Login and registration share this utility through `AuthShell`, with an 18px upward entrance. Panel integration remains a separate step.

Defaults live in `src/components/motion/fade.ts`: 1200ms duration, zero delay and a gentle ease-in-out curve. By default only opacity animates. Set `distance={18}` for an optional gentle upward entrance using the independent CSS `translate` property; existing transforms are preserved. Content stays visible without JavaScript and when reduced motion is enabled. Switching to reduced motion during playback cancels the animation.

```tsx
import FadeIn from "@/components/motion/FadeIn";

<FadeIn><LoginForm /></FadeIn>
<FadeIn delay={120}><Card /></FadeIn>
<FadeIn replayKey={activeTab}>{children}</FadeIn>
```

`replayKey` replays the animation without assigning a React key or remounting children. It does not preserve children that the caller itself removes from the tree. For an existing container, attach the ref returned by `useFadeIn<HTMLDivElement>({ replayKey: activeTab })`. Animation cleanup cancels previous playback on a change or unmount. Duration and delay are optional, in milliseconds.
