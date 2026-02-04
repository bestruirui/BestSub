'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/src/components/ui/alert-dialog'

interface AlertOptions {
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
}

interface AlertContextType {
  confirm: (options?: AlertOptions) => Promise<boolean>
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export function useAlert() {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider')
  }
  return context
}

interface AlertState {
  isOpen: boolean
  title: string
  description: string
  confirmText: string
  cancelText: string
  variant: 'default' | 'destructive'
  resolve: ((value: boolean) => void) | null
}

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alertState, setAlertState] = useState<AlertState>({
    isOpen: false,
    title: '确认操作',
    description: '您确定要执行此操作吗？',
    confirmText: '确认',
    cancelText: '取消',
    variant: 'default',
    resolve: null,
  })

  const confirm = useCallback((options: AlertOptions = {}): Promise<boolean> => {
    return new Promise((resolve) => {
      setAlertState({
        isOpen: true,
        title: options.title || '确认操作',
        description: options.description || '您确定要执行此操作吗？',
        confirmText: options.confirmText || '确认',
        cancelText: options.cancelText || '取消',
        variant: options.variant || 'default',
        resolve,
      })
    })
  }, [])

  const handleConfirm = useCallback(() => {
    alertState.resolve?.(true)
    setAlertState(prev => ({ ...prev, isOpen: false, resolve: null }))
  }, [alertState])

  const handleCancel = useCallback(() => {
    alertState.resolve?.(false)
    setAlertState(prev => ({ ...prev, isOpen: false, resolve: null }))
  }, [alertState])

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      handleCancel()
    }
  }, [handleCancel])

  return (
    <AlertContext.Provider value={{ confirm }}>
      {children}
      <AlertDialog open={alertState.isOpen} onOpenChange={handleOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertState.title}</AlertDialogTitle>
            <AlertDialogDescription>{alertState.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              {alertState.cancelText}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {alertState.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertContext.Provider>
  )
}
