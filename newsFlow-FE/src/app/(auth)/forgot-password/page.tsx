'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/src/components/ui/Button'
import Input from '@/src/components/ui/Input'
import { useRequestPasswordReset } from '@/src/hooks/useAuth'

const schema = z.object({
  email: z.string().email('올바른 이메일을 입력하세요'),
})
type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const request = useRequestPasswordReset()
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  function onSubmit(data: FormData) {
    request.mutate(data.email, {
      onSuccess: () => setSubmitted(true),
    })
  }

  if (submitted) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm text-center">
        <div className="mb-4 text-4xl">📬</div>
        <h1 className="mb-2 text-xl font-bold text-gray-900">이메일을 확인해 주세요</h1>
        <p className="mb-6 text-sm text-gray-500 leading-relaxed">
          입력하신 이메일로 비밀번호 재설정 링크를 보냈습니다.
          <br />
          링크는 <span className="font-medium text-gray-700">30분</span> 동안 유효합니다.
        </p>
        <Link href="/login" className="text-sm text-blue-600 hover:underline">
          로그인으로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">비밀번호 찾기</h1>
      <p className="mb-6 text-sm text-gray-500">
        가입 시 사용한 이메일을 입력하시면 재설정 링크를 보내드립니다.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="이메일"
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />
        {request.isError && (
          <p className="text-sm text-red-500">요청 중 오류가 발생했습니다. 다시 시도해 주세요.</p>
        )}
        <Button type="submit" loading={request.isPending} className="mt-2">
          재설정 링크 보내기
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-500">
        <Link href="/login" className="text-blue-600 hover:underline">
          로그인으로 돌아가기
        </Link>
      </p>
    </div>
  )
}
