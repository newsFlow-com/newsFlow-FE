import { apiClient } from './client'
import type { Notification } from '@/src/types'

export const notificationsApi = {
  list: (page = 0, size = 20) =>
    apiClient
      .get<{ content: Notification[]; totalElements: number }>('/api/v1/notifications', {
        params: { page, size },
      })
      .then((r) => r.data),

  unreadCount: () =>
    apiClient
      .get<{ count: number }>('/api/v1/notifications/unread-count')
      .then((r) => r.data.count),

  markRead: (id: string) => apiClient.patch(`/api/v1/notifications/${id}/read`),

  markAllRead: () => apiClient.patch('/api/v1/notifications/read-all'),
}
