import { apiClient } from './client'
import type { Subscription } from '@/src/types'

export const subscriptionsApi = {
  list: () =>
    apiClient.get<Subscription[]>('/api/v1/subscriptions').then((r) => r.data),

  add: (subscriptionType: 'keyword' | 'category', value: string) =>
    apiClient
      .post<Subscription>('/api/v1/subscriptions', { subscriptionType, value })
      .then((r) => r.data),

  remove: (id: string) => apiClient.delete(`/api/v1/subscriptions/${id}`),
}
