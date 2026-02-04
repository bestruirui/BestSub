import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { useAlert } from '@/src/components/providers'
import { api } from '@/src/lib/api/client'
import type { NotifyRequest } from '@/src/types'

export function useNotifyOperations() {
    const { confirm } = useAlert()
    const [testingId, setTestingId] = useState<number | null>(null)
    const [deletingId, setDeletingId] = useState<number | null>(null)

    const handleTest = useCallback(async (notify: NotifyRequest, id?: number) => {
        try {
            setTestingId(id || 0)
            await api.testNotify(notify)
            toast.success('通知测试成功')
        } catch (error) {
            console.error('Failed to test notify:', error)
            toast.error('通知测试失败')
        } finally {
            setTestingId(null)
        }
    }, [])

    const handleDelete = useCallback(async (id: number, name: string) => {
        const confirmed = await confirm({
            title: '删除通知',
            description: `确定要删除通知配置 "${name}" 吗？`,
            confirmText: '删除',
            cancelText: '取消',
            variant: 'destructive'
        })

        if (confirmed) {
            try {
                setDeletingId(id)
                await api.deleteNotify(id)
                toast.success('删除成功')
            } catch (error) {
                console.error('Failed to delete notify:', error)
                toast.error('删除失败')
            } finally {
                setDeletingId(null)
            }
        }
    }, [confirm])

    return {
        deletingId,
        testingId,
        handleDelete,
        handleTest
    }
} 