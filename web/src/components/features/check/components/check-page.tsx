import { useState, useCallback } from "react"
import { Button } from "@/src/components/ui/button"
import { Plus } from "lucide-react"
import { CheckForm } from "./check-form"
import { CheckList } from "./check-list"
import { UI_TEXT } from "../constants"
import { convertCheckResponseToRequest } from "../utils"
import type { CheckResponse, CheckRequest } from "@/src/types/check"

export function CheckPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingCheck, setEditingCheck] = useState<CheckResponse | null>(null)
    const [formData, setFormData] = useState<CheckRequest | undefined>(undefined)

    const openEditDialog = useCallback((check: CheckResponse) => {
        setEditingCheck(check)
        setFormData(convertCheckResponseToRequest(check))
        setIsDialogOpen(true)
    }, [])

    const openCreateDialog = useCallback(() => {
        setEditingCheck(null)
        setFormData(undefined)
        setIsDialogOpen(true)
    }, [])

    const closeFormDialog = useCallback(() => {
        setIsDialogOpen(false)
        setTimeout(() => {
            setEditingCheck(null)
            setFormData(undefined)
        }, 200)
    }, [])

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center justify-between px-4 lg:px-6">
                <div>
                    <h1 className="text-2xl font-bold">检测任务</h1>
                </div>

                <Button onClick={openCreateDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    {UI_TEXT.CREATE_CHECK}
                </Button>
            </div>

            <CheckForm
                {...(formData && { initialData: formData })}
                formTitle={editingCheck ? UI_TEXT.EDIT_CHECK : UI_TEXT.CREATE_CHECK}
                isOpen={isDialogOpen}
                onClose={closeFormDialog}
                editingCheckId={editingCheck?.id}
            />

            <div className="px-4 lg:px-6">
                <CheckList onEdit={openEditDialog} />
            </div>
        </div>
    )
}