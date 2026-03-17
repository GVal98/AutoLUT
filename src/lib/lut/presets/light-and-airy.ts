import type { LutPreset } from '../types'
import { generateLut, clamp01, mixSaturation, lerp } from '../generate-utils'

const SIZE = 17

export function createLightAndAiryLut(): LutPreset {
  return {
    id: 'light-and-airy',
    name: 'Light & Airy',
    description: 'Bright, lifted shadows, very low contrast, slight warm tint, slightly desaturated',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Very lifted shadows, gently compressed highlights
      let ro = lerp(0.14, 0.96, r)
      let go = lerp(0.14, 0.96, g)
      let bo = lerp(0.13, 0.96, b)
      // Brighten midtones
      const mid = Math.sin(r * Math.PI)
      ro += 0.03 * mid
      go += 0.03 * mid
      bo += 0.025 * mid
      // Slight warm tint
      ro += 0.015
      bo -= 0.01
      // Subtle desaturation
      const [fr, fg, fb] = mixSaturation(ro, go, bo, 0.88)
      return [clamp01(fr), clamp01(fg), clamp01(fb)]
    }),
  }
}
