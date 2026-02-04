'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog'
import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { copyToClipboard } from '../utils'
import { UI_TEXT } from '../constants'

interface ShareCopyDialogProps {
    fullUrl: string
    isOpen: boolean
    onClose: () => void
}

export function ShareCopyDialog({ fullUrl, isOpen, onClose }: ShareCopyDialogProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        const success = await copyToClipboard(fullUrl)
        if (success) {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000) // 2秒后重置状态
        }
    }

    const handleClose = () => {
        setCopied(false)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>订阅链接</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        请复制以下订阅链接:
                    </p>

                    <div className="flex items-center space-x-2">
                        <Input
                            readOnly
                            value={fullUrl || ''}
                            className="flex-1"
                            onClick={(e) => e.currentTarget.select()}
                        />
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleCopy}
                            className="shrink-0"
                            variant={copied ? "default" : "outline"}
                        >
                            {copied ? (
                                <>
                                    <Check className="h-4 w-4 mr-1" />
                                    已复制
                                </>
                            ) : (
                                <>
                                    <Copy className="h-4 w-4 mr-1" />
                                    {UI_TEXT.COPY}
                                </>
                            )}
                        </Button>
                    </div>

                    {copied && (
                        <p className="text-sm text-green-600">
                            链接已复制到剪贴板！
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}