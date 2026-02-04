"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme: currentTheme } = useTheme()
  const { theme: _ignoredTheme, ...restProps } = props

  const resolvedTheme: ToasterProps["theme"] =
    currentTheme === "light" || currentTheme === "dark" || currentTheme === "system"
      ? currentTheme
      : "system"

  return (
    <Sonner
      theme={resolvedTheme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...restProps}
    />
  )
}

export { Toaster }
