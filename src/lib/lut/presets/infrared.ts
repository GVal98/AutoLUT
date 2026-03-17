import type { LutPreset } from '../types'
import { generateLut, clamp01, mixSaturation } from '../generate-utils'

const SIZE = 17

export function createInfraredLut(): LutPreset {
  return {
    id: 'infrared',
    name: 'Infrared',
    description: 'Partial R/G swap, boosted reds, desaturated blues',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Partial R/G swap
      const ro = r * 0.6 + g * 0.4 + 0.08
      const go = g * 0.6 + r * 0.4 - 0.04
      let bo = b
      // Desaturate blues
      const blueness = Math.max(0, b - Math.max(r, g))
      const [, , sb] = mixSaturation(ro, go, bo, 0.5)
      bo = bo + (sb - bo) * blueness * 2
      return [clamp01(ro), clamp01(go), clamp01(bo)]
    }),
  }
}
