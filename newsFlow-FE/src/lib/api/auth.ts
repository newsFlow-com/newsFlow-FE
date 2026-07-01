import { apiClient } from './client'
import type { AuthTokens, LoginResponse, User } from '@/src/types'

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<LoginResponse>('/api/v1/auth/login', { email, password }).then((r) => r.data),

  checkEmail: (email: string) =>
    apiClient.get<{ available: boolean }>('/api/v1/auth/check-email', { params: { email } }).then((r) => r.data),

  checkNickname: (nickname: string) =>
    apiClient.get<{ available: boolean }>('/api/v1/auth/check-nickname', { params: { nickname } }).then((r) => r.data),

  kakaoLogin: (code: string) =>
    apiClient.post<import('@/src/types').LoginResponse>('/api/v1/auth/kakao', { code }).then((r) => r.data),

  naverLogin: (code: string, state: string) =>
    apiClient.post<import('@/src/types').LoginResponse>('/api/v1/auth/naver', { code, state }).then((r) => r.data),

  signup: (email: string, password: string, nickname: string) =>
    apiClient.post('/api/v1/auth/signup', { email, password, nickname }),

  logout: (refreshToken: string) =>
    apiClient.post('/api/v1/auth/logout', { refreshToken }),

  refresh: (refreshToken: string) =>
    apiClient.post<AuthTokens>('/api/v1/auth/refresh', { refreshToken }).then((r) => r.data),

  sendVerificationEmail: () =>
    apiClient.post('/api/v1/auth/email/send'),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.post('/api/v1/auth/password/change', { currentPassword, newPassword }),

  me: () =>
    apiClient.get<User>('/api/v1/users/me').then((r) => r.data),
}
