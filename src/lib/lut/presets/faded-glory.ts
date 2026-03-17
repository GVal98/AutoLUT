import type { LutPreset } from '../types'
import { generateLut, mixSaturation, lerp } from '../generate-utils'

const SIZE = 17

export function createFadedGloryLut(): LutPreset {
  return {
    id: 'faded-glory',
    name: 'Faded Glory',
    description: 'Raised black point, lowered white point, green midtone tint',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Raise black point, lower white point
      let ro = lerp(0.07, 0.90, r)
      let go = lerp(0.07, 0.90, g)
      let bo = lerp(0.07, 0.90, b)
      // Green midtone tint
      const midAmt = Math.sin(go * Math.PI)
      go += 0.03 * midAmt
      // Slight warm undertone
      ro += 0.01
      bo -= 0.01
      // Desaturate 15%
      const [fr, fg, fb] = mixSaturation(ro, go, bo, 0.85)
      return [fr, fg, fb]
    }),
  }
}
