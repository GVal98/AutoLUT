import { useState, useCallback, useRef } from 'react'
import { loadImageFromFile } from '@/lib/lut/image-utils'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function useImageUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (f: File) => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setError('Please upload a JPEG, PNG, or WebP image.')
      return
    }
    setError(null)
    try {
      const img = await loadImageFromFile(f)
      setFile(f)
      setImage(img)
    } catch {
      setError('Failed to load image.')
    }
  }, [])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const f = e.dataTransfer.files[0]
      if (f) handleFile(f)
    },
    [handleFile],
  )

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0]
      if (f) handleFile(f)
    },
    [handleFile],
  )

  const openPicker = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const reset = useCallback(() => {
    setFile(null)
    setImage(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }, [])

  return {
    file,
    image,
    isDragging,
    error,
    inputRef,
    onDragOver,
    onDragLeave,
    onDrop,
    onFileChange,
    openPicker,
    reset,
  }
}
