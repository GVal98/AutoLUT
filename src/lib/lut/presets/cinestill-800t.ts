import type { LutPreset } from '../types'
import { generateLut, clamp01, applySCurve, mixSaturation } from '../generate-utils'

const SIZE = 17

export function createCineStill800TLut(): LutPreset {
  return {
    id: 'cinestill-800t',
    name: 'CineStill 800T',
    description: 'Tungsten-balanced, cyan/teal shadows, warm highlights, halation glow',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
      // Tungsten white balance — cool overall shift
      let ro = r * 0.92
      let go = g * 0.97
      let bo = b * 1.06
      // Cyan/teal shadows
      const shadowAmt = Math.pow(1 - luma, 2)
      ro -= 0.06 * shadowAmt
      go += 0.02 * shadowAmt
      bo += 0.05 * shadowAmt
      // Warm highlights
      const hiAmt = Math.pow(luma, 2.5)
      ro += 0.08 * hiAmt
      go += 0.03 * hiAmt
      bo -= 0.04 * hiAmt
      // Halation — red glow around bright areas
      const halation = Math.pow(luma, 4)
      ro += 0.07 * halation
      go += 0.01 * halation
      // Moderate contrast
      ro = applySCurve(ro, 0.3)
      go = applySCurve(go, 0.3)
      bo = applySCurve(bo, 0.25)
      // Slight saturation boost
      const [fr, fg, fb] = mixSaturation(ro, go, bo, 1.08)
      return [clamp01(fr), clamp01(fg), clamp01(fb)]
    }),
  }
}
