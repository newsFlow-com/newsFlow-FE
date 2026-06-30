'use client'

import Link from 'next/link'
import { useLogout } from '@/src/hooks/useAuth'
import { useAuthStore } from '@/src/store/authStore'
import Button from '@/src/components/ui/Button'
import NotificationDropdown from '@/src/components/notification/NotificationDropdown'

export default function Navbar() {
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/feed" className="text-xl font-bold text-blue-600">
          NewsFlow
        </Link>
        <nav className="flex items-center gap-3">
          {user?.role === 'ADMIN' && (
            <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900">
              관리자
            </Link>
          )}
          <Link
            href="/search"
            className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="검색"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </Link>
          <NotificationDropdown />
          <span className="text-sm text-gray-500">{user?.nickname}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logout.mutate()}
            loading={logout.isPending}
          >
            로그아웃
          </Button>
        </nav>
      </div>
    </header>
  )
}
