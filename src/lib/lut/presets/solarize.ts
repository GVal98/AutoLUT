import type { LutPreset } from '../types'
import { generateLut, clamp01, mixSaturation } from '../generate-utils'

const SIZE = 17

export function createSolarizeLut(): LutPreset {
  return {
    id: 'solarize',
    name: 'Solarize',
    description: 'Partial inversion in highlights (>0.6), moderate sat',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      function solarizeChannel(v: number): number {
        if (v > 0.6) {
          // Partial inversion in highlights
          return v - (v - 0.6) * 0.6
        }
        return v
      }
      const ro = solarizeChannel(r)
      const go = solarizeChannel(g)
      const bo = solarizeChannel(b)
      // Moderate saturation
      const [sr, sg, sb] = mixSaturation(ro, go, bo, 1.1)
      return [clamp01(sr), clamp01(sg), clamp01(sb)]
    }),
  }
}
