import { useRef, useEffect, useCallback } from 'react'
import { LutEngine } from '@/lib/lut/engine'
import type { LutPreset } from '@/lib/lut/types'

export function useLutEngine(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  image: HTMLImageElement | null,
  preset: LutPreset | null,
) {
  const engineRef = useRef<LutEngine | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const engine = new LutEngine(canvas)
    engineRef.current = engine
    return () => {
      engine.dispose()
      engineRef.current = null
    }
  }, [canvasRef])

  useEffect(() => {
    const engine = engineRef.current
    if (!engine || !image) return
    engine.setImage(image, image.naturalWidth, image.naturalHeight)
    engine.setLut(preset)
    engine.render()
  }, [image, preset])

  const downloadImage = useCallback(
    async (filename: string, format: 'image/png' | 'image/jpeg' = 'image/png') => {
      const engine = engineRef.current
      if (!engine) return
      const blob = await engine.toBlob(format, 1.0)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    },
    [],
  )

  return { engineRef, downloadImage }
}
