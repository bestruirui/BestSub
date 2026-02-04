import { Controller, useWatch, type Control } from "react-hook-form"
import type { FormValues } from "@/src/types/setting"
import {
  LOG_RETENTION_DAYS,
  PROXY_ENABLE,
  PROXY_URL,
  SUBCONV_URL,
  SUBCONV_URL_PROXY,
  SUB_DISABLE_AUTO,
} from "@/src/constant/settings-keys"
import { BooleanSettingField } from "./fields/BooleanSettingField"
import { NumberSettingField } from "./fields/NumberSettingField"
import { TextSettingField } from "./fields/TextSettingField"

export function SystemSettingsSection({ control }: { control: Control<FormValues> }) {
  const proxyEnabled = Boolean(useWatch({ control, name: PROXY_ENABLE }))

  return (
    <div className="space-y-4">
      <Controller
        name={PROXY_ENABLE}
        control={control}
        render={({ field }) => (
          <BooleanSettingField
            title="代理"
            description="是否启用代理"
            checked={Boolean(field.value)}
            onCheckedChange={field.onChange}
          />
        )}
      />

      {proxyEnabled && (
        <Controller
          name={PROXY_URL}
          control={control}
          render={({ field }) => (
            <TextSettingField
              title="代理地址"
              value={String(field.value ?? "")}
              onChange={field.onChange}
            />
          )}
        />
      )}

      <Controller
        name={LOG_RETENTION_DAYS}
        control={control}
        render={({ field }) => (
          <NumberSettingField
            title="日志保留天数"
            value={field.value}
            onChange={field.onChange}
            min={0}
          />
        )}
      />

      <Controller
        name={SUBCONV_URL}
        control={control}
        render={({ field }) => (
          <TextSettingField
            title="外部订阅转换地址"
            description={
              <>
                使用{" "}
                <a
                  href="https://github.com/bestruirui/SubWorker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  SubWorker
                </a>{" "}
                或已有的 SubStore 地址, 示例: http://ip:port/xxxxxxx
              </>
            }
            value={String(field.value ?? "")}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        name={SUBCONV_URL_PROXY}
        control={control}
        render={({ field }) => (
          <BooleanSettingField
            title="外部订阅转换代理"
            description="是否启用代理访问外部订阅转换"
            checked={Boolean(field.value)}
            onCheckedChange={field.onChange}
          />
        )}
      />

      <Controller
        name={SUB_DISABLE_AUTO}
        control={control}
        render={({ field }) => (
          <NumberSettingField
            title="自动禁用订阅"
            description="当订阅获取节点数量为0的次数大于该值时,自动禁用订阅,0为不自动禁用"
            value={field.value}
            onChange={field.onChange}
            min={0}
          />
        )}
      />
    </div>
  )
}
