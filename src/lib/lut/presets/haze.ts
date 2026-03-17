import type { LutPreset } from '../types'
import { generateLut, clamp01 } from '../generate-utils'

const SIZE = 17

export function createHazeLut(): LutPreset {
  return {
    id: 'haze',
    name: 'Haze',
    description: 'Raised blacks ~0.15, lowered whites ~0.85, blue tint',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Compress to 0.15..0.85 range
      let ro = r * 0.70 + 0.15
      const go = g * 0.70 + 0.15
      let bo = b * 0.70 + 0.15
      // Blue tint
      bo = bo + 0.04
      ro = ro - 0.02
      return [clamp01(ro), clamp01(go), clamp01(bo)]
    }),
  }
}
