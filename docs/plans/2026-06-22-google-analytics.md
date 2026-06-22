# Google Analytics Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Google Analytics 4 tracking to the portfolio site.

**Architecture:** Use the standard Google tag snippet in `index.html` so tracking initializes before the Vite React app loads. Keep the change static and dependency-free.

**Tech Stack:** Vite 7, React 19, TypeScript 5, Google Analytics 4 `gtag.js`.

---

### Task 1: Add GA4 Tag

**Files:**
- Modify: `index.html`

**Step 1: Add the standard Google tag snippet**

Insert the provided GA4 snippet in the `<head>` before existing metadata.

**Step 2: Validate TypeScript**

Run: `npm run check`
Expected: TypeScript exits successfully.

**Step 3: Build production bundle**

Run: `npm run build`
Expected: Vite build exits successfully.

**Step 4: Commit and push**

Stage only `index.html` and this plan file, commit, then push `main`.
