import { Geopoint } from '.'

interface Palette {
  background: string
  foreground: string
  population: number
  title: string
}

interface ResolvedImage {
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
