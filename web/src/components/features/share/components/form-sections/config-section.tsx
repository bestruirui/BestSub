import { Controller, Control } from 'react-hook-form'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import { Calendar22 } from '../share-date-pick'
import { SUBSCRIPTION_TARGETS } from '../../constants'
import type { ShareRequest } from '@/src/types'

interface ConfigSectionProps {
    control: Control<ShareRequest>
}

export function ConfigSection({ control }: ConfigSectionProps) {
    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="template" className="mb-2 block">
                    订阅模板
                </Label>
                <Controller
                    name="gen.target"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value ?? 'auto'}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="选择订阅模板" />
                            </SelectTrigger>
                            <SelectContent>
                                {SUBSCRIPTION_TARGETS.map((target) => (
                                    <SelectItem key={target.value} value={target.value}>
                                        {target.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>

            <div>
                <Label htmlFor="rename" className="mb-2 block">
                    重命名模板
                </Label>
                <Controller
                    name="gen.rename"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            value={field.value || ''}
                            id="rename"
                        />
                    )}
                />
            </div>


            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="max_access_count" className="mb-2 block">
                        最大访问次数
                    </Label>
                    <Controller
                        name="max_access_count"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                value={field.value || ''}
                                id="max_access_count"
                                type="number"
                                placeholder="0"
                                min="0"
                                onChange={(e) => field.onChange(parseInt(e.target.value || '0'))}
                            />
                        )}
                    />
                </div>

                <div>
                    <Controller
                        name="expires"
                        control={control}
                        render={({ field }) => (
                            <Calendar22
                                value={field.value ?? 0}
                                onChange={(ts: number) => field.onChange(ts || 0)}
                            />
                        )}
                    />
                </div>
            </div>
        </div>
    )
}