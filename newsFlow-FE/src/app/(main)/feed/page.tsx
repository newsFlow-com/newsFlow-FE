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
  // 커서 기반 페이지네이션: 지금까지 이동한 커서를 스택으로 쌓아 "이전"을 지원한다
  const [cursorStack, setCursorStack] = useState<(string | undefined)[]>([undefined])
  const [sentiment, setSentiment] = useState<string | undefined>(undefined)
  const cursor = cursorStack[cursorStack.length - 1]

  const { data: recommended, isLoading: recLoading } = useRecommend(10)
  const { data: articles, isLoading: artLoading } = useArticles(cursor, 20, sentiment)

  const recommendedIds = new Set(recommended?.articles.map((a) => a.id))

  function handleSentimentChange(value: string | undefined) {
    setSentiment(value)
    setCursorStack([undefined])
  }

  function handlePrev() {
    setCursorStack((s) => (s.length > 1 ? s.slice(0, -1) : s))
  }

  function handleNext() {
    if (articles?.nextCursor) setCursorStack((s) => [...s, articles.nextCursor ?? undefined])
  }

  return (
    <div className="space-y-8">
      {userId && !!recommended?.articles.length && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">추천 기사</h2>
          <div className="space-y-3">
            {recommended.articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
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
                .filter((a) => !recommendedIds.has(a.id))
                .map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
            </div>
            {articles && (cursorStack.length > 1 || articles.hasNext) && (
              <div className="mt-4 flex items-center justify-between">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handlePrev}
                  disabled={cursorStack.length <= 1}
                >
                  이전
                </Button>
                <span className="text-sm text-gray-500">{cursorStack.length} 페이지</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleNext}
                  disabled={!articles.hasNext}
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
