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

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return [h, s, l]
}

export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) return [l, l, l]
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  return [hue2rgb(p, q, h + 1 / 3), hue2rgb(p, q, h), hue2rgb(p, q, h - 1 / 3)]
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
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
