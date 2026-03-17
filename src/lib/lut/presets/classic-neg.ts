import type { LutPreset } from '../types'
import { generateLut, clamp01, applySCurve, mixSaturation } from '../generate-utils'

const SIZE = 17

export function createClassicNegLut(): LutPreset {
  return {
    id: 'classic-neg',
    name: 'Classic Neg',
    description: 'High contrast, warm highlights, cool shadows, punchy consumer film look',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
      // Warm highlights
      const hiAmt = Math.pow(luma, 2)
      let ro = r + 0.06 * hiAmt
      let go = g + 0.03 * hiAmt
      let bo = b - 0.04 * hiAmt
      // Cool shadows
      const shadowAmt = Math.pow(1 - luma, 2)
      ro -= 0.04 * shadowAmt
      go -= 0.01 * shadowAmt
      bo += 0.05 * shadowAmt
      // High contrast S-curve
      ro = applySCurve(ro, 0.45)
      go = applySCurve(go, 0.4)
      bo = applySCurve(bo, 0.4)
      // Slight saturation boost
      const [fr, fg, fb] = mixSaturation(ro, go, bo, 1.05)
      return [clamp01(fr), clamp01(fg), clamp01(fb)]
    }),
  }
}
