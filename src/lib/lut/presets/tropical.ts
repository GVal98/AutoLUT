import type { LutPreset } from '../types'
import { generateLut, clamp01, mixSaturation } from '../generate-utils'

const SIZE = 17

export function createTropicalLut(): LutPreset {
  return {
    id: 'tropical',
    name: 'Tropical',
    description: 'Green/yellow midtones, cyan shadows, saturation ~1.2',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      const mid = Math.sin(g * Math.PI)
      // Green/yellow midtone push
      const ro = r + 0.03 * mid
      let go = g + 0.06 * mid
      let bo = b
      // Cyan shadows
      const shadow = 1 - (0.2126 * r + 0.7152 * g + 0.0722 * b)
      go = go + 0.04 * shadow
      bo = bo + 0.05 * shadow
      // Saturation boost
      const [sr, sg, sb] = mixSaturation(ro, go, bo, 1.2)
      return [clamp01(sr), clamp01(sg), clamp01(sb)]
    }),
  }
}
