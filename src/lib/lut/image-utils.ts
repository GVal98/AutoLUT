export async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }
    img.src = url
  })
}

export async function createThumbnail(
  source: ImageBitmapSource,
  maxDim = 600,
): Promise<ImageBitmap> {
  const bitmap = source instanceof ImageBitmap ? source : await createImageBitmap(source)
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height))
  const w = Math.round(bitmap.width * scale)
  const h = Math.round(bitmap.height * scale)
  if (scale >= 1) return bitmap
  const thumb = await createImageBitmap(bitmap, {
    resizeWidth: w,
    resizeHeight: h,
    resizeQuality: 'high',
  })
  if (source instanceof ImageBitmap && source !== bitmap) bitmap.close()
  return thumb
}
