import type { LutPreset } from '../types'
import { generateLut, clamp01, mixSaturation, lerp } from '../generate-utils'

const SIZE = 17

export function createFujiPro400HLut(): LutPreset {
  return {
    id: 'fuji-pro-400h',
    name: 'Fuji Pro 400H',
    description: 'Soft pastel tones, slightly cool, muted greens, beautiful skin tones',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Low contrast — compress range
      let ro = lerp(0.06, 0.94, r)
      let go = lerp(0.06, 0.94, g)
      let bo = lerp(0.06, 0.94, b)
      // Slightly cool cast
      ro -= 0.01
      bo += 0.025
      // Mute greens slightly
      const greenness = go - Math.max(ro, bo)
      if (greenness > 0) {
        go -= greenness * 0.15
      }
      // Soft skin tone warmth in midtones
      const mid = Math.sin(r * Math.PI)
      ro += 0.015 * mid
      // Gentle desaturation for pastel feel
      const [fr, fg, fb] = mixSaturation(ro, go, bo, 0.82)
      return [clamp01(fr), clamp01(fg), clamp01(fb)]
    }),
  }
}
