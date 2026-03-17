import type { LutPreset } from './types'
import { clamp01, applySCurve, mixSaturation } from './generate-utils'

export function generateIdentityLut(size: number): Float32Array {
  const total = size * size * size * 4
  const data = new Float32Array(total)
  let idx = 0
  for (let b = 0; b < size; b++) {
    for (let g = 0; g < size; g++) {
      for (let r = 0; r < size; r++) {
        data[idx++] = r / (size - 1)
        data[idx++] = g / (size - 1)
        data[idx++] = b / (size - 1)
        data[idx++] = 1.0
      }
    }
  }
  return data
}

export function mutateLut(
  parent: LutPreset,
  variationIndex: number,
  round: number,
): LutPreset {
  const size = parent.size
  const identity = generateIdentityLut(size)
  const src = parent.data
  const total = size * size * size * 4
  const out = new Float32Array(total)

  // Later rounds make finer adjustments
  const roundScale = 1 / (1 + (round - 2) * 0.3)

  switch (variationIndex) {
    case 0: // Weaken — lerp toward identity
      {
        const strength = 0.65
        for (let i = 0; i < total; i += 4) {
          out[i] = clamp01(identity[i] + (src[i] - identity[i]) * strength)
          out[i + 1] = clamp01(identity[i + 1] + (src[i + 1] - identity[i + 1]) * strength)
          out[i + 2] = clamp01(identity[i + 2] + (src[i + 2] - identity[i + 2]) * strength)
          out[i + 3] = 1.0
        }
      }
      break

    case 1: // Amplify — extrapolate past parent
      {
        const factor = 1 + 0.4 * roundScale
        for (let i = 0; i < total; i += 4) {
          out[i] = clamp01(identity[i] + (src[i] - identity[i]) * factor)
          out[i + 1] = clamp01(identity[i + 1] + (src[i + 1] - identity[i + 1]) * factor)
          out[i + 2] = clamp01(identity[i + 2] + (src[i + 2] - identity[i + 2]) * factor)
          out[i + 3] = 1.0
        }
      }
      break

    case 2: // Warm/Cool Shift
      {
        const offset = 0.04 * roundScale
        const sign = round % 2 === 0 ? 1 : -1
        for (let i = 0; i < total; i += 4) {
          out[i] = clamp01(src[i] + offset * sign)
          out[i + 1] = src[i + 1]
          out[i + 2] = clamp01(src[i + 2] - offset * sign)
          out[i + 3] = 1.0
        }
      }
      break

    case 3: // Saturation Modify
      {
        const satAmount = round % 2 === 0 ? 1.2 : 0.8
        const blend = roundScale
        for (let i = 0; i < total; i += 4) {
          const [sr, sg, sb] = mixSaturation(src[i], src[i + 1], src[i + 2], satAmount)
          out[i] = clamp01(src[i] + (sr - src[i]) * blend)
          out[i + 1] = clamp01(src[i + 1] + (sg - src[i + 1]) * blend)
          out[i + 2] = clamp01(src[i + 2] + (sb - src[i + 2]) * blend)
          out[i + 3] = 1.0
        }
      }
      break

    case 4: // Contrast Twist — mild S-curve or flatten
      {
        const curveStrength = 0.3 * roundScale
        const doFlatten = round % 2 !== 0
        for (let i = 0; i < total; i += 4) {
          if (doFlatten) {
            // Flatten toward 0.5
            out[i] = clamp01(src[i] + (0.5 - src[i]) * curveStrength)
            out[i + 1] = clamp01(src[i + 1] + (0.5 - src[i + 1]) * curveStrength)
            out[i + 2] = clamp01(src[i + 2] + (0.5 - src[i + 2]) * curveStrength)
          } else {
            out[i] = applySCurve(src[i], curveStrength)
            out[i + 1] = applySCurve(src[i + 1], curveStrength)
            out[i + 2] = applySCurve(src[i + 2], curveStrength)
          }
          out[i + 3] = 1.0
        }
      }
      break

    default:
      out.set(src)
  }

  const names = ['Soft', 'Bold', 'Shifted', 'Saturated', 'Contrast']
  return {
    id: `${parent.id}--v${variationIndex}-r${round}`,
    name: `${parent.name} ${names[variationIndex]}`,
    description: `Variation ${variationIndex + 1} of ${parent.name} (round ${round})`,
    size,
    data: out,
    parentId: parent.id,
    round,
  }
}
