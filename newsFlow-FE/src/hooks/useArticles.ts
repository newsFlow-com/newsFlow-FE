'use client'

import { useQuery } from '@tanstack/react-query'
import { articlesApi } from '@/src/lib/api/articles'

export function useArticles(page = 0, size = 20, sentiment?: string) {
  return useQuery({
    queryKey: ['articles', page, size, sentiment],
    queryFn: () => articlesApi.list(page, size, sentiment),
  })
}

export function useArticle(id: string) {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => articlesApi.get(id),
    enabled: !!id,
  })
}
