'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bookmarkApi } from '@/src/lib/api/bookmark'

export function useBookmarks(size = 50) {
  return useQuery({
    queryKey: ['bookmarks', size],
    queryFn: () => bookmarkApi.list(size),
  })
}

export function useAddBookmark() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (articleId: string) => bookmarkApi.add(articleId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookmarks'] }),
  })
}

export function useRemoveBookmark() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (articleId: string) => bookmarkApi.remove(articleId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookmarks'] }),
  })
}
