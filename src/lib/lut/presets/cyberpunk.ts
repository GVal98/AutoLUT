import type { LutPreset } from '../types'
import { generateLut, clamp01, mixSaturation } from '../generate-utils'

const SIZE = 17

export function createCyberpunkLut(): LutPreset {
  return {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Magenta shadows, cyan highlights, high saturation',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
      // Magenta shadows
      const shadow = 1 - luma
      let ro = r + 0.10 * shadow
      let go = g - 0.05 * shadow
      let bo = b + 0.12 * shadow
      // Cyan highlights
      const highlight = luma
      ro = ro - 0.06 * highlight
      go = go + 0.06 * highlight
      bo = bo + 0.08 * highlight
      // High saturation
      const [sr, sg, sb] = mixSaturation(ro, go, bo, 1.4)
      return [clamp01(sr), clamp01(sg), clamp01(sb)]
    }),
  }
}
