import type { LutPreset } from '../types'
import { generateLut, clamp01, applySCurve, mixSaturation } from '../generate-utils'

const SIZE = 17

export function createClassicChromeLut(): LutPreset {
  return {
    id: 'classic-chrome',
    name: 'Classic Chrome',
    description: 'Muted, desaturated, slightly warm, deep shadows, documentary feel',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Moderate desaturation
      let [ro, go, bo] = mixSaturation(r, g, b, 0.7)
      // Deep shadows — darken lower end
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
      const shadowAmt = Math.pow(1 - luma, 3)
      ro -= 0.04 * shadowAmt
      go -= 0.04 * shadowAmt
      bo -= 0.04 * shadowAmt
      // Slightly warm tint
      ro += 0.02
      go += 0.008
      bo -= 0.015
      // Moderate S-curve
      ro = applySCurve(ro, 0.3)
      go = applySCurve(go, 0.3)
      bo = applySCurve(bo, 0.25)
      return [clamp01(ro), clamp01(go), clamp01(bo)]
    }),
  }
}
