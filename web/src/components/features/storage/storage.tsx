"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"

export function StoragePage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div>
          <h1 className="text-2xl font-bold">存储配置</h1>
          <p className="text-muted-foreground">配置您的存储设置</p>
        </div>
      </div>

      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>存储设置</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              存储配置功能正在开发中...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
