import type { LutPreset } from '../types'
import { generateLut, applySCurve, mixSaturation } from '../generate-utils'

const SIZE = 17

export function createCoolBreezeLut(): LutPreset {
  return {
    id: 'cool-breeze',
    name: 'Cool Breeze',
    description: 'Boost B shadows/midtones, reduce R in shadows',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Reduce red in shadows
      let ro = r - 0.05 * (1 - r)
      // Slightly boost green midtones
      let go = g + 0.02 * Math.sin(g * Math.PI)
      // Boost blue in shadows and midtones
      let bo = b + 0.08 * (1 - b) * Math.sin(b * Math.PI)
      // Light contrast
      ro = applySCurve(ro, 0.15)
      go = applySCurve(go, 0.15)
      bo = applySCurve(bo, 0.15)
      // Slight desaturation for cool feel
      const [fr, fg, fb] = mixSaturation(ro, go, bo, 0.92)
      return [fr, fg, fb]
    }),
  }
}
