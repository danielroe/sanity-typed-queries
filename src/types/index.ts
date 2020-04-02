export { Block } from './block'

export interface Image {
  _type: 'image'
  [key: string]: any
  asset: {
    _type: 'reference'
    _ref: string
  }
  crop?: {
    _type: 'sanity.imageCrop'
    top?: number
    bottom?: number
    left?: number
    right?: number
  }
  hotspot?: {
    _type: 'sanity.imageHotspot'
    x?: number
    y?: number
    height?: number
    width?: number
  }
}

export interface File {
  _type: 'file'
  asset: {
    _type: string
    _ref: string
  }
  [key: string]: any
}

export interface Geopoint {
  _type: 'geopoint'
  lat: number
  lng: number
  alt: number
}

export interface Slug {
  _type: 'slug'
  current: string
}

export interface Reference {
  _type: 'reference'
  _ref: string
  _weak?: boolean
}
