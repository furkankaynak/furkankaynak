# Kanban Plan - Portfolio Build

## Workflow Rules

- Flow is strict: `feature/* -> develop -> main`
- One active in-progress item per contributor
- Every done item must include:
  - code completed
  - basic verification done (`npm run build`)
  - related docs/memory updated

## Backlog

- [ ] Add simple project tags (tech stack) if needed in next iteration
- [ ] Add lightweight analytics event tracking (optional)
- [ ] Add dedicated case-study pages for enterprise work that cannot expose private repos

## Todo

- [ ] Optional: add manual chunk strategy for Three.js split if bundle budget becomes strict

## In Progress

- [ ] None

## Review

- [ ] Initial implementation review against PRD acceptance criteria
- [ ] First feature PR (`feature/* -> develop`)

## Done

- [x] Define product requirements and technical scope in PRD
- [x] Set monochrome terminal UI direction
- [x] Set animation direction: wireframe field, medium density, reactive pointer
- [x] Set reduced motion behavior: low FPS mode
- [x] Set project data source strategy: local TS/JSON
- [x] Scaffold Vite + React + TypeScript app
- [x] Implement hero section with identity and social links
- [x] Implement R3F wireframe node/line animation with spawn/fade lifecycle
- [x] Implement portfolio section and project cards from local data
- [x] Tune animation values (spawn/lifetime/pointer strength/line cap)
- [x] Replace generic project link labels with final allowed link set
- [x] Apply accessibility polish (focus-visible and mobile tap targets)
- [x] Add lazy-loaded hero scene split for initial bundle reduction
- [x] Run QA commands (`npm run check`, `npm run build`)
- [x] Initialize git flow branches (`main`, `develop`, `feature/portfolio-foundation`)
- [x] Replace generic profile links with project-specific GitHub/Medium URLs

## Execution Queue (Next)

1. Open branch from `develop` and prepare first feature PR
2. Continue replacing profile-level links with project-specific URLs
3. Optional: optimize Three.js chunking strategy if required
