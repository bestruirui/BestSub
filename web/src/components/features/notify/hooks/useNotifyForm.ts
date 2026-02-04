import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { api } from '@/src/lib/api/client'
import type { NotifyRequest, NotifyResponse, DynamicConfigItem } from '@/src/types'


const DEFAULT_FORM_DATA: NotifyRequest = {
    name: '',
    type: '',
    config: {}
}

interface UseNotifyFormProps {
    onSuccess: () => void
}

export function useNotifyForm({ onSuccess }: UseNotifyFormProps) {
    const [formData, setFormData] = useState<NotifyRequest>(DEFAULT_FORM_DATA)
    const [notifyChannels, setNotifyChannels] = useState<string[]>([])
    const [channelConfigs, setChannelConfigs] = useState<Record<string, DynamicConfigItem[]>>({})
    const [isLoadingChannels, setIsLoadingChannels] = useState(false)
    const [isLoadingConfigs, setIsLoadingConfigs] = useState(false)
    const [editingNotify, setEditingNotify] = useState<NotifyResponse | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)


    const loadNotifyChannels = useCallback(async () => {
        try {
            setIsLoadingChannels(true)
            const channels = await api.getNotifyChannels()
            setNotifyChannels(channels)
        } catch (error) {
            console.error('Failed to load notify channels:', error)
            toast.error('加载通知渠道失败')
        } finally {
            setIsLoadingChannels(false)
        }
    }, [])

    const loadChannelConfig = useCallback(async (channel: string) => {
        try {
            setIsLoadingConfigs(true)
            const configs = await api.getNotifyChannelConfig(channel)
            if (Array.isArray(configs)) {
                setChannelConfigs(prev => ({ ...prev, [channel]: configs }))
            }
        } catch (error) {
            console.error('Failed to load channel config:', error)
            toast.error('加载渠道配置失败')
        } finally {
            setIsLoadingConfigs(false)
        }
    }, [])

    const handleChannelChange = useCallback(async (channel: string) => {
        setFormData(prev => ({ ...prev, type: channel, config: {} }))

        if (channel && !channelConfigs[channel]) {
            await loadChannelConfig(channel)
        }
    }, [channelConfigs, loadChannelConfig])

    const updateFormField = useCallback((field: keyof NotifyRequest, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }, [])

    const updateConfigField = useCallback((field: string, value: string | boolean | number) => {
        setFormData(prev => ({
            ...prev,
            config: { ...prev.config, [field]: value }
        }))
    }, [])

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name.trim()) {
            toast.error('请输入通知名称')
            return
        }

        if (!formData.type) {
            toast.error('请选择通知渠道')
            return
        }

        try {
            // 处理配置数据，将空值替换为 default 值
            const processedConfig = { ...formData.config }
            const configs = channelConfigs[formData.type] || []

            configs.forEach(config => {
                const value = processedConfig[config.key]
                // 如果值为空且有 default 值，则使用 default 值
                if ((value === undefined || value === '' || value === null) && config.value) {
                    processedConfig[config.key] = config.value
                }
            })

            const requestData: NotifyRequest = {
                name: formData.name.trim(),
                type: formData.type,
                config: processedConfig
            }

            if (editingNotify) {
                await api.updateNotify(editingNotify.id, requestData)
                toast.success('通知配置更新成功')
            } else {
                await api.createNotify(requestData)
                toast.success('通知配置创建成功')
            }

            setFormData(DEFAULT_FORM_DATA)
            setEditingNotify(null)
            setIsDialogOpen(false)
            onSuccess()
        } catch (error) {
            console.error('Failed to submit notify form:', error)
            toast.error(editingNotify ? '更新通知配置失败' : '创建通知配置失败')
        }
    }, [formData, editingNotify, onSuccess, channelConfigs])

    const handleEdit = useCallback((notify: NotifyResponse) => {
        setFormData({
            name: notify.name,
            type: notify.type,
            config: notify.config
        })
        setEditingNotify(notify)
        setIsDialogOpen(true)

        // 确保渠道配置已加载
        if (notify.type && !channelConfigs[notify.type]) {
            loadChannelConfig(notify.type)
        }
    }, [channelConfigs, loadChannelConfig])

    const openCreateDialog = useCallback(async () => {
        if (notifyChannels.length === 0) {
            await loadNotifyChannels()
        }
        setFormData(DEFAULT_FORM_DATA)
        setEditingNotify(null)
        setIsDialogOpen(true)
    }, [notifyChannels.length, loadNotifyChannels])

    const closeDialog = useCallback(() => {
        setFormData(DEFAULT_FORM_DATA)
        setEditingNotify(null)
        setIsDialogOpen(false)
    }, [])

    return {
        formData,
        notifyChannels,
        channelConfigs,
        isLoadingChannels,
        isLoadingConfigs,
        editingNotify,
        isDialogOpen,
        updateFormField,
        updateConfigField,
        handleChannelChange,
        handleSubmit,
        handleEdit,
        openCreateDialog,
        closeDialog
    }
} 