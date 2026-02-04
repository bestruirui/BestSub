import { Input } from "@/src/components/ui/input"
import type { BaseSettingProps } from "./types"
import { SettingCard } from "./SettingCard"

interface NumberSettingFieldProps extends BaseSettingProps {
  value: unknown
  onChange: (value: number | string) => void
  min?: number
}

export function NumberSettingField({
  title,
  description,
  value,
  onChange,
  min,
}: NumberSettingFieldProps) {
  const inputValue = getNumberInputValue(value)

  return (
    <SettingCard title={title} description={description}>
      <Input
        type="number"
        value={inputValue}
        min={min}
        onChange={(event) => {
          const nextValue = event.target.value
          if (nextValue === "") {
            onChange("")
            return
          }
          onChange(Number(nextValue))
        }}
        className="h-10"
      />
    </SettingCard>
  )
}

const getNumberInputValue = (value: unknown): string | number => {
  if (typeof value === "number") {
    return Number.isNaN(value) ? "" : value
  }

  if (typeof value === "string") {
    return value
  }

  return ""
}
