import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/src/lib/api/client'
import type { SubResponse, SubRequest } from '@/src/types'

const subKeys = {
    all: ['subs'] as const,
    lists: () => [...subKeys.all, 'list'] as const,
    details: () => [...subKeys.all, 'detail'] as const,
    detail: (id: number) => [...subKeys.details(), id] as const,
}

export function useSubs() {
    return useQuery({
        queryKey: subKeys.lists(),
        queryFn: () => api.getSub(),
        refetchInterval: 60 * 1000,
        notifyOnChangeProps: ['data', 'error', 'isLoading'],
    })
}

export function useCreateSub() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: SubRequest) => api.createSubscription(data),

        onSuccess: (newSub) => {
            queryClient.setQueryData<SubResponse[]>(
                subKeys.lists(),
                (oldData) => oldData ? [...oldData, newSub] : [newSub]
            )

            queryClient.setQueryData(subKeys.detail(newSub.id), newSub)

            queryClient.invalidateQueries({
                queryKey: subKeys.lists(),
                refetchType: 'active'
            })
        },

        onError: () => {
            queryClient.invalidateQueries({ queryKey: subKeys.lists() })
        },
    })
}

export function useUpdateSub() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: SubRequest }) =>
            api.updateSubscription(id, data),

        onSuccess: (updatedSub, { id }) => {
            queryClient.setQueryData<SubResponse[]>(
                subKeys.lists(),
                (oldData) => oldData?.map(sub =>
                    sub.id === id ? updatedSub : sub
                )
            )

            queryClient.setQueryData(subKeys.detail(id), updatedSub)

            queryClient.invalidateQueries({
                queryKey: subKeys.detail(id),
                refetchType: 'active'
            })
        },

        onError: () => {
            queryClient.invalidateQueries({ queryKey: subKeys.lists() })
        },
    })
}

export function useDeleteSub() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => api.deleteSubscription(id),

        onSuccess: (_, id) => {
            queryClient.setQueryData<SubResponse[]>(
                subKeys.lists(),
                (oldData) => oldData?.filter(sub => sub.id !== id)
            )

            queryClient.removeQueries({ queryKey: subKeys.detail(id) })

            queryClient.invalidateQueries({
                queryKey: subKeys.lists(),
                refetchType: 'active'
            })
        },

        onError: () => {
            queryClient.invalidateQueries({ queryKey: subKeys.lists() })
        },
    })
}

export function useRefreshSub() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => api.refreshSubscription(id),

        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: subKeys.lists(),
                refetchType: 'active'
            })

            queryClient.invalidateQueries({
                queryKey: subKeys.detail(id),
                refetchType: 'active'
            })
        },

        onError: () => {
            queryClient.invalidateQueries({ queryKey: subKeys.lists() })
        },
    })
}

export function useBatchCreateSub() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (subscriptions: SubRequest[]) => api.batchCreateSubscriptions(subscriptions),

        onSuccess: (results) => {
            if (results.length > 0) {
                queryClient.setQueryData<SubResponse[]>(
                    subKeys.lists(),
                    (oldData) => oldData ? [...oldData, ...results] : results
                )

                results.forEach(sub => {
                    queryClient.setQueryData(subKeys.detail(sub.id), sub)
                })

                queryClient.invalidateQueries({
                    queryKey: subKeys.lists(),
                    refetchType: 'active'
                })
            }
        },

        onError: () => {
            queryClient.invalidateQueries({ queryKey: subKeys.lists() })
        },
    })
} 