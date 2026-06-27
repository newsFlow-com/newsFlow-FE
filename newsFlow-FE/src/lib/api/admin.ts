import { apiClient } from './client'
import type { PageResponse } from '@/src/types'

export interface QualityLog {
  logId: string
  articleId: string
  checkType: string
  isCorrect: boolean
  reviewedAt: string | null
  reviewedByAdminId: string | null
  createdAt: string
}

export const adminApi = {
  qualityLogs: (params?: { checkType?: string; isCorrect?: boolean; page?: number; size?: number }) =>
    apiClient
      .get<PageResponse<QualityLog>>('/api/admin/v1/quality/logs', { params })
      .then((r) => r.data),

  reviewQualityLog: (logId: string, isCorrect: boolean, correctionData?: Record<string, unknown>) =>
    apiClient.patch(`/api/admin/v1/quality/logs/${logId}/review`, { isCorrect, correctionData }),
}
