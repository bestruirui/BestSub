import type { BaseSettingProps } from "./types"
import { SettingCard } from "./SettingCard"
import { Switch } from "@/src/components/ui/switch"

interface BooleanSettingFieldProps extends BaseSettingProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function BooleanSettingField({
  title,
  description,
  checked,
  onCheckedChange,
}: BooleanSettingFieldProps) {
  return (
    <SettingCard
      title={title}
      description={description}
      action={<Switch checked={checked} onCheckedChange={onCheckedChange} />}
      actionAlignment="center"
    />
  )
}
