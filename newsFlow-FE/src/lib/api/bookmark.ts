import { apiClient } from './client'
import type { Article } from '@/src/types'

export const bookmarkApi = {
  list: (size = 20) =>
    apiClient.get<Article[]>('/api/v1/bookmarks', { params: { size } }).then((r) => r.data),

  add: (articleId: string) => apiClient.post(`/api/v1/bookmarks/${articleId}`),

  remove: (articleId: string) => apiClient.delete(`/api/v1/bookmarks/${articleId}`),
}
