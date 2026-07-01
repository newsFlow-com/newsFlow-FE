'use client'

import { useState } from 'react'
import ArticleCard from '@/src/components/article/ArticleCard'
import Spinner from '@/src/components/ui/Spinner'
import { useDailyHighlight, useMonthlyHighlight, useYearlyHighlight } from '@/src/hooks/useHighlight'

type Tab = 'daily' | 'monthly' | 'yearly'

const TABS: { key: Tab; label: string }[] = [
  { key: 'daily', label: '일간' },
  { key: 'monthly', label: '월간' },
  { key: 'yearly', label: '연간' },
]

export default function HighlightPage() {
  const [tab, setTab] = useState<Tab>('daily')

  const daily = useDailyHighlight(undefined, 5, true)
  const monthly = useMonthlyHighlight(undefined, undefined, 5, true)
  const yearly = useYearlyHighlight(undefined, 10, true)

  const current = { daily, monthly, yearly }[tab]
  const articles =
    tab === 'daily'
      ? daily.data?.articles
      : tab === 'monthly'
        ? monthly.data?.articles
        : yearly.data?.articles

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">핵심 기사</h1>

      <div className="flex gap-2 border-b border-gray-200">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === key
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {current.isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : articles?.length ? (
        <div className="space-y-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-gray-400">기사가 없습니다.</p>
      )}
    </div>
  )
}
