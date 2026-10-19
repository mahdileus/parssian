"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import Logo from "@/components/layout/Logo";
import "./sidebar.css";

const subscribe = (callback: () => void) => {
  const media = window.matchMedia("(max-width: 1023px)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
const snapshot = () => window.matchMedia("(max-width: 1023px)").matches;

export default function ResponsiveSidebar({ children, className = "", open, onOpenChange }: { children: ReactNode; className?: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  const mobile = useSyncExternalStore(subscribe, snapshot, () => false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!mobile || !dialog) { if (open) onOpenChange(false); return; }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animation: Animation | undefined;
    let cancelled = false;
    if (open) {
      if (!dialog.open) dialog.showModal();
      animation = reduced ? undefined : dialog.animate([{ transform: "translateX(100%)", opacity: 0.6 }, { transform: "translateX(0)", opacity: 1 }], { duration: 700, easing: "cubic-bezier(.22,.61,.36,1)" });
    } else if (dialog.open) {
      animation = reduced ? undefined : dialog.animate([{ transform: "translateX(0)", opacity: 1 }, { transform: "translateX(100%)", opacity: 0.6 }], { duration: 500, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" });
      const finish = () => { if (!cancelled) { dialog.close(); triggerRef.current?.focus({ preventScroll: true }); } };
      if (animation) void animation.finished.then(finish, () => {}); else finish();
    }
    return () => { cancelled = true; animation?.cancel(); };
  }, [mobile, open, onOpenChange]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!mobile || !dialog) return;
    let previous: string | undefined;
    const lock = () => { if (previous === undefined) { previous = document.body.style.overflow; document.body.style.overflow = "hidden"; } };
    const unlock = () => { if (previous !== undefined) { document.body.style.overflow = previous; previous = undefined; } };
    if (dialog.open) lock();
    const observer = new MutationObserver(() => { if (dialog.open) lock(); else unlock(); });
    observer.observe(dialog, { attributes: true, attributeFilter: ["open"] });
    return () => { observer.disconnect(); unlock(); };
  }, [mobile]);

  const sidebar = <aside className={`panel-sidebar brand-sidebar self-start lg:sticky lg:top-6 ${className} ${mobile ? "drawer-sidebar" : "desktop-panel-sidebar"}`}>{children}</aside>;
  return <>
    <header className="mobile-panel-bar"><button ref={triggerRef} type="button" className="p-icon-btn" aria-label="بازکردن منوی پنل" aria-expanded={mobile && open} aria-controls="mobile-panel-drawer" onClick={() => onOpenChange(true)}><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg></button><Logo /></header>
    {mobile ? <dialog ref={dialogRef} id="mobile-panel-drawer" className="panel-drawer" aria-label="منوی پنل" onCancel={event => { event.preventDefault(); onOpenChange(false); }} onClose={() => { if (open) onOpenChange(false); }} onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right) onOpenChange(false); } }}><button type="button" className="drawer-close" aria-label="بستن منوی پنل" onClick={() => onOpenChange(false)}>×</button>{sidebar}</dialog> : sidebar}
  </>;
}
