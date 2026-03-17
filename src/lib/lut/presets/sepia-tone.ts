import type { LutPreset } from '../types'
import { generateLut, clamp01, mixSaturation } from '../generate-utils'

const SIZE = 17

export function createSepiaToneLut(): LutPreset {
  return {
    id: 'sepia-tone',
    name: 'Sepia Tone',
    description: 'Full desat + sepia tint (R+0.12, G+0.06, B-0.04)',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Full desaturation
      const [ro, go, bo] = mixSaturation(r, g, b, 0)
      // Sepia tint
      return [clamp01(ro + 0.12), clamp01(go + 0.06), clamp01(bo - 0.04)]
    }),
  }
}
