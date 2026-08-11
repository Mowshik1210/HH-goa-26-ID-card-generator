import { X_SHARE_TEXT } from './constants'
import type { FormatMode } from './types'

export function slugifyName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'builder'
}

export function getDownloadFilename(mode: FormatMode, name: string): string {
  const slug = slugifyName(name)
  return mode === 'pass'
    ? `hh-goa-2026-builder-${slug}.png`
    : `hh-goa-2026-pfp-${slug}.png`
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export type ShareResult = 'file-shared' | 'text-shared' | 'intent-opened'

export async function shareGeneratedImage(blob: Blob, filename: string): Promise<ShareResult> {
  const file = new File([blob], filename, { type: 'image/png' })

  if (typeof navigator.share === 'function') {
    try {
      if (navigator.canShare?.({ files: [file], text: X_SHARE_TEXT })) {
        await navigator.share({ files: [file], text: X_SHARE_TEXT, title: 'Hacker House Goa 2026' })
        return 'file-shared'
      }
      if (navigator.canShare?.({ text: X_SHARE_TEXT })) {
        await navigator.share({ text: X_SHARE_TEXT, title: 'Hacker House Goa 2026', url: window.location.href })
        return 'text-shared'
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return 'intent-opened'
      }
    }
  }

  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(X_SHARE_TEXT)}`,
    '_blank',
    'noopener,noreferrer',
  )
  return 'intent-opened'
}
