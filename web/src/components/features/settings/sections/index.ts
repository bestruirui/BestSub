import type { ComponentType } from "react"
import type { Control } from "react-hook-form"
import type { FormValues } from "@/src/types/setting"
import { NotifySettingsSection } from "./NotifySettingsSection"
import { NodeSettingsSection } from "./NodeSettingsSection"
import { SystemSettingsSection } from "./SystemSettingsSection"
import { TaskSettingsSection } from "./TaskSettingsSection"

type SectionComponent = ComponentType<{ control: Control<FormValues> }>

interface SettingsSectionDefinition {
  id: string
  label: string
  Component: SectionComponent
}

export const SETTINGS_SECTIONS: SettingsSectionDefinition[] = [
  {
    id: "system-config",
    label: "系统配置",
    Component: SystemSettingsSection,
  },
  {
    id: "node-config",
    label: "节点配置",
    Component: NodeSettingsSection,
  },
  {
    id: "task-config",
    label: "任务配置",
    Component: TaskSettingsSection,
  },
  {
    id: "notify-config",
    label: "通知配置",
    Component: NotifySettingsSection,
  },
]
