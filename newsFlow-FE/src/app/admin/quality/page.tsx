'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { adminApi, type QualityLog } from '@/src/lib/api/admin'
import Spinner from '@/src/components/ui/Spinner'
import Button from '@/src/components/ui/Button'
import Badge from '@/src/components/ui/Badge'

const PAGE_SIZE = 20

export default function QualityPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [filterCorrect, setFilterCorrect] = useState<boolean | undefined>(undefined)

  const { data, isLoading } = useQuery({
    queryKey: ['qualityLogs', page, filterCorrect],
    queryFn: () => adminApi.qualityLogs({ page, size: PAGE_SIZE, isCorrect: filterCorrect }),
  })

  const review = useMutation({
    mutationFn: ({ logId, isCorrect }: { logId: string; isCorrect: boolean }) =>
      adminApi.reviewQualityLog(logId, isCorrect),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['qualityLogs'] }),
  })

  const FILTERS: { label: string; value: boolean | undefined }[] = [
    { label: '전체', value: undefined },
    { label: '정상', value: true },
    { label: '오류', value: false },
  ]

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">콘텐츠 품질 관리</h1>

      <div className="flex gap-2">
        {FILTERS.map(({ label, value }) => (
          <button
            key={label}
            onClick={() => { setFilterCorrect(value); setPage(0) }}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              filterCorrect === value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : data?.length ? (
        <>
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">기사 ID</th>
                  <th className="px-4 py-3 text-left font-medium">체크 유형</th>
                  <th className="px-4 py-3 text-left font-medium">상태</th>
                  <th className="px-4 py-3 text-left font-medium">생성일</th>
                  <th className="px-4 py-3 text-left font-medium">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((log: QualityLog) => (
                  <tr key={log.id} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {log.articleId.slice(0, 8)}…
                    </td>
                    <td className="px-4 py-3 text-gray-700">{log.checkType}</td>
                    <td className="px-4 py-3">
                      {log.isCorrect === null ? (
                        <Badge>미검토</Badge>
                      ) : log.isCorrect ? (
                        <Badge variant="green">정상</Badge>
                      ) : (
                        <Badge variant="red">오류</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {format(new Date(log.createdAt), 'MM.dd HH:mm', { locale: ko })}
                    </td>
                    <td className="px-4 py-3">
                      {log.isCorrect === null && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            loading={review.isPending}
                            onClick={() => review.mutate({ logId: log.id, isCorrect: true })}
                          >
                            승인
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            loading={review.isPending}
                            onClick={() => review.mutate({ logId: log.id, isCorrect: false })}
                          >
                            반려
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(page > 0 || data.length === PAGE_SIZE) && (
            <div className="flex items-center justify-between">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                이전
              </Button>
              <span className="text-sm text-gray-500">{page + 1} 페이지</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={data.length < PAGE_SIZE}
              >
                다음
              </Button>
            </div>
          )}
        </>
      ) : (
        <p className="py-12 text-center text-sm text-gray-400">로그가 없습니다.</p>
      )}
    </div>
  )
}
