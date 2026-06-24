"use client";

import { useEffect } from "react";

const FORWARD_FLAG = "_scroll_forward";

// Module-level: set global forward flag on any <a> click (fires before navigation)
if (typeof window !== "undefined") {
  document.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const link = target.closest("a");
    if (link?.href && !link.href.startsWith("javascript:")) {
      sessionStorage.setItem(FORWARD_FLAG, "1");
    }
  });
}

/**
 * Saves scroll position continuously while the user scrolls.
 * Restores it ONLY on browser back-navigation, never on forward (link clicks).
 */
export function useScrollRestore(storageKey: string) {
  useEffect(() => {
    const container = document.getElementById("main-scroll");
    if (!container) return;

    const isForward = sessionStorage.getItem(FORWARD_FLAG);
    sessionStorage.removeItem(FORWARD_FLAG);

    if (isForward) {
      // Forward nav: override browser auto-restore and scroll to top
      history.scrollRestoration = "manual";
      container.scrollTo(0, 0);
      return;
    }

    // Back nav: restore saved position
    const saved = sessionStorage.getItem(storageKey);
    if (!saved) return;

    history.scrollRestoration = "manual";
    const targetY = parseInt(saved, 10);

    let attempts = 0;
    function tryScroll() {
      const c = document.getElementById("main-scroll");
      if (!c) return;
      attempts++;
      if (c.scrollHeight <= targetY && attempts < 50) {
        requestAnimationFrame(tryScroll);
        return;
      }
      c.scrollTo(0, targetY);
    }
    requestAnimationFrame(tryScroll);
  }, [storageKey]);

  // ── Continuous throttled save ──────────────────────────────────────
  useEffect(() => {
    let lastSave = 0;
    function onScroll() {
      const now = Date.now();
      if (now - lastSave < 200) return;
      lastSave = now;
      const container = document.getElementById("main-scroll");
      if (container) {
        sessionStorage.setItem(storageKey, String(container.scrollTop));
      }
    }

    const container = document.getElementById("main-scroll");
    if (container) {
      container.addEventListener("scroll", onScroll, { passive: true });
      return () => container.removeEventListener("scroll", onScroll);
    }
  }, [storageKey]);
}
