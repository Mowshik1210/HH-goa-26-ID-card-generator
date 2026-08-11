import { toPng } from 'html-to-image'

/**
 * Captures a DOM node exactly as rendered and returns a PNG data URL.
 * This is the single source of truth for exported artwork — the same
 * node that's shown as the live preview is the node that gets exported,
 * so there is no second/simplified redraw to fall out of sync.
 */
export async function exportNodeToPng(node: HTMLElement, options: { targetWidth: number }): Promise<string> {
  // Make sure web fonts are actually painted before we rasterize.
  if (typeof document !== 'undefined' && 'fonts' in document) {
    await document.fonts.ready
  }
  // Give the browser two frames to finish layout/paint (covers image loads
  // and any transform updates that just landed via React state).
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

  const rect = node.getBoundingClientRect()
  const pixelRatio = Math.max(1, options.targetWidth / Math.max(1, rect.width))

  return toPng(node, {
    pixelRatio,
    cacheBust: true,
    skipFonts: false,
  })
}

export function dataUrlToFile(dataUrl: string, filename: string): File {
  const [header, base64] = dataUrl.split(',')
  const mimeMatch = header.match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : 'image/png'
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new File([bytes], filename, { type: mime })
}

export function triggerDownload(dataUrl: string, filename: string) {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  link.click()
}
