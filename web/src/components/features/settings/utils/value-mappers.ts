import { BOOLEAN_SETTING_KEYS, MULTI_SELECT_SETTING_KEYS, NUMBER_SETTING_KEYS } from "@/src/constant/settings-keys"
import type { FormValue, FormValues, Setting } from "@/src/types/setting"

const parseBoolean = (value: string | undefined): boolean => {
  return value?.trim().toLowerCase() === "true"
}

const parseNumber = (value: string | undefined): number | string => {
  if (!value?.length) {
    return ""
  }

  const parsed = Number(value)
  return Number.isNaN(parsed) ? "" : parsed
}

const parseMultiSelect = (value: string | undefined): string[] => {
  if (!value) return []

  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

const parseValue = (key: string, value: string | undefined): FormValue => {
  if (BOOLEAN_SETTING_KEYS.has(key)) {
    return parseBoolean(value)
  }

  if (NUMBER_SETTING_KEYS.has(key)) {
    return parseNumber(value)
  }

  if (MULTI_SELECT_SETTING_KEYS.has(key)) {
    return parseMultiSelect(value)
  }

  return value ?? ""
}

export const mapSettingsToFormValues = (settings: Setting[] | undefined): FormValues => {
  if (!settings || settings.length === 0) {
    return {}
  }

  return settings.reduce<FormValues>((acc, setting) => {
    if (!setting.key) return acc

    acc[setting.key] = parseValue(setting.key, setting.value)
    return acc
  }, {})
}

export const cloneFormValues = (values: FormValues): FormValues => {
  const clonedEntries = Object.entries(values).map(([key, value]) => {
    if (Array.isArray(value)) {
      return [key, [...value]] as const
    }

    return [key, value] as const
  })

  return Object.fromEntries(clonedEntries) as FormValues
}
