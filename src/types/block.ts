interface BlockMarkDefs {
  _key: string
  _type: string
  [key: string]: string
}

interface BlockChildren {
  _key: string
  _type: string
  marks: string[]
  text: string
}

export interface BlockType {
  _key: string
  _type: string
  children: BlockChildren[]
  level?: number
  listItem?: string
  markDefs: BlockMarkDefs[]
  style: string
}
