import type { LutPreset } from '../types'
import { generateLut, applySCurve, mixSaturation, lerp } from '../generate-utils'

const SIZE = 17

export function createVintageFilmLut(): LutPreset {
  return {
    id: 'vintage-film',
    name: 'Vintage Film',
    description: 'Lifted blacks, reduced saturation, warm shift, S-curve contrast',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Lift blacks
      let ro = lerp(0.06, r, 0.94 + 0.06 * r)
      let go = lerp(0.04, g, 0.94 + 0.06 * g)
      let bo = lerp(0.03, b, 0.94 + 0.06 * b)
      // Warm shift
      ro += 0.03
      bo -= 0.04
      // S-curve contrast
      ro = applySCurve(ro, 0.4)
      go = applySCurve(go, 0.35)
      bo = applySCurve(bo, 0.3)
      // Reduce saturation 20%
      const [fr, fg, fb] = mixSaturation(ro, go, bo, 0.80)
      return [fr, fg, fb]
    }),
  }
}
