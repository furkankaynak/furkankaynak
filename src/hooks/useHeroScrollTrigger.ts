import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollProgressRef } from "../context/scrollRef";

gsap.registerPlugin(ScrollTrigger);

export function useHeroScrollTrigger() {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const hero = heroRef.current;
      const content = contentRef.current;
      if (!hero || !content) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) return;

      const isMobile = window.innerWidth < 768;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: 0.5,
          onUpdate: (self) => {
            scrollProgressRef.current = self.progress;
          },
        },
      });

      tl.to(content, {
        scale: 0.3,
        opacity: 0,
        rotation: isMobile ? 0 : 8,
        y: isMobile ? -20 : -40,
        ease: "none",
      });
    },
    { scope: heroRef }
  );

  return { heroRef, contentRef };
}
