# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Reference

Also read `AGENTS.md` — it is the primary machine-readable instruction set for this repo and covers code style, naming conventions, TypeScript rules, and branching strategy in detail.

## Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # TypeScript compile + Vite production build
npm run preview  # Serve production build locally
npm run check    # TypeScript type-check only (no emit)
```

No linter or test runner is configured. Before reporting changes as done, run `npm run check && npm run build`. For visual/animation changes, also verify with `npm run dev`.

## Architecture

Single-page portfolio built with Vite 7 + React 19 + TypeScript 5 (strict). The hero section is a full-screen 3D canvas powered by React Three Fiber / Three.js. Below it sits a terminal-styled portfolio grid.

**Rendering pipeline:**
- `App.tsx` renders `Hero` + `PortfolioSection`
- `Hero` lazy-loads `HeroScene` (the R3F `<Canvas>`) via `React.lazy` + `Suspense`
- `HeroScene` composes two imperative animation layers:
  - `PhotonWarpField` — wormhole tunnel of 2000 (desktop) / 1000 (mobile) photon streaks using `<lineSegments>` with Float32Array buffers, updated every frame via `useFrame`
  - `CosmicObjectsField` — 6 (desktop) / 4 (mobile) pixel-art sprites (planets, galaxies, comets, black holes) that drift through the tunnel using `<points>` + `<sprite>`

**Data layer:**
- `src/data/projects.ts` — portfolio project entries
- `src/data/cosmicSprites.ts` — pixel sprite blueprints with a 17-char color palette; textures are generated at runtime from row strings and rendered with nearest-neighbor filtering

**Styling:** Plain CSS in `src/styles.css` with CSS variables (`--bg`, `--fg`, `--muted`, `--line`). Monochrome terminal aesthetic using Share Tech Mono / VT323 fonts. No Tailwind, no CSS-in-JS.

## Key Patterns

- **Frame loop performance:** Both animation components clamp delta, use memoized typed arrays, and skip allocations inside `useFrame`. Mobile has lower particle/object caps. `prefers-reduced-motion` throttles frame rate and halves active particle count.
- **PhotonWarpField streak math:** Streaks use decoupled Z-depth + XY-tangent tail positioning (not velocity normalization). The `TANGENT_STREAK_WEIGHT` constant controls spiral curvature visibility. All particles rotate in the same direction for coherent vortex appearance.
- **CosmicObjectsField sprite generation:** Pixel art textures are created from string-encoded row data at mount time via canvas 2D, cached in a `Map`, and applied as `THREE.CanvasTexture` with `NearestFilter`.
- **No path aliases:** All imports are relative. No `@/` or `~/` configured.
