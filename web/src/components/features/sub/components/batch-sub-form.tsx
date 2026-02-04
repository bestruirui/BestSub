import { useState } from 'react'
import { useForm, Control } from 'react-hook-form'
import { Button } from '@/src/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog'
import { Textarea } from '@/src/components/ui/textarea'
import { Label } from '@/src/components/ui/label'
import { toast } from 'sonner'
import { ConfigSection } from './form-sections'
import { useBatchCreateSub } from '@/src/lib/queries/sub-queries'
import { generateNameFromUrl } from '../utils'
import type { SubRequest } from '@/src/types/sub'

interface BatchSubFormProps {
    isOpen: boolean
    onClose: () => void
}

interface BatchFormData extends SubRequest {
    urls: string
}

export function BatchSubForm({ isOpen, onClose }: BatchSubFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const batchCreateMutation = useBatchCreateSub()

    const form = useForm<BatchFormData>({
        defaultValues: {
            urls: '',
            name: '',
            tags: [],
            enable: true,
            cron_expr: '0 */1 * * *',
            config: {
                url: '',
                proxy: false,
                timeout: 10,
            },
        }
    })

    const { control, handleSubmit, reset } = form

    const onSubmit = async (data: BatchFormData) => {
        setIsSubmitting(true)

        try {
            const urls = data.urls
                .split('\n')
                .map(url => url.trim())
                .filter(url => url && /^https?:\/\/.+/.test(url))

            if (urls.length === 0) {
                toast.error('请输入至少一个有效的订阅链接')
                return
            }

            const subscriptions: SubRequest[] = urls.map(url => ({
                name: generateNameFromUrl(url) || '未知订阅',
                tags: data.tags || [],
                enable: data.enable,
                cron_expr: data.cron_expr,
                config: {
                    url,
                    proxy: data.config.proxy || false,
                    timeout: data.config.timeout || 10,
                },
            }))

            const results = await batchCreateMutation.mutateAsync(subscriptions)

            const successCount = results.length

            if (successCount > 0) {
                toast.success(`成功添加 ${successCount} 个订阅`)
                reset()
                onClose()
            }

        } catch (error) {
            toast.error('批量添加失败')
            console.error('Failed to batch create subscriptions:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto scrollbar-hide">
                <DialogHeader>
                    <DialogTitle>批量添加订阅</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="urls" className="mb-2 block">
                            订阅链接
                        </Label>
                        <Textarea
                            id="urls"
                            placeholder={`https://example.com/subscription1
https://example.com/subscription2
https://example.com/subscription3`}
                            className="min-h-[120px] resize-none"
                            {...form.register('urls', {
                                required: '请输入至少一个订阅链接'
                            })}
                        />
                        <p className="text-xs text-muted-foreground">
                            每行输入一个订阅链接，系统会自动为每个链接生成名称
                        </p>
                    </div>

                    <div className="space-y-4">
                        <ConfigSection control={control as unknown as Control<SubRequest>} />
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? '添加中...' : '批量添加'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
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
