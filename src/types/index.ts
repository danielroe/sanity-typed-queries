export { Block } from './block'

export const to = Symbol('type of object referred to by the reference')

export interface Image {
  _type: 'image'
  [key: string]: any
  asset: Reference
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
  asset: Reference
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

export interface Reference<Type = any> {
  _type: 'reference'
  _ref: string
  _weak?: boolean
  [to]: Type
}
