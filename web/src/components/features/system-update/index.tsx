"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { marked } from 'marked'

import {
  IconDownload,
  IconLoader2,
  IconRefresh,
  IconAlertCircle,
  IconCheck,
} from "@tabler/icons-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion"
import { api } from "@/src/lib/api/client"
import type { UpdateResponse, UpdateComponent, SystemVersion } from "@/src/types"

interface SystemUpdateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ComponentStatus {
  name: UpdateComponent
  displayName: string
  currentVersion: string
  latestVersion: string
  publishedAt: string
  updateBody: string
  isUpdating: boolean
  updateSuccess: boolean | null
  updateError: string | null
}

export function SystemUpdateDialog({ open, onOpenChange }: SystemUpdateDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [components, setComponents] = useState<ComponentStatus[]>([
    {
      name: 'bestsub',
      displayName: 'BestSub 后端',
      currentVersion: '加载中...',
      latestVersion: '加载中...',
      publishedAt: '',
      updateBody: '',
      isUpdating: false,
      updateSuccess: null,
      updateError: null,
    }
  ])

  const fetchUpdateInfo = async () => {
    setIsLoading(true)
    try {
      const [info, systemVersion] = await Promise.all([
        api.getLatestUpdates(),
        api.getSystemVersion()
      ]) as [UpdateResponse, SystemVersion]

      setComponents(prev => prev.map(comp => {
        let currentVersion = comp.currentVersion
        let latestVersion = comp.latestVersion
        const latest = info[comp.name]

        if (comp.name === 'bestsub') {
          currentVersion = systemVersion.version
          latestVersion = info.bestsub.tag_name
        }

        return {
          ...comp,
          currentVersion,
          latestVersion,
          publishedAt: latest.published_at,
          updateBody: latest.body
        }
      }))
    } catch (error) {
      toast.error("获取更新信息失败" + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async (componentName: UpdateComponent) => {
    setComponents(prev =>
      prev.map(comp =>
        comp.name === componentName
          ? { ...comp, isUpdating: true, updateSuccess: null as boolean | null, updateError: null as string | null }
          : comp
      )
    )

    try {
      await api.updateComponent(componentName)
      setComponents(prev =>
        prev.map(comp =>
          comp.name === componentName
            ? { ...comp, isUpdating: false, updateSuccess: true, updateError: null }
            : comp
        )
      )
      toast.success(`${components.find(c => c.name === componentName)?.displayName} 更新成功`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新失败'
      setComponents(prev =>
        prev.map(comp =>
          comp.name === componentName
            ? { ...comp, isUpdating: false, updateSuccess: false, updateError: errorMessage }
            : comp
        )
      )
      toast.error(`${components.find(c => c.name === componentName)?.displayName} 更新失败`)
    }
  }

  useEffect(() => {
    if (open) {
      fetchUpdateInfo()
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div>
            <DialogTitle className="flex items-center gap-2">
              <IconRefresh className="h-5 w-5" />
              系统更新
            </DialogTitle>
            <DialogDescription className="mt-1">
              查看最新版本和更新系统组件
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-4 max-h-[60vh] overflow-y-auto scrollbar-hide">
            {components.map((component) => (
              <Card key={component.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{component.displayName}</CardTitle>
                    <div className="flex items-center gap-2">
                      {component.updateSuccess === true && (
                        <Badge variant="default" className="bg-green-600">
                          更新成功
                        </Badge>
                      )}
                      {component.updateSuccess === false && (
                        <Badge variant="destructive">
                          更新失败
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="text-sm">
                  <div>
                    <span>当前版本: </span>
                    <span>{component.currentVersion}</span>
                  </div>
                  <div>
                    <span>最新版本: </span>
                    <span className={`${component.latestVersion !== '加载中...' && component.currentVersion !== component.latestVersion ? 'text-orange-600' : ''}`}>
                      {component.latestVersion}
                    </span>

                    {component.updateBody && (
                      <Accordion type="single" collapsible>
                        <AccordionItem value="update-content" >
                          <AccordionTrigger className="hover:no-underline">
                            <span>查看更新内容</span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div
                              className=" [&_a]:text-blue-600 leading-relaxed [&_ul]:list-inside [&_li]:list-disc [&_li]:ml-4"
                              dangerouslySetInnerHTML={{
                                __html: marked.parse(component.updateBody)
                              }}
                            />
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}

                    {component.updateError && (
                      <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-2 rounded">
                        <IconAlertCircle className="h-4 w-4" />
                        {component.updateError}
                      </div>
                    )}

                    <Button
                      onClick={() => handleUpdate(component.name)}
                      disabled={component.isUpdating || component.latestVersion === component.currentVersion || component.latestVersion === '加载中...'}
                      className="w-full"
                    >
                      {component.isUpdating ? (
                        <>
                          <IconLoader2 className="h-4 w-4 animate-spin mr-2" />
                          更新中...
                        </>
                      ) : component.latestVersion === component.currentVersion ? (
                        <>
                          <IconCheck className="h-4 w-4 mr-2" />
                          已是最新版本
                        </>
                      ) : (
                        <>
                          <IconDownload className="h-4 w-4 mr-2" />
                          立即更新
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              onClick={fetchUpdateInfo}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <IconLoader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <IconRefresh className="h-4 w-4 mr-2" />
              )}
              刷新版本
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
