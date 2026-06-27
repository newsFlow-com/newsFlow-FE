'use client'

import { useQuery } from '@tanstack/react-query'
import { highlightApi } from '@/src/lib/api/highlight'

export function useDailyHighlight(targetDate?: string, topN = 5, withSummary = false) {
  return useQuery({
    queryKey: ['highlight', 'daily', targetDate, topN, withSummary],
    queryFn: () => highlightApi.daily(targetDate, topN, withSummary),
  })
}

export function useMonthlyHighlight(year?: number, month?: number, topN = 5, withSummary = false) {
  return useQuery({
    queryKey: ['highlight', 'monthly', year, month, topN, withSummary],
    queryFn: () => highlightApi.monthly(year, month, topN, withSummary),
  })
}

export function useYearlyHighlight(year?: number, topN = 10, withSummary = false) {
  return useQuery({
    queryKey: ['highlight', 'yearly', year, topN, withSummary],
    queryFn: () => highlightApi.yearly(year, topN, withSummary),
  })
}
