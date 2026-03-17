import type { LutPreset } from '../types'
import { generateLut, clamp01, applySCurve, mixSaturation } from '../generate-utils'

const SIZE = 17

export function createKodakTriXLut(): LutPreset {
  return {
    id: 'kodak-tri-x',
    name: 'Kodak Tri-X',
    description: 'Classic high-contrast B&W, deep blacks, bright whites',
    size: SIZE,
    data: generateLut(SIZE, (r, g, b) => {
      // Full desaturation — pure B&W
      const [dr, dg, db] = mixSaturation(r, g, b, 0)
      // Strong S-curve for punchy contrast
      let ro = applySCurve(dr, 0.55)
      let go = applySCurve(dg, 0.55)
      let bo = applySCurve(db, 0.55)
      // Slightly crush the deepest shadows for that film-black look
      ro = ro < 0.03 ? ro * 0.5 : ro
      go = go < 0.03 ? go * 0.5 : go
      bo = bo < 0.03 ? bo * 0.5 : bo
      return [clamp01(ro), clamp01(go), clamp01(bo)]
    }),
  }
}
