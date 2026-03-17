import type { LutPreset } from '../types'
import { generateLut, clamp01, mixSaturation, lerp } from '../generate-utils'

const SIZE = 17

export function createSeventiesRetroLut(): LutPreset {
  return {
    id: 'seventies-retro',
    name: "'70s Retro",
    description: 'Heavy orange/amber cast, faded blacks, low contrast, warm tint',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Faded blacks, lowered whites — very compressed
      let ro = lerp(0.1, 0.88, r)
      let go = lerp(0.08, 0.86, g)
      let bo = lerp(0.06, 0.82, b)
      // Heavy orange/amber cast
      ro += 0.06
      go += 0.03
      bo -= 0.06
      // Warm midtone push
      const mid = Math.sin(r * Math.PI)
      ro += 0.03 * mid
      go += 0.015 * mid
      // Slight desaturation for faded look
      const [fr, fg, fb] = mixSaturation(ro, go, bo, 0.85)
      return [clamp01(fr), clamp01(fg), clamp01(fb)]
    }),
  }
}
