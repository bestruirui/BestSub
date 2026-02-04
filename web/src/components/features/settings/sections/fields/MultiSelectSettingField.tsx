import { Badge } from "@/src/components/ui/badge"
import type { BaseSettingProps } from "./types"
import { SettingCard } from "./SettingCard"

type MultiSelectSettingFieldProps = BaseSettingProps & {
  value: string[]
  options: string[]
  onChange: (value: string[]) => void
}

export function MultiSelectSettingField({
  title,
  description,
  value,
  options,
  onChange,
}: MultiSelectSettingFieldProps) {
  const toggleValue = (option: string) => {
    const exists = value.includes(option)
    const nextValues = exists
      ? value.filter((item) => item !== option)
      : [...value, option]

    const ordered = options.filter((item) => nextValues.includes(item))
    onChange(ordered)
  }

  return (
    <SettingCard title={title} description={description}>
      <div className="flex flex-wrap gap-2">
        {options.length === 0 && (
          <p className="text-xs text-muted-foreground">暂无可选项</p>
        )}
        {options.map((option) => {
          const active = value.includes(option)

          return (
            <Badge
              key={option}
              variant={active ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                active
                  ? "hover:bg-red-100 hover:text-red-700"
                  : "hover:bg-green-100 hover:text-green-700"
              }`}
              onClick={() => toggleValue(option)}
            >
              {option} {active ? "×" : "+"}
            </Badge>
          )
        })}
      </div>
    </SettingCard>
  )
}
