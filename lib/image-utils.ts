import { MAX_FILE_SIZE, MAX_IMAGE_DIMENSION } from './constants'
import { convertHeicToJpeg, isHeicFile } from './heic'

const ACCEPTED_TYPES = /^image\/(jpeg|jpg|png|webp|heic|heif)/i
const ACCEPTED_EXT = /\.(jpe?g|png|webp|heic|heif)$/i

export function isAcceptedImage(file: File): boolean {
  return ACCEPTED_TYPES.test(file.type) || ACCEPTED_EXT.test(file.name)
}

export function validateFileSize(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) {
    return 'Image is too large — please use a file under 25 MB.'
  }
  return null
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Could not read the image file.'))
    reader.readAsDataURL(blob)
  })
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('The image file appears to be corrupt or unsupported.'))
    img.src = src
  })
}

export async function resizeImageIfNeeded(dataUrl: string): Promise<string> {
  const img = await loadImage(dataUrl)
  const maxDim = Math.max(img.width, img.height)
  if (maxDim <= MAX_IMAGE_DIMENSION) return dataUrl

  const scale = MAX_IMAGE_DIMENSION / maxDim
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.width * scale)
  canvas.height = Math.round(img.height * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) return dataUrl
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', 0.92)
}

export interface ProcessedUpload {
  dataUrl: string
  fileName: string
}

export async function processUploadedFile(file: File): Promise<ProcessedUpload> {
  if (!isAcceptedImage(file)) {
    throw new Error('Unsupported file type — please upload JPG, PNG, or HEIC.')
  }

  const sizeError = validateFileSize(file)
  if (sizeError) throw new Error(sizeError)

  let blob: Blob = file
  if (isHeicFile(file)) {
    blob = await convertHeicToJpeg(file)
  }

  let dataUrl = await blobToDataUrl(blob)
  dataUrl = await resizeImageIfNeeded(dataUrl)

  const fileName = file.name.replace(/\.[^/.]+$/, '').slice(0, 24) || 'photo'
  return { dataUrl, fileName }
}
