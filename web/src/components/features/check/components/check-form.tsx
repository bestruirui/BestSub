import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { useCheckForm } from "../hooks"
import { UI_TEXT } from "../constants"
import {
  BasicInfoSection,
  BasicConfigSection,
  NotifyConfig,
  LogConfig,
  ExtraConfigSection
} from "./form-sections"
import { SubscriptionSection } from "@/src/components/shared/subscription-section"
import type { CheckRequest } from "@/src/types/check"

interface CheckFormProps {
  initialData?: CheckRequest | undefined
  formTitle: string
  isOpen: boolean
  onClose: () => void
  editingCheckId?: number | undefined
}

export function CheckForm({
  initialData,
  formTitle,
  isOpen,
  onClose,
  editingCheckId,
}: CheckFormProps) {
  const { form, onSubmit, isEditing } = useCheckForm({
    initialData,
    editingCheckId,
    onSuccess: onClose,
    isOpen,
  })

  const { control } = form

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl max-h-[80vh] overflow-y-auto scrollbar-hide"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>{formTitle}</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          <BasicInfoSection control={control} />

          <BasicConfigSection control={control} />

          <NotifyConfig control={control} />

          <LogConfig control={control} />

          <SubscriptionSection
            control={control}
            subIdField="task.sub_id"
            subIdExcludeField="task.sub_id_exclude"
          />

          <ExtraConfigSection control={control} />

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {isEditing ? UI_TEXT.UPDATE : UI_TEXT.CREATE}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              {UI_TEXT.CANCEL}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}