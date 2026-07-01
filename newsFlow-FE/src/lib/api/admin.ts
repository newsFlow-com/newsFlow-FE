import { apiClient } from './client'

export interface QualityLog {
  id: string
  articleId: string
  articleTitle: string
  checkType: string
  isCorrect: boolean | null
  checkedBy: string | null
  createdAt: string
}

export const adminApi = {
  qualityLogs: (params?: { checkType?: string; isCorrect?: boolean; page?: number; size?: number }) =>
    apiClient
      .get<QualityLog[]>('/api/admin/v1/quality/logs', { params })
      .then((r) => r.data),

  reviewQualityLog: (logId: string, isCorrect: boolean, correctionData?: Record<string, unknown>) =>
    apiClient.patch(`/api/admin/v1/quality/logs/${logId}/review`, { isCorrect, correctionData }),
}
