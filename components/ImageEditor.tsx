'use client'

import {
  useRef,
  type ReactNode,
  type TouchEvent,
  type WheelEvent,
  type PointerEvent,
} from 'react'
import {
  applyDrag,
  applyPinchZoom,
  applyWheelZoom,
  clampScale,
  MAX_SCALE,
  MIN_SCALE,
} from '@/lib/image-transform'
import type { ImageTransform } from '@/lib/types'

interface ImageEditorProps {
  transform: ImageTransform
  onChange: (transform: ImageTransform) => void
  disabled?: boolean
}

export function ImageEditor({ transform, onChange, disabled }: ImageEditorProps) {
  return (
    <div className="editor-controls">
      <p className="editor-hint" id="editor-hint">
        DRAG TO REFRAME · PINCH TO ZOOM
      </p>
      <label className="field-label range-label" htmlFor="zoom-range">
        ZOOM
        <output htmlFor="zoom-range">{transform.scale.toFixed(1)}×</output>
        <input
          id="zoom-range"
          type="range"
          min={MIN_SCALE}
          max={MAX_SCALE}
          step={0.05}
          value={transform.scale}
          disabled={disabled}
          onChange={(event) =>
            onChange({ ...transform, scale: clampScale(Number(event.target.value)) })
          }
          aria-describedby="editor-hint"
        />
      </label>
    </div>
  )
}

interface PhotoEditorSurfaceProps {
  transform: ImageTransform
  onChange: (transform: ImageTransform) => void
  disabled?: boolean
  children: ReactNode
  className?: string
}

export function PhotoEditorSurface({
  transform,
  onChange,
  disabled,
  children,
  className = '',
}: PhotoEditorSurfaceProps) {
  const surfaceRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    origin: transform,
  })
  const pinchRef = useRef({ distance: 0, scale: 1 })

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (disabled) return
    if (event.pointerType === 'touch' && event.isPrimary === false) return

    const target = surfaceRef.current
    if (!target) return

    target.setPointerCapture(event.pointerId)
    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin: transform,
    }
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (disabled || !dragRef.current.active || dragRef.current.pointerId !== event.pointerId) return

    const dx = event.clientX - dragRef.current.startX
    const dy = event.clientY - dragRef.current.startY
    onChange(
      applyDrag(dragRef.current.origin, dx, dy),
    )
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (dragRef.current.pointerId !== event.pointerId) return
    dragRef.current.active = false
    surfaceRef.current?.releasePointerCapture(event.pointerId)
  }

  function onTouchStart(event: TouchEvent<HTMLDivElement>) {
    if (disabled || event.touches.length !== 2) return
    pinchRef.current = {
      distance: Math.hypot(
        event.touches[0].clientX - event.touches[1].clientX,
        event.touches[0].clientY - event.touches[1].clientY,
      ),
      scale: transform.scale,
    }
  }

  function onTouchMove(event: TouchEvent<HTMLDivElement>) {
    if (disabled || event.touches.length !== 2 || pinchRef.current.distance === 0) return
    event.preventDefault()
    const distance = Math.hypot(
      event.touches[0].clientX - event.touches[1].clientX,
      event.touches[0].clientY - event.touches[1].clientY,
    )
    const ratio = distance / pinchRef.current.distance
    onChange(applyPinchZoom({ ...transform, scale: pinchRef.current.scale }, ratio))
  }

  function onWheel(event: WheelEvent<HTMLDivElement>) {
    if (disabled) return
    event.preventDefault()
    onChange(applyWheelZoom(transform, event.deltaY))
  }

  return (
    <div
      ref={surfaceRef}
      className={`photo-editor-surface ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onWheel={onWheel}
      role="img"
      aria-label="Photo preview — drag to reframe, pinch or scroll to zoom"
      style={{ touchAction: 'none' }}
    >
      {children}
    </div>
  )
}

export { ImageEditor as ImageEditorControls }
