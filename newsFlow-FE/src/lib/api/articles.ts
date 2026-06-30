import { apiClient } from './client'
import type { Article, PageResponse } from '@/src/types'

export const articlesApi = {
  list: (page = 0, size = 20, sentiment?: string) =>
    apiClient
      .get<PageResponse<Article>>('/api/v1/articles', {
        params: { page, size, ...(sentiment ? { sentiment } : {}) },
      })
      .then((r) => r.data),

  get: (id: string) =>
    apiClient.get<Article>(`/api/v1/articles/${id}`).then((r) => r.data),
}
