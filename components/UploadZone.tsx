'use client'

import { useRef, type ChangeEvent, type DragEvent, type KeyboardEvent } from 'react'
import { Upload, X } from 'lucide-react'

interface UploadZoneProps {
  image: string | null
  status: string
  isProcessing: boolean
  onFileSelect: (file: File) => void
  onClear: () => void
}

export function UploadZone({ image, status, isProcessing, onFileSelect, onClear }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file) onFileSelect(file)
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) onFileSelect(file)
    event.target.value = ''
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      inputRef.current?.click()
    }
  }

  return (
    <div
      className={`upload-box ${isProcessing ? 'processing' : ''}`}
      onDrop={handleDrop}
      onDragOver={(event) => event.preventDefault()}
      onClick={() => !isProcessing && inputRef.current?.click()}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Upload photo"
      aria-busy={isProcessing}
    >
      {image ? (
        <div className="upload-preview">
          <img src={image} alt="Uploaded photo thumbnail" />
          <button
            type="button"
            aria-label="Remove uploaded photo"
            onClick={(event) => {
              event.stopPropagation()
              onClear()
            }}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <>
          <Upload size={26} aria-hidden="true" />
          <strong>{isProcessing ? 'PROCESSING…' : 'DROP YOUR PHOTO'}</strong>
        </>
      )}
      <span role="status">{status}</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/heic,image/heif,.heic,.heif"
        hidden
        onChange={handleChange}
        aria-label="Choose photo file"
      />
    </div>
  )
}
