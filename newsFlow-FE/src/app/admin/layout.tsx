'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/src/store/authStore'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const accessToken = useAuthStore((s) => s.accessToken)

  useEffect(() => {
    if (!accessToken) {
      router.replace('/login')
    } else if (user && user.role !== 'ADMIN') {
      router.replace('/feed')
    }
  }, [accessToken, user, router])

  if (!accessToken || !user || user.role !== 'ADMIN') return null

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/admin" className="text-xl font-bold text-blue-600">
            NewsFlow Admin
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/admin/quality" className="text-gray-600 hover:text-gray-900">
              품질 관리
            </Link>
            <Link href="/feed" className="text-gray-500 hover:text-gray-900">
              사용자 화면
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
    </div>
  )
}
