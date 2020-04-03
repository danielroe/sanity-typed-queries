import { Geopoint, Reference } from '.'

interface Palette {
  background: string
  foreground: string
  population: number
  title: string
}

export interface Image {
  _type: 'image'
  [key: string]: any
  asset: Reference<ImageAsset>
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

interface ImageAsset {
  _type: 'sanity.imageAsset'
  assetId: string
  extension: string
  metadata: {
    dimensions: {
      aspectRatio: number
      height: number
      width: number
    }
    location?: Geopoint
    lqip: string
    palette: {
      darkMuted: Palette
      darkVibrant: Palette
      dominant: Palette
      lightMuted: Palette
      lightVibrant: Palette
      muted: Palette
      vibrant: Palette
    }
  }
  mimeType: string
  originalFilename: string
  path: string
  sha1hash: string
  size: number
  url: string
}
