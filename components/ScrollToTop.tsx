"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const container = document.getElementById("main-scroll");
    if (!container) return;

    const onScroll = () => {
      setVisible(container.scrollTop > 300);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    const container = document.getElementById("main-scroll");
    if (!container) return;
    container.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-black/40 dark:bg-white/30 backdrop-blur-sm text-white dark:text-black shadow-lg hover:bg-black/60 dark:hover:bg-white/50 transition-all duration-200 ${
        visible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      aria-label="맨 위로"
      type="button"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
}
