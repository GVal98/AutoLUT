import type { LutPreset } from '../types'
import { generateLut, clamp01, applySCurve, mixSaturation } from '../generate-utils'

const SIZE = 17

export function createDayForNightLut(): LutPreset {
  return {
    id: 'day-for-night',
    name: 'Day for Night',
    description: 'Blue-shifted, darkened, desaturated, cool cast — simulates night',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Darken significantly
      let ro = r * 0.55
      let go = g * 0.6
      let bo = b * 0.75
      // Blue shift
      ro -= 0.03
      bo += 0.06
      // Moderate contrast
      ro = applySCurve(ro, 0.3)
      go = applySCurve(go, 0.3)
      bo = applySCurve(bo, 0.25)
      // Heavy desaturation
      const [fr, fg, fb] = mixSaturation(ro, go, bo, 0.45)
      return [clamp01(fr), clamp01(fg), clamp01(fb)]
    }),
  }
}
