import { Control, Controller, useWatch } from 'react-hook-form'
import { Label } from '@/src/components/ui/label'
import { Switch } from '@/src/components/ui/switch'
import { Badge } from '@/src/components/ui/badge'
import { PROTOCOL_OPTIONS } from '@/src/constant/protocols'
import type { SubRequest } from '@/src/types/sub'

export function ProtocolFilterSection({ control }: { control: Control<SubRequest> }) {
    const enable = useWatch({ control, name: 'config.protocol_filter_enable' }) as boolean | undefined
    return (
        <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
                <Label className="font-medium">协议过滤</Label>
                <Controller
                    name="config.protocol_filter_enable"
                    control={control}
                    render={({ field }) => (
                        <Switch
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                        />
                    )}
                />
            </div>

            {enable && (
                <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <Label className="font-medium">排除模式</Label>
                            <p className="text-xs text-muted-foreground">关闭为包含以下协议,打开为排除以下协议</p>
                        </div>

                        <Controller
                            name="config.protocol_filter_mode"
                            control={control}
                            render={({ field: modeField }) => (
                                <Switch
                                    checked={modeField.value || false}
                                    onCheckedChange={modeField.onChange}
                                />
                            )}
                        />
                    </div>
                    <Controller
                        name="config.protocol_filter"
                        control={control}
                        render={({ field: filterField }) => {
                            const selectedValues = Array.isArray(filterField.value) ? filterField.value : []

                            const handleToggle = (value: string) => {
                                const isSelected = selectedValues.includes(value)
                                const nextValues = isSelected
                                    ? selectedValues.filter(item => item !== value)
                                    : [...selectedValues, value]

                                filterField.onChange(nextValues)
                            }

                            return (
                                <div className="space-y-2">
                                    <Label className="font-medium">选择协议</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {PROTOCOL_OPTIONS.map(option => {
                                            const isSelected = selectedValues.includes(option)

                                            return (
                                                <Badge
                                                    key={option}
                                                    variant={isSelected ? 'default' : 'outline'}
                                                    className={`cursor-pointer transition-colors ${isSelected
                                                        ? 'hover:bg-red-100 hover:text-red-700'
                                                        : 'hover:bg-green-100 hover:text-green-700'
                                                        }`}
                                                    onClick={() => handleToggle(option)}
                                                >
                                                    {option} {isSelected ? '×' : '+'}
                                                </Badge>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        }}
                    />
                </div>
            )}
        </div>
    )
}
