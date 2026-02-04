import { useMemo } from 'react'
import { Controller, Control } from 'react-hook-form'
import { Label } from '@/src/components/ui/label'
import { Badge } from '@/src/components/ui/badge'
import { Switch } from '@/src/components/ui/switch'
import { useSubs } from '@/src/lib/queries/sub-queries'

interface SubscriptionSectionProps {
    control: Control<Record<string, unknown> | any>
    subIdField: string
    subIdExcludeField: string
}

export function SubscriptionSection({ control, subIdField, subIdExcludeField }: SubscriptionSectionProps) {
    const { data: subs = [], isLoading, error } = useSubs()

    const subList = useMemo(() =>
        subs.map(sub => ({ id: sub.id, name: sub.name })),
        [subs]
    )

    if (isLoading) {
        return (
            <div className="w-full">
                <Label className="mb-2 block">选择订阅</Label>
                <div className="text-center py-4 text-muted-foreground">
                    <p className="text-sm">加载订阅中...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="w-full">
                <Label className="mb-2 block">选择订阅</Label>
                <div className="text-center py-4 text-destructive">
                    <p className="text-sm">加载失败: {error.message}</p>
                </div>
            </div>
        )
    }

    if (subList.length === 0) {
        return (
            <div className="w-full">
                <Label className="mb-2 block">选择订阅</Label>
                <div className="text-center py-4 text-muted-foreground">
                    <p className="text-sm">暂无可用订阅</p>
                </div>
            </div>
        )
    }

    return (
        <Controller
            name={subIdField}
            control={control}
            render={({ field }) => {

                return (
                    <div className="w-full">
                        <div className="flex items-center justify-between mb-2">
                            <Label htmlFor="sub_id" className="block">
                                选择订阅
                            </Label>
                            <div className="flex items-center space-x-2">
                                <Label htmlFor={`${subIdField}-exclude`} className="text-sm text-muted-foreground">
                                    排除模式
                                </Label>
                                <Controller
                                    name={subIdExcludeField}
                                    control={control}
                                    render={({ field: excludeField }) => (
                                        <Switch
                                            id={`${subIdField}-exclude`}
                                            checked={excludeField.value || false}
                                            onCheckedChange={excludeField.onChange}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex flex-wrap gap-2">
                                {subList.map(sub => {
                                    const selectedSubIds = (field.value as number[]) || []
                                    const isSelected = selectedSubIds.includes(sub.id)

                                    const handleToggleSelection = (subId: number) => {
                                        if (isSelected) {
                                            field.onChange(selectedSubIds.filter((id: number) => id !== subId))
                                        } else {
                                            field.onChange([...selectedSubIds, subId])
                                        }
                                    }

                                    return (
                                        <Badge
                                            key={sub.id}
                                            variant={isSelected ? "default" : "outline"}
                                            className={`cursor-pointer transition-colors ${isSelected
                                                ? "hover:bg-red-100 hover:text-red-700"
                                                : "hover:bg-green-100 hover:text-green-700"
                                                }`}
                                            onClick={() => handleToggleSelection(sub.id)}
                                        >
                                            {sub.name} {isSelected ? "×" : "+"}
                                        </Badge>
                                    )
                                })}
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            点击订阅进行选择/取消选择，不选择则视为全选
                        </p>
                    </div>
                )
            }}
        />
    )
}