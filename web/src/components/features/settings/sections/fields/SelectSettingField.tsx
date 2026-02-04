import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import type { BaseSettingProps } from "./types"
import { SettingCard } from "./SettingCard"

type SelectSettingFieldProps = BaseSettingProps & {
  value: string
  options: Array<{ label: string; value: string }>
  onChange: (value: string) => void
  placeholder?: string
}

export function SelectSettingField({
  title,
  description,
  value,
  options,
  onChange,
  placeholder = "选择选项",
}: SelectSettingFieldProps) {
  return (
    <SettingCard title={title} description={description}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-10">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </SettingCard>
  )
}
