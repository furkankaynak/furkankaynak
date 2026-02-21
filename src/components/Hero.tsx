import { ThemeToggle } from "./ThemeToggle";
import { useHeroScrollTrigger } from "../hooks/useHeroScrollTrigger";

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
  const { heroRef, contentRef } = useHeroScrollTrigger();

  return (
    <header className="hero" id="top" ref={heroRef}>
      <div className="hero-content" ref={contentRef}>
        <p className="terminal-label">$ whoami</p>
        <h1>Furkan Kaynak</h1>
        <p className="hero-title">Full Stack Software Developer</p>

        <nav className="social-links" aria-label="Social links">
          {SOCIAL_LINKS.map((link) => (
            <a key={link.label} href={link.url} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
