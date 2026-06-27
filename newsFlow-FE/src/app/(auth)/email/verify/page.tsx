'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { apiClient } from '@/src/lib/api/client'

export default function EmailVerifyPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending')

  useEffect(() => {
    if (!token) { setStatus('error'); return }
    apiClient
      .get(`/api/v1/auth/email/verify?token=${token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm text-center">
      {status === 'pending' && <p className="text-gray-500">인증 중...</p>}
      {status === 'success' && (
        <>
          <p className="mb-4 text-lg font-semibold text-green-600">이메일 인증이 완료되었습니다.</p>
          <Link href="/login" className="text-blue-600 hover:underline">
            로그인하러 가기
          </Link>
        </>
      )}
      {status === 'error' && (
        <p className="text-red-500">인증 링크가 유효하지 않거나 만료되었습니다.</p>
      )}
    </div>
  )
}
