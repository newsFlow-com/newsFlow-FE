import { aiClient } from './client'
import type { Article } from '@/src/types'

interface DailyHighlight {
  date: string
  articles: Article[]
}

interface MonthlyHighlight {
  year: number
  month: number
  articles: Article[]
}

interface YearlyHighlight {
  year: number
  articles: Article[]
}

export const highlightApi = {
  daily: (targetDate?: string, topN = 5, withSummary = false) =>
    aiClient
      .get<DailyHighlight>('/highlight/daily', {
        params: { target_date: targetDate, top_n: topN, with_summary: withSummary },
      })
      .then((r) => r.data),

  monthly: (year?: number, month?: number, topN = 5, withSummary = false) =>
    aiClient
      .get<MonthlyHighlight>('/highlight/monthly', {
        params: { year, month, top_n: topN, with_summary: withSummary },
      })
      .then((r) => r.data),

  yearly: (year?: number, topN = 10, withSummary = false) =>
    aiClient
      .get<YearlyHighlight>('/highlight/yearly', {
        params: { year, top_n: topN, with_summary: withSummary },
      })
      .then((r) => r.data),
}
