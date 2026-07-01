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

export function useAddMyCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (categorySlug: string) => categoriesApi.addMyCategory(categorySlug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['myCategories'] }),
  })
}

export function useRemoveMyCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (categorySlug: string) => categoriesApi.removeMyCategory(categorySlug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['myCategories'] }),
  })
}
