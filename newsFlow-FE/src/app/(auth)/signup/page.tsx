'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import Button from '@/src/components/ui/Button'
import Input from '@/src/components/ui/Input'
import { useSignup } from '@/src/hooks/useAuth'
import { authApi } from '@/src/lib/api/auth'

const schema = z.object({
  email: z.string().email('올바른 이메일을 입력하세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
  nickname: z.string().min(2, '닉네임은 2자 이상이어야 합니다'),
})

type FormData = z.infer<typeof schema>
type CheckStatus = 'idle' | 'available' | 'taken'

const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID ?? ''
const KAKAO_REDIRECT_URI = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/auth/kakao/callback`
const NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID ?? ''
const NAVER_REDIRECT_URI = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/auth/naver/callback`

function SocialDivider() {
  return (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200" />
      </div>
      <div className="relative flex justify-center text-xs text-gray-400">
        <span className="bg-white px-2">또는 소셜 계정으로 가입</span>
      </div>
    </div>
  )
}

export default function SignupPage() {
  const signup = useSignup()
  const [emailStatus, setEmailStatus] = useState<CheckStatus>('idle')
  const [nicknameStatus, setNicknameStatus] = useState<CheckStatus>('idle')

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const checkEmail = useMutation({
    mutationFn: () => authApi.checkEmail(getValues('email')),
    onSuccess: (data) => setEmailStatus(data.available ? 'available' : 'taken'),
  })

  const checkNickname = useMutation({
    mutationFn: () => authApi.checkNickname(getValues('nickname')),
    onSuccess: (data) => setNicknameStatus(data.available ? 'available' : 'taken'),
  })

  async function handleCheckEmail() {
    const valid = await trigger('email')
    if (!valid) return
    checkEmail.mutate()
  }

  async function handleCheckNickname() {
    const valid = await trigger('nickname')
    if (!valid) return
    checkNickname.mutate()
  }

  function onSubmit(data: FormData) {
    if (emailStatus !== 'available') return
    if (nicknameStatus !== 'available') return
    signup.mutate(data)
  }

  function handleKakao() {
    if (!KAKAO_CLIENT_ID) {
      alert('카카오 로그인은 현재 준비 중입니다.')
      return
    }
    const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URI)}`
    window.location.href = url
  }

  function handleNaver() {
    if (!NAVER_CLIENT_ID) {
      alert('네이버 로그인은 현재 준비 중입니다.')
      return
    }
    const state = Math.random().toString(36).slice(2)
    const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${encodeURIComponent(NAVER_REDIRECT_URI)}&state=${state}`
    window.location.href = url
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">회원가입</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* 이메일 + 중복 확인 */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">이메일</label>
          <div className="flex gap-2">
            <Input
              type="email"
              error={errors.email?.message}
              className="flex-1"
              {...register('email', { onChange: () => setEmailStatus('idle') })}
            />
            <button
              type="button"
              onClick={handleCheckEmail}
              disabled={checkEmail.isPending}
              className="shrink-0 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {checkEmail.isPending ? '확인 중…' : '중복 확인'}
            </button>
          </div>
          {emailStatus === 'available' && <p className="text-xs text-green-600">사용 가능한 이메일입니다.</p>}
          {emailStatus === 'taken' && <p className="text-xs text-red-500">이미 사용 중인 이메일입니다.</p>}
          {checkEmail.isError && <p className="text-xs text-red-500">확인 중 오류가 발생했습니다.</p>}
        </div>

        {/* 닉네임 + 중복 확인 */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">닉네임</label>
          <div className="flex gap-2">
            <Input
              error={errors.nickname?.message}
              className="flex-1"
              {...register('nickname', { onChange: () => setNicknameStatus('idle') })}
            />
            <button
              type="button"
              onClick={handleCheckNickname}
              disabled={checkNickname.isPending}
              className="shrink-0 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {checkNickname.isPending ? '확인 중…' : '중복 확인'}
            </button>
          </div>
          {nicknameStatus === 'available' && <p className="text-xs text-green-600">사용 가능한 닉네임입니다.</p>}
          {nicknameStatus === 'taken' && <p className="text-xs text-red-500">이미 사용 중인 닉네임입니다.</p>}
          {checkNickname.isError && <p className="text-xs text-red-500">확인 중 오류가 발생했습니다.</p>}
        </div>

        <Input label="비밀번호" type="password" error={errors.password?.message} {...register('password')} />

        {signup.error && (
          <p className="text-sm text-red-500">회원가입에 실패했습니다. 다시 시도해 주세요.</p>
        )}

        <Button
          type="submit"
          loading={signup.isPending}
          disabled={emailStatus !== 'available' || nicknameStatus !== 'available'}
          className="mt-2"
        >
          가입하기
        </Button>
      </form>

      <SocialDivider />

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleKakao}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FEE500] px-4 py-2.5 text-sm font-medium text-[#3C1E1E] transition hover:brightness-95"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 1C4.582 1 1 3.91 1 7.5c0 2.326 1.548 4.369 3.9 5.527L4.2 16l3.46-2.28C7.876 13.898 8.433 13.95 9 13.95c4.418 0 8-2.91 8-6.45S13.418 1 9 1z" fill="#3C1E1E"/>
          </svg>
          카카오로 시작하기
        </button>

        <button
          type="button"
          onClick={handleNaver}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#03C75A] px-4 py-2.5 text-sm font-medium text-white transition hover:brightness-95"
        >
          <span className="text-base font-bold leading-none">N</span>
          네이버로 시작하기
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        이미 계정이 있으신가요?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          로그인
        </Link>
      </p>
    </div>
  )
}
