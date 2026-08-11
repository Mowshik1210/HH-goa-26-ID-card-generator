import type { CSSProperties } from 'react'
import type { ImageTransform, Rect } from './types'

export const MIN_SCALE = 1
export const MAX_SCALE = 3

export function clampScale(scale: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale))
}

export interface DrawParams {
  x: number
  y: number
  width: number
  height: number
}

export function getCoverDrawParams(
  img: { width: number; height: number },
  viewport: Rect,
  transform: ImageTransform,
): DrawParams {
  const baseScale = Math.max(viewport.width / img.width, viewport.height / img.height)
  const scale = baseScale * transform.scale
  const width = img.width * scale
  const height = img.height * scale

  return {
    x: viewport.x + (viewport.width - width) / 2 + transform.offsetX,
    y: viewport.y + (viewport.height - height) / 2 + transform.offsetY,
    width,
    height,
  }
}

export function getPreviewImageStyle(transform: ImageTransform): CSSProperties {
  return {
    transform: `translate(${transform.offsetX}px, ${transform.offsetY}px) scale(${transform.scale})`,
    transformOrigin: 'center center',
  }
}

export function applyWheelZoom(
  transform: ImageTransform,
  deltaY: number,
  factor = 0.0015,
): ImageTransform {
  return {
    ...transform,
    scale: clampScale(transform.scale - deltaY * factor),
  }
}

export function applyPinchZoom(
  transform: ImageTransform,
  scaleRatio: number,
): ImageTransform {
  return {
    ...transform,
    scale: clampScale(transform.scale * scaleRatio),
  }
}

export function applyDrag(
  transform: ImageTransform,
  deltaX: number,
  deltaY: number,
): ImageTransform {
  return {
    ...transform,
    offsetX: transform.offsetX + deltaX,
    offsetY: transform.offsetY + deltaY,
  }
}
