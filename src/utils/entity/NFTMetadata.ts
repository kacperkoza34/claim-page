interface FileMetadata {
  uri: string
  type: string
  metadata: NFTMetadata
}

export interface Properties {
  label: string
  value: string
}
export interface Attribute {
  trait_type: string
  value: string
}

interface Localization {
  uri: string
  locale: string
}

export interface NFTMetadata {
  name: string
  creator?: string
  description?: string
  image?: string | null
  type?: string
  files?: FileMetadata[]
  format?: string
  properties?: Properties[]
  attributes?: Attribute[]
  localization?: Localization
}
