import { Controller, type Control } from "react-hook-form"
import type { FormValues } from "@/src/types/setting"
import { NumberSettingField } from "./fields/NumberSettingField"
import { NOTIFY_ID, NOTIFY_OPERATION } from "@/src/constant/settings-keys"

export function NotifySettingsSection({ control }: { control: Control<FormValues> }) {
  return (
    <div className="space-y-4">
      <Controller
        name={NOTIFY_OPERATION}
        control={control}
        render={({ field }) => (
          <NumberSettingField
            title="需要通知的操作类型"
            value={field.value}
            onChange={field.onChange}
            min={0}
          />
        )}
      />

      <Controller
        name={NOTIFY_ID}
        control={control}
        render={({ field }) => (
          <NumberSettingField
            title="系统默认通知渠道"
            value={field.value}
            onChange={field.onChange}
            min={0}
          />
        )}
      />
    </div>
  )
}
