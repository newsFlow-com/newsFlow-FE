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
type EmailStatus = 'idle' | 'available' | 'taken'

export default function SignupPage() {
  const signup = useSignup()
  const [emailStatus, setEmailStatus] = useState<EmailStatus>('idle')

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const checkEmail = useMutation({
    mutationFn: () => authApi.checkEmail(getValues('email')),
    onSuccess: (data) => setEmailStatus(data.available ? 'available' : 'taken'),
  })

  function onSubmit(data: FormData) {
    if (emailStatus !== 'available') return
    signup.mutate(data)
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">회원가입</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

        {/* 이메일 + 중복 확인 버튼 */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">이메일</label>
          <div className="flex gap-2">
            <Input
              type="email"
              error={errors.email?.message}
              className="flex-1"
              {...register('email', {
                onChange: () => setEmailStatus('idle'),
              })}
            />
            <button
              type="button"
              onClick={() => checkEmail.mutate()}
              disabled={checkEmail.isPending}
              className="shrink-0 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {checkEmail.isPending ? '확인 중…' : '중복 확인'}
            </button>
          </div>
          {emailStatus === 'available' && (
            <p className="text-xs text-green-600">사용 가능한 이메일입니다.</p>
          )}
          {emailStatus === 'taken' && (
            <p className="text-xs text-red-500">이미 사용 중인 이메일입니다.</p>
          )}
          {checkEmail.isError && (
            <p className="text-xs text-red-500">확인 중 오류가 발생했습니다.</p>
          )}
        </div>

        <Input label="닉네임" error={errors.nickname?.message} {...register('nickname')} />
        <Input label="비밀번호" type="password" error={errors.password?.message} {...register('password')} />

        {signup.error && (
          <p className="text-sm text-red-500">회원가입에 실패했습니다. 다시 시도해 주세요.</p>
        )}

        <Button
          type="submit"
          loading={signup.isPending}
          disabled={emailStatus !== 'available'}
          className="mt-2"
        >
          가입하기
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-500">
        이미 계정이 있으신가요?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          로그인
        </Link>
      </p>
    </div>
  )
}
