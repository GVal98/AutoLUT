import type { LutPreset } from '../types'
import { generateLut, clamp01, mixSaturation } from '../generate-utils'

const SIZE = 17

export function createMoonlightLut(): LutPreset {
  return {
    id: 'moonlight',
    name: 'Moonlight',
    description: 'Blue-shift, strong desaturation ~0.4, raised shadows',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Strong desaturation
      let [ro, go, bo] = mixSaturation(r, g, b, 0.4)
      // Blue shift
      ro = ro - 0.04
      bo = bo + 0.08
      // Raise shadows
      const lift = 0.10
      ro = ro * (1 - lift) + lift
      go = go * (1 - lift) + lift
      bo = bo * (1 - lift) + lift
      return [clamp01(ro), clamp01(go), clamp01(bo)]
    }),
  }
}
