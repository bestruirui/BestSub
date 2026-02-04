
import { useState, useCallback, useRef } from 'react'

export interface FormState<T> {
  data: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
  isDirty: boolean
}

export interface FormActions<T> {
  setValue: <K extends keyof T>(field: K, value: T[K]) => void
  setValues: (values: Partial<T>) => void
  setError: <K extends keyof T>(field: K, error: string) => void
  clearError: <K extends keyof T>(field: K) => void
  clearErrors: () => void
  setTouched: <K extends keyof T>(field: K, touched?: boolean) => void
  reset: (newData?: T) => void
  submit: (onSubmit: (data: T) => Promise<void>) => Promise<void>
}

export interface FormConfig<T> {
  initialData: T
  validate?: (data: T) => Partial<Record<keyof T, string>>
  onSubmitSuccess?: (data: T) => void
  onSubmitError?: (error: unknown) => void
}
export function useForm<T extends Record<string, unknown>>(
  config: FormConfig<T>
): [FormState<T>, FormActions<T>] {
  const initialDataRef = useRef(config.initialData)

  const [state, setState] = useState<FormState<T>>({
    data: config.initialData,
    errors: {},
    touched: {},
    isSubmitting: false,
    isDirty: false,
  })

  const updateState = useCallback((updates: Partial<FormState<T>>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setState(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value },
      touched: { ...prev.touched, [field]: true },
      isDirty: true,
      errors: { ...prev.errors, [field]: undefined },
    }))
  }, [])

  const setValues = useCallback((values: Partial<T>) => {
    setState(prev => ({
      ...prev,
      data: { ...prev.data, ...values },
      isDirty: true,
    }))
  }, [])

  const setError = useCallback(<K extends keyof T>(field: K, error: string) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [field]: error },
    }))
  }, [])

  const clearError = useCallback(<K extends keyof T>(field: K) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [field]: undefined },
    }))
  }, [])

  const clearErrors = useCallback(() => {
    updateState({ errors: {} })
  }, [updateState])

  const setTouched = useCallback(<K extends keyof T>(field: K, touched = true) => {
    setState(prev => ({
      ...prev,
      touched: { ...prev.touched, [field]: touched },
    }))
  }, [])

  const reset = useCallback((newData?: T) => {
    const resetData = newData || initialDataRef.current
    initialDataRef.current = resetData
    setState({
      data: resetData,
      errors: {},
      touched: {},
      isSubmitting: false,
      isDirty: false,
    })
  }, [])

  const submit = useCallback(async (onSubmit: (data: T) => Promise<void>) => {
    if (config.validate) {
      const errors = config.validate(state.data)
      if (Object.keys(errors).length > 0) {
        updateState({ errors })
        return
      }
    }

    updateState({ isSubmitting: true, errors: {} })

    try {
      await onSubmit(state.data)
      config.onSubmitSuccess?.(state.data)
      updateState({ isSubmitting: false, isDirty: false })
    } catch (error) {
      config.onSubmitError?.(error)
      updateState({ isSubmitting: false })

      if (error instanceof Error && error.message.includes(':')) {
        const [field, message] = error.message.split(':', 2)
        if (field && message && field in state.data) {
          setError(field as keyof T, message.trim())
        }
      }
    }
  }, [config, state.data, updateState, setError])

  const actions: FormActions<T> = {
    setValue,
    setValues,
    setError,
    clearError,
    clearErrors,
    setTouched,
    reset,
    submit,
  }

  return [state, actions]
}

