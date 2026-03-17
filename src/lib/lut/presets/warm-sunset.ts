import type { LutPreset } from '../types'
import { generateLut, applySCurve, mixSaturation, lerp } from '../generate-utils'

const SIZE = 17

export function createWarmSunsetLut(): LutPreset {
  return {
    id: 'warm-sunset',
    name: 'Warm Sunset',
    description: 'Boost R midtones, reduce B highlights, slight saturation boost',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Warm shift: boost red midtones
      let ro = r + 0.06 * Math.sin(r * Math.PI)
      // Slightly warm greens
      let go = g + 0.02 * Math.sin(g * Math.PI)
      // Reduce blue in highlights
      let bo = b - 0.08 * b * b
      // Gentle S-curve for contrast
      ro = applySCurve(ro, 0.3)
      go = applySCurve(go, 0.2)
      bo = applySCurve(bo, 0.2)
      // Slight saturation boost
      const [fr, fg, fb] = mixSaturation(ro, go, bo, 1.15)
      return [lerp(ro, fr, 1), lerp(go, fg, 1), lerp(bo, fb, 1)]
    }),
  }
}
