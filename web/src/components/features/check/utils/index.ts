import { CHECK_CONSTANTS, FORM_VALIDATION } from '../constants'
import { validateCronExpr } from '@/src/utils'
import type { CheckRequest, CheckResponse } from '@/src/types/check'
export function createDefaultCheckData(): CheckRequest {
    return {
        name: '',
        enable: true,
        task: {
            type: '',
            timeout: CHECK_CONSTANTS.DEFAULT_TIMEOUT,
            cron_expr: CHECK_CONSTANTS.DEFAULT_CRON,
            notify: false,
            notify_channel: CHECK_CONSTANTS.DEFAULT_NOTIFY_CHANNEL,
            log_write_file: false,
            log_level: CHECK_CONSTANTS.DEFAULT_LOG_LEVEL,
            sub_id: [],
        },
        config: {},
    }
}
export function validateCheckForm(formData: CheckRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!formData.name.trim()) {
        errors.push(FORM_VALIDATION.NAME_REQUIRED)
    }

    if (!formData.task.type) {
        errors.push(FORM_VALIDATION.TYPE_REQUIRED)
    }

    if (formData.task.timeout < CHECK_CONSTANTS.MIN_TIMEOUT || formData.task.timeout > CHECK_CONSTANTS.MAX_TIMEOUT) {
        errors.push(FORM_VALIDATION.TIMEOUT_RANGE)
    }

    if (!validateCronExpr(formData.task.cron_expr)) {
        errors.push(FORM_VALIDATION.CRON_INVALID)
    }

    if (formData.task.notify_channel < 1) {
        errors.push(FORM_VALIDATION.NOTIFY_CHANNEL_MIN)
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}


export function convertCheckResponseToRequest(check: CheckResponse): CheckRequest {
    return {
        name: check.name,
        enable: check.enable,
        task: {
            type: check.task?.type || '',
            timeout: check.task?.timeout || CHECK_CONSTANTS.DEFAULT_TIMEOUT,
            cron_expr: check.task?.cron_expr || CHECK_CONSTANTS.DEFAULT_CRON,
            notify: check.task?.notify ?? true,
            notify_channel: check.task?.notify_channel || CHECK_CONSTANTS.DEFAULT_NOTIFY_CHANNEL,
            log_write_file: check.task?.log_write_file ?? true,
            log_level: check.task?.log_level || CHECK_CONSTANTS.DEFAULT_LOG_LEVEL,
            sub_id: check.task?.sub_id || [],
        },
        config: check.config || {},
    }
}



