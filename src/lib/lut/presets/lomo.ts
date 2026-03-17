import type { LutPreset } from '../types'
import { generateLut, clamp01, applySCurve, mixSaturation } from '../generate-utils'

const SIZE = 17

export function createLomoLut(): LutPreset {
  return {
    id: 'lomo',
    name: 'Lomo',
    description: 'Heavy S-curve, oversaturated ~1.35, green midtone shift',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Heavy S-curve
      const ro = applySCurve(r, 0.55)
      let go = applySCurve(g, 0.55)
      const bo = applySCurve(b, 0.55)
      // Green midtone shift
      const mid = Math.sin(g * Math.PI)
      go = go + 0.04 * mid
      // Oversaturate
      const [sr, sg, sb] = mixSaturation(ro, go, bo, 1.35)
      return [clamp01(sr), clamp01(sg), clamp01(sb)]
    }),
  }
}
