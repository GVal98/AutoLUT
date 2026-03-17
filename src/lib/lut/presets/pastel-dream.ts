import type { LutPreset } from '../types'
import { generateLut, mixSaturation, lerp } from '../generate-utils'

const SIZE = 17

export function createPastelDreamLut(): LutPreset {
  return {
    id: 'pastel-dream',
    name: 'Pastel Dream',
    description: 'Lifted shadows, lowered highlights, desaturated with pink/lavender tint',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Lift shadows, lower highlights (compress range)
      let ro = lerp(0.10, 0.92, r)
      let go = lerp(0.08, 0.90, g)
      let bo = lerp(0.10, 0.92, b)
      // Reduce saturation 30%
      ;[ro, go, bo] = mixSaturation(ro, go, bo, 0.70)
      // Pink/lavender tint
      ro += 0.04
      go -= 0.01
      bo += 0.05
      return [ro, go, bo]
    }),
  }
}
