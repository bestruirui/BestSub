import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/src/lib/api/client'
import type { CheckResponse, CheckRequest } from '@/src/types'

const checkKeys = {
    all: ['checks'] as const,
    lists: () => [...checkKeys.all, 'list'] as const,
    types: () => [...checkKeys.all, 'types'] as const,
    details: () => [...checkKeys.all, 'detail'] as const,
    detail: (id: number) => [...checkKeys.details(), id] as const,
}

export function useChecks(id?: number) {
    return useQuery({
        queryKey: id ? checkKeys.detail(id) : checkKeys.lists(),
        queryFn: () => api.getChecks(id),
        notifyOnChangeProps: ['data', 'error', 'isLoading'],
        refetchInterval: 60 * 1000,
    })
}

export function useCheckTypes() {
    return useQuery({
        queryKey: checkKeys.types(),
        queryFn: () => api.getCheckTypes(),
        refetchInterval: 10 * 60 * 1000,
        notifyOnChangeProps: ['data', 'error', 'isLoading'],
    })
}

export function useCreateCheck() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CheckRequest) => api.createCheck(data),

        onSuccess: (newCheck) => {
            queryClient.setQueryData<CheckResponse[]>(
                checkKeys.lists(),
                (oldData) => oldData ? [...oldData, newCheck] : [newCheck]
            )

            queryClient.setQueryData(checkKeys.detail(newCheck.id), newCheck)

            queryClient.invalidateQueries({
                queryKey: checkKeys.lists(),
                refetchType: 'active'
            })
        },

        onError: () => {
            queryClient.invalidateQueries({ queryKey: checkKeys.lists() })
        },
    })
}

export function useUpdateCheck() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: CheckRequest }) =>
            api.updateCheck(id, data),

        onSuccess: (updatedCheck, { id }) => {
            queryClient.setQueryData<CheckResponse[]>(
                checkKeys.lists(),
                (oldData) => oldData?.map(check =>
                    check.id === id ? updatedCheck : check
                )
            )

            queryClient.setQueryData(checkKeys.detail(id), updatedCheck)

            queryClient.invalidateQueries({
                queryKey: checkKeys.detail(id),
                refetchType: 'active'
            })
        },

        onError: () => {
            queryClient.invalidateQueries({ queryKey: checkKeys.lists() })
        },
    })
}

export function useDeleteCheck() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => api.deleteCheck(id),

        onSuccess: (_, id) => {
            queryClient.setQueryData<CheckResponse[]>(
                checkKeys.lists(),
                (oldData) => oldData?.filter(check => check.id !== id)
            )

            queryClient.removeQueries({ queryKey: checkKeys.detail(id) })

            queryClient.invalidateQueries({
                queryKey: checkKeys.lists(),
                refetchType: 'active'
            })
        },

        onError: () => {
            queryClient.invalidateQueries({ queryKey: checkKeys.lists() })
        },
    })
} 