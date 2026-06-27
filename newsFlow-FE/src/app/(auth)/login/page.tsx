'use client'

import Link from 'next/link'
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

export default function LoginPage() {
  const login = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">로그인</h1>
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
      <p className="mt-4 text-center text-sm text-gray-500">
        계정이 없으신가요?{' '}
        <Link href="/signup" className="text-blue-600 hover:underline">
          회원가입
        </Link>
      </p>
    </div>
  )
}
