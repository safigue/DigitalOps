export interface Article {
  title: string
  image: string
  description: string
  hasVideo: boolean
  videoUrl: string
  id: number
  shortDescription: string
  order: number
  published: boolean
}

export interface Month {
  name: string
  articles: Article[]
  isTabActive: boolean
}

export interface Year {
  name: string
  months: Month[]
  isTabActive: boolean
}