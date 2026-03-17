import type { LutPreset } from '../types'
import { generateLut, clamp01 } from '../generate-utils'

const SIZE = 17

export function createAutumnHarvestLut(): LutPreset {
  return {
    id: 'autumn-harvest',
    name: 'Autumn Harvest',
    description: 'Orange midtones, reduced blue, warm shadows',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      const mid = Math.sin(r * Math.PI)
      let ro = r + 0.08 * mid
      let go = g + 0.03 * mid
      const bo = b * 0.82
      // Warm shadows
      const shadow = 1 - r
      ro = ro + 0.04 * shadow
      go = go + 0.02 * shadow
      return [clamp01(ro), clamp01(go), clamp01(bo)]
    }),
  }
}
