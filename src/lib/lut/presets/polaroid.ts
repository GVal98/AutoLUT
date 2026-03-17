import type { LutPreset } from '../types'
import { generateLut, clamp01, mixSaturation, lerp } from '../generate-utils'

const SIZE = 17

export function createPolaroidLut(): LutPreset {
  return {
    id: 'polaroid',
    name: 'Polaroid',
    description: 'Faded, green-tinted shadows, warm highlights, compressed range, soft',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Compressed dynamic range — lifted blacks, lowered whites
      let ro = lerp(0.08, 0.90, r)
      let go = lerp(0.08, 0.90, g)
      let bo = lerp(0.08, 0.90, b)
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
      // Green-tinted shadows
      const shadowAmt = Math.pow(1 - luma, 2)
      go += 0.035 * shadowAmt
      bo += 0.01 * shadowAmt
      // Warm highlights
      const hiAmt = Math.pow(luma, 2)
      ro += 0.04 * hiAmt
      go += 0.02 * hiAmt
      bo -= 0.02 * hiAmt
      // Slight desaturation for faded feel
      const [fr, fg, fb] = mixSaturation(ro, go, bo, 0.82)
      return [clamp01(fr), clamp01(fg), clamp01(fb)]
    }),
  }
}
