import type { LutPreset } from '../types'
import { generateLut, clamp01, applySCurve, mixSaturation } from '../generate-utils'

const SIZE = 17

export function createChromeLut(): LutPreset {
  return {
    id: 'chrome',
    name: 'Chrome',
    description: 'Highlight boost, blue-silver tint, high contrast',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Desaturate slightly for silver look
      let [ro, go, bo] = mixSaturation(r, g, b, 0.7)
      // Blue-silver tint
      bo = bo + 0.04
      // Highlight boost
      ro = ro + 0.06 * ro * ro
      go = go + 0.06 * go * go
      bo = bo + 0.08 * bo * bo
      // High contrast
      ro = applySCurve(ro, 0.45)
      go = applySCurve(go, 0.45)
      bo = applySCurve(bo, 0.45)
      return [clamp01(ro), clamp01(go), clamp01(bo)]
    }),
  }
}
