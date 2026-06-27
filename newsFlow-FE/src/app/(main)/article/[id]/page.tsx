'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useArticle } from '@/src/hooks/useArticles'
import Spinner from '@/src/components/ui/Spinner'
import Button from '@/src/components/ui/Button'
import { aiClient } from '@/src/lib/api/client'

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>()
  const { data: article, isLoading } = useArticle(id)
  const [summary, setSummary] = useState<string | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(false)

  async function fetchSummary() {
    if (!article) return
    setSummaryLoading(true)
    try {
      const { data } = await aiClient.post<{ article_id: string; summary: string }>('/summarize', {
        article_id: article.articleId,
      })
      setSummary(data.summary)
    } finally {
      setSummaryLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="py-20 text-center text-gray-500">
        <p>기사를 찾을 수 없습니다.</p>
        <Link href="/feed" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
          피드로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold leading-snug text-gray-900">{article.title}</h1>
        {article.publishedAt && (
          <p className="mt-1 text-sm text-gray-400">
            {format(new Date(article.publishedAt), 'yyyy년 MM월 dd일', { locale: ko })}
          </p>
        )}
      </div>

      {article.summary && (
        <p className="leading-relaxed text-gray-600">{article.summary}</p>
      )}

      <a
        href={article.originalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
      >
        원문 보기 →
      </a>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">AI 요약</h2>
          {!summary && (
            <Button size="sm" onClick={fetchSummary} loading={summaryLoading}>
              요약 생성
            </Button>
          )}
        </div>
        {summaryLoading ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : summary ? (
          <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">{summary}</p>
        ) : (
          <p className="text-sm text-gray-400">요약 생성 버튼을 클릭하세요.</p>
        )}
      </div>
    </div>
  )
}
