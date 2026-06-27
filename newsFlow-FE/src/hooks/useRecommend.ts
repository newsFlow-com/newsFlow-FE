'use client'

import { useQuery } from '@tanstack/react-query'
import { recommendApi } from '@/src/lib/api/recommend'
import { useAuthStore } from '@/src/store/authStore'

export function useRecommend(size = 10) {
  const userId = useAuthStore((s) => s.user?.id)

  return useQuery({
    queryKey: ['recommend', userId, size],
    queryFn: () => recommendApi.get(userId!, size),
    enabled: !!userId,
  })
}
