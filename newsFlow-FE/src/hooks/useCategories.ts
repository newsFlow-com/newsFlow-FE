'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { categoriesApi } from '@/src/lib/api/categories'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.list,
  })
}

export function useMyCategories() {
  return useQuery({
    queryKey: ['myCategories'],
    queryFn: categoriesApi.myCategories,
  })
}

export function useUpdateMyCategories() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (categoryIds: number[]) => categoriesApi.updateMyCategories(categoryIds),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['myCategories'] }),
  })
}
