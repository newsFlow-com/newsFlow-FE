'use client'

import Link from 'next/link'
import { useLogout } from '@/src/hooks/useAuth'
import { useAuthStore } from '@/src/store/authStore'
import Button from '@/src/components/ui/Button'

export default function Navbar() {
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/feed" className="text-xl font-bold text-blue-600">
          NewsFlow
        </Link>
        <nav className="flex items-center gap-4">
          {user?.role === 'ADMIN' && (
            <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900">
              관리자
            </Link>
          )}
          <span className="text-sm text-gray-500">{user?.nickname}</span>
          <Button variant="ghost" size="sm" onClick={() => logout.mutate()} loading={logout.isPending}>
            로그아웃
          </Button>
        </nav>
      </div>
    </header>
  )
}
