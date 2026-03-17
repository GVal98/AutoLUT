# AutoLUT

A browser-based tool for choosing and applying LUTs (Look-Up Tables) to photos. Upload a photo, preview it with different color grades, refine your favorite looks, then narrow down to a winner through elimination and tournament rounds.

**[Live Demo](https://gval98.github.io/autoLUT/)**

## Features

- **Photo upload** — drag-and-drop or click to upload any image
- **45 LUT presets** — cinematic, vintage, modern, and creative color grades
- **Interactive refinement** — select up to 5 favorites, then see 18 mutations of each to narrow down the perfect look
- **Elimination mode** — narrow down candidates by eliminating least favorites
- **Tournament mode** — head-to-head bracket-style matchups to pick a final winner
- **Hold-to-compare** — press and hold to see the original, release to see the LUT-applied version
- **WebGL2 rendering** — GPU-accelerated LUT application
- **Full-size viewer** — preview any LUT applied to your photo at full resolution
- **Download** — export the final result
- **PWA** — installable as a standalone app

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS v4
- shadcn (base-nova style)
- Geist font

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
npm run preview
```

## How It Works

1. **Upload** a photo
2. **Browse** 45 downscaled previews, each with a different LUT applied
3. **Select** up to 5 favorites
4. **Refine** — the app generates 18 mutations of each selected LUT (Soft, Bold, Warm, Cool, Vivid, Muted, Crisp, Flat, Faded, Deep, Green, Magenta, Sunset, Moonlit, Hue±, Xpro × 2)
5. **Eliminate** — discard least favorites to narrow the field
6. **Tournament** — head-to-head bracket matchups to crown a final winner
7. **View** any result at full size and **download** when you're happy
