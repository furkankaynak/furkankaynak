import { BackgroundCanvas } from "./components/BackgroundCanvas";
import { Hero } from "./components/Hero";
import { PortfolioSection } from "./components/PortfolioSection";
import { ThemeToggle } from "./components/ThemeToggle";

function App() {
  return (
    <>
      <BackgroundCanvas />
      <div className="app-theme-toggle">
        <ThemeToggle />
      </div>
      <div className="app-shell">
        <Hero />
        <PortfolioSection />
      </div>
    </>
  );
}

export default App;
