import { Button } from "@/src/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/src/components/ui/table"
import { Card, CardContent } from "@/src/components/ui/card"
import { InlineLoading } from "@/src/components/ui/loading"
import type { NotifyResponse } from "@/src/types"
import { Play, Edit, Trash2 } from "lucide-react"
import { Badge } from "@/src/components/ui/badge"

interface NotifyListProps {
    notifies: NotifyResponse[]
    isLoading: boolean
    deletingId: number | null
    testingId: number | null
    onEdit: (notify: NotifyResponse) => void
    onDelete: (id: number, name: string) => void
    onTest: (notify: NotifyResponse) => void
}

export function NotifyList({
    notifies,
    isLoading,
    deletingId,
    testingId,
    onEdit,
    onDelete,
    onTest
}: NotifyListProps) {
    if (isLoading) {
        return (
            <Card>
                <CardContent>
                    <InlineLoading message="加载通知..." />
                </CardContent>
            </Card>
        )
    }

    if (notifies.length === 0) {
        return (
            <Card>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        暂无通知配置，点击上方按钮添加第一个通知配置
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardContent>
                <Table>
                    <TableBody>
                        {notifies.sort((a, b) => a.id - b.id).map((notify) => (
                            <TableRow key={notify.id}>
                                <TableCell className="font-medium">{notify.name}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="outline" className="text-xs w-fit">
                                        {notify.type?.toUpperCase() || 'N/A'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onTest(notify)}
                                        disabled={testingId === notify.id}
                                    >
                                        <Play className={`h-4 w-4 ${testingId === notify.id ? 'animate-spin' : ''}`} />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onEdit(notify)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onDelete(notify.id, notify.name)}
                                        className={deletingId === notify.id ? 'opacity-50' : ''}
                                    >
                                        {deletingId === notify.id ? (
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
            </CardContent>
        </Card>
    )
} 