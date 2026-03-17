# AutoLUT — Development Plan

## Step 1: Install deps — DONE
Install React, TypeScript, Vite, shadcn, and everything else needed.

## Step 2: LUT engine, presets, photo upload, previews, full-size view — DONE
Brainstorm format for LUT (are there existing?). Write functionality to apply LUT to photo. Add 25 different LUT presets. Add to main page: photo upload, LUT previews for these photos (downscaled), on click apply LUT to full-size photo.

## Step 3: Auto-refine with mutations, multi-round selection — DONE
Show user 25 previews with preset LUTs. User can choose up to 5 best LUTs. Then modify these 5 LUTs 5 times each. Every modification is different by amount and direction of change. Steps are unlimited, user can choose to see full photo at any moment.

- Improve preview quality. Performance is still great - DONE
- On mobile refine button should float - DONE
- Preserve Original LUT when adding modified ones
- Add comparison to original in full photo view
- Add elimination round