// Email-friendly limits:
// - Max width 1200 px (= 600 px email width × 2 for retina displays)
// - Max file size 500 KB after compression
// - Always JPEG (smallest for photos; acceptable for all email clients)
const MAX_WIDTH_PX  = 1200
const MAX_SIZE_BYTES = 500_000 // 500 KB
const JPEG_QUALITY  = 0.82

export async function compressAndConvert(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file)

  // Scale down if wider than MAX_WIDTH_PX
  let { width, height } = bitmap
  if (width > MAX_WIDTH_PX) {
    height = Math.round(height * (MAX_WIDTH_PX / width))
    width = MAX_WIDTH_PX
  }

  const canvas = document.createElement('canvas')
  canvas.width  = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context unavailable')
  ctx.drawImage(bitmap, 0, 0, width, height)

  // Start at target quality; reduce iteratively if still over size limit
  let quality = JPEG_QUALITY
  let dataUrl = canvas.toDataURL('image/jpeg', quality)

  while (dataUrl.length * 0.75 > MAX_SIZE_BYTES && quality > 0.3) {
    quality -= 0.05
    dataUrl = canvas.toDataURL('image/jpeg', quality)
  }

  return dataUrl
}
