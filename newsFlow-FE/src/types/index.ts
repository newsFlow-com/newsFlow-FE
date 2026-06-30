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
  sentiment?: 'positive' | 'negative' | 'neutral' | null
}

export interface SearchArticle {
  id: string
  title: string
  summary: string | null
  aiSummary: string | null
  originalUrl: string
  categories: string[]
  keywords: string[]
  publishedAt: string | null
  score: number
  highlights: Record<string, string[]>
}

export interface SearchResponse {
  total: number
  page: number
  size: number
  articles: SearchArticle[]
}

export interface Subscription {
  id: string
  subscriptionType: 'keyword' | 'category'
  value: string
  isActive: boolean
  createdAt: string
}

export interface Notification {
  id: string
  articleId: string | null
  articleTitle: string | null
  subscriptionValue: string | null
  isRead: boolean
  sentAt: string
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
