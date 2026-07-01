'use client'

import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import { authApi } from '@/src/lib/api/auth'
import { useAuthStore } from '@/src/store/authStore'

export function useMe() {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: ['me'],
    queryFn: authApi.me,
    enabled: !!useAuthStore.getState().accessToken,
    initialData: user ?? undefined,
  })
}

export function useLogin() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken)
      router.push('/feed')
    },
  })
}

export function useSignup() {
  const router = useRouter()

  return useMutation({
    mutationFn: ({ email, password, nickname }: { email: string; password: string; nickname: string }) =>
      authApi.signup(email, password, nickname),
    onSuccess: () => router.push('/login'),
  })
}

export function useLogout() {
  const router = useRouter()
  const { refreshToken, clearAuth } = useAuthStore()

  return useMutation({
    mutationFn: () => authApi.logout(refreshToken ?? ''),
    onSettled: () => {
      clearAuth()
      router.push('/login')
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(currentPassword, newPassword),
  })
}

export function useSendVerificationEmail() {
  return useMutation({ mutationFn: authApi.sendVerificationEmail })
}

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (email: string) => authApi.requestPasswordReset(email),
  })
}

export function useConfirmPasswordReset() {
  const router = useRouter()
  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      authApi.confirmPasswordReset(token, newPassword),
    onSuccess: () => router.push('/login?reset=success'),
  })
}
