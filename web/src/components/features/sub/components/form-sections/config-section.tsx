import { Controller, Control } from 'react-hook-form'
import { Label } from '@/src/components/ui/label'
import { Input } from '@/src/components/ui/input'
import { Switch } from '@/src/components/ui/switch'
import type { SubRequest } from '@/src/types/sub'

export function ConfigSection({ control }: { control: Control<SubRequest> }) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 gap-y-4">
                <Label htmlFor="cron_expr">更新频率</Label>
                <Label htmlFor="timeout">超时时间（秒）</Label>

                <Controller
                    name="cron_expr"
                    control={control}
                    rules={{ required: '请输入有效的Cron表达式' }}
                    render={({ field, fieldState }) => (
                        <>
                            <Input
                                {...field}
                                value={field.value || ''}
                                id="cron_expr"
                                placeholder="0 */6 * * *"
                            />
                            {fieldState.error && (
                                <p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>
                            )}
                        </>
                    )}
                />

                <Controller
                    name="config.timeout"
                    control={control}
                    rules={{
                        required: '请输入超时时间',
                        min: { value: 1, message: '超时时间必须大于0' },
                        max: { value: 300, message: '超时时间不能超过300秒' }
                    }}
                    render={({ field, fieldState }) => (
                        <>
                            <Input
                                {...field}
                                value={field.value || ''}
                                id="timeout"
                                type="number"
                                placeholder="10"
                                min="1"
                                max="300"
                                onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                            {fieldState.error && (
                                <p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>
                            )}
                        </>
                    )}
                />
            </div>

            <div className="grid grid-cols-[1fr_auto] items-center gap-4 gap-y-4">
                <Label htmlFor="proxy">启用代理</Label>
                <Controller
                    name="config.proxy"
                    control={control}
                    render={({ field }) => (
                        <Switch
                            id="proxy"
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                        />
                    )}
                />

                <Label htmlFor="enable_format_conversion">启用格式转换</Label>
                <Controller
                    name="config.enable_format_conversion"
                    control={control}
                    render={({ field }) => (
                        <Switch
                            id="enable_format_conversion"
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                        />
                    )}
                />

                <Label htmlFor="enable">启用订阅</Label>
                <Controller
                    name="enable"
                    control={control}
                    render={({ field }) => (
                        <Switch
                            id="enable"
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                        />
                    )}
                />
            </div>
        </div>
    )
}