import { toast } from 'sonner'
import { useAlert } from '@/src/components/providers'
import { useDeleteShare } from '@/src/lib/queries/share-queries'
import { copyToClipboard, buildShareUrl } from '../utils'
import { UI_TEXT } from '../constants'

export function useShareOperations() {
    const { confirm } = useAlert()
    const deleteShareMutation = useDeleteShare()

    const handleDelete = async (id: number, name: string) => {
        const confirmed = await confirm({
            title: UI_TEXT.CONFIRM_DELETE,
            description: UI_TEXT.DELETE_CONFIRM_MESSAGE.replace('{name}', name),
            confirmText: UI_TEXT.DELETE,
            cancelText: UI_TEXT.CANCEL,
            variant: 'destructive'
        })

        if (confirmed) {
            try {
                await deleteShareMutation.mutateAsync(id)
                toast.success(UI_TEXT.DELETE_SUCCESS)
            } catch (error) {
                toast.error(UI_TEXT.DELETE_FAILED)
                console.error('Failed to delete share:', error)
            }
        }
    }

    const handleCopy = async (token: string, onFallback?: (url: string) => void) => {
        const fullUrl = buildShareUrl(token)

        const success = await copyToClipboard(fullUrl)

        if (success) {
            toast.success(UI_TEXT.COPY_SUCCESS)
        } else {
            if (onFallback) {
                onFallback(fullUrl)
            } else {
                toast.error(UI_TEXT.COPY_FAILED)
            }
        }
    }

    return {
        handleDelete,
        handleCopy,
        isDeleting: deleteShareMutation.isPending,
    }
}