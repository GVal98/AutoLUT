import type { LutPreset } from './types'
import {
  clamp01,
  applySCurve,
  mixSaturation,
  lerp,
  rgbToHsl,
  hslToRgb,
  smoothstep,
} from './generate-utils'

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
    case 0: // Soft — lerp toward identity
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

    case 1: // Bold — extrapolate past parent
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

    case 2: // Warm — red +offset, blue -offset
      {
        const offset = 0.04 * roundScale
        for (let i = 0; i < total; i += 4) {
          out[i] = clamp01(src[i] + offset)
          out[i + 1] = src[i + 1]
          out[i + 2] = clamp01(src[i + 2] - offset)
          out[i + 3] = 1.0
        }
      }
      break

    case 3: // Cool — red -offset, blue +offset
      {
        const offset = 0.04 * roundScale
        for (let i = 0; i < total; i += 4) {
          out[i] = clamp01(src[i] - offset)
          out[i + 1] = src[i + 1]
          out[i + 2] = clamp01(src[i + 2] + offset)
          out[i + 3] = 1.0
        }
      }
      break

    case 4: // Vivid — saturate
      {
        const blend = roundScale
        for (let i = 0; i < total; i += 4) {
          const [sr, sg, sb] = mixSaturation(src[i], src[i + 1], src[i + 2], 1.0 + 0.2 * roundScale)
          out[i] = clamp01(src[i] + (sr - src[i]) * blend)
          out[i + 1] = clamp01(src[i + 1] + (sg - src[i + 1]) * blend)
          out[i + 2] = clamp01(src[i + 2] + (sb - src[i + 2]) * blend)
          out[i + 3] = 1.0
        }
      }
      break

    case 5: // Muted — desaturate
      {
        const blend = roundScale
        for (let i = 0; i < total; i += 4) {
          const [sr, sg, sb] = mixSaturation(src[i], src[i + 1], src[i + 2], 1.0 - 0.2 * roundScale)
          out[i] = clamp01(src[i] + (sr - src[i]) * blend)
          out[i + 1] = clamp01(src[i + 1] + (sg - src[i + 1]) * blend)
          out[i + 2] = clamp01(src[i + 2] + (sb - src[i + 2]) * blend)
          out[i + 3] = 1.0
        }
      }
      break

    case 6: // Crisp — S-curve contrast boost
      {
        const curveStrength = 0.3 * roundScale
        for (let i = 0; i < total; i += 4) {
          out[i] = applySCurve(src[i], curveStrength)
          out[i + 1] = applySCurve(src[i + 1], curveStrength)
          out[i + 2] = applySCurve(src[i + 2], curveStrength)
          out[i + 3] = 1.0
        }
      }
      break

    case 7: // Flat — flatten toward 0.5
      {
        const curveStrength = 0.3 * roundScale
        for (let i = 0; i < total; i += 4) {
          out[i] = clamp01(src[i] + (0.5 - src[i]) * curveStrength)
          out[i + 1] = clamp01(src[i + 1] + (0.5 - src[i + 1]) * curveStrength)
          out[i + 2] = clamp01(src[i + 2] + (0.5 - src[i + 2]) * curveStrength)
          out[i + 3] = 1.0
        }
      }
      break

    case 8: // Faded — lift blacks
      {
        const fade = 0.10 * roundScale
        for (let i = 0; i < total; i += 4) {
          out[i] = clamp01(src[i] * (1 - fade) + fade)
          out[i + 1] = clamp01(src[i + 1] * (1 - fade) + fade)
          out[i + 2] = clamp01(src[i + 2] * (1 - fade) + fade)
          out[i + 3] = 1.0
        }
      }
      break

    case 9: // Deep — crush blacks via gamma
      {
        const gamma = 1 + 0.4 * roundScale
        for (let i = 0; i < total; i += 4) {
          out[i] = clamp01(Math.pow(src[i], gamma))
          out[i + 1] = clamp01(Math.pow(src[i + 1], gamma))
          out[i + 2] = clamp01(Math.pow(src[i + 2], gamma))
          out[i + 3] = 1.0
        }
      }
      break

    case 10: // Green — green channel +offset
      {
        const offset = 0.035 * roundScale
        for (let i = 0; i < total; i += 4) {
          out[i] = src[i]
          out[i + 1] = clamp01(src[i + 1] + offset)
          out[i + 2] = src[i + 2]
          out[i + 3] = 1.0
        }
      }
      break

    case 11: // Magenta — green channel -offset
      {
        const offset = 0.035 * roundScale
        for (let i = 0; i < total; i += 4) {
          out[i] = src[i]
          out[i + 1] = clamp01(src[i + 1] - offset)
          out[i + 2] = src[i + 2]
          out[i + 3] = 1.0
        }
      }
      break

    case 12: // Sunset — warm shadows + cool highlights
      {
        const strength = 0.05 * roundScale
        for (let i = 0; i < total; i += 4) {
          const luma = 0.2126 * src[i] + 0.7152 * src[i + 1] + 0.0722 * src[i + 2]
          const shadow = 1 - smoothstep(0.25, 0.75, luma)
          const highlight = smoothstep(0.25, 0.75, luma)
          out[i] = clamp01(src[i] + strength * shadow - strength * highlight * 0.5)
          out[i + 1] = src[i + 1]
          out[i + 2] = clamp01(src[i + 2] - strength * shadow + strength * highlight * 0.5)
          out[i + 3] = 1.0
        }
      }
      break

    case 13: // Moonlit — cool shadows + warm highlights
      {
        const strength = 0.05 * roundScale
        for (let i = 0; i < total; i += 4) {
          const luma = 0.2126 * src[i] + 0.7152 * src[i + 1] + 0.0722 * src[i + 2]
          const shadow = 1 - smoothstep(0.25, 0.75, luma)
          const highlight = smoothstep(0.25, 0.75, luma)
          out[i] = clamp01(src[i] - strength * shadow + strength * highlight * 0.5)
          out[i + 1] = src[i + 1]
          out[i + 2] = clamp01(src[i + 2] + strength * shadow - strength * highlight * 0.5)
          out[i + 3] = 1.0
        }
      }
      break

    case 14: // Hue+ — rotate hue +15deg
      {
        const shift = 0.042 * roundScale
        for (let i = 0; i < total; i += 4) {
          const [h, s, l] = rgbToHsl(src[i], src[i + 1], src[i + 2])
          let nh = h + shift
          if (nh > 1) nh -= 1
          const [nr, ng, nb] = hslToRgb(nh, s, l)
          out[i] = clamp01(nr)
          out[i + 1] = clamp01(ng)
          out[i + 2] = clamp01(nb)
          out[i + 3] = 1.0
        }
      }
      break

    case 15: // Hue- — rotate hue -15deg
      {
        const shift = 0.042 * roundScale
        for (let i = 0; i < total; i += 4) {
          const [h, s, l] = rgbToHsl(src[i], src[i + 1], src[i + 2])
          let nh = h - shift
          if (nh < 0) nh += 1
          const [nr, ng, nb] = hslToRgb(nh, s, l)
          out[i] = clamp01(nr)
          out[i + 1] = clamp01(ng)
          out[i + 2] = clamp01(nb)
          out[i + 3] = 1.0
        }
      }
      break

    case 16: // Xpro — cross-process forward: R←G, G←B, B←R
      {
        const mix = 0.15 * roundScale
        for (let i = 0; i < total; i += 4) {
          out[i] = clamp01(lerp(src[i], src[i + 1], mix))
          out[i + 1] = clamp01(lerp(src[i + 1], src[i + 2], mix))
          out[i + 2] = clamp01(lerp(src[i + 2], src[i], mix))
          out[i + 3] = 1.0
        }
      }
      break

    case 17: // Xpro II — cross-process reverse: R←B, G←R, B←G
      {
        const mix = 0.15 * roundScale
        for (let i = 0; i < total; i += 4) {
          out[i] = clamp01(lerp(src[i], src[i + 2], mix))
          out[i + 1] = clamp01(lerp(src[i + 1], src[i], mix))
          out[i + 2] = clamp01(lerp(src[i + 2], src[i + 1], mix))
          out[i + 3] = 1.0
        }
      }
      break

    default:
      out.set(src)
  }

  const names = [
    'Soft', 'Bold', 'Warm', 'Cool', 'Vivid', 'Muted', 'Crisp', 'Flat',
    'Faded', 'Deep', 'Green', 'Magenta', 'Sunset', 'Moonlit', 'Hue+', 'Hue-',
    'Xpro', 'Xpro II',
  ]
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
