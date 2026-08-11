'use client'

import { ImagePlus } from 'lucide-react'
import { FRAME_OPTIONS } from '@/lib/constants'
import { getPreviewImageStyle } from '@/lib/image-transform'
import type { FormatMode, FrameId, ImageTransform } from '@/lib/types'
import { PhotoEditorSurface } from './ImageEditor'

interface PreviewProps {
  mode: FormatMode
  frameId: FrameId
  image: string | null
  transform: ImageTransform
  onTransformChange: (transform: ImageTransform) => void
  name: string
  stack: string
  builderTitle: string
}

export function Preview({
  mode,
  frameId,
  image,
  transform,
  onTransformChange,
  name,
  stack,
  builderTitle,
}: PreviewProps) {
  const frameClass = FRAME_OPTIONS.find((item) => item.id === frameId)?.className ?? ''
  const isPass = mode === 'pass'

  return (
    <div className="preview-panel">
      <div className="preview-head">
        <span>LIVE PREVIEW</span>
        <span className="live-dot" aria-live="polite">
          ● READY TO SHIP
        </span>
      </div>

      <div
        className={`poster-preview reveal-card ${isPass ? 'pass-preview' : ''} ${!isPass ? frameClass : ''} ${frameId === 'landscape' && !isPass ? 'landscape-preview' : ''}`}
      >
        <div className="poster-top" aria-hidden="true">
          <span>HACKER</span>
          <b>गोवा</b>
          <span>HOUSE</span>
        </div>

        {isPass && (
          <div className="pass-badge" aria-hidden="true">
            HH GOA 2026
          </div>
        )}

        <PhotoEditorSurface
          transform={transform}
          onChange={onTransformChange}
          disabled={!image}
          className={`photo-window ${isPass ? 'pass-photo' : ''}`}
        >
          {image ? (
            <img
              src={image}
              alt="Live frame preview"
              draggable={false}
              style={getPreviewImageStyle(transform)}
            />
          ) : (
            <div className="empty-photo">
              <ImagePlus size={34} aria-hidden="true" />
              <span>
                YOUR PHOTO
                <br />
                GOES HERE
              </span>
            </div>
          )}
        </PhotoEditorSurface>

        <div className="poster-info">
          {isPass ? (
            <>
              <strong>{name.trim() || 'YOUR NAME'}</strong>
              <span className="stack-line">{stack.trim() || 'YOUR STACK / ROLE'}</span>
              <span className="title-line">{builderTitle.trim() || 'BUILDER TITLE'}</span>
              <span className="meta-line">28—31 OCT 2026 · GOA / INDIA</span>
            </>
          ) : (
            <>
              <strong>HH GOA 2026</strong>
              <span>OCT 28—31 · GOA, INDIA</span>
            </>
          )}
        </div>

        <div className="poster-footer">
          #FrameInGoa <span aria-hidden="true">✦</span> LESS NOISE. MORE SIGNAL.
        </div>

        {!isPass && <div className="frame-accent" aria-hidden="true" />}
      </div>

      <p className="preview-note">Drag to reframe · pinch or scroll to zoom</p>
    </div>
  )
}
