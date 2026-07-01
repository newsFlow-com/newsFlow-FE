'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useSearch } from '@/src/hooks/useSearch'
import { useCategories } from '@/src/hooks/useCategories'
import Spinner from '@/src/components/ui/Spinner'
import Badge from '@/src/components/ui/Badge'
import Input from '@/src/components/ui/Input'
import Button from '@/src/components/ui/Button'
import type { SearchArticle } from '@/src/types'

function parseHighlight(raw: string): { text: string; highlighted: boolean }[] {
  const parts: { text: string; highlighted: boolean }[] = []
  let last = 0
  const re = /<em>(.*?)<\/em>/g
  let m: RegExpExecArray | null
  while ((m = re.exec(raw)) !== null) {
    if (m.index > last) parts.push({ text: raw.slice(last, m.index), highlighted: false })
    parts.push({ text: m[1], highlighted: true })
    last = m.index + m[0].length
  }
  if (last < raw.length) parts.push({ text: raw.slice(last), highlighted: false })
  return parts
}

function HighlightText({ text, highlights }: { text: string; highlights?: string[] }) {
  if (!highlights?.length) return <span>{text}</span>
  const parts = parseHighlight(highlights[0])
  return (
    <>
      {parts.map((p, i) =>
        p.highlighted ? (
          <mark key={i} className="rounded bg-yellow-100 px-0.5 text-yellow-900">
            {p.text}
          </mark>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </>
  )
}

function SearchResultCard({ article }: { article: SearchArticle }) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <a href={article.originalUrl} target="_blank" rel="noopener noreferrer" className="block">
        <h2 className="mb-1 line-clamp-2 text-base font-semibold text-gray-900 hover:text-blue-600">
          <HighlightText text={article.title} highlights={article.highlights?.title} />
        </h2>
      </a>
      {(article.highlights?.summary?.[0] || article.summary) && (
        <p className="line-clamp-2 text-sm text-gray-500">
          <HighlightText
            text={article.summary ?? ''}
            highlights={article.highlights?.summary}
          />
        </p>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {article.publishedAt && (
          <span className="text-xs text-gray-400">
            {format(new Date(article.publishedAt), 'yyyy.MM.dd', { locale: ko })}
          </span>
        )}
        {article.categories.map((c) => (
          <Badge key={c} variant="blue">
            {c}
          </Badge>
        ))}
        {article.score > 0 && (
          <span className="text-xs text-gray-400">관련도 {article.score.toFixed(1)}</span>
        )}
      </div>
    </article>
  )
}

export default function SearchPage() {
  const [input, setInput] = useState('')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | undefined>(undefined)
  const [page, setPage] = useState(0)

  const { data: categories } = useCategories()
  const { data, isLoading, isFetching } = useSearch(query, category, page)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setQuery(input.trim())
    setPage(0)
  }

  const totalPages = data ? Math.ceil(data.total / data.size) : 0

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">검색</h1>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="검색어를 입력하세요"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={!input.trim()}>
          검색
        </Button>
      </form>

      {query && (
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => { setCategory(undefined); setPage(0) }}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              category === undefined
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            전체
          </button>
          {categories?.map((c) => (
            <button
              key={c.id}
              onClick={() => { setCategory(c.slug); setPage(0) }}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                category === c.slug
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {isLoading || isFetching ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : query && data ? (
        <>
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-900">&ldquo;{query}&rdquo;</span> 검색 결과{' '}
            {data.total.toLocaleString()}건
          </p>
          {data.articles.length ? (
            <div className="space-y-3">
              {data.articles.map((a) => (
                <SearchResultCard key={a.id} article={a} />
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-sm text-gray-400">검색 결과가 없습니다.</p>
          )}
          {totalPages > 1 && (
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
                {page + 1} / {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages - 1}
              >
                다음
              </Button>
            </div>
          )}
        </>
      ) : (
        !query && (
          <p className="py-12 text-center text-sm text-gray-400">
            검색어를 입력하고 검색 버튼을 누르세요.
          </p>
        )
      )}
    </div>
  )
}
