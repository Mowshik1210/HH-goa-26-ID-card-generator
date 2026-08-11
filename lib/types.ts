export type FormatMode = 'pfp' | 'pass'

export type FrameId =
  | 'arch'
  | 'portrait'
  | 'ornate'
  | 'slim'
  | 'landscape'
  | 'circle'
  | 'tall'

export interface ImageTransform {
  scale: number
  offsetX: number
  offsetY: number
}

export interface BuilderDetails {
  name: string
  stack: string
  title: string
}

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export interface ComposeOptions {
  mode: FormatMode
  frameId: FrameId
  imageSrc: string
  transform: ImageTransform
  builder: BuilderDetails
}

export interface FrameOption {
  id: FrameId
  label: string
  className: string
}
