import { Controller, Control } from 'react-hook-form'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Switch } from '@/src/components/ui/switch'
import { FORM_VALIDATION } from '../../constants'
import type { ShareRequest } from '@/src/types'

interface BasicInfoSectionProps {
    control: Control<ShareRequest>
}

export function BasicInfoSection({ control }: BasicInfoSectionProps) {
    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="name" className="mb-2 block">
                    分享名称
                </Label>
                <Controller
                    name="name"
                    control={control}
                    rules={{ required: FORM_VALIDATION.NAME_REQUIRED }}
                    render={({ field }) => (
                        <Input
                            {...field}
                            value={field.value || ''}
                            id="name"
                            placeholder="请输入分享名称"
                        />
                    )}
                />
            </div>

            <div>
                <Label htmlFor="token" className="mb-2 block">
                    访问Token
                </Label>
                <Controller
                    name="token"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            value={field.value || ''}
                            id="token"
                            placeholder="留空自动生成"
                        />
                    )}
                />
            </div>

            <div className="flex items-center justify-between">
                <Label htmlFor="enable">启用分享</Label>
                <Controller
                    name="enable"
                    control={control}
                    render={({ field }) => (
                        <Switch
                            id="enable"
                            checked={!!field.value}
                            onCheckedChange={field.onChange}
                        />
                    )}
                />
            </div>
        </div>
    )
}