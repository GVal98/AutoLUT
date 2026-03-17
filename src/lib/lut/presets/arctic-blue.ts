import type { LutPreset } from '../types'
import { generateLut, clamp01 } from '../generate-utils'

const SIZE = 17

export function createArcticBlueLut(): LutPreset {
  return {
    id: 'arctic-blue',
    name: 'Arctic Blue',
    description: 'Heavy blue/cyan midtones, raised black point',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Raised black point
      const lift = 0.08
      const ro = r * 0.85 + lift
      let go = g * 0.92 + lift
      let bo = b * 1.0 + lift + 0.06
      // Blue/cyan push in midtones
      const mid = Math.sin(b * Math.PI)
      go = go + 0.04 * mid
      bo = bo + 0.10 * mid
      return [clamp01(ro), clamp01(go), clamp01(bo)]
    }),
  }
}
