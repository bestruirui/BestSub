import { Controller, Control } from 'react-hook-form'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { safeParseInt, safeParseFloat } from '../../utils'

export function FilterSection({ control }: { control: Control<Record<string, unknown> | any> }) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="speed_up_more" className="mb-2 block">
                        上传速度 {'>'} (KB/s)
                    </Label>
                    <Controller
                        name="gen.filter.speed_up_more"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                value={field.value || ''}
                                id="speed_up_more"
                                type="number"
                                step="0.1"
                                placeholder="0"
                                min="0"
                                onChange={(e) => field.onChange(safeParseFloat(e.target.value))}
                            />
                        )}
                    />
                </div>

                <div>
                    <Label htmlFor="speed_down_more" className="mb-2 block">
                        下载速度 {'>'} (KB/s)
                    </Label>
                    <Controller
                        name="gen.filter.speed_down_more"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                value={field.value || ''}
                                id="speed_down_more"
                                type="number"
                                step="0.1"
                                placeholder="0"
                                min="0"
                                onChange={(e) => field.onChange(safeParseFloat(e.target.value))}
                            />
                        )}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="delay_less_than" className="mb-2 block">
                        延迟 {'<'} (ms)
                    </Label>
                    <Controller
                        name="gen.filter.delay_less_than"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                value={field.value || ''}
                                id="delay_less_than"
                                type="number"
                                placeholder="1000"
                                min="0"
                                onChange={(e) => field.onChange(safeParseInt(e.target.value))}
                            />
                        )}
                    />
                </div>

                <div>
                    <Label htmlFor="risk_less_than" className="mb-2 block">
                        风险值 {'<'}
                    </Label>
                    <Controller
                        name="gen.filter.risk_less_than"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                value={field.value || ''}
                                id="risk_less_than"
                                type="number"
                                placeholder="5"
                                min="0"
                                onChange={(e) => field.onChange(safeParseInt(e.target.value))}
                            />
                        )}
                    />
                </div>
            </div>

        </div>
    )
}