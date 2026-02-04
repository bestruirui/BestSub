import { useForm } from 'react-hook-form'
import { useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import { useCheckTypes, useCreateCheck, useUpdateCheck } from '@/src/lib/queries/check-queries'
import {
    createDefaultCheckData,
    validateCheckForm
} from '../utils'
import { UI_TEXT } from '../constants'
import type { CheckRequest } from '@/src/types/check'

interface UseCheckFormProps {
    initialData?: CheckRequest | undefined
    editingCheckId?: number | undefined
    onSuccess?: () => void
    isOpen?: boolean
}

export function useCheckForm({
    initialData,
    editingCheckId,
    onSuccess,
    isOpen = true
}: UseCheckFormProps = {}) {
    const { data: checkTypeConfigs = {}, isLoading: isLoadingConfigs } = useCheckTypes()
    const createCheckMutation = useCreateCheck()
    const updateCheckMutation = useUpdateCheck()

    const defaultData = useMemo(() => createDefaultCheckData(), [])

    const form = useForm<CheckRequest>({
        defaultValues: initialData || defaultData
    })

    const { handleSubmit, reset, watch } = form

    useEffect(() => {
        if (isOpen) {
            reset(initialData || defaultData)
        }
    }, [initialData, reset, defaultData, isOpen])

    const onSubmit = async (data: CheckRequest) => {
        const validation = validateCheckForm(data)
        if (!validation.isValid) {
            validation.errors.forEach(error => toast.error(error))
            return
        }

        try {
            const submitData: CheckRequest = {
                ...data,
            }

            if (editingCheckId) {
                await updateCheckMutation.mutateAsync({ id: editingCheckId, data: submitData })
                toast.success(UI_TEXT.UPDATE_SUCCESS)
            } else {
                await createCheckMutation.mutateAsync(submitData)
                toast.success(UI_TEXT.CREATE_SUCCESS)
            }

            onSuccess?.()
        } catch (error) {
            const errorMessage = editingCheckId ? UI_TEXT.UPDATE_FAILED : UI_TEXT.CREATE_FAILED
            toast.error(errorMessage)
            console.error('Failed to save check:', error)
        }
    }

    return {
        form,
        onSubmit: handleSubmit(onSubmit),
        watch,
        isEditing: !!editingCheckId,
        checkTypeConfigs,
        isLoadingConfigs,
    }
}
