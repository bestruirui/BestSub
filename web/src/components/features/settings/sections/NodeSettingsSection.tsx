import { Controller, useWatch, type Control } from "react-hook-form"
import type { FormValues } from "@/src/types/setting"
import { BooleanSettingField } from "./fields/BooleanSettingField"
import { MultiSelectSettingField } from "./fields/MultiSelectSettingField"
import { NumberSettingField } from "./fields/NumberSettingField"
import { TextSettingField } from "./fields/TextSettingField"
import { PROTOCOL_OPTIONS } from "@/src/constant/protocols"
import {
  NODE_POOL_SIZE,
  NODE_PROTOCOL_FILTER,
  NODE_PROTOCOL_FILTER_ENABLE,
  NODE_PROTOCOL_FILTER_MODE,
  NODE_TEST_TIMEOUT,
  NODE_TEST_URL,
} from "@/src/constant/settings-keys"

export function NodeSettingsSection({ control }: { control: Control<FormValues> }) {
  const protocolFilterEnabled = Boolean(useWatch({ control, name: NODE_PROTOCOL_FILTER_ENABLE }))

  return (
    <div className="space-y-4">
      <Controller
        name={NODE_POOL_SIZE}
        control={control}
        render={({ field }) => (
          <NumberSettingField
            title="节点池大小"
            value={field.value}
            onChange={field.onChange}
            min={0}
          />
        )}
      />

      <Controller
        name={NODE_TEST_URL}
        control={control}
        render={({ field }) => (
          <TextSettingField
            title="默认测试地址"
            value={String(field.value ?? "")}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        name={NODE_TEST_TIMEOUT}
        control={control}
        render={({ field }) => (
          <NumberSettingField
            title="默认测试超时时间（秒）"
            value={field.value}
            onChange={field.onChange}
            min={1}
          />
        )}
      />

      <Controller
        name={NODE_PROTOCOL_FILTER_ENABLE}
        control={control}
        render={({ field }) => (
          <BooleanSettingField
            title="全局协议过滤启用"
            description="是否启用全局协议过滤"
            checked={Boolean(field.value)}
            onCheckedChange={field.onChange}
          />
        )}
      />

      {protocolFilterEnabled && (
        <>
          <Controller
            name={NODE_PROTOCOL_FILTER_MODE}
            control={control}
            render={({ field }) => (
          <BooleanSettingField
            title="全局协议过滤模式"
            description="关闭为排除,打开为包含"
            checked={Boolean(field.value)}
            onCheckedChange={field.onChange}
          />
            )}
          />

          <Controller
            name={NODE_PROTOCOL_FILTER}
            control={control}
            render={({ field }) => (
              <MultiSelectSettingField
                title="全局协议过滤"
                value={Array.isArray(field.value) ? field.value : []}
                options={PROTOCOL_OPTIONS}
                onChange={field.onChange}
              />
            )}
          />
        </>
      )}
    </div>
  )
}
