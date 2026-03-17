import type { LutPreset } from '../types'
import { generateLut, clamp01, applySCurve, mixSaturation } from '../generate-utils'

const SIZE = 17

export function createPortraLut(): LutPreset {
  return {
    id: 'portra',
    name: 'Portra',
    description: 'Warm skin tones, lifted shadows, subtle contrast',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Lift shadows
      const lift = 0.06
      let ro = r * (1 - lift) + lift
      let go = g * (1 - lift) + lift
      let bo = b * (1 - lift) + lift
      // Warm skin tones — gentle red/yellow push in midtones
      const mid = Math.sin(r * Math.PI)
      ro = ro + 0.04 * mid
      go = go + 0.02 * mid
      // Subtle contrast
      ro = applySCurve(ro, 0.2)
      go = applySCurve(go, 0.2)
      bo = applySCurve(bo, 0.15)
      // Slight saturation boost
      const [sr, sg, sb] = mixSaturation(ro, go, bo, 1.08)
      return [clamp01(sr), clamp01(sg), clamp01(sb)]
    }),
  }
}
