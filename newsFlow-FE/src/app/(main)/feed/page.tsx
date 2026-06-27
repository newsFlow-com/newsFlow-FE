'use client'

import { useState } from 'react'
import ArticleCard from '@/src/components/article/ArticleCard'
import Spinner from '@/src/components/ui/Spinner'
import Button from '@/src/components/ui/Button'
import { useRecommend } from '@/src/hooks/useRecommend'
import { useArticles } from '@/src/hooks/useArticles'
import { useAuthStore } from '@/src/store/authStore'

export default function FeedPage() {
  const userId = useAuthStore((s) => s.user?.id)
  const [page, setPage] = useState(0)

  const { data: recommended, isLoading: recLoading } = useRecommend(10)
  const { data: articles, isLoading: artLoading } = useArticles(page, 20)

  const recommendedIds = new Set(recommended?.articles.map((a) => a.articleId))

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
        <h2 className="mb-3 text-lg font-semibold text-gray-900">전체 기사</h2>
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
