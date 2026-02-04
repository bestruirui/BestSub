import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/src/lib/api/client'
import type { Setting } from '@/src/types/setting'

const settingKeys = {
    all: ['settings'] as const,
    lists: () => [...settingKeys.all, 'list'] as const,
}

export function useSettings() {
    return useQuery({
        queryKey: settingKeys.lists(),
        queryFn: () => api.getSettings(),
        notifyOnChangeProps: ['data', 'error', 'isLoading'],
        refetchInterval: 5 * 60 * 1000,
    })
}

export function useUpdateSettings() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: Setting[]) => api.updateSettings(data),

        onSuccess: (_, data) => {
            queryClient.setQueryData<Setting[]>(
                settingKeys.lists(),
                (oldData) => {
                    if (!oldData) {
                        return data
                    }

                    const updated = [...oldData]

                    data.forEach((change) => {
                        const index = updated.findIndex((item) => item.key === change.key)

                        if (index >= 0) {
                            const target = updated[index]
                            if (target) {
                                updated[index] = {
                                    key: target.key,
                                    value: change.value,
                                }
                            }
                        } else {
                            updated.push({ key: change.key, value: change.value })
                        }
                    })

                    return updated
                }
            )

            queryClient.invalidateQueries({
                queryKey: settingKeys.lists(),
                refetchType: 'active'
            })
        },

        onError: () => {
            queryClient.invalidateQueries({ queryKey: settingKeys.lists() })
        },
    })
}