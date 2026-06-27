'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { Article } from '@/src/types'
import Badge from '@/src/components/ui/Badge'
import Button from '@/src/components/ui/Button'
import { useAddBookmark, useRemoveBookmark } from '@/src/hooks/useBookmarks'

interface ArticleCardProps {
  article: Article
  bookmarkId?: string
}

export default function ArticleCard({ article, bookmarkId }: ArticleCardProps) {
  const [bookmarked, setBookmarked] = useState(!!bookmarkId)
  const [activeBookmarkId, setActiveBookmarkId] = useState(bookmarkId)
  const addBookmark = useAddBookmark()
  const removeBookmark = useRemoveBookmark()

  async function toggleBookmark() {
    if (bookmarked && activeBookmarkId) {
      await removeBookmark.mutateAsync(activeBookmarkId)
      setBookmarked(false)
      setActiveBookmarkId(undefined)
    } else {
      const bm = await addBookmark.mutateAsync(article.articleId)
      setBookmarked(true)
      setActiveBookmarkId(bm.bookmarkId)
    }
  }

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <Link href={`/article/${article.articleId}`} className="block">
            <h2 className="mb-1 line-clamp-2 text-base font-semibold text-gray-900 hover:text-blue-600">
              {article.title}
            </h2>
          </Link>
          {article.summary && (
            <p className="line-clamp-2 text-sm text-gray-500">{article.summary}</p>
          )}
          <div className="mt-2 flex items-center gap-2">
            {article.publishedAt && (
              <span className="text-xs text-gray-400">
                {format(new Date(article.publishedAt), 'yyyy.MM.dd', { locale: ko })}
              </span>
            )}
            {article.score !== undefined && (
              <Badge variant="blue">점수 {article.score.toFixed(1)}</Badge>
            )}
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleBookmark}
            loading={addBookmark.isPending || removeBookmark.isPending}
            aria-label={bookmarked ? '북마크 해제' : '북마크 추가'}
          >
            {bookmarked ? '★' : '☆'}
          </Button>
          <a
            href={article.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:underline"
          >
            원문
          </a>
        </div>
      </div>
    </article>
  )
}
