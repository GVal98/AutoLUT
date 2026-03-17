import type { LutPreset } from '../types'
import { generateLut, applySCurve, mixSaturation } from '../generate-utils'

const SIZE = 17

export function createNoirLut(): LutPreset {
  return {
    id: 'noir',
    name: 'Noir',
    description: 'Near-monochrome with strong contrast and slight warm tint',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Desaturate ~85%
      let [ro, go, bo] = mixSaturation(r, g, b, 0.15)
      // Strong S-curve
      ro = applySCurve(ro, 0.6)
      go = applySCurve(go, 0.6)
      bo = applySCurve(bo, 0.6)
      // Slight warm tint
      ro += 0.02
      bo -= 0.02
      return [ro, go, bo]
    }),
  }
}
