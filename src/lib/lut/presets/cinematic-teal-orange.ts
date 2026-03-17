import type { LutPreset } from '../types'
import { generateLut, applySCurve, mixSaturation } from '../generate-utils'

const SIZE = 17

export function createCinematicTealOrangeLut(): LutPreset {
  return {
    id: 'cinematic-teal-orange',
    name: 'Cinematic',
    description: 'Teal shadows, orange highlights — classic cinema look',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
      // Shadows → teal (reduce R, boost G/B)
      const shadowAmt = Math.pow(1 - luma, 2)
      // Highlights → orange (boost R, reduce B)
      const hiAmt = Math.pow(luma, 2)

      let ro = r - 0.08 * shadowAmt + 0.10 * hiAmt
      let go = g + 0.04 * shadowAmt + 0.02 * hiAmt
      let bo = b + 0.06 * shadowAmt - 0.10 * hiAmt

      // Moderate S-curve
      ro = applySCurve(ro, 0.35)
      go = applySCurve(go, 0.3)
      bo = applySCurve(bo, 0.3)

      // Slightly boost saturation
      const [fr, fg, fb] = mixSaturation(ro, go, bo, 1.1)
      return [fr, fg, fb]
    }),
  }
}
