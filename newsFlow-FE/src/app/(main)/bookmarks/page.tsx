'use client'

import ArticleCard from '@/src/components/article/ArticleCard'
import Spinner from '@/src/components/ui/Spinner'
import { useBookmarks } from '@/src/hooks/useBookmarks'

export default function BookmarksPage() {
  const { data, isLoading } = useBookmarks()

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">북마크</h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : data?.length ? (
        <div className="space-y-3">
          {data.map((article) => (
            <ArticleCard key={article.id} article={article} initiallyBookmarked />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-gray-400">저장된 북마크가 없습니다.</p>
      )}
    </div>
  )
}
