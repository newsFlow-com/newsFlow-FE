export interface User {
  id: string
  email: string
  nickname: string
  profileImageUrl?: string | null
  isEmailVerified: boolean
  role: 'USER' | 'ADMIN'
}

export interface Article {
  id: string
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
  id: string
  name: string
  slug: string
}

export interface UserCategory {
  categoryId: string
  slug: string
  name: string
  preferenceWeight: number
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  gate: string
  user: User
}

export interface CursorPage<T> {
  content: T[]
  hasNext: boolean
  nextCursor: string | null
  size: number
}
