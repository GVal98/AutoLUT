import type { LutPreset } from '../types'
import { generateLut, clamp01, mixSaturation, lerp } from '../generate-utils'

const SIZE = 17

export function createEternaLut(): LutPreset {
  return {
    id: 'eterna',
    name: 'Eterna',
    description: 'Very low saturation, flat/low contrast, blue-green shadow tint, cinema-ready',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Very flat — compressed dynamic range
      let ro = lerp(0.08, 0.88, r)
      let go = lerp(0.08, 0.88, g)
      let bo = lerp(0.08, 0.88, b)
      // Blue-green shadow tint
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
      const shadowAmt = Math.pow(1 - luma, 2)
      go += 0.02 * shadowAmt
      bo += 0.03 * shadowAmt
      // Heavy desaturation
      const [fr, fg, fb] = mixSaturation(ro, go, bo, 0.55)
      return [clamp01(fr), clamp01(fg), clamp01(fb)]
    }),
  }
}
