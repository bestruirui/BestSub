import { Controller, Control } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Switch } from '@/src/components/ui/switch'
import { useCheckTypes } from '@/src/lib/queries/check-queries'
import { UI_TEXT } from '../../constants'
import type { CheckRequest } from '@/src/types/check'
import type { DynamicConfigItem } from '@/src/types/common'


export function ExtraConfigSection({ control }: { control: Control<CheckRequest> }) {
    const { data: checkTypeConfigs = {}, isLoading } = useCheckTypes()

    const checkTypes = Object.keys(checkTypeConfigs)

    const isConfigFieldEmpty = (configType: string, value: unknown): boolean => {
        if (configType === 'boolean') return false
        return value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')
    }

    const renderConfigField = (config: DynamicConfigItem) => {
        return (
            <Controller
                name={`config.${config.key}`}
                control={control}
                render={({ field }) => {
                    if (field.value === undefined || field.value === null || field.value === '') {
                        if (config.type === 'boolean') {
                            field.onChange(config.value === 'true')
                        } else if (config.type === 'number') {
                            field.onChange(Number(config.value) || 0)
                        } else {
                            field.onChange(config.value || '')
                        }
                    }
                    const isEmpty = isConfigFieldEmpty(config.type, field.value)
                    const showError = config.require && isEmpty

                    switch (config.type) {
                        case 'string':
                            if (config.options) {
                                return (
                                    <Select
                                        value={field.value as string || config.value || ''}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger className={showError ? 'border-red-500' : ''}>
                                            <SelectValue placeholder={`请选择${config.name}`} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {config.options.split(',').map((option: string) => (
                                                <SelectItem key={option.trim()} value={option.trim()}>
                                                    {option.trim()}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )
                            }
                            return (
                                <Input
                                    type="text"
                                    placeholder={`请输入${config.name}`}
                                    value={field.value as string || config.value || ''}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    className={showError ? 'border-red-500' : ''}
                                />
                            )

                        case 'number':
                            return (
                                <Input
                                    type="number"
                                    placeholder={`请输入${config.name}`}
                                    value={field.value as string || config.value || ''}
                                    onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                                    className={showError ? 'border-red-500' : ''}
                                />
                            )

                        case 'boolean':
                            return (
                                <div className="flex items-center justify-between w-full">
                                    <span className="text-sm font-medium">{config.name}</span>
                                    <Switch
                                        checked={field.value as boolean || config.value === 'true'}
                                        onCheckedChange={field.onChange}
                                    />
                                </div>
                            )

                        default:
                            return (
                                <Input
                                    type="text"
                                    placeholder={`请输入${config.name}`}
                                    value={field.value as string || config.value || ''}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    className={showError ? 'border-red-500' : ''}
                                />
                            )
                    }
                }}
            />
        )
    }

    return (
        <div className="space-y-4">
            <Controller
                name="task.type"
                control={control}
                render={({ field }) => (
                    <div className="w-full">
                        <Label htmlFor="type" className="mb-2 block">
                            检测类型
                        </Label>
                        <Select
                            value={field.value}
                            onValueChange={field.onChange}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={isLoading ? UI_TEXT.LOADING + "..." : "选择检测类型"} />
                            </SelectTrigger>
                            <SelectContent>
                                {checkTypes.map(type => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            />

            <Controller
                name="task.type"
                control={control}
                render={({ field }) => {
                    const selectedType = field.value
                    const configs = selectedType ? checkTypeConfigs[selectedType] || [] : []

                    if (!selectedType) {
                        return (
                            <div className="text-center py-4 text-muted-foreground">
                                选择检测类型后将显示相关配置项
                            </div>
                        )
                    }

                    if (isLoading) {
                        return (
                            <div className="text-center py-4 text-muted-foreground">
                                加载配置中...
                            </div>
                        )
                    }

                    if (configs.length === 0) {
                        return <div></div>
                    }

                    return (
                        <div className="space-y-4">
                            {configs.map((config) => (
                                <div key={config.key} className="space-y-2">
                                    {config.type !== 'boolean' && (
                                        <Label htmlFor={config.key} className="block">
                                            {config.name}
                                            {config.require && <span className="text-red-500 ml-1">*</span>}
                                        </Label>
                                    )}
                                    {renderConfigField(config)}
                                    {config.desc && (
                                        <p className="text-sm text-muted-foreground">
                                            {config.desc}
                                        </p>
                                    )}
                                    <Controller
                                        name={`config.${config.key}`}
                                        control={control}
                                        render={({ field: configField }) => {
                                            const isEmpty = isConfigFieldEmpty(config.type, configField.value)
                                            return config.require && isEmpty ? (
                                                <p className="text-xs text-red-500">此字段为必填项</p>
                                            ) : <></>
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )
                }}
            />
        </div>
    )
}