import type { LutPreset } from '../types'
import { generateLut, clamp01, applySCurve, mixSaturation } from '../generate-utils'

const SIZE = 17

export function createDarkAndMoodyLut(): LutPreset {
  return {
    id: 'dark-and-moody',
    name: 'Dark & Moody',
    description: 'Crushed shadows, muted colors, dark tone, slight teal midtones',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Darken overall
      let ro = r * 0.85
      let go = g * 0.85
      let bo = b * 0.85
      // Crush shadows
      ro = applySCurve(ro, 0.4)
      go = applySCurve(go, 0.4)
      bo = applySCurve(bo, 0.4)
      // Teal tint in midtones
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
      const midAmt = Math.sin(luma * Math.PI)
      ro -= 0.02 * midAmt
      go += 0.015 * midAmt
      bo += 0.02 * midAmt
      // Muted colors
      const [fr, fg, fb] = mixSaturation(ro, go, bo, 0.7)
      return [clamp01(fr), clamp01(fg), clamp01(fb)]
    }),
  }
}
