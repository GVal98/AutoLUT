import type { LutPreset } from '../types'
import { generateLut, clamp01, applySCurve, mixSaturation } from '../generate-utils'

const SIZE = 17

export function createAcrosLut(): LutPreset {
  return {
    id: 'acros',
    name: 'Acros',
    description: 'Premium B&W — smooth tones, deep blacks, excellent midtone separation',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Full desaturation
      const [dr, dg, db] = mixSaturation(r, g, b, 0)
      // Moderate S-curve — less aggressive than Tri-X for smoother tones
      let ro = applySCurve(dr, 0.35)
      let go = applySCurve(dg, 0.35)
      let bo = applySCurve(db, 0.35)
      // Enhanced midtone separation — subtle lift in lower-mids
      const mid = Math.sin(dr * Math.PI)
      ro += 0.015 * mid
      go += 0.015 * mid
      bo += 0.015 * mid
      // Deepen blacks
      ro = ro < 0.05 ? ro * 0.7 : ro
      go = go < 0.05 ? go * 0.7 : go
      bo = bo < 0.05 ? bo * 0.7 : bo
      return [clamp01(ro), clamp01(go), clamp01(bo)]
    }),
  }
}
