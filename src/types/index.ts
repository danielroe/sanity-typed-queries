export { BlockType } from './block'

export interface SanityImageType {
  [key: string]: any
  asset: {
    _type: 'reference'
    _ref: string
  }
  crop?: {
    top?: number
    bottom?: number
    left?: number
    right?: number
  }
  hotspot?: {
    x?: number
    y?: number
    height?: number
    width?: number
  }
}

export interface SanityFileType {
  asset: {
    _type: string
    _ref: string
  }
  [key: string]: any
}

export interface GeopointType {
  lat: number
  lng: number
  alt: number
}

export interface SlugType {
  current: string
}

export interface ReferenceType {
  _ref: string
  _weak?: boolean
}
