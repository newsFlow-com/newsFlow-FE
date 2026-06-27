'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bookmarkApi } from '@/src/lib/api/bookmark'

export function useBookmarks(page = 0, size = 20) {
  return useQuery({
    queryKey: ['bookmarks', page, size],
    queryFn: () => bookmarkApi.list(page, size),
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
    mutationFn: (bookmarkId: string) => bookmarkApi.remove(bookmarkId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookmarks'] }),
  })
}
