import { apiClient } from './client'
import type { Category } from '@/src/types'

export const categoriesApi = {
  list: () =>
    apiClient.get<Category[]>('/api/v1/categories').then((r) => r.data),

  myCategories: () =>
    apiClient.get<Category[]>('/api/v1/users/me/categories').then((r) => r.data),

  updateMyCategories: (categoryIds: number[]) =>
    apiClient.put('/api/v1/users/me/categories', { categoryIds }),
}
