import type { LutPreset } from '../types'
import { generateLut, applySCurve, mixSaturation } from '../generate-utils'

const SIZE = 17

export function createVividPopLut(): LutPreset {
  return {
    id: 'vivid-pop',
    name: 'Vivid Pop',
    description: 'Strong contrast, boosted saturation, slight warmth',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Strong S-curve
      let ro = applySCurve(r, 0.5)
      const go = applySCurve(g, 0.45)
      let bo = applySCurve(b, 0.4)
      // Slight warmth
      ro += 0.02
      bo -= 0.02
      // Boost saturation 30%
      const [fr, fg, fb] = mixSaturation(ro, go, bo, 1.30)
      return [fr, fg, fb]
    }),
  }
}
