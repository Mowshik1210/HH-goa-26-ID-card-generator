import { dataUrlToFile, triggerDownload } from './export-utils'

export type ShareResult = { method: 'share' | 'fallback' | 'cancelled' }

/**
 * Shares the generated PNG as a real image file when the platform supports
 * it (navigator.share with files). Otherwise downloads the PNG and opens a
 * pre-filled X/Twitter intent as a fallback — never claims the image was
 * attached when it wasn't.
 */
export async function shareOrDownload(dataUrl: string, filename: string, shareText: string): Promise<ShareResult> {
  const file = dataUrlToFile(dataUrl, filename)

  const canShareFiles =
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [file] })

  if (canShareFiles) {
    try {
      await navigator.share({
        title: 'Hacker House Goa 2026',
        text: shareText,
        files: [file],
      })
      return { method: 'share' }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { method: 'cancelled' }
      }
      // fall through to the download + intent fallback below
    }
  }

  triggerDownload(dataUrl, filename)
  const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
  window.open(intentUrl, '_blank', 'noopener,noreferrer')
  return { method: 'fallback' }
}
