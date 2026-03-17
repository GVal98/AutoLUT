# AutoLUT

A browser-based tool for choosing and applying LUTs (Look-Up Tables) to photos. Upload a photo, preview it with different color grades, then iteratively refine your favorite looks through multiple rounds of selection and mutation.

## Features

- **Photo upload** — drag-and-drop or click to upload any image
- **25 LUT presets** — cinematic, vintage, modern, and creative color grades
- **Interactive refinement** — select up to 5 favorites, then see 5 mutations of each to narrow down the perfect look
- **Unlimited rounds** — keep refining until you're satisfied
- **Full-size viewer** — preview any LUT applied to your photo at full resolution
- **Download** — export the final result

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
2. **Browse** 25 downscaled previews, each with a different LUT applied
3. **Select** up to 5 favorites
4. **Refine** — the app generates 5 mutations of each selected LUT, varying the intensity and direction of adjustments
5. **Repeat** selection and refinement as many times as you like
6. **View** any result at full size and **download** when you're happy
