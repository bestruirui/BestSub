"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, } from "@/src/components/ui/dialog"
import { InlineLoading } from "@/src/components/ui/loading"
import { useSettings, useUpdateSettings } from "@/src/lib/queries/setting-queries"
import { SettingsLayout } from "./SettingsLayout"
import { SettingsActions } from "./SettingsActions"
import type { FormValues, Setting } from "@/src/types/setting"
import { SETTINGS_SECTIONS } from "./sections"
import { cloneFormValues, mapSettingsToFormValues } from "./utils/value-mappers"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}


export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState(() => SETTINGS_SECTIONS[0]?.id ?? "")
  const updateSettingsMutation = useUpdateSettings()
  const { data: backendSettings, isLoading, error } = useSettings()

  const form = useForm<FormValues>({
    mode: 'onChange',
    shouldUnregister: false,
    shouldFocusError: true,
    defaultValues: {},
  })

  const { dirtyFields, isDirty } = form.formState

  useEffect(() => {
    if (backendSettings === undefined || isDirty) {
      return
    }

    const mappedValues = mapSettingsToFormValues(backendSettings)
    const currentValues = form.getValues()

    if (areFormValuesEqual(currentValues, mappedValues)) {
      return
    }

    form.reset(mappedValues, {
      keepDirty: false,
      keepDirtyValues: false,
      keepErrors: false,
      keepTouched: false,
      keepSubmitCount: false,
    })
  }, [backendSettings, form, isDirty])

  const nav = useMemo(
    () =>
      SETTINGS_SECTIONS.map((section) => ({
        id: section.id,
        name: section.label,
      })),
    []
  )

  const currentSection = useMemo(() => {
    if (!SETTINGS_SECTIONS.length) return null
    return (
      SETTINGS_SECTIONS.find((section) => section.id === activeTab) ??
      SETTINGS_SECTIONS[0]
    )
  }, [activeTab])

  const hasChanges = isDirty

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    if (!hasChanges) {
      onOpenChange(false)
      return
    }

    const changes: Setting[] = []
    const formValues = form.getValues()

    const dirtyKeys = Object.keys(dirtyFields) as Array<keyof FormValues>

    dirtyKeys.forEach((key) => {
      if (!dirtyFields[key]) return

      const value = formValues[key]
      if (value === undefined) return

      let stringValue: string

      if (Array.isArray(value)) {
        stringValue = value.join(',')
      } else if (typeof value === 'boolean') {
        stringValue = value ? 'true' : 'false'
      } else {
        stringValue = value === null ? '' : String(value)
      }

      changes.push({ key: String(key), value: stringValue })
    })

    if (changes.length > 0) {
      try {
        await updateSettingsMutation.mutateAsync(changes)
        const nextValues = cloneFormValues(formValues)

        form.reset(nextValues, {
          keepDirty: false,
          keepDirtyValues: false,
          keepErrors: false,
          keepTouched: false,
          keepSubmitCount: false,
        })
        onOpenChange(false)
      } catch (err) {
        console.error('Failed to save settings:', err)
      }
    } else {
      onOpenChange(false)
    }
  }, [hasChanges, dirtyFields, form, updateSettingsMutation, onOpenChange])

  const renderContent = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-[400px]">
          <InlineLoading message="正在加载设置..." size="sm" />
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-[400px] space-y-3 text-sm">
          <span className="text-destructive font-medium">设置加载失败</span>
          <span className="text-muted-foreground">
            {error instanceof Error ? error.message : '请稍后重试'}
          </span>
        </div>
      )
    }

    if (!currentSection) {
      return (
        <div className="text-center text-muted-foreground">
          暂无可用的设置项
        </div>
      )
    }

    const SectionComponent = currentSection.Component
    return <SectionComponent control={form.control} />
  }, [currentSection, form.control, error, isLoading])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 md:max-h-[600px] md:max-w-[800px] lg:max-w-[900px] max-h-[90vh] h-full md:h-auto w-[95vw] sm:w-[90vw] md:w-full">
        <SettingsLayout
          nav={nav}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSubmit={handleSubmit}
          renderActions={(isMobile) => (
            <SettingsActions
              onCancel={() => onOpenChange(false)}
              isMobile={!!isMobile}
              hasChanges={hasChanges}
            />
          )}
        >
          {renderContent}
        </SettingsLayout>
      </DialogContent>
    </Dialog>
  )
}

const areFormValuesEqual = (a: FormValues, b: FormValues): boolean => {
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)

  if (aKeys.length !== bKeys.length) {
    return false
  }

  return aKeys.every((key) => {
    const aValue = a[key]
    const bValue = b[key]

    if (Array.isArray(aValue) && Array.isArray(bValue)) {
      if (aValue.length !== bValue.length) {
        return false
      }

      return aValue.every((item, index) => item === bValue[index])
    }

    return aValue === bValue
  })
}
