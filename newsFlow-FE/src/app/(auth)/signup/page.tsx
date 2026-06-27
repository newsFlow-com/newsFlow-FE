'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/src/components/ui/Button'
import Input from '@/src/components/ui/Input'
import { useSignup } from '@/src/hooks/useAuth'

const schema = z.object({
  email: z.string().email('올바른 이메일을 입력하세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
  nickname: z.string().min(2, '닉네임은 2자 이상이어야 합니다'),
})

type FormData = z.infer<typeof schema>

export default function SignupPage() {
  const signup = useSignup()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">회원가입</h1>
      <form onSubmit={handleSubmit((data) => signup.mutate(data))} className="flex flex-col gap-4">
        <Input label="이메일" type="email" error={errors.email?.message} {...register('email')} />
        <Input label="닉네임" error={errors.nickname?.message} {...register('nickname')} />
        <Input label="비밀번호" type="password" error={errors.password?.message} {...register('password')} />
        {signup.error && (
          <p className="text-sm text-red-500">회원가입에 실패했습니다. 다시 시도해 주세요.</p>
        )}
        <Button type="submit" loading={signup.isPending} className="mt-2">
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
