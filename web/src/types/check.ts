export interface CheckRequest {
    name: string
    enable: boolean
    task: CheckTask
    config: Record<string, unknown>
}
export interface CheckResponse {
    id: number
    name: string
    enable: boolean
    config: Record<string, unknown>
    result: CheckResult
    task: CheckTask
    status: string
}

export interface CheckResult {
    duration: number
    extra: Record<string, unknown>
    last_run: string
    msg: string
}

export interface CheckTask {
    cron_expr: string
    log_level: string
    log_write_file: boolean
    notify: boolean
    notify_channel: number
    timeout: number
    type: string
    sub_id: number[]
}