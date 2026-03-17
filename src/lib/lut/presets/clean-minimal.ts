import type { LutPreset } from '../types'
import { generateLut, clamp01, applySCurve } from '../generate-utils'

const SIZE = 17

export function createCleanMinimalLut(): LutPreset {
  return {
    id: 'clean-minimal',
    name: 'Clean Minimal',
    description: 'Near-neutral, subtle contrast, true-to-life but polished, highlight rolloff',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Very subtle S-curve for mild contrast
      let ro = applySCurve(r, 0.15)
      let go = applySCurve(g, 0.15)
      let bo = applySCurve(b, 0.15)
      // Gentle highlight rolloff — compress top end slightly
      if (ro > 0.85) ro = 0.85 + (ro - 0.85) * 0.7
      if (go > 0.85) go = 0.85 + (go - 0.85) * 0.7
      if (bo > 0.85) bo = 0.85 + (bo - 0.85) * 0.7
      return [clamp01(ro), clamp01(go), clamp01(bo)]
    }),
  }
}
