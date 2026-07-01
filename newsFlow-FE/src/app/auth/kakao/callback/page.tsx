'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authApi } from '@/src/lib/api/auth'
import { useAuthStore } from '@/src/store/authStore'

export default function KakaoCallbackPage() {
  const router = useRouter()
  const params = useSearchParams()
  const setAuth = useAuthStore((s) => s.setAuth)

  useEffect(() => {
    const code = params.get('code')
    if (!code) {
      router.replace('/login')
      return
    }

    authApi.kakaoLogin(code)
      .then((data) => {
        setAuth(data.user, data.accessToken, data.refreshToken)
        router.replace('/feed')
      })
      .catch(() => {
        router.replace('/login?error=kakao')
      })
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-gray-500">카카오 로그인 처리 중…</p>
    </div>
  )
}
