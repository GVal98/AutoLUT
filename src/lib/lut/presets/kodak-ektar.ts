import type { LutPreset } from '../types'
import { generateLut, clamp01, applySCurve, mixSaturation } from '../generate-utils'

const SIZE = 17

export function createKodakEktarLut(): LutPreset {
  return {
    id: 'kodak-ektar',
    name: 'Kodak Ektar',
    description: 'High saturation, punchy contrast, vivid blues and reds',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Strong S-curve for punchy contrast
      let ro = applySCurve(r, 0.5)
      let go = applySCurve(g, 0.45)
      let bo = applySCurve(b, 0.5)
      // Push reds and blues slightly in midtones
      const midR = Math.sin(r * Math.PI)
      const midB = Math.sin(b * Math.PI)
      ro += 0.03 * midR
      bo += 0.025 * midB
      // High saturation boost
      const [fr, fg, fb] = mixSaturation(ro, go, bo, 1.35)
      return [clamp01(fr), clamp01(fg), clamp01(fb)]
    }),
  }
}
