import { useEffect, useRef } from "react";
import { projects } from "../data/projects";
import { useScrollProgress } from "../context/ScrollProgressContext";

export function PortfolioSection() {
  const { scrollY } = useScrollProgress();
  const gridRef = useRef<HTMLDivElement>(null);

  const parallaxOffset = Math.max(0, 40 - scrollY * 0.06);
  const sectionStyle: React.CSSProperties = {
    transform: `translateY(${parallaxOffset}px)`,
    willChange: "transform",
  };

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const cards = Array.from(
      grid.querySelectorAll<HTMLElement>(".project-card")
    );
    cards.forEach((card) => {
      card.classList.add("card-hidden");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target as HTMLElement;
            const index = cards.indexOf(card);
            if (index === -1) return;
            setTimeout(() => {
              card.classList.remove("card-hidden");
              card.classList.add("card-visible");
            }, index * 80);
            observer.unobserve(card);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="portfolio" id="portfolio" style={sectionStyle}>
      <div className="container">
        <div className="section-heading">
          <p className="terminal-label">$ ls ./portfolio</p>
          <h2>Selected Work</h2>
        </div>

        <div className="project-grid" ref={gridRef}>
          {projects.map((project) => (
            <article className="project-card terminal-frame" key={project.name}>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <div className="project-links">
                {project.links.map((link) => (
                  <a key={link.label} href={link.url} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
