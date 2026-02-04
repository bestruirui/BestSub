import { Controller, type Control } from "react-hook-form"
import type { FormValues } from "@/src/types/setting"
import { NumberSettingField } from "./fields/NumberSettingField"
import { TASK_MAX_RETRY, TASK_MAX_THREAD, TASK_MAX_TIMEOUT } from "@/src/constant/settings-keys"

export function TaskSettingsSection({ control }: { control: Control<FormValues> }) {
  return (
    <div className="space-y-4">
      <Controller
        name={TASK_MAX_THREAD}
        control={control}
        render={({ field }) => (
          <NumberSettingField
            title="最大线程数"
            value={field.value}
            onChange={field.onChange}
            min={1}
          />
        )}
      />

      <Controller
        name={TASK_MAX_TIMEOUT}
        control={control}
        render={({ field }) => (
          <NumberSettingField
            title="任务最大超时时间（秒）"
            value={field.value}
            onChange={field.onChange}
            min={1}
          />
        )}
      />

      <Controller
        name={TASK_MAX_RETRY}
        control={control}
        render={({ field }) => (
          <NumberSettingField
            title="任务最大重试次数"
            value={field.value}
            onChange={field.onChange}
            min={0}
          />
        )}
      />
    </div>
  )
}
