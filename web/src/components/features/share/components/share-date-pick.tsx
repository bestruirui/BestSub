"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Calendar } from "@/src/components/ui/calendar"
import { Label } from "@/src/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover"

interface Calendar22Props {
  value?: number
  onChange?: (timestamp: number) => void
}

export function Calendar22({
  value = 0,
  onChange,
}: Calendar22Props) {
  const [open, setOpen] = React.useState(false)

  // 将时间戳转换为日期对象
  const selectedDate = React.useMemo(() => {
    if (!value || value === 0) return undefined
    return new Date(value * 1000)
  }, [value])

  // 处理日期选择
  const handleDateSelect = React.useCallback((date: Date | undefined) => {
    if (date && onChange) {
      const timestamp = Math.floor(date.getTime() / 1000)
      onChange(timestamp)
    } else if (!date && onChange) {
      onChange(0)
    }
    setOpen(false)
  }, [onChange])

  // 处理"永不过期"按钮点击
  const handleNeverExpires = React.useCallback(() => {
    if (onChange) {
      onChange(0)
    }
    setOpen(false)
  }, [onChange])

  // 显示文本
  const displayText = React.useMemo(() => {
    if (!value || value === 0) {
      return "永不过期"
    }
    if (selectedDate) {
      return selectedDate.toLocaleDateString('zh-CN')
    }
    return "选择日期"
  }, [selectedDate, value])

  // 禁用过去的日期
  const isDateDisabled = React.useCallback((date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }, [])

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="date" className="px-1">
        过期时间
      </Label>

      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-full justify-between font-normal"
            aria-expanded={open}
            aria-haspopup="dialog"
          >
            <span className={selectedDate ? "" : "text-muted-foreground"}>
              {displayText}
            </span>
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto overflow-hidden p-0 !z-[60]"
          align="start"
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            captionLayout="dropdown"
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
          />

          <div className="border-t p-3 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNeverExpires}
              type="button"
            >
              永不过期
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
