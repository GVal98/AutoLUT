export interface LutPreset {
  id: string
  name: string
  description: string
  size: number
  data: Float32Array
  parentId?: string
  round?: number
}
