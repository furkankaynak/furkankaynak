import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { ScrollProgressProvider } from "./context/ScrollProgressContext";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ScrollProgressProvider>
        <App />
      </ScrollProgressProvider>
    </ThemeProvider>
  </StrictMode>
);
