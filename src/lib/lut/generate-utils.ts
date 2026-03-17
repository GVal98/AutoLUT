export function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v
}

export function applySCurve(v: number, strength: number): number {
  // Attempt midpoint-based S-curve: strength > 0 adds contrast, < 0 flattens
  const t = clamp01(v)
  const s = clamp01(strength)
  const curved = t - s * t * (1 - t) * (0.5 - t) * 4
  return clamp01(curved)
}

export function applyChannelCurve(
  v: number,
  black: number,
  white: number,
  gamma: number,
): number {
  const range = white - black
  if (range <= 0) return black
  const normalized = clamp01((v - black) / range)
  return clamp01(black + Math.pow(normalized, 1 / gamma) * range)
}

export function mixSaturation(
  r: number,
  g: number,
  b: number,
  amount: number,
): [number, number, number] {
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return [
    clamp01(luma + (r - luma) * amount),
    clamp01(luma + (g - luma) * amount),
    clamp01(luma + (b - luma) * amount),
  ]
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function generateLut(
  size: number,
  transformFn: (r: number, g: number, b: number) => [number, number, number],
): Float32Array {
  const total = size * size * size * 4
  const data = new Float32Array(total)
  let idx = 0
  for (let b = 0; b < size; b++) {
    for (let g = 0; g < size; g++) {
      for (let r = 0; r < size; r++) {
        const ri = r / (size - 1)
        const gi = g / (size - 1)
        const bi = b / (size - 1)
        const [ro, go, bo] = transformFn(ri, gi, bi)
        data[idx++] = clamp01(ro)
        data[idx++] = clamp01(go)
        data[idx++] = clamp01(bo)
        data[idx++] = 1.0
      }
    }
  }
  return data
}
