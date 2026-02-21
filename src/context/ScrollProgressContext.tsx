import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { scrollProgressRef } from "./scrollRef";

type ScrollProgressContextValue = {
  heroProgress: number;
  scrollY: number;
};

const ScrollProgressContext = createContext<ScrollProgressContextValue>({
  heroProgress: 0,
  scrollY: 0,
});

export function ScrollProgressProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<ScrollProgressContextValue>({
    heroProgress: 0,
    scrollY: 0,
  });
  const rafRef = useRef(0);
  const pendingRef = useRef(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function update() {
      pendingRef.current = false;
      const sy = window.scrollY;
      const heroHeight = window.innerHeight;
      const progress = prefersReduced
        ? 0
        : Math.min(1, Math.max(0, sy / heroHeight));

      scrollProgressRef.current = progress;
      setValue({ heroProgress: progress, scrollY: sy });
    }

    function onScroll() {
      if (pendingRef.current) return;
      pendingRef.current = true;
      rafRef.current = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <ScrollProgressContext.Provider value={value}>
      {children}
    </ScrollProgressContext.Provider>
  );
}

export function useScrollProgress() {
  return useContext(ScrollProgressContext);
}
