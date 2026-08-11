import { COLORS } from './constants'
import { getCoverDrawParams } from './image-transform'
import type { ComposeOptions, FrameId, Rect } from './types'

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load image for export.'))
    img.src = src
  })
}

function getCanvasSize(mode: ComposeOptions['mode'], frameId: FrameId): { width: number; height: number } {
  if (mode === 'pass') return { width: 1080, height: 1350 }
  if (frameId === 'landscape') return { width: 1600, height: 900 }
  return { width: 1024, height: 1024 }
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + w - radius, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius)
  ctx.lineTo(x + w, y + h - radius)
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h)
  ctx.lineTo(x + radius, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

function archPath(ctx: CanvasRenderingContext2D, rect: Rect) {
  const { x, y, width, height } = rect
  const arch = width * 0.5
  ctx.beginPath()
  ctx.moveTo(x, y + height)
  ctx.lineTo(x, y + arch)
  ctx.quadraticCurveTo(x, y, x + width / 2, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + arch)
  ctx.lineTo(x + width, y + height)
  ctx.closePath()
}

function drawPhoto(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  viewport: Rect,
  transform: ComposeOptions['transform'],
  clip?: (ctx: CanvasRenderingContext2D, rect: Rect) => void,
) {
  ctx.save()
  if (clip) {
    clip(ctx, viewport)
    ctx.clip()
  } else {
    ctx.beginPath()
    ctx.rect(viewport.x, viewport.y, viewport.width, viewport.height)
    ctx.clip()
  }

  const params = getCoverDrawParams(img, viewport, transform)
  ctx.drawImage(img, params.x, params.y, params.width, params.height)
  ctx.restore()
}

function drawPalm(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, flip = false) {
  ctx.save()
  ctx.translate(x, y)
  if (flip) ctx.scale(-1, 1)
  ctx.scale(scale, scale)
  ctx.fillStyle = COLORS.greenDeep
  ctx.fillRect(-4, 0, 8, 50)
  ctx.fillStyle = COLORS.green
  ;[
    [-18, 8], [-10, 4], [0, 2], [10, 4], [18, 8],
    [-14, 18], [-6, 14], [6, 14], [14, 18],
  ].forEach(([lx, ly]) => {
    ctx.beginPath()
    ctx.ellipse(lx, ly, 14, 5, (lx < 0 ? -0.6 : 0.6), 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.restore()
}

function drawSun(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save()
  ctx.fillStyle = COLORS.yellow
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,223,0,0.35)'
  ctx.lineWidth = 8
  ctx.stroke()
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(angle) * (r + 6), cy + Math.sin(angle) * (r + 6))
    ctx.lineTo(cx + Math.cos(angle) * (r + 22), cy + Math.sin(angle) * (r + 22))
    ctx.strokeStyle = COLORS.yellow
    ctx.lineWidth = 3
    ctx.stroke()
  }
  ctx.restore()
}

function drawWaves(ctx: CanvasRenderingContext2D, y: number, width: number) {
  ctx.save()
  ctx.strokeStyle = COLORS.cream
  ctx.lineWidth = 3
  for (let row = 0; row < 3; row++) {
    ctx.beginPath()
    for (let x = 0; x <= width; x += 20) {
      const wy = y + row * 14 + Math.sin((x + row * 30) * 0.04) * 6
      if (x === 0) ctx.moveTo(x, wy)
      else ctx.lineTo(x, wy)
    }
    ctx.stroke()
  }
  ctx.restore()
}

function drawBirds(ctx: CanvasRenderingContext2D, width: number, y: number) {
  ctx.save()
  ctx.strokeStyle = COLORS.cream
  ctx.lineWidth = 2
  ;[width * 0.15, width * 0.45, width * 0.72].forEach((bx, i) => {
    ctx.beginPath()
    ctx.moveTo(bx - 10 - i * 2, y)
    ctx.quadraticCurveTo(bx - 5, y - 8, bx, y)
    ctx.quadraticCurveTo(bx + 5, y - 8, bx + 10 + i * 2, y)
    ctx.stroke()
  })
  ctx.restore()
}

function drawBrandHeader(ctx: CanvasRenderingContext2D, width: number, y: number, size: number) {
  ctx.save()
  ctx.textAlign = 'center'
  ctx.fillStyle = COLORS.yellow
  ctx.font = `bold ${size}px Georgia, serif`
  ctx.fillText('HACKER', width / 2 - 52, y)
  ctx.fillStyle = COLORS.pink
  ctx.beginPath()
  ctx.arc(width / 2, y - size * 0.35, size * 0.28, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = COLORS.yellow
  ctx.font = `bold ${size * 0.45}px serif`
  ctx.fillText('गोवा', width / 2, y - size * 0.22)
  ctx.fillStyle = COLORS.yellow
  ctx.font = `bold ${size}px Georgia, serif`
  ctx.fillText('HOUSE', width / 2 + 52, y)
  ctx.restore()
}

function getPhotoRect(frameId: FrameId, width: number, height: number, mode: ComposeOptions['mode']): Rect {
  if (mode === 'pass') {
    return { x: width * 0.1, y: height * 0.16, width: width * 0.8, height: height * 0.42 }
  }

  switch (frameId) {
    case 'landscape':
      return { x: width * 0.08, y: height * 0.22, width: width * 0.84, height: height * 0.52 }
    case 'circle':
      return { x: width * 0.14, y: height * 0.18, width: width * 0.72, height: width * 0.72 }
    case 'tall':
      return { x: width * 0.2, y: height * 0.14, width: width * 0.6, height: height * 0.62 }
    case 'slim':
      return { x: width * 0.16, y: height * 0.18, width: width * 0.68, height: height * 0.56 }
    case 'arch':
      return { x: width * 0.12, y: height * 0.16, width: width * 0.76, height: height * 0.52 }
    case 'ornate':
      return { x: width * 0.1, y: height * 0.15, width: width * 0.8, height: height * 0.54 }
    case 'portrait':
    default:
      return { x: width * 0.14, y: height * 0.15, width: width * 0.72, height: height * 0.58 }
  }
}

function getPhotoClip(frameId: FrameId, mode: ComposeOptions['mode']) {
  if (mode === 'pass') {
    return (ctx: CanvasRenderingContext2D, rect: Rect) => roundRectPath(ctx, rect.x, rect.y, rect.width, rect.height, 12)
  }
  switch (frameId) {
    case 'circle':
      return (ctx: CanvasRenderingContext2D, rect: Rect) => {
        ctx.beginPath()
        ctx.arc(rect.x + rect.width / 2, rect.y + rect.height / 2, rect.width / 2, 0, Math.PI * 2)
      }
    case 'arch':
      return (ctx: CanvasRenderingContext2D, rect: Rect) => archPath(ctx, rect)
    case 'landscape':
    case 'slim':
      return (ctx: CanvasRenderingContext2D, rect: Rect) => roundRectPath(ctx, rect.x, rect.y, rect.width, rect.height, 8)
    case 'ornate':
      return (ctx: CanvasRenderingContext2D, rect: Rect) => roundRectPath(ctx, rect.x, rect.y, rect.width, rect.height, 20)
    case 'tall':
      return (ctx: CanvasRenderingContext2D, rect: Rect) => roundRectPath(ctx, rect.x, rect.y, rect.width, rect.height, 16)
    case 'portrait':
    default:
      return (ctx: CanvasRenderingContext2D, rect: Rect) => roundRectPath(ctx, rect.x, rect.y, rect.width, rect.height, 6)
  }
}

function drawFrameDecorations(
  ctx: CanvasRenderingContext2D,
  frameId: FrameId,
  width: number,
  height: number,
  photoRect: Rect,
) {
  ctx.save()

  switch (frameId) {
    case 'arch':
      drawSun(ctx, width * 0.82, height * 0.1, 36)
      drawPalm(ctx, width * 0.06, height * 0.78, 0.9)
      drawPalm(ctx, width * 0.94, height * 0.78, 0.9, true)
      ctx.strokeStyle = COLORS.yellow
      ctx.lineWidth = 14
      archPath(ctx, { x: photoRect.x - 10, y: photoRect.y - 10, width: photoRect.width + 20, height: photoRect.height + 20 })
      ctx.stroke()
      break
    case 'portrait':
      ctx.strokeStyle = COLORS.pink
      ctx.lineWidth = 8
      roundRectPath(ctx, photoRect.x - 8, photoRect.y - 8, photoRect.width + 16, photoRect.height + 16, 8)
      ctx.stroke()
      ctx.strokeStyle = COLORS.yellow
      ctx.lineWidth = 3
      ctx.strokeRect(photoRect.x - 18, photoRect.y - 18, photoRect.width + 36, photoRect.height + 36)
      drawBirds(ctx, width, height * 0.08)
      break
    case 'ornate':
      ctx.strokeStyle = COLORS.yellow
      ctx.lineWidth = 6
      roundRectPath(ctx, photoRect.x - 14, photoRect.y - 14, photoRect.width + 28, photoRect.height + 28, 24)
      ctx.stroke()
      ctx.strokeStyle = COLORS.pink
      ctx.lineWidth = 3
      roundRectPath(ctx, photoRect.x - 6, photoRect.y - 6, photoRect.width + 12, photoRect.height + 12, 18)
      ctx.stroke()
      ;[
        [photoRect.x - 20, photoRect.y - 20],
        [photoRect.x + photoRect.width + 20, photoRect.y - 20],
        [photoRect.x - 20, photoRect.y + photoRect.height + 20],
        [photoRect.x + photoRect.width + 20, photoRect.y + photoRect.height + 20],
      ].forEach(([cx, cy]) => {
        ctx.fillStyle = COLORS.pink
        ctx.font = '24px serif'
        ctx.textAlign = 'center'
        ctx.fillText('✦', cx, cy)
      })
      break
    case 'slim':
      ctx.strokeStyle = COLORS.yellow
      ctx.lineWidth = 4
      ctx.strokeRect(photoRect.x - 12, photoRect.y - 12, photoRect.width + 24, photoRect.height + 24)
      ctx.fillStyle = COLORS.pink
      ctx.fillRect(photoRect.x - 12, photoRect.y - 16, photoRect.width + 24, 4)
      ctx.fillRect(photoRect.x - 12, photoRect.y + photoRect.height + 12, photoRect.width + 24, 4)
      break
    case 'landscape':
      drawWaves(ctx, height * 0.82, width)
      drawSun(ctx, width * 0.12, height * 0.12, 30)
      ctx.strokeStyle = COLORS.yellow
      ctx.lineWidth = 10
      roundRectPath(ctx, photoRect.x - 8, photoRect.y - 8, photoRect.width + 16, photoRect.height + 16, 6)
      ctx.stroke()
      break
    case 'circle':
      ctx.strokeStyle = COLORS.yellow
      ctx.lineWidth = 12
      ctx.beginPath()
      ctx.arc(photoRect.x + photoRect.width / 2, photoRect.y + photoRect.height / 2, photoRect.width / 2 + 8, 0, Math.PI * 2)
      ctx.stroke()
      ctx.strokeStyle = COLORS.pink
      ctx.lineWidth = 4
      ctx.setLineDash([8, 10])
      ctx.stroke()
      ctx.setLineDash([])
      break
    case 'tall':
      ctx.strokeStyle = COLORS.pink
      ctx.lineWidth = 6
      roundRectPath(ctx, photoRect.x - 10, photoRect.y - 10, photoRect.width + 20, photoRect.height + 20, 14)
      ctx.stroke()
      drawPalm(ctx, width * 0.08, height * 0.88, 0.7)
      drawPalm(ctx, width * 0.92, height * 0.88, 0.7, true)
      break
  }

  ctx.restore()
}

function drawPfpFooter(ctx: CanvasRenderingContext2D, width: number, height: number, frameId: FrameId) {
  ctx.save()
  ctx.fillStyle = COLORS.cream
  ctx.fillRect(width * 0.08, height * 0.82, width * 0.84, height * 0.1)
  ctx.fillStyle = COLORS.ink
  ctx.textAlign = 'center'
  ctx.font = 'bold 36px Georgia, serif'
  ctx.fillText('HH GOA 2026', width / 2, height * 0.875)
  ctx.font = '18px monospace'
  ctx.fillStyle = COLORS.greenDeep
  ctx.fillText(
    frameId === 'landscape' ? 'GOA, INDIA · 28—31 OCT 2026 · #FrameInGoa' : '28—31 OCT · GOA, INDIA · #FrameInGoa',
    width / 2,
    height * 0.905,
  )
  ctx.restore()
}

function drawBuilderPass(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: ComposeOptions,
  img: HTMLImageElement | null,
) {
  ctx.fillStyle = COLORS.green
  ctx.fillRect(0, 0, width, height)

  ctx.strokeStyle = COLORS.yellow
  ctx.lineWidth = 16
  ctx.strokeRect(24, 24, width - 48, height - 48)
  ctx.strokeStyle = COLORS.pink
  ctx.lineWidth = 4
  ctx.strokeRect(40, 40, width - 80, height - 80)

  drawBrandHeader(ctx, width, 110, 42)
  ctx.fillStyle = COLORS.yellow
  ctx.font = '16px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('HH GOA 2026', width / 2, 145)

  const photoRect = getPhotoRect('portrait', width, height, 'pass')
  if (img) {
    drawPhoto(ctx, img, photoRect, options.transform, getPhotoClip('portrait', 'pass'))
  } else {
    ctx.fillStyle = COLORS.greenDeep
    roundRectPath(ctx, photoRect.x, photoRect.y, photoRect.width, photoRect.height, 12)
    ctx.fill()
  }

  ctx.strokeStyle = COLORS.yellow
  ctx.lineWidth = 5
  roundRectPath(ctx, photoRect.x - 6, photoRect.y - 6, photoRect.width + 12, photoRect.height + 12, 14)
  ctx.stroke()

  drawPalm(ctx, 70, height - 180, 0.65)
  drawPalm(ctx, width - 70, height - 180, 0.65, true)
  drawSun(ctx, width - 100, 200, 28)

  const name = options.builder.name.trim() || 'YOUR NAME'
  const stack = options.builder.stack.trim() || 'YOUR STACK'
  const title = options.builder.title.trim() || 'BUILDER'

  ctx.fillStyle = COLORS.cream
  ctx.fillRect(60, height * 0.62, width - 120, 280)

  ctx.fillStyle = COLORS.ink
  ctx.textAlign = 'center'
  ctx.font = 'bold 58px Georgia, serif'
  ctx.fillText(name.toUpperCase(), width / 2, height * 0.67)

  ctx.font = '26px monospace'
  ctx.fillStyle = COLORS.greenDeep
  ctx.fillText(stack.toUpperCase(), width / 2, height * 0.715)

  ctx.fillStyle = COLORS.pink
  ctx.font = 'bold 32px monospace'
  ctx.fillText(title.toUpperCase(), width / 2, height * 0.765)

  ctx.strokeStyle = COLORS.yellow
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(120, height * 0.785)
  ctx.lineTo(width - 120, height * 0.785)
  ctx.stroke()

  ctx.fillStyle = COLORS.greenDeep
  ctx.font = '20px monospace'
  ctx.fillText('28—31 OCT 2026', width / 2, height * 0.82)
  ctx.fillText('GOA / INDIA', width / 2, height * 0.855)

  ctx.fillStyle = COLORS.pink
  ctx.font = 'bold 22px monospace'
  ctx.fillText('#FrameInGoa', width / 2, height * 0.895)

  ctx.font = '14px monospace'
  ctx.fillStyle = COLORS.muted
  ctx.fillText('LESS NOISE. MORE SIGNAL.', width / 2, height * 0.93)
}

function drawPfp(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: ComposeOptions,
  img: HTMLImageElement | null,
) {
  const { frameId } = options

  ctx.fillStyle = COLORS.green
  ctx.fillRect(0, 0, width, height)

  ctx.strokeStyle = COLORS.yellow
  ctx.lineWidth = frameId === 'landscape' ? 18 : 14
  if (frameId === 'circle') {
    ctx.beginPath()
    ctx.arc(width / 2, height / 2, Math.min(width, height) / 2 - 20, 0, Math.PI * 2)
    ctx.stroke()
  } else {
    ctx.strokeRect(20, 20, width - 40, height - 40)
  }

  ctx.strokeStyle = COLORS.pink
  ctx.lineWidth = 4
  ctx.strokeRect(32, 32, width - 64, height - 64)

  drawBrandHeader(ctx, width, frameId === 'landscape' ? 90 : 100, frameId === 'landscape' ? 34 : 38)

  const photoRect = getPhotoRect(frameId, width, height, 'pfp')
  if (img) {
    drawPhoto(ctx, img, photoRect, options.transform, getPhotoClip(frameId, 'pfp'))
  } else {
    ctx.fillStyle = COLORS.greenDeep
    const clip = getPhotoClip(frameId, 'pfp')
    clip(ctx, photoRect)
    ctx.fill()
  }

  drawFrameDecorations(ctx, frameId, width, height, photoRect)
  drawPfpFooter(ctx, width, height, frameId)

  if (frameId !== 'landscape') {
    drawBirds(ctx, width, height * 0.06)
  }
}

export async function composeImage(options: ComposeOptions): Promise<Blob> {
  const { width, height } = getCanvasSize(options.mode, options.frameId)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is not supported in this browser.')

  const img = options.imageSrc ? await loadImage(options.imageSrc) : null

  if (options.mode === 'pass') {
    drawBuilderPass(ctx, width, height, options, img)
  } else {
    drawPfp(ctx, width, height, options, img)
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Failed to generate PNG.'))
      },
      'image/png',
      1,
    )
  })
}

export { getCanvasSize, getPhotoRect }
