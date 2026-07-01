import { aiClient } from './client'
import type { Article } from '@/src/types'

interface RawRecommendedArticle {
  article_id: string
  title: string
  summary: string | null
  original_url: string
  published_at: string | null
  score: number
}

export const recommendApi = {
  get: (userId: string, size = 10) =>
    aiClient
      .get<{ user_id: string; articles: RawRecommendedArticle[] }>(`/recommend/${userId}`, {
        params: { size },
      })
      .then((r) => ({
        userId: r.data.user_id,
        articles: r.data.articles.map(
          (a): Article => ({
            id: a.article_id,
            title: a.title,
            summary: a.summary,
            originalUrl: a.original_url,
            publishedAt: a.published_at,
            score: a.score,
          })
        ),
      })),
}
