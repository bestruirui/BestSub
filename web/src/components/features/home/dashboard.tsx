"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Construction } from "lucide-react"

export function DashboardPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
            <Construction className="h-8 w-8 text-orange-600" />
          </div>
          <CardTitle className="text-xl">仪表盘正在开发中</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            我们正在努力完善仪表盘功能，敬请期待！
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            您可以通过侧边栏访问其他功能模块
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
