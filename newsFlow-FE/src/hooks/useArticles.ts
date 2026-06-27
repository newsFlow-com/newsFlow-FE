'use client'

import { useQuery } from '@tanstack/react-query'
import { articlesApi } from '@/src/lib/api/articles'

export function useArticles(page = 0, size = 20) {
  return useQuery({
    queryKey: ['articles', page, size],
    queryFn: () => articlesApi.list(page, size),
  })
}

export function useArticle(id: string) {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => articlesApi.get(id),
    enabled: !!id,
  })
}
