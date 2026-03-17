import type { LutPreset } from '../types'
import { generateLut, clamp01, mixSaturation, lerp } from '../generate-utils'

const SIZE = 17

export function createHighKeyBWLut(): LutPreset {
  return {
    id: 'high-key-bw',
    name: 'High-Key B&W',
    description: 'Bright, airy black & white with lifted shadows and soft contrast',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Full desaturation
      const [dr, dg, db] = mixSaturation(r, g, b, 0)
      // Heavily lift shadows, compress highlights — soft, bright feel
      let ro = lerp(0.18, 0.97, dr)
      let go = lerp(0.18, 0.97, dg)
      let bo = lerp(0.18, 0.97, db)
      // Brighten midtones
      const mid = Math.sin(dr * Math.PI)
      ro += 0.04 * mid
      go += 0.04 * mid
      bo += 0.04 * mid
      return [clamp01(ro), clamp01(go), clamp01(bo)]
    }),
  }
}
