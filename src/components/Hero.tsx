import { Suspense, lazy } from "react";

const HeroScene = lazy(() => import("./HeroScene"));

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/furkankaynak/"
  },
  {
    label: "GitHub",
    url: "https://github.com/furkankaynak"
  },
  {
    label: "Medium",
    url: "https://medium.com/@furkankaynak.74"
  },
  {
    label: "X",
    url: "https://x.com/furkannkaynak"
  }
];

export function Hero() {
  return (
    <header className="hero" id="top">
      <div className="hero-canvas" aria-hidden="true">
        <Suspense fallback={<div className="hero-canvas-fallback" />}>
          <HeroScene />
        </Suspense>
      </div>

      <div className="hero-content terminal-frame">
        <p className="terminal-label">$ whoami</p>
        <h1>Furkan Kaynak</h1>
        <p className="hero-title">Full Stack Software Developer</p>

        <nav className="social-links" aria-label="Social links">
          {SOCIAL_LINKS.map((link) => (
            <a key={link.label} href={link.url} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
