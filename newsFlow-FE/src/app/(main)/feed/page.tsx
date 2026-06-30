'use client'

import { useState } from 'react'
import ArticleCard from '@/src/components/article/ArticleCard'
import Spinner from '@/src/components/ui/Spinner'
import Button from '@/src/components/ui/Button'
import { useRecommend } from '@/src/hooks/useRecommend'
import { useArticles } from '@/src/hooks/useArticles'
import { useAuthStore } from '@/src/store/authStore'

const SENTIMENT_FILTERS = [
  { label: '전체', value: undefined },
  { label: '긍정', value: 'positive' },
  { label: '부정', value: 'negative' },
  { label: '중립', value: 'neutral' },
] as const

export default function FeedPage() {
  const userId = useAuthStore((s) => s.user?.id)
  const [page, setPage] = useState(0)
  const [sentiment, setSentiment] = useState<string | undefined>(undefined)

  const { data: recommended, isLoading: recLoading } = useRecommend(10)
  const { data: articles, isLoading: artLoading } = useArticles(page, 20, sentiment)

  const recommendedIds = new Set(recommended?.articles.map((a) => a.articleId))

  function handleSentimentChange(value: string | undefined) {
    setSentiment(value)
    setPage(0)
  }

  return (
    <div className="space-y-8">
      {userId && !!recommended?.articles.length && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">추천 기사</h2>
          <div className="space-y-3">
            {recommended.articles.map((article) => (
              <ArticleCard key={article.articleId} article={article} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">전체 기사</h2>
          <div className="ml-auto flex gap-1.5">
            {SENTIMENT_FILTERS.map(({ label, value }) => (
              <button
                key={label}
                onClick={() => handleSentimentChange(value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  sentiment === value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {artLoading || recLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {articles?.content
                .filter((a) => !recommendedIds.has(a.articleId))
                .map((article) => (
                  <ArticleCard key={article.articleId} article={article} />
                ))}
            </div>
            {articles && articles.totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  이전
                </Button>
                <span className="text-sm text-gray-500">
                  {page + 1} / {articles.totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= articles.totalPages - 1}
                >
                  다음
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
