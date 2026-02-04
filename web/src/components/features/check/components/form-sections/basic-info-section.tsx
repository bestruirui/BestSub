import { Controller, Control } from 'react-hook-form'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Switch } from '@/src/components/ui/switch'
import type { CheckRequest } from '@/src/types/check'

export function BasicInfoSection({ control }: { control: Control<CheckRequest> }) {
    return (
        <div className="space-y-4">
            <Controller
                name="name"
                control={control}
                render={({ field }) => (
                    <div>
                        <Label htmlFor="name" className="mb-2 block">
                            任务名称
                        </Label>
                        <Input
                            id="name"
                            {...field}
                            placeholder="请输入检测任务名称"
                            required
                        />
                    </div>
                )}
            />

            <Controller
                name="enable"
                control={control}
                render={({ field }) => (
                    <div className="flex items-center justify-between">
                        <Label htmlFor="enable">启用任务</Label>
                        <Switch
                            id="enable"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    </div>
                )}
            />
        </div>
    )
}