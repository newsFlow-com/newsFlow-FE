import { apiClient } from './client'
import type { SearchResponse } from '@/src/types'

export const searchApi = {
  search: (params: { q: string; category?: string; page?: number; size?: number }) =>
    apiClient
      .get<{ data: SearchResponse }>('/api/v1/search', { params })
      .then((r) => r.data.data),
}
