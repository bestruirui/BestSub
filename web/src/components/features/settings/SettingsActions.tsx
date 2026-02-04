import * as React from "react"
import { Button } from "@/src/components/ui/button"

interface SettingsActionsProps {
  onCancel: () => void
  isMobile?: boolean
  hasChanges?: boolean
}

export function SettingsActions({ onCancel, isMobile, hasChanges }: SettingsActionsProps) {
  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className={isMobile ? "flex-1 h-9 sm:h-10 text-sm" : "h-10"}
      >
        取消
      </Button>
      <Button
        type="submit"
        disabled={!hasChanges}
        className={isMobile ? "flex-1 h-9 sm:h-10 text-sm" : "h-10"}
      >
        保存设置
      </Button>
    </>
  )
}