import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { useShareForm } from "../hooks"
import { UI_TEXT } from "../constants"
import {
    BasicInfoSection,
    ConfigSection,
    FilterSection,
    AliveStatusSection,
    CountrySection
} from "./form-sections"
import { SubscriptionSection } from "@/src/components/shared/subscription-section"
import type { ShareRequest } from "@/src/types"

interface ShareFormProps {
    initialData?: ShareRequest
    formTitle: string
    isOpen: boolean
    onClose: () => void
    editingShareId?: number | undefined
}

export function ShareForm({
    initialData,
    formTitle,
    isOpen,
    onClose,
    editingShareId,
}: ShareFormProps) {
    const { form, onSubmit, isEditing, isLoading } = useShareForm({
        initialData,
        editingShareId,
        onSuccess: onClose,
        isOpen,
    })

    const { control } = form

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="max-w-2xl max-h-[80vh] overflow-y-auto scrollbar-hide"
                aria-describedby={undefined}
            >
                <DialogHeader>
                    <DialogTitle>{formTitle}</DialogTitle>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6">
                    {/* 基础信息 */}
                    <BasicInfoSection control={control} />

                    {/* 配置设置 */}
                    <ConfigSection control={control} />

                    {/* 订阅选择 */}
                    <SubscriptionSection
                        control={control}
                        subIdField="gen.filter.sub_id"
                        subIdExcludeField="gen.filter.sub_id_exclude"
                    />

                    {/* 过滤条件 */}
                    <FilterSection control={control} />

                    {/* 存活状态选择 */}
                    <AliveStatusSection control={control} fieldName="gen.filter.alive_status" />

                    <CountrySection control={control} fieldName="gen.filter.country" />

                    {/* 操作按钮 */}
                    <div className="flex gap-2 pt-4">
                        <Button type="submit" className="flex-1" disabled={isLoading}>
                            {isLoading ? (
                                isEditing ? '更新中...' : '创建中...'
                            ) : (
                                isEditing ? UI_TEXT.UPDATE : UI_TEXT.CREATE
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            {UI_TEXT.CANCEL}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

