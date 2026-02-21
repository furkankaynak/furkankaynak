import { ThemeToggle } from "./ThemeToggle";
import { useScrollProgress } from "../context/ScrollProgressContext";

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
  const { heroProgress } = useScrollProgress();

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const scale = 1 - heroProgress * 0.7;
  const opacity = 1 - heroProgress;
  const rotate = isMobile ? 0 : heroProgress * 8;
  const translateY = isMobile ? heroProgress * -20 : heroProgress * -40;

  const contentStyle: React.CSSProperties = {
    transform: `scale(${scale}) rotate(${rotate}deg) translateY(${translateY}px)`,
    opacity,
  };

  return (
    <header className="hero" id="top">
      <div className="hero-content" style={contentStyle}>
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
