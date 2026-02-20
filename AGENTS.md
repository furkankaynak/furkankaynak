# AGENTS.md

Guidance for coding agents working in this repository.
This file is the operational source of truth for local agent behavior.

## 1) Project Snapshot
- Stack: Vite 7, React 19, TypeScript 5, React Three Fiber, Three.js.
- Package manager: npm (`package-lock.json` exists).
- App type: single-page portfolio with a canvas animation hero.
- Entry points:
  - `src/main.tsx`
  - `src/App.tsx`
- Main feature areas:
  - `src/components/` (UI + 3D scene)
  - `src/data/` (portfolio content)
  - `src/styles.css` (global styles)
- TypeScript strict mode is enabled.

## 2) Install and Run Commands
Run commands from repo root.

- Install dependencies:
  - `npm install`
- Start development server:
  - `npm run dev`
- Build production bundle:
  - `npm run build`
- Preview production bundle:
  - `npm run preview`
- Type-check only:
  - `npm run check`

## 3) Lint/Test Status (Current)
- No lint script exists in `package.json`.
- No test runner is configured (no Vitest/Jest config, no test script).
- So these commands are unavailable:
  - `npm run lint`
  - `npm test`
  - `npm run test`

If asked to lint or test, state this clearly and run `npm run check` as minimum validation.

## 4) Single Test Execution
Single-test execution is currently **not supported** (no test framework configured).

If tests are added later, prefer Vitest:
- Run all tests:
  - `npx vitest run`
- Run one file:
  - `npx vitest run src/path/to/file.test.ts`
- Run one test by name:
  - `npx vitest run -t "test name"`

Until then, required verification is `npm run check` + `npm run build`.

## 5) Required Verification Before Completion
Before reporting code changes as done, run:

1. `npm run check`
2. `npm run build`

When changing rendering/layout/animation behavior, also run `npm run dev` for manual UI checks.

## 6) Repository Constraints
- Do not edit generated folders directly:
  - `dist/`
  - `node_modules/`
- Ignore memory/docs folders for product code tasks:
  - `.docs/`
  - `.agents/`
  - `.claude/`
- Keep changes focused and minimal.
- Preserve current architecture unless explicitly asked to refactor.

## 7) Code Style: Imports and Modules
- Use ES modules and TypeScript.
- Keep imports ordered:
  1. External packages (`react`, `three`, `@react-three/fiber`)
  2. Internal modules (`./`, `../`)
- Use a single import block at file top.
- Use relative imports (no configured path aliases).
- Avoid unused imports.

## 8) Code Style: Formatting
- Match existing formatting:
  - double quotes
  - semicolons
  - trailing commas where style already uses them
  - 2-space indentation
- Keep JSX readable; split long prop lists across lines.
- Avoid dense one-liners for non-trivial logic.

## 9) Code Style: Types and TypeScript
- Keep new code fully type-safe under `strict` mode.
- Prefer explicit domain types for structured data.
- Prefer `type` aliases (current repo convention).
- Avoid `any`; use specific types or generics.
- Keep non-null assertions (`!`) rare and justified.
- Keep compiler checks clean:
  - `noUnusedLocals`
  - `noUnusedParameters`
  - `noFallthroughCasesInSwitch`

## 10) Naming Conventions
- Components: PascalCase (`HeroScene`, `PortfolioSection`).
- Component files: PascalCase `.tsx`.
- Variables/functions: camelCase.
- Constants: UPPER_SNAKE_CASE (`MOBILE_NODE_LIMIT`).
- Type names: PascalCase (`ProjectItem`, `NodeState`).
- CSS classes: kebab-case (`project-grid`, `hero-canvas-fallback`).

## 11) React and UI Conventions
- Prefer function components.
- Prefer named exports for reusable components.
- Default exports are acceptable for lazy-loaded modules.
- Keep rendering declarative; isolate heavy imperative logic (see `WireframeField`).
- Use `Suspense` fallbacks for lazy-loaded visuals.
- Maintain accessibility basics:
  - meaningful `aria-label` usage
  - visible keyboard `:focus-visible` states

## 12) Animation and Performance Conventions
- Keep content readability first; animation is secondary.
- Preserve reduced-motion support (`prefers-reduced-motion`).
- Respect mobile/desktop performance caps (node and segment limits).
- Avoid expensive allocations inside frame loops.
- Reuse memoized typed arrays/buffers when possible.

## 13) Error Handling and Resilience
- Prefer graceful UI fallback behavior over crashes.
- Always clean up side effects in hooks.
- Guard null/undefined runtime access where relevant.
- For new async logic, expose clear failure states (UI or logs).

## 14) Data and Content Patterns
- Keep portfolio content in `src/data/projects.ts`.
- Keep data typed and shape-consistent.
- Use stable, domain-meaningful keys when mapping lists.
- External links should use `target="_blank"` + `rel="noreferrer"`.

## 15) Branching and Delivery Notes
- Preferred flow from project notes: `feature/* -> develop -> main`.
- Keep commits scoped and descriptive.
- Avoid unrelated refactors while implementing targeted work.

## 16) Cursor/Copilot Rule Audit
Checked paths:
- `.cursorrules`
- `.cursor/rules/`
- `.github/copilot-instructions.md`

Current status:
- No Cursor rules found.
- No Copilot instruction file found.

Therefore this `AGENTS.md` is the primary machine-readable agent instruction set for this repository.
