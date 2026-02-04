"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
} from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { ProfileLayout } from "./ProfileLayout"
import { InlineLoading } from "@/src/components/ui/loading"
import { api } from "@/src/lib/api/client"
import { useAuth } from "@/src/components/providers"

interface ProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface FormData {
  username: string
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const { user, logout, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      username: user?.username || "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  })


  useEffect(() => {
    if (open && user) {
      form.reset({
        username: user.username,
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    }
  }, [open, user])

  const handleUpdateUsername = useCallback(async (data: FormData) => {
    if (!data.username.trim()) {
      toast.error("用户名不能为空")
      return
    }

    if (data.username === user?.username) {
      toast.error("新用户名不能与当前用户名相同")
      return
    }

    setIsSubmitting(true)
    try {
      await api.updateUsername({ username: data.username })
      updateUser({ ...user!, username: data.username })
      toast.success("用户名修改成功")
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || "用户名修改失败")
    } finally {
      setIsSubmitting(false)
    }
  }, [user, updateUser, onOpenChange])

  const handleChangePassword = useCallback(async (data: FormData) => {
    if (!data.oldPassword || !data.newPassword) {
      toast.error("请填写完整密码信息")
      return
    }

    if (data.newPassword !== data.confirmPassword) {
      toast.error("两次输入的新密码不一致")
      return
    }

    if (data.newPassword.length < 6) {
      toast.error("新密码长度至少为6位")
      return
    }

    setIsSubmitting(true)
    try {
      await api.changePassword({
        username: user!.username,
        old_password: data.oldPassword,
        new_password: data.newPassword
      })
      toast.success("密码修改成功，请重新登录")
      onOpenChange(false)
      // 密码修改成功后调用登出
      setTimeout(() => {
        logout()
      }, 1000)
    } catch (error: any) {
      toast.error(error.message || "密码修改失败")
    } finally {
      setIsSubmitting(false)
    }
  }, [user, logout, onOpenChange])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    const data = form.getValues()

    if (activeTab === "profile") {
      await handleUpdateUsername(data)
    } else if (activeTab === "password") {
      await handleChangePassword(data)
    }
  }, [activeTab, form, handleUpdateUsername, handleChangePassword])

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                {...form.register("username", { required: true })}
                placeholder="请输入用户名"
              />
              {form.formState.errors.username && (
                <p className="text-sm text-destructive">用户名不能为空</p>
              )}
            </div>
          </div>
        )

      case "password":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oldPassword">当前密码</Label>
              <Input
                id="oldPassword"
                type="password"
                {...form.register("oldPassword", { required: true })}
                placeholder="请输入当前密码"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">新密码</Label>
              <Input
                id="newPassword"
                type="password"
                {...form.register("newPassword", {
                  required: true,
                  minLength: 6
                })}
                placeholder="请输入新密码（至少6位）"
              />
              {form.formState.errors.newPassword && (
                <p className="text-sm text-destructive">密码长度至少为6位</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认新密码</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...form.register("confirmPassword", {
                  required: true,
                  validate: (value) => value === form.getValues("newPassword") || "两次输入的密码不一致"
                })}
                placeholder="请再次输入新密码"
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const renderActions = (isMobile?: boolean) => {
    const isDirty = form.formState.isDirty
    const canSubmit = activeTab === "profile"
      ? isDirty && form.getValues("username").trim() !== user?.username
      : isDirty && form.getValues("newPassword") === form.getValues("confirmPassword") && form.getValues("newPassword").length >= 6

    return (
      <>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          className={isMobile ? "flex-1 h-9 sm:h-10 text-sm" : "h-10"}
        >
          取消
        </Button>
        <Button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className={isMobile ? "flex-1 h-9 sm:h-10 text-sm" : "h-10"}
        >
          {isSubmitting ? <InlineLoading size="sm" /> : "保存"}
        </Button>
      </>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 md:max-h-[600px] md:max-w-[800px] lg:max-w-[900px] max-h-[90vh] h-full md:h-auto w-[95vw] sm:w-[90vw] md:w-full">
        <ProfileLayout
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSubmit={handleSubmit}
          renderActions={renderActions}
        >
          {renderContent()}
        </ProfileLayout>
      </DialogContent>
    </Dialog>
  )
}
