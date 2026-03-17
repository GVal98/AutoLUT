import type { LutPreset } from '../types'
import { generateLut, applySCurve, mixSaturation } from '../generate-utils'

const SIZE = 17

export function createGoldenHourLut(): LutPreset {
  return {
    id: 'golden-hour',
    name: 'Golden Hour',
    description: 'Strong warm shift with gentle contrast',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Strong warm shift
      let ro = r + 0.08 * Math.sin(r * Math.PI)
      let go = g + 0.04 * Math.sin(g * Math.PI)
      let bo = b - 0.10 * (1 - b * b)
      // Gentle contrast
      ro = applySCurve(ro, 0.25)
      go = applySCurve(go, 0.2)
      bo = applySCurve(bo, 0.15)
      // Slight saturation boost
      const [fr, fg, fb] = mixSaturation(ro, go, bo, 1.12)
      return [fr, fg, fb]
    }),
  }
}
