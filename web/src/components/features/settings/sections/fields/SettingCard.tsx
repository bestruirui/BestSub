import type { ReactNode } from "react"

type SettingCardProps = {
  title: string
  description?: ReactNode
  action?: ReactNode
  actionAlignment?: 'center' | 'start'
  children?: ReactNode
}

export function SettingCard({ title, description, action, actionAlignment = 'start', children }: SettingCardProps) {
  const headerAlignment = action ? (actionAlignment === 'center' ? 'items-center' : 'items-start') : 'items-start'

  return (
    <div className="p-4 border rounded-lg bg-card hover:shadow-sm transition-all space-y-3">
      <div className={`flex justify-between gap-4 ${headerAlignment}`}>
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">{title}</p>
          {description && (
            <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
          )}
        </div>
        {action ? (
          <div className="flex-shrink-0">
            {action}
          </div>
        ) : null}
      </div>
      {children}
    </div>
  )
}
