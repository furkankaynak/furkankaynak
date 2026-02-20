# PRD - Furkan Kaynak Portfolio (Terminal Monochrome)

## 1) Product Overview

- **Product name:** `furkankaynak.com`
- **Owner:** Furkan Kaynak
- **Role headline:** Full Stack Software Developer
- **Goal:** Deliver a minimal, black-and-white personal portfolio with a full-screen hero and a project listing section.
- **Design direction:** Terminal-like, 8-bit flavored, monochrome only.
- **Primary implementation stack:** Vite + React + TypeScript + React Three Fiber.

## 2) Primary Goals

1. Make the hero section immediately communicate identity, role, and links.
2. Keep UI minimal while still feeling intentional and technical.
3. Provide a lightweight portfolio list with direct external links.
4. Add a custom wireframe particle field in hero background with restrained motion.

## 3) Out of Scope (Current Iteration)

- Blog engine
- Admin panel / CMS
- Dark-light theme switch (site remains monochrome and dark-first)
- Complex filtering/search for portfolio items

## 4) User Persona and Core User Story

- **Persona:** Recruiter, hiring manager, engineering lead, peer developer.
- **Core story:**
  - "As a visitor, I can immediately understand who Furkan is, what role he targets, and open his social/work links in one click."

## 5) Information Architecture

1. **Hero (full viewport):**
   - Name: `Furkan Kaynak`
   - Title: `Full Stack Software Developer`
   - Links: LinkedIn, GitHub, Medium, X
   - Animated background: custom R3F wireframe field
2. **Portfolio section (below hero):**
   - Project cards
   - Card fields: name, short description, links

## 6) Functional Requirements

### 6.1 Hero Content

- Full-screen first fold (`100svh` target)
- Readable textual hierarchy on desktop/mobile
- Social links must open in new tab

### 6.2 Portfolio Section

- Render project cards from local TypeScript data source
- Each project has:
  - `name`
  - `description`
  - `links[]`
- No backend dependency

### 6.3 Animation - R3F Wireframe Field

- Nodes appear in random times and random positions
- Each node has short lifetime and fades out
- Nodes connect with nearby nodes through thin white lines
- Medium density and medium speed target
- Pointer reactive behavior:
  - Local repulsion/deformation near cursor area
- Reduced motion handling:
  - If `prefers-reduced-motion: reduce`, animation keeps running in low FPS mode (not disabled)

## 7) Non-Functional Requirements

### 7.1 Performance

- Desktop: smooth interaction under typical modern browser conditions
- Mobile: lower node count/spawn rate to preserve readability and fluidity

### 7.2 Accessibility

- Semantic structure (`header`, `main`, meaningful headings)
- Sufficient contrast in monochrome palette
- `aria-label` for social link group

### 7.3 Responsiveness

- Hero remains visually centered on small viewports
- Portfolio cards collapse to single/multi-column grid based on screen width

## 8) Data Contract (Portfolio)

```ts
type ProjectLink = {
  label: "GitHub" | "Medium" | "LinkedIn" | "Overview";
  url: string;
};

type ProjectItem = {
  name: string;
  description: string;
  links: ProjectLink[];
};
```

## 9) Acceptance Criteria

1. Hero occupies first viewport and shows name, title, and 4 social links.
2. Visual style is monochrome and minimal, with terminal-like typography.
3. Portfolio cards render from local data and include required fields.
4. R3F wireframe animation includes random birth/fade lifecycle and pointer reactivity.
5. Reduced motion users receive low FPS behavior instead of full disable.
6. Layout is usable on mobile and desktop.

## 10) Risks and Mitigations

- **Risk:** Too many active nodes causing frame drops.
  - **Mitigation:** Hard caps for node/line count and lower mobile intensity.
- **Risk:** Animation visually competing with hero text.
  - **Mitigation:** Keep line opacity low and preserve clear foreground layering.
- **Risk:** Placeholder project links not project-specific yet.
  - **Mitigation:** Replace with dedicated repo/live links as they are finalized.

## 11) Release Strategy

- Build incrementally on feature branches.
- Merge flow:
  - `feature/* -> develop`
  - `develop -> main`
- Keep docs and memory updated in every meaningful iteration.
