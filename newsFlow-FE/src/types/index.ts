export interface User {
  id: string
  email: string
  nickname: string
  profileImageUrl?: string | null
  isEmailVerified: boolean
  role: 'USER' | 'ADMIN'
}

export interface Article {
  articleId: string
  title: string
  summary: string | null
  originalUrl: string
  publishedAt: string | null
  score?: number
  aiSummary?: string | null
}

export interface Category {
  id: number
  name: string
  code: string
}

export interface Bookmark {
  bookmarkId: string
  article: Article
  createdAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}
