import { apiClient } from './client'
import type { Notification } from '@/src/types'

export const notificationsApi = {
  list: (size = 20) =>
    apiClient
      .get<Notification[]>('/api/v1/notifications', { params: { size } })
      .then((r) => r.data),

  unreadCount: () =>
    apiClient
      .get<{ count: number }>('/api/v1/notifications/unread-count')
      .then((r) => r.data.count),

  markRead: (id: string) => apiClient.patch(`/api/v1/notifications/${id}/read`),

  markAllRead: () => apiClient.patch('/api/v1/notifications/read-all'),
}
