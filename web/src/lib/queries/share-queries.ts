import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/src/lib/api/client'
import type { ShareResponse, ShareRequest } from '@/src/types'

const shareKeys = {
    all: ['shares'] as const,
    lists: () => [...shareKeys.all, 'list'] as const,
    details: () => [...shareKeys.all, 'detail'] as const,
    detail: (id: number) => [...shareKeys.details(), id] as const,
}

export function useShares() {
    return useQuery({
        queryKey: shareKeys.lists(),
        queryFn: () => api.getShares(),
        notifyOnChangeProps: ['data', 'error', 'isLoading'],
        refetchInterval: 5 * 60 * 1000,
    })
}

export function useCreateShare() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: ShareRequest) => api.createShare(data),

        onSuccess: (newShare) => {
            queryClient.setQueryData<ShareResponse[]>(
                shareKeys.lists(),
                (oldData) => oldData ? [...oldData, newShare] : [newShare]
            )

            queryClient.setQueryData(shareKeys.detail(newShare.id), newShare)

            queryClient.invalidateQueries({
                queryKey: shareKeys.lists(),
                refetchType: 'active'
            })
        },

        onError: () => {
            queryClient.invalidateQueries({ queryKey: shareKeys.lists() })
        },
    })
}

export function useUpdateShare() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: ShareRequest }) =>
            api.updateShare(id, data),

        onSuccess: (updatedShare, { id }) => {
            queryClient.setQueryData<ShareResponse[]>(
                shareKeys.lists(),
                (oldData) => oldData?.map(share =>
                    share.id === id ? updatedShare : share
                )
            )

            queryClient.setQueryData(shareKeys.detail(id), updatedShare)

            queryClient.invalidateQueries({
                queryKey: shareKeys.detail(id),
                refetchType: 'active'
            })
        },

        onError: () => {
            queryClient.invalidateQueries({ queryKey: shareKeys.lists() })
        },
    })
}

export function useDeleteShare() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => api.deleteShare(id),

        onSuccess: (_, id) => {
            queryClient.setQueryData<ShareResponse[]>(
                shareKeys.lists(),
                (oldData) => oldData?.filter(share => share.id !== id)
            )

            queryClient.removeQueries({ queryKey: shareKeys.detail(id) })

            queryClient.invalidateQueries({
                queryKey: shareKeys.lists(),
                refetchType: 'active'
            })
        },

        onError: () => {
            queryClient.invalidateQueries({ queryKey: shareKeys.lists() })
        },
    })
} 