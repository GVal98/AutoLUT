import type { LutPreset } from '../types'
import { generateLut, clamp01, mixSaturation } from '../generate-utils'

const SIZE = 17

export function createDustyRoseLut(): LutPreset {
  return {
    id: 'dusty-rose',
    name: 'Dusty Rose',
    description: 'Pink/mauve tint, compressed range, 0.75 saturation',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Compress range
      let ro = r * 0.85 + 0.08
      const go = g * 0.85 + 0.08
      let bo = b * 0.85 + 0.08
      // Pink/mauve tint
      ro = ro + 0.06
      bo = bo + 0.03
      // Reduce saturation
      const [sr, sg, sb] = mixSaturation(ro, go, bo, 0.75)
      return [clamp01(sr), clamp01(sg), clamp01(sb)]
    }),
  }
}
