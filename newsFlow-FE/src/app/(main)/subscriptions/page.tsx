'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import {
  useSubscriptions,
  useAddSubscription,
  useRemoveSubscription,
} from '@/src/hooks/useSubscriptions'
import { useCategories } from '@/src/hooks/useCategories'
import Spinner from '@/src/components/ui/Spinner'
import Button from '@/src/components/ui/Button'
import Input from '@/src/components/ui/Input'
import Badge from '@/src/components/ui/Badge'

export default function SubscriptionsPage() {
  const { data: subscriptions, isLoading } = useSubscriptions()
  const { data: categories } = useCategories()
  const addSub = useAddSubscription()
  const removeSub = useRemoveSubscription()

  const [keywordInput, setKeywordInput] = useState('')
  const [keywordError, setKeywordError] = useState('')

  const keywordSubs = subscriptions?.filter((s) => s.subscriptionType === 'keyword') ?? []
  const categorySubs = subscriptions?.filter((s) => s.subscriptionType === 'category') ?? []

  const subscribedCategories = new Set(categorySubs.map((s) => s.value))

  function handleAddKeyword(e: React.FormEvent) {
    e.preventDefault()
    const value = keywordInput.trim()
    if (!value) return
    if (keywordSubs.some((s) => s.value === value)) {
      setKeywordError('이미 구독 중인 키워드입니다.')
      return
    }
    setKeywordError('')
    addSub.mutate({ type: 'keyword', value }, { onSuccess: () => setKeywordInput('') })
  }

  function toggleCategory(code: string) {
    if (subscribedCategories.has(code)) {
      const sub = categorySubs.find((s) => s.value === code)
      if (sub) removeSub.mutate(sub.id)
    } else {
      addSub.mutate({ type: 'category', value: code })
    }
  }

  return (
    <div className="max-w-lg space-y-10">
      <h1 className="text-xl font-bold text-gray-900">구독 관리</h1>

      {/* 키워드 구독 */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-gray-800">키워드 구독</h2>
        <p className="text-sm text-gray-500">
          구독한 키워드가 포함된 새 기사가 발행되면 알림을 받습니다.
        </p>
        <form onSubmit={handleAddKeyword} className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="구독할 키워드 입력"
              value={keywordInput}
              onChange={(e) => { setKeywordInput(e.target.value); setKeywordError('') }}
              error={keywordError}
            />
          </div>
          <Button type="submit" disabled={!keywordInput.trim()} loading={addSub.isPending}>
            추가
          </Button>
        </form>

        {isLoading ? (
          <Spinner />
        ) : keywordSubs.length ? (
          <ul className="space-y-2">
            {keywordSubs.map((sub) => (
              <li
                key={sub.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2.5"
              >
                <div>
                  <span className="text-sm font-medium text-gray-800">#{sub.value}</span>
                  <span className="ml-2 text-xs text-gray-400">
                    {format(new Date(sub.createdAt), 'yyyy.MM.dd', { locale: ko })}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSub.mutate(sub.id)}
                  loading={removeSub.isPending}
                  className="text-red-500 hover:text-red-700"
                >
                  삭제
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">구독 중인 키워드가 없습니다.</p>
        )}
      </section>

      {/* 카테고리 구독 */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-gray-800">카테고리 구독</h2>
        <p className="text-sm text-gray-500">
          구독한 카테고리의 새 기사가 발행되면 알림을 받습니다.
        </p>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories?.map((cat) => {
              const subscribed = subscribedCategories.has(cat.slug)
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.slug)}
                  disabled={addSub.isPending || removeSub.isPending}
                  className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                    subscribed
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                  }`}
                >
                  {cat.name} {subscribed && '✓'}
                </button>
              )
            })}
          </div>
        )}
        {categorySubs.length > 0 && (
          <p className="text-xs text-gray-400">
            구독 중: {categorySubs.map((s) => s.value).join(', ')}
          </p>
        )}
      </section>
    </div>
  )
}
