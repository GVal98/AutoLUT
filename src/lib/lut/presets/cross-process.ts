import type { LutPreset } from '../types'
import { generateLut, applySCurve, mixSaturation } from '../generate-utils'

const SIZE = 17

export function createCrossProcessLut(): LutPreset {
  return {
    id: 'cross-process',
    name: 'Cross Process',
    description: 'Green midtones, cyan blue highlights, yellow shadows',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
      const shadowAmt = Math.pow(1 - luma, 1.5)
      const midAmt = Math.sin(luma * Math.PI)
      const hiAmt = Math.pow(luma, 1.5)

      // Yellow shadows (boost R,G in shadows)
      let ro = r + 0.06 * shadowAmt
      let go = g + 0.08 * midAmt + 0.04 * shadowAmt
      // Cyan/blue highlights
      let bo = b + 0.07 * hiAmt

      // Contrast
      ro = applySCurve(ro, 0.3)
      go = applySCurve(go, 0.25)
      bo = applySCurve(bo, 0.2)

      const [fr, fg, fb] = mixSaturation(ro, go, bo, 1.1)
      return [fr, fg, fb]
    }),
  }
}
