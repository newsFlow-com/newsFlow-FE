import { apiClient } from './client'
import type { Bookmark, PageResponse } from '@/src/types'

export const bookmarkApi = {
  list: (page = 0, size = 20) =>
    apiClient
      .get<PageResponse<Bookmark>>('/api/v1/bookmarks', { params: { page, size } })
      .then((r) => r.data),

  add: (articleId: string) =>
    apiClient.post<Bookmark>('/api/v1/bookmarks', { articleId }).then((r) => r.data),

  remove: (bookmarkId: string) =>
    apiClient.delete(`/api/v1/bookmarks/${bookmarkId}`),
}
