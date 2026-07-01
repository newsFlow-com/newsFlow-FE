'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authApi } from '@/src/lib/api/auth'
import { useAuthStore } from '@/src/store/authStore'

export default function NaverCallbackPage() {
  const router = useRouter()
  const params = useSearchParams()
  const setAuth = useAuthStore((s) => s.setAuth)

  useEffect(() => {
    const code = params.get('code')
    const state = params.get('state')
    if (!code || !state) {
      router.replace('/login')
      return
    }

    authApi.naverLogin(code, state)
      .then((data) => {
        setAuth(data.user, data.accessToken, data.refreshToken)
        router.replace('/feed')
      })
      .catch(() => {
        router.replace('/login?error=naver')
      })
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-gray-500">네이버 로그인 처리 중…</p>
    </div>
  )
}
