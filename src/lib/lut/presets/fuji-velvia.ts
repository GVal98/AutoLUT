import type { LutPreset } from '../types'
import { generateLut, clamp01, applySCurve, mixSaturation } from '../generate-utils'

const SIZE = 17

export function createFujiVelviaLut(): LutPreset {
  return {
    id: 'fuji-velvia',
    name: 'Fuji Velvia',
    description: 'Extreme saturation, deep shadows, vivid greens/blues/reds',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Strong S-curve for high contrast
      let ro = applySCurve(r, 0.55)
      let go = applySCurve(g, 0.5)
      let bo = applySCurve(b, 0.55)
      // Deepen shadows
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
      const shadowAmt = Math.pow(1 - luma, 3)
      ro -= 0.03 * shadowAmt
      go -= 0.03 * shadowAmt
      bo -= 0.03 * shadowAmt
      // Push greens and blues in midtones
      const midG = Math.sin(g * Math.PI)
      const midB = Math.sin(b * Math.PI)
      go += 0.02 * midG
      bo += 0.02 * midB
      // Extreme saturation boost
      const [fr, fg, fb] = mixSaturation(ro, go, bo, 1.45)
      return [clamp01(fr), clamp01(fg), clamp01(fb)]
    }),
  }
}
