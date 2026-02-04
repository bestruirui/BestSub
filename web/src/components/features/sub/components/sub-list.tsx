import { useEffect, useCallback } from "react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/src/components/ui/table"
import { InlineLoading } from "@/src/components/ui/loading"
import { RefreshCw, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { formatLastRunTime } from "@/src/utils"
import { StatusBadge } from "@/src/components/shared/status-badge"
import { formatSpeed } from "../utils"
import { useSubs, useDeleteSub, useRefreshSub } from "@/src/lib/queries/sub-queries"
import { useOverflowDetection } from "@/src/lib/hooks/useOverflowDetection"
import { useAlert } from "@/src/components/providers"
import type { SubResponse } from "@/src/types/sub"

interface SubscriptionListProps {
    onEdit: (subscription: SubResponse) => void
    onShowDetail: (subscription: SubResponse) => void
}

export function SubList({
    onEdit,
    onShowDetail,
}: SubscriptionListProps) {
    const { data: subs = [], isLoading, error } = useSubs()
    const deleteSubMutation = useDeleteSub()
    const refreshSubMutation = useRefreshSub()
    const { confirm } = useAlert()
    const { containerRef, contentRef, isOverflowing, checkOverflow } = useOverflowDetection<HTMLTableElement>()

    useEffect(() => {
        if (!isLoading) {
            checkOverflow()
        }
    }, [isLoading, checkOverflow])

    const handleDelete = useCallback(async (id: number, name: string) => {
        const confirmed = await confirm({
            title: '删除订阅',
            description: `确定要删除订阅 "${name}" 吗？`,
            confirmText: '删除',
            cancelText: '取消',
            variant: 'destructive'
        })

        if (confirmed) {
            try {
                await deleteSubMutation.mutateAsync(id)
                toast.success('删除成功')
            } catch (error) {
                console.error('Failed to delete subscription:', error)
                toast.error('删除失败')
            }
        }
    }, [confirm, deleteSubMutation])

    const handleRefresh = useCallback(async (id: number) => {
        try {
            await refreshSubMutation.mutateAsync(id)
            toast.success('刷新成功')
        } catch (error) {
            console.error('Failed to refresh subscription:', error)
            toast.error('刷新失败')
        }
    }, [refreshSubMutation])

    if (isLoading) {
        return (
            <Card>
                <CardContent>
                    <InlineLoading message="加载订阅列表..." />
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card>
                <CardContent>
                    <div className="text-center py-8 text-destructive">
                        加载失败: {error.message}
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (subs.length === 0) {
        return (
            <Card>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        暂无订阅数据，点击上方按钮创建第一个订阅
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardContent>
                <div className="overflow-x-auto" ref={containerRef}>
                    <Table ref={contentRef}>
                        <TableBody>
                            {subs.sort((a, b) => a.id - b.id).map((sub) => (
                                <TableRow key={sub.id}>
                                    <TableCell>
                                        <div className="font-medium cursor-pointer hover:text-blue-600"
                                            onClick={() => onShowDetail(sub)}>
                                            {sub.name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">{sub?.cron_expr || 'N/A'}</div>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={sub.status} />
                                    </TableCell>
                                    <TableCell className="text-xs space-y-1">
                                        <div>平均延迟: <span className="text-muted-foreground">{sub.info?.delay || 0}ms</span></div>
                                        <div className="text-muted-foreground">↑{formatSpeed(sub.info?.speed_up || 0)} ↓{formatSpeed(sub.info?.speed_down || 0)}</div>
                                    </TableCell>
                                    <TableCell className="text-xs space-y-1">
                                        <div>最后运行: <span className="text-muted-foreground">{formatLastRunTime(sub.result?.last_run)}</span></div>
                                        <div>执行时长: <span className="text-muted-foreground">{sub.result?.duration || 0}ms</span></div>
                                    </TableCell>
                                    <TableCell className={`text-right sticky right-0 bg-background ${isOverflowing ? 'shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.1)]' : ''}`}>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleRefresh(sub.id)}
                                            disabled={refreshSubMutation.isPending && refreshSubMutation.variables === sub.id}
                                            className={refreshSubMutation.isPending && refreshSubMutation.variables === sub.id ? 'opacity-50' : ''}
                                        >
                                            <RefreshCw className={`h-4 w-4 ${refreshSubMutation.isPending && refreshSubMutation.variables === sub.id ? 'animate-spin' : ''}`} />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onEdit(sub)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleDelete(sub.id, sub.name)}
                                            disabled={deleteSubMutation.isPending && deleteSubMutation.variables === sub.id}
                                            className={deleteSubMutation.isPending && deleteSubMutation.variables === sub.id ? 'opacity-50' : ''}
                                        >
                                            {deleteSubMutation.isPending && deleteSubMutation.variables === sub.id ? (
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
} 