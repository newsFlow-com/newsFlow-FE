import { aiClient } from './client'
import type { Article } from '@/src/types'

export const recommendApi = {
  get: (userId: string, size = 10) =>
    aiClient
      .get<{ user_id: string; articles: Article[] }>(`/recommend/${userId}`, { params: { size } })
      .then((r) => r.data),
}
