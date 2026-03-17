import type { LutPreset } from '../types'
import { generateLut, clamp01, applySCurve, mixSaturation } from '../generate-utils'

const SIZE = 17

export function createMatrixLut(): LutPreset {
  return {
    id: 'matrix',
    name: 'Matrix',
    description: 'Strong green tint, desaturated non-greens, mild contrast boost',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Desaturate
      let [ro, go, bo] = mixSaturation(r, g, b, 0.6)
      // Strong green tint across all tones
      ro -= 0.03
      go += 0.06
      bo -= 0.04
      // Mild contrast boost
      ro = applySCurve(ro, 0.25)
      go = applySCurve(go, 0.25)
      bo = applySCurve(bo, 0.2)
      // Extra green push in midtones
      const mid = Math.sin(go * Math.PI)
      go += 0.025 * mid
      return [clamp01(ro), clamp01(go), clamp01(bo)]
    }),
  }
}
