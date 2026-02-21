import { BackgroundCanvas } from "./components/BackgroundCanvas";
import { Hero } from "./components/Hero";
import { PortfolioSection } from "./components/PortfolioSection";

function App() {
  return (
    <>
      <BackgroundCanvas />
      <div className="app-shell">
        <Hero />
        <PortfolioSection />
      </div>
    </>
  );
}

export default App;
