# Agent Memory - Portfolio Project

## Memory Update Protocol

- Update after each significant implementation step.
- Keep entries compact and decision-oriented.
- Track: decision, reason, tradeoff, lesson, next action.

## Current Product Decisions

### 2026-02-20 - Foundation Decisions

- **Decision:** Stack is `Vite + React + TypeScript`.
  - **Reason:** Minimal setup overhead and fast iteration for a lightweight portfolio.
  - **Tradeoff:** Less built-in routing/SSR tooling compared to Next.js.
  - **Lesson:** For a minimal one-page style portfolio, smaller runtime surface is preferable.
  - **Next action:** Keep architecture simple and avoid over-engineering.

- **Decision:** Visual language is strict monochrome terminal-like minimal UI.
  - **Reason:** Personal preference and strong, consistent identity.
  - **Tradeoff:** Limited color cues requires careful spacing and typography hierarchy.
  - **Lesson:** Contrast and scale carry more UX weight when color is constrained.
  - **Next action:** Preserve strong text hierarchy and restrained motion.

- **Decision:** Hero animation uses R3F wireframe nodes/lines with random spawn and fade.
  - **Reason:** Aligns with technical identity without becoming visually noisy.
  - **Tradeoff:** Real-time rendering introduces performance sensitivity on lower-end devices.
  - **Lesson:** Hard caps and adaptive density are non-negotiable.
  - **Next action:** Tune node count and connection distance after visual pass.

- **Decision:** Pointer interaction is reactive, not static.
  - **Reason:** Adds subtle depth and interactivity while keeping content-first layout.
  - **Tradeoff:** Can distract if force is too high.
  - **Lesson:** Interaction should feel local and light.
  - **Next action:** Keep interaction radius and force conservative.

- **Decision:** Reduced motion users get low FPS mode, not a full shutdown.
  - **Reason:** Preserve visual identity while reducing motion intensity.
  - **Tradeoff:** Any motion still exists, so cadence must stay gentle.
  - **Lesson:** Accessibility can be applied as graceful degradation, not binary off/on.
  - **Next action:** Validate comfort level in manual review.

- **Decision:** Portfolio data source is local TypeScript data.
  - **Reason:** Fastest and cleanest initial iteration for minimal scope.
  - **Tradeoff:** Content updates require code changes.
  - **Lesson:** Static content is enough until project volume increases.
  - **Next action:** Revisit CMS/Markdown only if update frequency grows.

## Lessons Learned During Build

- Creating in-place Vite scaffold in a non-empty root can fail in non-interactive mode.
- Manual project bootstrap is reliable when interactive scaffolding is blocked.
- Three.js/R3F can trigger large initial bundle warnings; lazy loading can be used if needed.

### 2026-02-20 - Iteration Update (Animation + Polish)

- **Decision:** Lazy-load Three.js hero scene via `React.lazy` + `Suspense`.
  - **Reason:** Keep initial app chunk smaller and isolate heavy 3D runtime.
  - **Tradeoff:** Hero animation loads as a second chunk.
  - **Lesson:** For visual-heavy sections, route/component level splitting is valuable even in single-page portfolios.
  - **Next action:** Consider manual chunking only if stricter bundle limits are required.

- **Decision:** Cap line segments and per-node connections in wireframe field.
  - **Reason:** Control worst-case line generation cost while preserving medium-density look.
  - **Tradeoff:** Slightly less dense webs in high activity moments.
  - **Lesson:** Visual consistency improves when performance limits are deterministic.
  - **Next action:** Fine-tune caps after manual browser profiling on target devices.

- **Decision:** Add keyboard focus styles and larger mobile tap targets.
  - **Reason:** Improve accessibility and cross-device usability in minimal UI.
  - **Tradeoff:** Slightly larger link boxes on small screens.
  - **Lesson:** Minimal visual language still benefits from explicit interaction affordances.
  - **Next action:** Keep future interactive elements aligned with the same focus/tap standards.

- **Decision:** Initialize branch flow as `main -> develop -> feature/portfolio-foundation`.
  - **Reason:** Enforce requested git flow from day one.
  - **Tradeoff:** Slightly more process overhead for small changes.
  - **Lesson:** Early workflow structure prevents branching confusion later.
  - **Next action:** Keep all implementation commits on `feature/*` and merge via `develop`.
