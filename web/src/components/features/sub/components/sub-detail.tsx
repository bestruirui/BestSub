import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { formatTime, formatLastRunTime, getNextCronRunTime, formatDuration } from "@/src/utils"
import StatusBadge from "@/src/components/shared/status-badge"
import type { SubResponse } from "@/src/types/sub"

interface SubscriptionDetailProps {
    subscription: SubResponse | null
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export function SubDetail({
    subscription,
    isOpen,
    onOpenChange,
}: SubscriptionDetailProps) {
    if (!subscription) return null

    const formatSpeed = (speed: number) => ((speed || 0) / 1024 / 1024).toFixed(2)
    const getRiskColor = (risk: number) => {
        if (risk === 0) return 'text-green-600'
        if (risk <= 3) return 'text-yellow-600'
        return 'text-red-600'
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>订阅详情 - {subscription.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2">基本信息</h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                            <div className="space-y-2">
                                <div className="text-muted-foreground"><span>ID:</span> {subscription.id}</div>
                                <div className="text-muted-foreground"><span>名称:</span> {subscription.name}</div>
                                <div className="text-muted-foreground"><span>Cron:</span> {subscription.cron_expr}</div>
                                <div className="text-muted-foreground">
                                    <span>状态:</span> <StatusBadge status={subscription.status} />
                                </div>
                                {subscription.result?.duration && (
                                    <div className="text-muted-foreground"><span>运行耗时:</span> {formatDuration(subscription.result.duration)}</div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <div className="text-muted-foreground"><span>创建时间:</span> {formatTime(subscription.created_at) || '未知'}</div>
                                <div className="text-muted-foreground"><span>更新时间:</span> {formatTime(subscription.updated_at) || '未知'}</div>
                                <div className="text-muted-foreground"><span>最后运行:</span> {formatLastRunTime(subscription.result?.last_run)}</div>
                                <div className="text-muted-foreground"><span>下次运行:</span> {getNextCronRunTime(subscription.cron_expr, subscription.enable) || '未启用或无法计算'}</div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">配置信息</h3>
                        <div className="space-y-3 text-sm">
                            <div className="text-muted-foreground"><span>订阅链接:</span> {subscription.config.url}</div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-muted-foreground"><span>使用代理:</span> {subscription.config.proxy ? '是' : '否'}</div>
                                <div className="text-muted-foreground"><span>超时时间:</span> {subscription.config.timeout || 10}秒</div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">节点信息</h3>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="space-y-2">
                                <div className="text-muted-foreground"><span>原始节点:</span> <span className="font-medium">{subscription.result?.raw_count || 0}</span></div>
                                <div className="text-muted-foreground"><span>入库节点:</span> <span className="font-medium text-green-600">{subscription.info?.count || 0}</span></div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-muted-foreground"><span>平均上行:</span> {formatSpeed(subscription.info?.speed_up)} MB/s</div>
                                <div className="text-muted-foreground"><span>平均下行:</span> {formatSpeed(subscription.info?.speed_down)} MB/s</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-muted-foreground"><span>平均延迟:</span> {subscription.info?.delay || 0} ms</div>
                                <div className="text-muted-foreground"><span>风险等级:</span>
                                    <span className={`font-medium ml-1 ${getRiskColor(subscription.info?.risk || 0)}`}>
                                        {subscription.info?.risk || 0}/10
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">执行结果</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                                <div className="text-muted-foreground"><span>成功次数:</span> <span className="text-green-600 font-medium">{subscription.result?.success || 0}</span></div>
                                <div className="text-muted-foreground"><span>失败次数:</span> <span className="text-red-600 font-medium">{subscription.result?.fail || 0}</span></div>
                            </div>
                            <div>
                                <div className="text-muted-foreground"><span>运行消息:</span></div>
                                <div className="text-muted-foreground mt-1 p-2 bg-gray-50 rounded text-xs max-h-20 overflow-y-auto">
                                    {subscription.result?.msg || '无消息'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog >
    )
} 