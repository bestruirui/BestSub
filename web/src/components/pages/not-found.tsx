"use client"

import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { Home, ArrowLeft } from "lucide-react"
import { useRouter } from "@/src/router"

interface NotFoundProps {
    path?: string
}

export function NotFound({ path }: NotFoundProps) {
    const { navigate } = useRouter()

    const handleGoHome = () => {
        navigate('/dashboard')
    }

    const handleGoBack = () => {
        if (typeof window !== 'undefined' && window.history.length > 1) {
            window.history.back()
        } else {
            navigate('/dashboard')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
            <Card className="w-full max-w-md mx-auto shadow-lg">
                <CardContent className="p-8 text-center">
                    <div className="mb-6">
                        <div className="text-6xl font-bold text-primary/80 mb-2">404</div>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-foreground mb-3">
                            页面未找到
                        </h1>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            抱歉，您访问的页面不存在或已被移动。
                        </p>
                        {path && (
                            <p className="text-sm text-muted-foreground">
                                路径: <code className="bg-muted px-2 py-1 rounded text-xs">{path}</code>
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            onClick={handleGoHome}
                            className="flex items-center gap-2"
                        >
                            <Home className="w-4 h-4" />
                            返回首页
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleGoBack}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            返回上页
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
