'use client'

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react'

export type PhotoTransform = { zoom: number; x: number; y: number }

const MIN_ZOOM = 1
const MAX_ZOOM = 3

interface PhotoEditorProps {
  src: string
  transform: PhotoTransform
  onTransformChange: (transform: PhotoTransform) => void
  alt?: string
}

/**
 * Fixed photo window with a real drag-to-reframe + pinch/scroll-to-zoom photo
 * inside it. The window (frame shape) never moves — only the photo does.
 *
 * The photo is always visible from the very first paint (a plain cover-fit
 * fallback via CSS), and upgrades to precise, draggable geometry once the
 * image's natural size and the container's rendered size are both known.
 * Both are tracked as React state (image onLoad + ResizeObserver) rather
 * than read ad-hoc during render, so sizing is always reactive and correct.
 */
export function PhotoEditor({ src, transform, onTransformChange, alt = 'Live frame preview' }: PhotoEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null)
  const [containerSize, setContainerSize] = useState<{ w: number; h: number } | null>(null)

  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map())
  const dragState = useRef<{
    startX: number
    startY: number
    startOffsetX: number
    startOffsetY: number
    startDist: number | null
    startZoom: number
  } | null>(null)

  // Reset fit info whenever a new photo is loaded.
  useEffect(() => {
    setNaturalSize(null)
  }, [src])

  function handleImgLoad() {
    const img = imgRef.current
    if (img && img.naturalWidth && img.naturalHeight) {
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight })
    }
  }

  // Track the container's rendered size reactively (initial size + any
  // resize from switching frame shape, responsive breakpoints, etc.)
  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const measure = () => {
      const rect = container.getBoundingClientRect()
      setContainerSize((prev) => {
        if (prev && Math.abs(prev.w - rect.width) < 0.5 && Math.abs(prev.h - rect.height) < 0.5) return prev
        return { w: rect.width, h: rect.height }
      })
    }

    measure()

    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const fit = useMemo(() => {
    if (!naturalSize || !containerSize || containerSize.w === 0 || containerSize.h === 0) return null
    const baseScale = Math.max(containerSize.w / naturalSize.w, containerSize.h / naturalSize.h)
    return { baseScale, cw: containerSize.w, ch: containerSize.h }
  }, [naturalSize, containerSize])

  const clampOffset = useCallback(
    (x: number, y: number, zoom: number) => {
      if (!fit || !naturalSize) return { x, y }
      const scale = fit.baseScale * zoom
      const dispW = naturalSize.w * scale
      const dispH = naturalSize.h * scale
      const maxX = Math.max(0, (dispW - fit.cw) / 2)
      const maxY = Math.max(0, (dispH - fit.ch) / 2)
      return { x: Math.min(maxX, Math.max(-maxX, x)), y: Math.min(maxY, Math.max(-maxY, y)) }
    },
    [fit, naturalSize],
  )

  // Re-clamp whenever zoom changes externally (slider) or fit info becomes
  // known/changes, so we never end up with gaps inside the window.
  useEffect(() => {
    if (!fit) return
    const clamped = clampOffset(transform.x, transform.y, transform.zoom)
    if (Math.abs(clamped.x - transform.x) > 0.5 || Math.abs(clamped.y - transform.y) > 0.5) {
      onTransformChange({ ...transform, x: clamped.x, y: clamped.y })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transform.zoom, fit])

  function clampZoom(z: number) {
    return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z))
  }

  function onPointerDown(event: ReactPointerEvent) {
    ;(event.currentTarget as Element).setPointerCapture?.(event.pointerId)
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    if (pointers.current.size === 1) {
      dragState.current = {
        startX: event.clientX,
        startY: event.clientY,
        startOffsetX: transform.x,
        startOffsetY: transform.y,
        startDist: null,
        startZoom: transform.zoom,
      }
    } else if (pointers.current.size === 2) {
      const pts = Array.from(pointers.current.values())
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      dragState.current = {
        startX: dragState.current?.startX ?? event.clientX,
        startY: dragState.current?.startY ?? event.clientY,
        startOffsetX: transform.x,
        startOffsetY: transform.y,
        startDist: dist,
        startZoom: transform.zoom,
      }
    }
  }

  function onPointerMove(event: ReactPointerEvent) {
    if (!pointers.current.has(event.pointerId)) return
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })

    if (pointers.current.size === 2 && dragState.current?.startDist) {
      const pts = Array.from(pointers.current.values())
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      const scaleFactor = dist / dragState.current.startDist
      const newZoom = clampZoom(dragState.current.startZoom * scaleFactor)
      const clamped = clampOffset(dragState.current.startOffsetX, dragState.current.startOffsetY, newZoom)
      onTransformChange({ zoom: newZoom, x: clamped.x, y: clamped.y })
    } else if (pointers.current.size === 1 && dragState.current) {
      const dx = event.clientX - dragState.current.startX
      const dy = event.clientY - dragState.current.startY
      const clamped = clampOffset(dragState.current.startOffsetX + dx, dragState.current.startOffsetY + dy, transform.zoom)
      onTransformChange({ ...transform, x: clamped.x, y: clamped.y })
    }
  }

  function endPointer(event: ReactPointerEvent) {
    pointers.current.delete(event.pointerId)
    if (pointers.current.size === 1) {
      const [remaining] = Array.from(pointers.current.values())
      dragState.current = {
        startX: remaining.x,
        startY: remaining.y,
        startOffsetX: transform.x,
        startOffsetY: transform.y,
        startDist: null,
        startZoom: transform.zoom,
      }
    } else if (pointers.current.size === 0) {
      dragState.current = null
    }
  }

  function onWheel(event: ReactWheelEvent) {
    event.preventDefault()
    const delta = -event.deltaY * 0.0016
    const newZoom = clampZoom(transform.zoom + delta)
    const clamped = clampOffset(transform.x, transform.y, newZoom)
    onTransformChange({ zoom: newZoom, x: clamped.x, y: clamped.y })
  }

  // Until we have real measurements, fall back to a plain cover fill so the
  // photo is ALWAYS visible immediately — never a blank/invisible window.
  let imgStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    pointerEvents: 'none',
    userSelect: 'none',
  }

  if (fit && naturalSize) {
    const scale = fit.baseScale * transform.zoom
    const dispW = naturalSize.w * scale
    const dispH = naturalSize.h * scale
    imgStyle = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: `${dispW}px`,
      height: `${dispH}px`,
      maxWidth: 'none',
      objectFit: 'cover',
      transform: `translate(calc(-50% + ${transform.x}px), calc(-50% + ${transform.y}px))`,
      pointerEvents: 'none',
      userSelect: 'none',
    }
  }

  return (
    <div
      ref={containerRef}
      className="photo-editor-surface"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      onPointerLeave={endPointer}
      onWheel={onWheel}
    >
      <img key={src} ref={imgRef} src={src} alt={alt} draggable={false} onLoad={handleImgLoad} style={imgStyle} />
    </div>
  )
}
