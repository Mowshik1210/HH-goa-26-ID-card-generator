import { FRAME_OPTIONS } from '@/lib/constants'
import type { FrameId } from '@/lib/types'

interface FrameGalleryProps {
  selected: FrameId
  image: string | null
  onSelect: (frameId: FrameId) => void
}

export function FrameGallery({ selected, image, onSelect }: FrameGalleryProps) {
  return (
    <>
      <div className="section-heading compact">
        <span>02 / PICK A FRAME</span>
        <span>{FRAME_OPTIONS.length} AVAILABLE</span>
      </div>
      <div className="frame-grid" role="listbox" aria-label="Frame styles">
        {FRAME_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`frame-option ${selected === option.id ? 'selected' : ''}`}
            onClick={() => onSelect(option.id)}
            role="option"
            aria-selected={selected === option.id}
            aria-label={option.label}
          >
            <span className={`mini-frame ${option.className}`}>
              {image && <img src={image} alt="" />}
            </span>
            <small>{option.label}</small>
          </button>
        ))}
      </div>
    </>
  )
}
