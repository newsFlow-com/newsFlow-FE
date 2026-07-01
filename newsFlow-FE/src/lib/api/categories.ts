import { apiClient } from './client'
import type { Category, UserCategory } from '@/src/types'

export const categoriesApi = {
  list: () =>
    apiClient.get<Category[]>('/api/v1/categories').then((r) => r.data),

  myCategories: () =>
    apiClient.get<UserCategory[]>('/api/v1/users/me/categories').then((r) => r.data),

  addMyCategory: (categorySlug: string) =>
    apiClient
      .post<UserCategory>('/api/v1/users/me/categories', { categorySlug })
      .then((r) => r.data),

  removeMyCategory: (categorySlug: string) =>
    apiClient.delete(`/api/v1/users/me/categories/${categorySlug}`),
}
