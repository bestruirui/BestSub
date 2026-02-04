import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Switch } from "@/src/components/ui/switch"
import { Textarea } from "@/src/components/ui/textarea"
import type { DynamicConfigItem } from "@/src/types/common"

interface DynamicConfigFormProps {
    configs: DynamicConfigItem[]
    configValues: Record<string, unknown>
    onConfigChange: (field: string, value: string | boolean | number) => void
    isLoading?: boolean
    typeName?: string
}

export function DynamicConfigForm({
    configs,
    configValues,
    onConfigChange,
    isLoading = false,
    typeName = "配置"
}: DynamicConfigFormProps) {
    // 验证动态配置字段是否为空
    const isConfigFieldEmpty = (configName: string, configType: string, value: unknown): boolean => {
        if (configType === 'boolean') return false // 布尔类型不需要验证
        // 如果值为undefined或空字符串，则认为是空的
        return value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')
    }

    const renderConfigField = (config: DynamicConfigItem) => {
        const value = configValues[config.key]
        const isEmpty = isConfigFieldEmpty(config.key, config.type, value)
        const showError = config.require && isEmpty

        switch (config.type) {
            case 'string':
                if (config.options) {
                    return (
                        <Select
                            value={value as string || ''}
                            onValueChange={(val) => {
                                const finalValue = val === '' && config.value ? config.value : val
                                onConfigChange(config.key, finalValue)
                            }}
                        >
                            <SelectTrigger className={showError ? 'border-red-500' : ''}>
                                <SelectValue placeholder={config.value || `请选择${config.name}`} />
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
                        placeholder={config.value || `请输入${config.name}`}
                        value={value as string || ''}
                        onChange={(e) => {
                            const inputValue = e.target.value
                            const finalValue = inputValue === '' && config.value ? config.value : inputValue
                            onConfigChange(config.key, finalValue)
                        }}
                        className={showError ? 'border-red-500' : ''}
                    />
                )

            case 'number':
                return (
                    <Input
                        type="number"
                        placeholder={config.value || `请输入${config.name}`}
                        value={value as number || ''}
                        onChange={(e) => {
                            const inputValue = e.target.value
                            if (inputValue === '') {
                                const finalValue = config.value || ''
                                onConfigChange(config.key, finalValue)
                            } else {
                                onConfigChange(config.key, Number(inputValue))
                            }
                        }}
                        className={showError ? 'border-red-500' : ''}
                    />
                )

            case 'boolean':
                return (
                    <div className="flex items-center justify-between w-full">
                        <span className="text-sm font-medium">{config.name}</span>
                        <Switch
                            checked={value as boolean || false}
                            onCheckedChange={(checked) => onConfigChange(config.key, checked)}
                        />
                    </div>
                )

            case 'textarea':
                return (
                    <Textarea
                        placeholder={config.value || `请输入${config.name}`}
                        value={value as string || ''}
                        onChange={(e) => {
                            const inputValue = e.target.value
                            const finalValue = inputValue === '' && config.value ? config.value : inputValue
                            onConfigChange(config.key, finalValue)
                        }}
                        className={showError ? 'border-red-500' : ''}
                        rows={3}
                    />
                )

            default:
                return (
                    <Input
                        type="text"
                        placeholder={config.value || `请输入${config.name}`}
                        value={value as string || ''}
                        onChange={(e) => {
                            const inputValue = e.target.value
                            const finalValue = inputValue === '' && config.value ? config.value : inputValue
                            onConfigChange(config.key, finalValue)
                        }}
                        className={showError ? 'border-red-500' : ''}
                    />
                )
        }
    }

    if (isLoading) {
        return (
            <div className="text-center py-4 text-muted-foreground">
                加载配置中...
            </div>
        )
    }

    if (configs.length === 0) {
        return (
            <div className="text-center py-4 text-muted-foreground">
                选择{typeName}后将显示相关配置项
            </div>
        )
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
                    {config.require && isConfigFieldEmpty(config.key, config.type, configValues[config.key]) && (
                        <p className="text-xs text-red-500">此字段为必填项</p>
                    )}
                </div>
            ))}
        </div>
    )
} 