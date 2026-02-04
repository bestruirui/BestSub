import { useState, useCallback } from "react"
import { Button } from "@/src/components/ui/button"
import { Plus } from "lucide-react"
import { ShareForm } from "./share-form"
import { ShareList } from "./share-list"
import { ShareCopyDialog } from "./share-copy"
import { UI_TEXT } from "../constants"
import type { ShareResponse, ShareRequest } from "@/src/types/share"

export function SharePage() {
    // 表单状态
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingShare, setEditingShare] = useState<ShareResponse | null>(null)
    const [formData, setFormData] = useState<ShareRequest | undefined>(undefined)

    // 复制对话框状态
    const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false)
    const [copyUrl, setCopyUrl] = useState('')

    // 打开编辑对话框
    const openEditDialog = useCallback((share: ShareResponse) => {
        setEditingShare(share)
        // 从 ShareResponse 转换为 ShareRequest，移除只读字段
        const { id: _id, access_count: _access_count, ...shareRequest } = share
        setFormData(shareRequest)
        setIsDialogOpen(true)
    }, [])

    // 打开创建对话框
    const openCreateDialog = useCallback(() => {
        setEditingShare(null)
        setFormData(undefined)
        setIsDialogOpen(true)
    }, [])

    // 关闭表单对话框
    const closeFormDialog = useCallback(() => {
        setIsDialogOpen(false)
        // 延迟清理状态，等待对话框关闭动画完成
        setTimeout(() => {
            setEditingShare(null)
            setFormData(undefined)
        }, 200) // 对话框关闭动画通常是 150-200ms
    }, [])

    // 打开复制对话框
    const openCopyDialog = useCallback((fullUrl: string) => {
        setCopyUrl(fullUrl)
        setIsCopyDialogOpen(true)
    }, [])

    // 关闭复制对话框
    const closeCopyDialog = useCallback(() => {
        setIsCopyDialogOpen(false)
        setCopyUrl('')
    }, [])

    // 获取表单标题
    const formTitle = editingShare ? UI_TEXT.EDIT_SHARE : UI_TEXT.CREATE_SHARE

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* 页面头部 */}
            <div className="flex items-center justify-between px-4 lg:px-6">
                <div>
                    <h1 className="text-2xl font-bold">分享管理</h1>
                </div>

                <Button onClick={openCreateDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    {UI_TEXT.CREATE_SHARE}
                </Button>
            </div>

            {/* 分享表单对话框 */}
            <ShareForm
                {...(formData && { initialData: formData })}
                formTitle={formTitle}
                isOpen={isDialogOpen}
                onClose={closeFormDialog}
                editingShareId={editingShare?.id}
            />

            {/* 分享列表 */}
            <div className="px-4 lg:px-6">
                <ShareList
                    onEdit={openEditDialog}
                    openCopyDialog={openCopyDialog}
                />
            </div>

            {/* 复制链接对话框 */}
            <ShareCopyDialog
                fullUrl={copyUrl}
                isOpen={isCopyDialogOpen}
                onClose={closeCopyDialog}
            />
        </div>
    )
}
