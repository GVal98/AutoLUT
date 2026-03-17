import type { LutPreset } from '../types'
import { generateLut, clamp01, applySCurve, mixSaturation, lerp } from '../generate-utils'

const SIZE = 17

export function createKodakGold200Lut(): LutPreset {
  return {
    id: 'kodak-gold-200',
    name: 'Kodak Gold 200',
    description: 'Warm yellow cast, moderate saturation, lifted blacks, nostalgic',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Lift blacks
      let ro = lerp(0.05, 1.0, r)
      let go = lerp(0.045, 1.0, g)
      let bo = lerp(0.035, 0.95, b)
      // Warm yellow cast — push red and green, suppress blue
      ro += 0.04
      go += 0.025
      bo -= 0.04
      // Moderate contrast
      ro = applySCurve(ro, 0.25)
      go = applySCurve(go, 0.25)
      bo = applySCurve(bo, 0.2)
      // Moderate saturation
      const [fr, fg, fb] = mixSaturation(ro, go, bo, 1.1)
      return [clamp01(fr), clamp01(fg), clamp01(fb)]
    }),
  }
}
