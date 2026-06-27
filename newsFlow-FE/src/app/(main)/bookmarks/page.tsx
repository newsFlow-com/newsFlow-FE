'use client'

import { useState } from 'react'
import ArticleCard from '@/src/components/article/ArticleCard'
import Spinner from '@/src/components/ui/Spinner'
import Button from '@/src/components/ui/Button'
import { useBookmarks } from '@/src/hooks/useBookmarks'

export default function BookmarksPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useBookmarks(page, 20)

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">북마크</h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : data?.content.length ? (
        <>
          <div className="space-y-3">
            {data.content.map((bm) => (
              <ArticleCard key={bm.bookmarkId} article={bm.article} bookmarkId={bm.bookmarkId} />
            ))}
          </div>
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                이전
              </Button>
              <span className="text-sm text-gray-500">
                {page + 1} / {data.totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= data.totalPages - 1}
              >
                다음
              </Button>
            </div>
          )}
        </>
      ) : (
        <p className="py-12 text-center text-sm text-gray-400">저장된 북마크가 없습니다.</p>
      )}
    </div>
  )
}
