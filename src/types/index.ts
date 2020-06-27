export type { Block } from './block'
export type { Image } from './image'

export const to = Symbol('type of object referred to by the reference')

interface FileAsset {
  url: string
  path: string
  size: number
  assetId: string
  mimeType: string
  sha1hash: string
  extension: string
  uploadId?: string
  originalFilename?: string
}

export interface File {
  _type: 'file'
  asset: Reference<FileAsset>
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
