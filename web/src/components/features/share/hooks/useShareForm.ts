import { useForm } from 'react-hook-form'
import { useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import { useCreateShare, useUpdateShare } from '@/src/lib/queries/share-queries'
import { generateToken, createDefaultShareData } from '../utils'
import { UI_TEXT } from '../constants'
import type { ShareRequest } from '@/src/types'

interface UseShareFormProps {
    initialData?: ShareRequest | undefined
    editingShareId?: number | undefined
    onSuccess?: () => void
    isOpen?: boolean
}

export function useShareForm({
    initialData,
    editingShareId,
    onSuccess,
    isOpen = true
}: UseShareFormProps = {}) {
    const createShareMutation = useCreateShare()
    const updateShareMutation = useUpdateShare()

    const defaultData = useMemo(() => createDefaultShareData(), [])

    const form = useForm<ShareRequest>({
        defaultValues: initialData || defaultData
    })

    const { handleSubmit, reset, watch } = form

    useEffect(() => {
        if (isOpen) {
            reset(initialData || defaultData)
        }
    }, [initialData, reset, defaultData, isOpen])

    const onSubmit = async (data: ShareRequest) => {
        try {
            const token = data.token || generateToken()
            const submitData: ShareRequest = {
                ...data,
                token,
            }

            if (editingShareId) {
                await updateShareMutation.mutateAsync({ id: editingShareId, data: submitData })
                toast.success(UI_TEXT.UPDATE_SUCCESS)
            } else {
                await createShareMutation.mutateAsync(submitData)
                toast.success(UI_TEXT.CREATE_SUCCESS)
            }

            onSuccess?.()
        } catch (error) {
            const errorMessage = editingShareId ? UI_TEXT.UPDATE_FAILED : UI_TEXT.CREATE_FAILED
            toast.error(errorMessage)
            console.error('Failed to save share:', error)
        }
    }

    const isLoading = editingShareId
        ? updateShareMutation.isPending
        : createShareMutation.isPending

    return {
        form,
        onSubmit: handleSubmit(onSubmit),
        watch,
        isEditing: !!editingShareId,
        isLoading,
    }
}
