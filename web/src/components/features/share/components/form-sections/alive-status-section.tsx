import { Controller, Control } from 'react-hook-form'
import { Label } from '@/src/components/ui/label'
import { Badge } from '@/src/components/ui/badge'

interface AliveStatusSectionProps {
    control: Control<Record<string, unknown> | any>
    fieldName: string
}

// 根据 bestsub/internal/models/node/node.go 中的常量定义
const ALIVE_STATUS_FLAGS = [
    { value: 1, label: '存活', name: 'Alive' },           // 1 << 0
    { value: 2, label: '国家', name: 'Country' },         // 1 << 1
    { value: 4, label: 'TikTok', name: 'TikTok' },             // 1 << 2
    { value: 8, label: 'TikTok IDC', name: 'TikTok IDC' },     // 1 << 3
] as const

export function AliveStatusSection({ control, fieldName }: AliveStatusSectionProps) {
    return (
        <Controller
            name={fieldName}
            control={control}
            render={({ field }) => (
                <div className="w-full">
                    <Label className="mb-2 block">
                        存活状态
                    </Label>
                    <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                            {ALIVE_STATUS_FLAGS.map(flag => {
                                const currentValue = (field.value as number) || 0
                                const isSelected = (currentValue & flag.value) !== 0

                                const handleToggleSelection = (flagValue: number) => {
                                    let newValue = currentValue
                                    if (isSelected) {
                                        // 取消选择：使用异或运算清除该位
                                        newValue = currentValue & ~flagValue
                                    } else {
                                        // 选择：使用或运算设置该位
                                        newValue = currentValue | flagValue
                                    }
                                    field.onChange(newValue)
                                }

                                return (
                                    <Badge
                                        key={flag.value}
                                        variant={isSelected ? "default" : "outline"}
                                        className={`cursor-pointer transition-colors ${isSelected
                                            ? "hover:bg-red-100 hover:text-red-700"
                                            : "hover:bg-green-100 hover:text-green-700"
                                            }`}
                                        onClick={() => handleToggleSelection(flag.value)}
                                    >
                                        {flag.label} {isSelected ? "×" : "+"}
                                    </Badge>
                                )
                            })}
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        点击状态进行选择/取消选择，支持多选组合
                    </p>
                </div>
            )}
        />
    )
} 