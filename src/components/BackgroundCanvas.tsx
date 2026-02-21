import { Suspense, lazy } from "react";

const HeroScene = lazy(() => import("./HeroScene"));

export function BackgroundCanvas() {
  return (
    <div className="background-canvas" aria-hidden="true">
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>
    </div>
  );
}
