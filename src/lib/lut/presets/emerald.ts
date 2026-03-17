import type { LutPreset } from '../types'
import { generateLut, clamp01 } from '../generate-utils'

const SIZE = 17

export function createEmeraldLut(): LutPreset {
  return {
    id: 'emerald',
    name: 'Emerald',
    description: 'Green midtones, teal shadows, desaturated reds',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      const mid = Math.sin(g * Math.PI)
      // Green midtone push
      let ro = r * 0.90
      let go = g + 0.07 * mid
      let bo = b
      // Teal shadows
      const shadow = 1 - (0.2126 * r + 0.7152 * g + 0.0722 * b)
      go = go + 0.04 * shadow
      bo = bo + 0.05 * shadow
      // Desaturate reds — pull r toward luma
      const luma = 0.2126 * ro + 0.7152 * go + 0.0722 * bo
      ro = luma + (ro - luma) * 0.7
      return [clamp01(ro), clamp01(go), clamp01(bo)]
    }),
  }
}
