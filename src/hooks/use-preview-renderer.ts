import { useState, useEffect, useRef } from 'react'
import { LutEngine } from '@/lib/lut/engine'
import { createThumbnail } from '@/lib/lut/image-utils'
import type { LutPreset } from '@/lib/lut/types'

export function usePreviewRenderer(
  image: HTMLImageElement | null,
  presets: LutPreset[],
) {
  const [previews, setPreviews] = useState<Map<string, string>>(new Map())
  const [loading, setLoading] = useState(false)
  const prevUrlsRef = useRef<string[]>([])

  useEffect(() => {
    if (!image) {
      for (const url of prevUrlsRef.current) URL.revokeObjectURL(url)
      prevUrlsRef.current = []
      const id = requestAnimationFrame(() => setPreviews(new Map()))
      return () => cancelAnimationFrame(id)
    }

    let cancelled = false

    async function renderPreviews() {
      setLoading(true)

      // Revoke old URLs
      for (const url of prevUrlsRef.current) URL.revokeObjectURL(url)
      prevUrlsRef.current = []

      try {
        const thumb = await createThumbnail(image!, 300)
        const engine = new LutEngine()
        engine.setImage(thumb, thumb.width, thumb.height)

        const map = new Map<string, string>()
        const urls: string[] = []

        // Original (no LUT)
        engine.setLut(null)
        engine.render()
        const origBlob = await engine.toBlob('image/jpeg', 0.85)
        const origUrl = URL.createObjectURL(origBlob)
        map.set('original', origUrl)
        urls.push(origUrl)

        if (cancelled) {
          for (const url of urls) URL.revokeObjectURL(url)
          engine.dispose()
          if (thumb instanceof ImageBitmap) thumb.close()
          return
        }

        // Emit original immediately
        setPreviews(new Map(map))

        // Each preset — emit progressively
        for (const preset of presets) {
          if (cancelled) break
          engine.setLut(preset)
          engine.render()
          const blob = await engine.toBlob('image/jpeg', 0.85)
          const url = URL.createObjectURL(blob)
          map.set(preset.id, url)
          urls.push(url)

          // Emit partial results every 3 presets for smoother UX
          if (!cancelled && urls.length % 3 === 0) {
            setPreviews(new Map(map))
          }
        }

        engine.dispose()
        if (thumb instanceof ImageBitmap) thumb.close()

        if (!cancelled) {
          prevUrlsRef.current = urls
          setPreviews(new Map(map))
          setLoading(false)
        } else {
          for (const url of urls) URL.revokeObjectURL(url)
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Preview render failed:', err)
          setLoading(false)
        }
      }
    }

    renderPreviews()

    return () => {
      cancelled = true
    }
  }, [image, presets])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      for (const url of prevUrlsRef.current) URL.revokeObjectURL(url)
    }
  }, [])

  return { previews, loading }
}
