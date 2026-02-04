import { Controller, Control, useController } from 'react-hook-form'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import type { SubRequest } from '@/src/types/sub'
import { generateNameFromUrl } from '../../utils'
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { useState } from "react";

export function BasicInfoSection({ control }: { control: Control<SubRequest> }) {
    const { field: nameField } = useController({
        name: 'name',
        control
    })

    const [tag, setTag] = useState("")
    const [tagError, setTagError] = useState("")

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="url" className="mb-2 block">订阅链接</Label>
                <Controller
                    name="config.url"
                    control={control}
                    rules={{
                        required: '请输入有效的订阅链接',
                        pattern: {
                            value: /^https?:\/\/.+/,
                            message: '请输入有效的URL (http:// 或 https://)'
                        }
                    }}
                    render={({ field, fieldState }) => (
                        <>
                            <Input
                                {...field}
                                value={field.value || ''}
                                id="url"
                                type="url"
                                placeholder="https://example.com/subscription"
                                onChange={(e) => {
                                    const url = e.target.value
                                    field.onChange(url)

                                    if (url && /^https?:\/\/.+/.test(url)) {
                                        if (!nameField.value || nameField.value.trim() === '') {
                                            const generatedName = generateNameFromUrl(url)
                                            if (generatedName) {
                                                nameField.onChange(generatedName)
                                            }
                                        }
                                    }
                                }}
                            />
                            {fieldState.error && (
                                <p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>
                            )}
                        </>
                    )}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="name" className="mb-2 block">订阅名称</Label>
                <Controller
                    name="name"
                    control={control}
                    rules={{ required: '请输入订阅名称' }}
                    render={({ field, fieldState }) => (
                        <>
                            <Input
                                {...field}
                                value={field.value || ''}
                                id="name"
                                placeholder="输入订阅名称"
                            />
                            {fieldState.error && (
                                <p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>
                            )}
                        </>
                    )}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="tags" className="mb-2 block">订阅标签</Label>
                <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                        <>
                            {
                                field.value.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {field.value.map(option => {
                                            return (
                                                <Badge
                                                    key={option}
                                                    variant={'default'}
                                                    className={`cursor-pointer transition-colors hover:bg-red-100 hover:text-red-700`}
                                                    onClick={() => {
                                                        const index = field.value.indexOf(option)
                                                        field.value.splice(index, 1)
                                                        field.onChange(field.value)
                                                    }}
                                                >
                                                    {option} {'×'}
                                                </Badge>
                                            )
                                        })}
                                    </div>
                                )
                            }
                            <div className="flex gap-2 pt-4">
                                <Input
                                    placeholder="新增订阅标签"
                                    className="flex-1"
                                    disabled={field.disabled}
                                    value={tag}
                                    onChange={(e) => setTag(e.target.value)}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={field.disabled}
                                    onClick={() => {
                                        if (field.value.indexOf(tag) >= 0) {
                                            setTagError("标签已存在")
                                        } else if (tag.trim() === "") {
                                            setTagError("请输入标签")
                                        } else {
                                            setTagError("")
                                            field.value.push(tag)
                                            setTag("")
                                        }
                                    }}
                                >
                                    添加
                                </Button>
                            </div>
                            {tagError !== "" && (
                                <p className="text-xs text-red-500 mt-1">{tagError}</p>
                            )}
                        </>
                    )}
                />
            </div>
        </div>
    )
}
