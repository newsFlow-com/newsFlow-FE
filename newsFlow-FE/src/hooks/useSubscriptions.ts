'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { subscriptionsApi } from '@/src/lib/api/subscriptions'

export function useSubscriptions() {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: subscriptionsApi.list,
  })
}

export function useAddSubscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ type, value }: { type: 'keyword' | 'category'; value: string }) =>
      subscriptionsApi.add(type, value),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subscriptions'] }),
  })
}

export function useRemoveSubscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => subscriptionsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subscriptions'] }),
  })
}
