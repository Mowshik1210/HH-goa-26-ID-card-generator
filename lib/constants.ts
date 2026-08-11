import type { FrameOption } from './types'

export const COLORS = {
  green: '#076b3a',
  greenDeep: '#053b28',
  yellow: '#ffdf00',
  pink: '#ff087d',
  cream: '#ffebc7',
  ink: '#12231a',
  muted: '#9fc29d',
} as const

export const FRAME_OPTIONS: FrameOption[] = [
  { id: 'arch', label: 'Arch', className: 'frame-arch' },
  { id: 'portrait', label: 'Portrait', className: 'frame-portrait' },
  { id: 'ornate', label: 'Ornate', className: 'frame-ornate' },
  { id: 'slim', label: 'Slim', className: 'frame-slim' },
  { id: 'landscape', label: 'Landscape', className: 'frame-landscape' },
  { id: 'circle', label: 'Circle', className: 'frame-circle' },
  { id: 'tall', label: 'Tall', className: 'frame-tall' },
]

export const MAX_FILE_SIZE = 25 * 1024 * 1024
export const MAX_IMAGE_DIMENSION = 4096

export const X_SHARE_TEXT = `Building at Hacker House Goa 2026 ⚡

Here's my builder identity.

#FrameInGoa`

export const DEFAULT_TRANSFORM = { scale: 1, offsetX: 0, offsetY: 0 }
