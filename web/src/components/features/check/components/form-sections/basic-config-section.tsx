import { Controller, Control } from 'react-hook-form'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { validateCronExpr, validateTimeout } from '@/src/utils'
import { CHECK_CONSTANTS } from '../../constants'
import type { CheckRequest } from '@/src/types/check'

export function BasicConfigSection({ control }: { control: Control<CheckRequest> }) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <Controller
                name="task.timeout"
                control={control}
                render={({ field }) => (
                    <div>
                        <Label htmlFor="timeout" className="mb-2 block">
                            超时时间(分钟)
                        </Label>
                        <Input
                            id="timeout"
                            type="number"
                            value={field.value}
                            onChange={(e) => field.onChange(validateTimeout(e.target.value))}
                            placeholder={CHECK_CONSTANTS.DEFAULT_TIMEOUT.toString()}
                            min={CHECK_CONSTANTS.MIN_TIMEOUT}
                            max={CHECK_CONSTANTS.MAX_TIMEOUT}
                        />
                    </div>
                )}
            />

            <Controller
                name="task.cron_expr"
                control={control}
                render={({ field }) => (
                    <div>
                        <Label htmlFor="cron" className="mb-2 block">
                            检测频率
                        </Label>
                        <Input
                            id="cron"
                            {...field}
                            placeholder={CHECK_CONSTANTS.DEFAULT_CRON}
                            className={!validateCronExpr(field.value) ? 'border-red-500' : ''}
                        />
                        {field.value && !validateCronExpr(field.value) && (
                            <p className="text-xs text-red-500 mt-1">请输入有效的Cron表达式</p>
                        )}
                    </div>
                )}
            />
        </div>
    )
}