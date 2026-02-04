import { useMemo, useEffect } from 'react'
import { Card, CardContent } from "@/src/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/src/components/ui/table"
import { InlineLoading } from "@/src/components/ui/loading"
import StatusBadge from "@/src/components/shared/status-badge"
import { Button } from "@/src/components/ui/button"
import { Edit, Trash2, Copy } from "lucide-react"
import { useShares } from "@/src/lib/queries/share-queries"
import { useShareOperations } from "../hooks"
import { formatAccessCount, formatExpiresTime } from "../utils"
import { UI_TEXT } from "../constants"
import { useOverflowDetection } from "@/src/lib/hooks/useOverflowDetection"
import type { ShareResponse } from "@/src/types/share"

interface ShareListProps {
    onEdit: (share: ShareResponse) => void
    openCopyDialog: (fullUrl: string) => void
}

export function ShareList({ onEdit, openCopyDialog }: ShareListProps) {
    const { data: shares = [], isLoading, error } = useShares()
    const { handleDelete, handleCopy } = useShareOperations()
    const { containerRef, contentRef, isOverflowing, checkOverflow } = useOverflowDetection<HTMLTableElement>()

    const sortedShares = useMemo(() =>
        [...shares].sort((a, b) => a.id - b.id),
        [shares]
    )

    const onCopyClick = (token: string) => {
        handleCopy(token, openCopyDialog)
    }

    const onDeleteClick = (id: number, name: string) => {
        handleDelete(id, name)
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
                    <InlineLoading message={UI_TEXT.LOADING + '分享列表...'} />
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

    if (shares.length === 0) {
        return (
            <Card>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        {UI_TEXT.NO_DATA}，点击上方按钮创建第一个分享
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
                            {sortedShares.map((share) => (
                                <TableRow key={share.id}>
                                    <TableCell className="space-y-1">
                                        <div className="font-medium">
                                            {share.name}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <StatusBadge status={share.enable ? 'enabled' : 'disabled'} />
                                    </TableCell>

                                    <TableCell>
                                        <div>
                                            访问: <span className="text-muted-foreground">
                                                {formatAccessCount(share.access_count, share.max_access_count)}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div>
                                            过期日期: <span className="text-muted-foreground">
                                                {formatExpiresTime(share.expires)}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell className={`text-right sticky right-0 bg-background ${isOverflowing ? 'shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.1)]' : ''}`}>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onCopyClick(share.token)}
                                            title={UI_TEXT.COPY}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEdit(share)}
                                            title="编辑"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onDeleteClick(share.id, share.name)}
                                            title={UI_TEXT.DELETE}
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
