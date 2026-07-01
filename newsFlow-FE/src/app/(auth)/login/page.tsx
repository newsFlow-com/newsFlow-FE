'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/src/components/ui/Button'
import Input from '@/src/components/ui/Input'
import { useLogin } from '@/src/hooks/useAuth'

const schema = z.object({
  email: z.string().email('올바른 이메일을 입력하세요'),
  password: z.string().min(1, '비밀번호를 입력하세요'),
})

type FormData = z.infer<typeof schema>

const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID ?? ''
const NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID ?? ''

function getOrigin() {
  if (typeof window !== 'undefined') return window.location.origin
  return 'http://localhost:3000'
}

export default function LoginPage() {
  const login = useLogin()
  const searchParams = useSearchParams()
  const socialError = searchParams.get('error')
  const resetSuccess = searchParams.get('reset')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  function handleKakao() {
    if (!KAKAO_CLIENT_ID) {
      alert('카카오 로그인은 현재 준비 중입니다.')
      return
    }
    const redirectUri = `${getOrigin()}/auth/kakao/callback`
    const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}`
    window.location.href = url
  }

  function handleNaver() {
    if (!NAVER_CLIENT_ID) {
      alert('네이버 로그인은 현재 준비 중입니다.')
      return
    }
    const redirectUri = `${getOrigin()}/auth/naver/callback`
    const state = Math.random().toString(36).slice(2)
    const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`
    window.location.href = url
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">로그인</h1>

      {resetSuccess === 'success' && (
        <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          비밀번호가 변경되었습니다. 새 비밀번호로 로그인해 주세요.
        </p>
      )}
      {(socialError === 'kakao' || socialError === 'naver') && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          소셜 로그인에 실패했습니다. 다시 시도해 주세요.
        </p>
      )}

      <form onSubmit={handleSubmit((data) => login.mutate(data))} className="flex flex-col gap-4">
        <Input label="이메일" type="email" error={errors.email?.message} {...register('email')} />
        <Input label="비밀번호" type="password" error={errors.password?.message} {...register('password')} />
        {login.error && (
          <p className="text-sm text-red-500">이메일 또는 비밀번호가 올바르지 않습니다.</p>
        )}
        <Button type="submit" loading={login.isPending} className="mt-2">
          로그인
        </Button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs text-gray-400">
          <span className="bg-white px-2">또는 소셜 계정으로 로그인</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleKakao}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FEE500] px-4 py-2.5 text-sm font-medium text-[#3C1E1E] transition hover:brightness-95"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 1C4.582 1 1 3.91 1 7.5c0 2.326 1.548 4.369 3.9 5.527L4.2 16l3.46-2.28C7.876 13.898 8.433 13.95 9 13.95c4.418 0 8-2.91 8-6.45S13.418 1 9 1z" fill="#3C1E1E"/>
          </svg>
          카카오로 로그인
        </button>

        <button
          type="button"
          onClick={handleNaver}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#03C75A] px-4 py-2.5 text-sm font-medium text-white transition hover:brightness-95"
        >
          <span className="text-base font-bold leading-none">N</span>
          네이버로 로그인
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        계정이 없으신가요?{' '}
        <Link href="/signup" className="text-blue-600 hover:underline">
          회원가입
        </Link>
      </p>

      <p className="mt-2 text-center text-sm">
        <Link href="/forgot-password" className="text-gray-400 hover:text-gray-600 hover:underline">
          비밀번호를 잊으셨나요?
        </Link>
      </p>
    </div>
  )
}
