import { Controller, Control, useWatch } from 'react-hook-form'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Switch } from '@/src/components/ui/switch'
import type { CheckRequest } from '@/src/types/check'

export function NotifyConfig({ control }: { control: Control<CheckRequest> }) {
    const notifyEnabled = useWatch({
        control,
        name: "task.notify",
        defaultValue: false
    })

    return (
        <div className="space-y-4">
            <Controller
                name="task.notify"
                control={control}
                render={({ field }) => (
                    <div className="flex items-center justify-between">
                        <Label htmlFor="notify">启用通知</Label>
                        <Switch
                            id="notify"
                            checked={field.value ?? false}
                            onCheckedChange={field.onChange}
                        />
                    </div>
                )}
            />

            {notifyEnabled && (
                <Controller
                    name="task.notify_channel"
                    control={control}
                    render={({ field }) => (
                        <div className="mt-2">
                            <Label htmlFor="notify_channel" className="mb-2 block">
                                通知渠道
                            </Label>
                            <Input
                                id="notify_channel"
                                type="number"
                                value={field.value}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                min="1"
                            />
                        </div>
                    )}
                />
            )}
        </div>
    )
}