"use client"

import { useState } from "react"
import { cn } from "@/src/utils"
import { Button } from "@/src/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { ApiError } from "@/src/lib/api/client"
import { Spinner } from "@/src/components/ui/loading"
import { useAuth } from "@/src/components/providers"

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const { login, isLoading } = useAuth()

    const getErrorMessage = (error: unknown): string => {
        if (error instanceof ApiError) {
            switch (error.code) {
                case 401:
                    return "用户名或密码错误"
                case 429:
                    return "登录尝试过于频繁，请稍后再试"
                case 500:
                    return "服务器错误，请稍后再试"
                default:
                    return "登录失败，请检查网络连接"
            }
        }

        if (error instanceof Error && error.message.includes('fetch')) {
            return "网络连接失败，请检查网络设置"
        }

        return "登录失败，请稍后再试"
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!username.trim() || !password) {
            setError("请输入用户名和密码")
            return
        }

        try {
            await login(username.trim(), password)
        } catch (err) {
            setError(getErrorMessage(err))
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>登录到您的账户</CardTitle>
                    <CardDescription>
                        输入您的用户名和密码来登录
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            {error && (
                                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-950 dark:text-red-400 dark:border-red-800">
                                    {error}
                                </div>
                            )}

                            <div className="grid gap-3">
                                <Label htmlFor="username">用户名</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="请输入用户名"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">密码</Label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        忘记密码？
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="请输入密码"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading || !username.trim() || !password}
                                >
                                    {isLoading ? (
                                        <>
                                            <Spinner size="sm" className="mr-2 border-white" />
                                            登录中...
                                        </>
                                    ) : (
                                        "登录"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}