import { apiClient } from './client'
import type { Article, CursorPage } from '@/src/types'

export const articlesApi = {
  list: (cursor?: string, size = 20, sentiment?: string) =>
    apiClient
      .get<CursorPage<Article>>('/api/v1/articles', {
        params: { cursor, size, ...(sentiment ? { sentiment } : {}) },
      })
      .then((r) => r.data),

  get: (id: string) =>
    apiClient.get<Article>(`/api/v1/articles/${id}`).then((r) => r.data),
}
