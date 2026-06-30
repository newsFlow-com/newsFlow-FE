'use client'

import { useQuery } from '@tanstack/react-query'
import { searchApi } from '@/src/lib/api/search'

export function useSearch(q: string, category?: string, page = 0) {
  return useQuery({
    queryKey: ['search', q, category, page],
    queryFn: () => searchApi.search({ q, category, page, size: 20 }),
    enabled: q.trim().length > 0,
    staleTime: 30_000,
  })
}
