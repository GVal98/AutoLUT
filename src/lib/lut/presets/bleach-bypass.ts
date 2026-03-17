import type { LutPreset } from '../types'
import { generateLut, clamp01, applySCurve, mixSaturation } from '../generate-utils'

const SIZE = 17

export function createBleachBypassLut(): LutPreset {
  return {
    id: 'bleach-bypass',
    name: 'Bleach Bypass',
    description: 'Mix luminance ~60%, low saturation, strong contrast',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Desaturate
      let [ro, go, bo] = mixSaturation(r, g, b, 0.4)
      // Mix with luminance
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
      ro = ro * 0.4 + luma * 0.6
      go = go * 0.4 + luma * 0.6
      bo = bo * 0.4 + luma * 0.6
      // Strong contrast
      ro = applySCurve(ro, 0.5)
      go = applySCurve(go, 0.5)
      bo = applySCurve(bo, 0.5)
      return [clamp01(ro), clamp01(go), clamp01(bo)]
    }),
  }
}
