'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/src/components/ui/Button'
import Input from '@/src/components/ui/Input'
import { useConfirmPasswordReset } from '@/src/hooks/useAuth'

const schema = z
  .object({
    newPassword: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const confirm = useConfirmPasswordReset()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  if (!token) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm text-center">
        <p className="mb-4 text-sm text-gray-600">유효하지 않은 링크입니다.</p>
        <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
          비밀번호 찾기로 돌아가기
        </Link>
      </div>
    )
  }

  function onSubmit(data: FormData) {
    confirm.mutate({ token, newPassword: data.newPassword })
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">새 비밀번호 설정</h1>
      <p className="mb-6 text-sm text-gray-500">새로 사용할 비밀번호를 입력해 주세요.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="새 비밀번호"
          type="password"
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />
        <Input
          label="비밀번호 확인"
          type="password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        {confirm.isError && (
          <p className="text-sm text-red-500">
            링크가 만료되었거나 유효하지 않습니다.{' '}
            <Link href="/forgot-password" className="underline">
              다시 요청하기
            </Link>
          </p>
        )}
        <Button type="submit" loading={confirm.isPending} className="mt-2">
          비밀번호 변경
        </Button>
      </form>
    </div>
  )
}
