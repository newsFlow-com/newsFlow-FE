'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/src/components/ui/Button'
import Input from '@/src/components/ui/Input'
import Badge from '@/src/components/ui/Badge'
import Spinner from '@/src/components/ui/Spinner'
import { useChangePassword, useSendVerificationEmail } from '@/src/hooks/useAuth'
import { useCategories, useMyCategories, useUpdateMyCategories } from '@/src/hooks/useCategories'

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, '현재 비밀번호를 입력하세요'),
    newPassword: z.string().min(8, '새 비밀번호는 8자 이상이어야 합니다'),
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력하세요'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: '새 비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  })

type PasswordForm = z.infer<typeof passwordSchema>

export default function SettingsPage() {
  const changePassword = useChangePassword()
  const sendEmail = useSendVerificationEmail()
  const { data: allCategories, isLoading: catLoading } = useCategories()
  const { data: myCategories } = useMyCategories()
  const updateCategories = useUpdateMyCategories()

  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  useEffect(() => {
    if (myCategories) setSelectedIds(myCategories.map((c) => c.id))
  }, [myCategories])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) })

  function onPasswordSubmit(data: PasswordForm) {
    changePassword.mutate(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      {
        onSuccess: () => {
          setPasswordSuccess(true)
          reset()
        },
      }
    )
  }

  function toggleCategory(id: number) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  function saveCategories() {
    updateCategories.mutate(selectedIds)
  }

  return (
    <div className="max-w-lg space-y-10">
      <h1 className="text-xl font-bold text-gray-900">설정</h1>

      {/* 비밀번호 변경 */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-gray-800">비밀번호 변경</h2>
        <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-3">
          <Input
            label="현재 비밀번호"
            type="password"
            error={errors.currentPassword?.message}
            {...register('currentPassword')}
          />
          <Input
            label="새 비밀번호"
            type="password"
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />
          <Input
            label="새 비밀번호 확인"
            type="password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          {changePassword.error && (
            <p className="text-sm text-red-500">현재 비밀번호가 올바르지 않습니다.</p>
          )}
          {passwordSuccess && (
            <p className="text-sm text-green-600">비밀번호가 변경되었습니다.</p>
          )}
          <Button type="submit" loading={changePassword.isPending}>
            변경
          </Button>
        </form>
      </section>

      {/* 이메일 인증 */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-800">이메일 인증</h2>
        <Button
          variant="secondary"
          onClick={() => sendEmail.mutate()}
          loading={sendEmail.isPending}
        >
          인증 메일 재발송
        </Button>
        {sendEmail.isSuccess && (
          <p className="text-sm text-green-600">인증 메일을 발송했습니다.</p>
        )}
      </section>

      {/* 관심 카테고리 */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-gray-800">관심 카테고리</h2>
        {catLoading ? (
          <Spinner />
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {allCategories?.map((cat) => {
                const selected = selectedIds.includes(cat.id)
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                      selected
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                    }`}
                  >
                    {cat.name}
                  </button>
                )
              })}
            </div>
            <Button onClick={saveCategories} loading={updateCategories.isPending}>
              저장
            </Button>
            {updateCategories.isSuccess && (
              <p className="text-sm text-green-600">관심 카테고리가 저장되었습니다.</p>
            )}
          </>
        )}
      </section>
    </div>
  )
}
