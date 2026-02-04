"use client"

import { cn } from "@/src/utils"

interface LoadingProps {
  message?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'fullscreen' | 'inline' | 'overlay'
  showMessage?: boolean
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8'
}

const variantClasses = {
  fullscreen: 'flex min-h-screen items-center justify-center',
  inline: 'flex items-center justify-center p-4',
  overlay: 'absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm'
}

export function Loading({
  message = "加载中...",
  className = "",
  size = 'md',
  variant = 'fullscreen',
  showMessage = true
}: LoadingProps) {
  return (
    <div className={cn(variantClasses[variant], className)}>
      <div className="text-center">
        <div
          className={cn(
            "animate-spin rounded-full border-b-2 border-primary mx-auto",
            sizeClasses[size],
            showMessage && "mb-4"
          )}
        />
        {showMessage && (
          <p className="text-muted-foreground text-sm">{message}</p>
        )}
      </div>
    </div>
  )
}

// 便捷组件
export function InlineLoading({ message = "加载中...", size = 'sm' as const }) {
  return (
    <Loading
      variant="inline"
      size={size}
      message={message}
      className="py-2"
    />
  )
}

export function PageLoading({ message = "页面加载中..." }) {
  return (
    <Loading
      variant="fullscreen"
      size="lg"
      message={message}
    />
  )
}

// 仅显示spinner，不显示文字
export function Spinner({ size = 'md', className = "" }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  return (
    <Loading
      variant="inline"
      size={size}
      showMessage={false}
      className={cn("p-0", className)}
    />
  )
}
