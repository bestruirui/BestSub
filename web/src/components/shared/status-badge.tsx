import { Badge } from "@/src/components/ui/badge"
import type { ComponentProps } from "react"

type BadgeVariant = ComponentProps<typeof Badge>["variant"]

interface StatusConfig {
    variant: BadgeVariant
    className: string
    text: string
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
    running: { variant: 'default', className: 'bg-blue-500 hover:bg-blue-600 text-white', text: '运行中' },
    scheduled: { variant: 'default', className: 'bg-teal-500 hover:bg-teal-600 text-white', text: '已调度' },
    pending: { variant: 'default', className: 'bg-yellow-500 hover:bg-yellow-600 text-white', text: '等待中' },
    disabled: { variant: 'secondary', className: 'bg-gray-500 hover:bg-gray-600 text-white', text: '已停用' },
    enabled: { variant: 'default', className: 'bg-green-500 hover:bg-green-600 text-white', text: '已启用' },
} as const

const getUnknownConfig = (status: string): StatusConfig => ({
    variant: "outline",
    className: "",
    text: status || "未知"
})

export function StatusBadge({ status }: { status: string }) {
    const config = STATUS_CONFIG[status] || getUnknownConfig(status)

    return (
        <Badge variant={config.variant} className={config.className}>
            {config.text}
        </Badge>
    )
}

export default StatusBadge
