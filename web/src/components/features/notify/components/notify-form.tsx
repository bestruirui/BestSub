import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { DynamicConfigForm } from "@/src/components/shared/dynamic-config-form"
import type { DynamicConfigItem, NotifyResponse, NotifyRequest } from "@/src/types"

interface NotifyFormProps {
    formData: NotifyRequest
    editingNotify: NotifyResponse | null
    isDialogOpen: boolean
    notifyChannels: string[]
    channelConfigs: Record<string, DynamicConfigItem[]>
    isLoadingChannels: boolean
    isLoadingConfigs: boolean
    updateFormField: (field: keyof NotifyRequest, value: string) => void
    updateConfigField: (field: string, value: string | boolean | number) => void
    handleChannelChange: (channel: string) => void
    handleSubmit: (e: React.FormEvent) => void
    onOpenChange: (open: boolean) => void
}

export function NotifyForm({
    formData,
    editingNotify,
    isDialogOpen,
    notifyChannels,
    channelConfigs,
    isLoadingChannels,
    isLoadingConfigs,
    updateFormField,
    updateConfigField,
    handleChannelChange,
    handleSubmit,
    onOpenChange
}: NotifyFormProps) {
    const currentConfigs = formData.type ? channelConfigs[formData.type] || [] : []

    return (
        <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto scrollbar-hide">
                <DialogHeader>
                    <DialogTitle>
                        {editingNotify ? '编辑通知配置' : '创建通知配置'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="name" className="mb-2 block">通知名称</Label>
                        <Input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => updateFormField('name', e.target.value)}
                            placeholder="请输入通知名称"
                            required
                        />
                    </div>

                    <div className="w-full">
                        <Label htmlFor="type" className="mb-2 block">通知渠道</Label>
                        <Select
                            value={formData.type}
                            onValueChange={handleChannelChange}
                            disabled={isLoadingChannels}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={isLoadingChannels ? "加载中..." : "请选择通知渠道"} />
                            </SelectTrigger>
                            <SelectContent>
                                {notifyChannels.map((channel) => (
                                    <SelectItem key={channel} value={channel}>
                                        {channel}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {formData.type && (
                        <DynamicConfigForm
                            configs={currentConfigs}
                            configValues={formData.config}
                            onConfigChange={updateConfigField}
                            isLoading={isLoadingConfigs}
                            typeName="通知渠道"
                        />
                    )}

                    <div className="flex gap-2 pt-4">
                        <Button type="submit" className="flex-1" disabled={isLoadingConfigs}>
                            {editingNotify ? '更新' : '创建'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            取消
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
} 