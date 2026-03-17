# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AutoLUT is a browser-based tool for choosing and applying LUTs (Look-Up Tables) to photos. Users upload a photo, see downscaled previews with preset LUTs applied, then iteratively refine their choice through multiple rounds of selection and modification.

## Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — Type-check with `tsc -b` then build with Vite
- `npm run lint` — Run ESLint
- `npm run preview` — Preview production build

## Tech Stack

- **React 19** with TypeScript, bundled by **Vite 7**
- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin, no `tailwind.config` file — config is in `src/index.css`)
- **shadcn v4** (base-nova style, lucide icons, `@base-ui/react` primitives) — add components with `npx shadcn@latest add <component>`
- **Geist** variable font

## Path Aliases

`@/*` maps to `./src/*` (configured in both `tsconfig.json` and `vite.config.ts`).

## shadcn Conventions

- UI components go in `src/components/ui/`
- Utility `cn()` helper is at `src/lib/utils.ts`
- Hooks go in `src/hooks/`
- CSS variables for theming are defined in `src/index.css` (light/dark mode via oklch values)
