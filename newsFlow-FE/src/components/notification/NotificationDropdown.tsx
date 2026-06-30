'use client'

import { useEffect, useRef, useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useNotifications, useUnreadCount, useMarkRead, useMarkAllRead } from '@/src/hooks/useNotifications'
import Spinner from '@/src/components/ui/Spinner'

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const { data: count = 0 } = useUnreadCount()
  const { data, isLoading } = useNotifications(0)
  const markRead = useMarkRead()
  const markAllRead = useMarkAllRead()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        aria-label="알림"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <span className="text-sm font-semibold text-gray-900">알림</span>
            {count > 0 && (
              <button
                onClick={() => markAllRead.mutate()}
                disabled={markAllRead.isPending}
                className="text-xs text-blue-600 hover:underline"
              >
                모두 읽음
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-6">
                <Spinner />
              </div>
            ) : !data?.content.length ? (
              <p className="py-8 text-center text-sm text-gray-400">알림이 없습니다.</p>
            ) : (
              data.content.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    if (!n.isRead) markRead.mutate(n.id)
                  }}
                  className={`cursor-pointer border-b border-gray-50 px-4 py-3 hover:bg-gray-50 ${
                    n.isRead ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!n.isRead && (
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                    )}
                    <div className={!n.isRead ? '' : 'pl-3.5'}>
                      {n.subscriptionValue && (
                        <p className="mb-0.5 text-xs font-medium text-blue-600">
                          #{n.subscriptionValue}
                        </p>
                      )}
                      <p className="line-clamp-2 text-sm text-gray-800">{n.articleTitle ?? '새 기사'}</p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {format(new Date(n.sentAt), 'M월 d일 HH:mm', { locale: ko })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
