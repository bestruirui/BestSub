import { Input } from "@/src/components/ui/input"
import type { BaseSettingProps } from "./types"
import { SettingCard } from "./SettingCard"

type TextSettingFieldProps = BaseSettingProps & {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  inputType?: React.ComponentProps<typeof Input>["type"]
}

export function TextSettingField({
  title,
  description,
  value,
  onChange,
  placeholder,
  inputType = "text",
}: TextSettingFieldProps) {
  return (
    <SettingCard title={title} description={description}>
      <Input
        type={inputType}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10"
      />
    </SettingCard>
  )
}
