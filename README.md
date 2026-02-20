# furkankaynak.com

Personal portfolio built with Vite, React, TypeScript, React Three Fiber, and Three.js.

## Highlights

- Monochrome interface with a realtime 3D hero scene.
- Photon warp tunnel (`src/components/PhotonWarpField.tsx`).
- Colored pixel-art cosmic objects (planets + galaxies) layered over warp motion (`src/components/CosmicObjectsField.tsx`).
- Relativistic-feel motion: objects appear as distant points, resolve into sprites while approaching, then pass by.
- Responsive performance caps for cosmic objects: mobile `4`, desktop `6`.

## Pixel Sprite Data

- Cosmic sprite blueprints and palette live in `src/data/cosmicSprites.ts`.
- Contains 4 planet types and 4 galaxy types.
- Sprite textures are generated from pixel rows at runtime with nearest-neighbor filtering.

## Scripts

- `npm install` - install dependencies
- `npm run dev` - start local dev server
- `npm run check` - TypeScript type-check
- `npm run build` - production build
- `npm run preview` - preview production bundle

## Validation

This project currently has no lint or test runner. Minimum validation is:

1. `npm run check`
2. `npm run build`
