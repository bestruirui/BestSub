import { useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Card, CardContent } from "@/src/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/src/components/ui/table"
import { InlineLoading } from "@/src/components/ui/loading"
import { Play, Edit, Trash2 } from "lucide-react"
import { UI_TEXT } from "../constants"
import { formatLastRunTime, formatDuration, formatBooleanText } from "@/src/utils"
import StatusBadge from "@/src/components/shared/status-badge"
import { useOverflowDetection } from "@/src/lib/hooks/useOverflowDetection"
import type { CheckResponse } from "@/src/types/check"
import { api } from "@/src/lib/api/client"
import { useAlert } from '@/src/components/providers'
import { useChecks, useDeleteCheck } from "@/src/lib/queries/check-queries"
import { toast } from "sonner"

interface CheckListProps {
    onEdit: (check: CheckResponse) => void
}

export function CheckList({ onEdit }: CheckListProps) {
    const { confirm } = useAlert()
    const { data: checks = [], isLoading, error } = useChecks()
    const deleteCheckMutation = useDeleteCheck()
    const { containerRef, contentRef, isOverflowing, checkOverflow } = useOverflowDetection<HTMLTableElement>()

    const onDelete = async (id: number, name: string) => {
        const confirmed = await confirm({
            title: UI_TEXT.CONFIRM_DELETE,
            description: UI_TEXT.DELETE_CONFIRM_MESSAGE.replace('{name}', name),
            confirmText: UI_TEXT.DELETE,
            cancelText: UI_TEXT.CANCEL,
            variant: 'destructive'
        })

        if (confirmed) {
            try {
                await deleteCheckMutation.mutateAsync(id)
                toast.success(UI_TEXT.DELETE_SUCCESS)
            } catch (error) {
                toast.error(UI_TEXT.DELETE_FAILED)
                console.error('Failed to delete check:', error)
            }
        }
    }

    useEffect(() => {
        if (!isLoading) {
            checkOverflow()
        }
    }, [isLoading, checkOverflow])

    if (isLoading) {
        return (
            <Card>
                <CardContent>
                    <InlineLoading message={UI_TEXT.LOADING + '检测任务...'} />
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

    if (checks.length === 0) {
        return (
            <Card>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        {UI_TEXT.NO_DATA}，点击上方按钮创建第一个检测任务
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
                            {checks.sort((a, b) => a.id - b.id).map((check) => (
                                <TableRow key={check.id}>
                                    <TableCell className="space-y-1">
                                        <div className="font-medium">
                                            {check.name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">{check.task?.cron_expr || 'N/A'}</div>
                                    </TableCell>

                                    <TableCell className="space-y-2 flex flex-col">
                                        <StatusBadge status={check.enable ? check.status : 'disabled'} />
                                        <Badge variant="outline" className="text-xs w-fit">
                                            {check.task.type}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-xs space-y-1">
                                        <div>超时时间: <span className="text-muted-foreground">{check.task?.timeout || 0}分钟</span> </div>
                                        <div>通知: <span className="text-muted-foreground">{formatBooleanText(check.task?.notify ?? false)}</span></div>
                                        <div>日志: <span className="text-muted-foreground">{formatBooleanText(check.task?.log_write_file ?? false)}</span></div>
                                    </TableCell>

                                    <TableCell className="text-xs space-y-1">
                                        <div>最后运行: <span className="text-muted-foreground">{formatLastRunTime(check.result?.last_run)}</span></div>
                                        <div>执行时长: <span className="text-muted-foreground">{formatDuration(check.result?.duration)}</span></div>
                                        <div>状态消息: <span className="text-muted-foreground">{check.result?.msg || '无'}</span></div>
                                    </TableCell>

                                    <TableCell className={`text-right space-x-2 sticky right-0 bg-background ${isOverflowing ? 'shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.1)]' : ''}`}>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                api.runCheck(check.id)
                                                toast.success(UI_TEXT.RUN_SUCCESS)
                                            }}
                                            disabled={!check.enable || check.status === 'running'}
                                        >
                                            <Play className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onEdit(check)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onDelete(check.id, check.name)}
                                        >
                                            <Trash2 className="h-4 w-4" />
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