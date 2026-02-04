import { useForm } from 'react-hook-form'
import { useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { BasicInfoSection, ConfigSection, ProtocolFilterSection } from "./form-sections"
import { useCreateSub, useUpdateSub } from '@/src/lib/queries/sub-queries'
import type { SubRequest } from "@/src/types/sub"

interface SubFormProps {
    initialData?: SubRequest | undefined
    formTitle: string
    isOpen: boolean
    onClose: () => void
    editingSubId?: number | undefined
}

export function SubForm({
    initialData,
    formTitle,
    isOpen,
    onClose,
    editingSubId,
}: SubFormProps) {
    const createSubMutation = useCreateSub()
    const updateSubMutation = useUpdateSub()
    const isEditing = !!editingSubId

    const defaultData = useMemo((): SubRequest => ({
        name: '',
        tags: [],
        enable: true,
        cron_expr: '0 */6 * * *',
        config: {
            url: '',
            proxy: false,
            timeout: 10,
            protocol_filter_enable: false,
            protocol_filter_mode: false,
            protocol_filter: [],
        },
    }), [])

    const form = useForm<SubRequest>({
        defaultValues: initialData || defaultData
    })

    const { control, handleSubmit, reset } = form

    useEffect(() => {
        if (isOpen) {
            reset(initialData || defaultData)
        }
    }, [initialData, reset, defaultData, isOpen])

    const onSubmit = async (data: SubRequest) => {
        try {
            if (editingSubId) {
                await updateSubMutation.mutateAsync({ id: editingSubId, data })
                toast.success('订阅更新成功')
            } else {
                await createSubMutation.mutateAsync(data)
                toast.success('订阅创建成功')
            }

            onClose()
        } catch (error) {
            const errorMessage = editingSubId ? '更新订阅失败' : '创建订阅失败'
            toast.error(errorMessage)
            console.error('Failed to save subscription:', error)
        }
    }

    const isSubmitting = createSubMutation.isPending || updateSubMutation.isPending

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto scrollbar-hide">
                <DialogHeader>
                    <DialogTitle>{formTitle}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* 基础信息 */}
                    <BasicInfoSection control={control} />

                    {/* 配置设置 */}
                    <ConfigSection control={control} />

                    {/* 协议过滤 */}
                    <ProtocolFilterSection control={control} />

                    {/* 操作按钮 */}
                    <div className="flex gap-2 pt-4">
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? '提交中...' : (isEditing ? "更新" : "创建")}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            取消
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
