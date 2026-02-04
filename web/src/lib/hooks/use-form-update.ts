import { useCallback } from 'react'

export function useFormUpdate<TFormData extends { config: unknown }>(
    setFormData: React.Dispatch<React.SetStateAction<TFormData>>
) {
    const updateFormField = useCallback((
        field: string,
        value: unknown
    ) => {
        setFormData(prev => {
            if (field.includes('.')) {
                const [parentKey, childKey] = field.split('.') as [string, string]
                const parent = (prev as Record<string, unknown>)[parentKey] as Record<string, unknown> ?? {}
                return {
                    ...prev,
                    [parentKey]: {
                        ...parent,
                        [childKey]: value,
                    },
                } as TFormData
            } else {
                return { ...prev, [field]: value } as TFormData
            }
        })
    }, [setFormData])

    const updateConfigField = useCallback((
        field: string,
        value: unknown
    ) => {
        setFormData(prev => ({
            ...prev,
            config: { ...(prev.config as Record<string, unknown>), [field]: value },
        }))
    }, [setFormData])

    return {
        updateFormField,
        updateConfigField,
    }
}
