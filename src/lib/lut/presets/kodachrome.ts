import type { LutPreset } from '../types'
import { generateLut, clamp01, applySCurve, mixSaturation } from '../generate-utils'

const SIZE = 17

export function createKodachromeLut(): LutPreset {
  return {
    id: 'kodachrome',
    name: 'Kodachrome',
    description: 'Rich deep reds and yellows, strong contrast, slightly cool shadows',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
      // Strong contrast
      let ro = applySCurve(r, 0.45)
      let go = applySCurve(g, 0.4)
      let bo = applySCurve(b, 0.4)
      // Rich reds — push red in midtones
      const midR = Math.sin(r * Math.PI)
      ro += 0.05 * midR
      // Warm yellow push — boost green slightly alongside red
      go += 0.02 * midR
      // Slightly cool shadows
      const shadowAmt = Math.pow(1 - luma, 2)
      ro -= 0.02 * shadowAmt
      bo += 0.03 * shadowAmt
      // Moderate saturation boost
      const [fr, fg, fb] = mixSaturation(ro, go, bo, 1.2)
      return [clamp01(fr), clamp01(fg), clamp01(fb)]
    }),
  }
}
