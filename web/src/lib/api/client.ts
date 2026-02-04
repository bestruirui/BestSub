import { API_PATH } from '../config/config'
import { tokenManager } from './token-manager'
import type { LoginResponse, UserInfo, ApiResponse, SubResponse, CheckResponse, CheckRequest, SubRequest, DynamicConfigItem, SubNameAndID, NotifyResponse, NotifyRequest, NotifyTemplate, NotifyChannel, NotifyChannelConfigResponse, ShareResponse, ShareRequest, Setting, ChangePasswordRequest, UpdateUserInfoRequest, UpdateResponse, UpdateComponent, SystemVersion } from '@/src/types'

const DEFAULT_REQUEST_HEADERS: Record<string, string> = {}

export class ApiError extends Error {
  constructor(
    public code: number,
    override message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requiresAuth: boolean = true
  ): Promise<T> {
    const url = `${API_PATH.base}${endpoint}`

    const hasBody = options.body !== undefined && options.body !== null
    const mergedHeaders: Record<string, string> = {
      ...DEFAULT_REQUEST_HEADERS,
      ...(options.headers as Record<string, string> | undefined),
    }

    if (requiresAuth) {
      const token = await tokenManager.getValidToken()
      if (token) {
        mergedHeaders.Authorization = `Bearer ${token}`
      }
    }

    if (hasBody) {
      const existingHeaderKeys = Object.keys(mergedHeaders).map((k) => k.toLowerCase())
      if (!existingHeaderKeys.includes('content-type')) {
        mergedHeaders['Content-Type'] = 'application/json'
      }
    }

    const config: RequestInit = {
      ...options,
      headers: mergedHeaders,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const data = await response.json() as ApiResponse
        throw new ApiError(data.code, data.message)
      }

      return await response.json() as T
    } catch (error) {
      if (error instanceof ApiError) throw error
      throw new ApiError(-1, error instanceof Error ? error.message : '与后端通信失败')
    }
  }

  async get<T>(endpoint: string, requiresAuth: boolean = true): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' }, requiresAuth)
  }

  async post<T>(endpoint: string, data?: unknown, requiresAuth: boolean = true): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        ...(data !== undefined ? { body: JSON.stringify(data) } : {}),
      },
      requiresAuth
    )
  }

  async delete<T>(endpoint: string, requiresAuth: boolean = true): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' }, requiresAuth)
  }

  async put<T>(endpoint: string, data?: unknown, requiresAuth: boolean = true): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'PUT',
        ...(data !== undefined ? { body: JSON.stringify(data) } : {}),
      },
      requiresAuth
    )
  }
}

const apiClient = new ApiClient()
export const api = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      API_PATH.auth.login,
      { username, password },
      false
    )
    return response.data
  },

  async logout(): Promise<void> {
    await apiClient.post<ApiResponse<void>>(API_PATH.auth.logout, {})
  },

  async getUserInfo(): Promise<UserInfo> {
    const response = await apiClient.get<ApiResponse<UserInfo>>(API_PATH.auth.user)
    return response.data
  },

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await apiClient.post<ApiResponse<void>>(API_PATH.auth.password, data)
  },

  async updateUsername(data: UpdateUserInfoRequest): Promise<void> {
    await apiClient.post<ApiResponse<void>>(API_PATH.auth.name, data)
  },

  async getSub(id?: number): Promise<SubResponse[]> {
    const url = id ? `${API_PATH.sub}?id=${id}` : API_PATH.sub
    const response = await apiClient.get<ApiResponse<SubResponse[]>>(url)
    return response.data
  },
  async getChecks(id?: number): Promise<CheckResponse[]> {
    const url = id ? `${API_PATH.check}?id=${id}` : API_PATH.check
    const response = await apiClient.get<ApiResponse<CheckResponse[]>>(url)
    return response.data
  },
  async getCheckTypes(): Promise<Record<string, DynamicConfigItem[]>> {
    const response = await apiClient.get<ApiResponse<Record<string, DynamicConfigItem[]>>>(`${API_PATH.check}/type`)
    return response.data
  },
  async refreshSubscription(id: number): Promise<void> {
    await apiClient.post<ApiResponse<void>>(`${API_PATH.sub}/refresh/${id}`, {})
  },
  async runCheck(id: number): Promise<void> {
    await apiClient.post<ApiResponse<void>>(`${API_PATH.check}/${id}/run`, {})
  },
  async createSubscription(data: SubRequest): Promise<SubResponse> {
    const response = await apiClient.post<ApiResponse<SubResponse>>(API_PATH.sub, data)
    return response.data
  },
  async batchCreateSubscriptions(data: SubRequest[]): Promise<SubResponse[]> {
    const response = await apiClient.post<ApiResponse<SubResponse[]>>(`${API_PATH.sub}/batch`, data)
    return response.data
  },
  async updateSubscription(id: number, data: SubRequest): Promise<SubResponse> {
    const response = await apiClient.put<ApiResponse<SubResponse>>(`${API_PATH.sub}/${id}`, data)
    return response.data
  },
  async deleteSubscription(id: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`${API_PATH.sub}/${id}`)
  },
  async createCheck(data: CheckRequest): Promise<CheckResponse> {
    const response = await apiClient.post<ApiResponse<CheckResponse>>(API_PATH.check, data)
    return response.data
  },
  async updateCheck(id: number, data: CheckRequest): Promise<CheckResponse> {
    const response = await apiClient.put<ApiResponse<CheckResponse>>(`${API_PATH.check}/${id}`, data)
    return response.data
  },
  async deleteCheck(id: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`${API_PATH.check}/${id}`)
  },
  async getSubNameAndID(): Promise<SubNameAndID[]> {
    const response = await apiClient.get<ApiResponse<SubNameAndID[]>>(`${API_PATH.sub}/name`)
    return response.data
  },
  async getNotifyChannels(): Promise<NotifyChannel[]> {
    const response = await apiClient.get<ApiResponse<NotifyChannel[]>>(`${API_PATH.notify}/channel`)
    return response.data
  },
  async getNotifyChannelConfig(channel?: string): Promise<NotifyChannelConfigResponse | DynamicConfigItem[]> {
    const url = channel
      ? `${API_PATH.notify}/channel/config?channel=${encodeURIComponent(channel)}`
      : `${API_PATH.notify}/channel/config`
    const response = await apiClient.get<ApiResponse<NotifyChannelConfigResponse | DynamicConfigItem[]>>(url)
    return response.data
  },
  async getNotifyList(): Promise<NotifyResponse[]> {
    const response = await apiClient.get<ApiResponse<NotifyResponse[]>>(API_PATH.notify)
    return response.data
  },
  async createNotify(data: NotifyRequest): Promise<NotifyResponse> {
    const response = await apiClient.post<ApiResponse<NotifyResponse>>(API_PATH.notify, data)
    return response.data
  },
  async updateNotify(id: number, data: NotifyRequest): Promise<NotifyResponse> {
    const response = await apiClient.put<ApiResponse<NotifyResponse>>(`${API_PATH.notify}?id=${id}`, data)
    return response.data
  },
  async deleteNotify(id: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`${API_PATH.notify}?id=${id}`)
  },
  async testNotify(data: NotifyRequest): Promise<void> {
    await apiClient.post<ApiResponse<void>>(`${API_PATH.notify}/test`, data)
  },
  async getNotifyTemplates(): Promise<NotifyTemplate[]> {
    const response = await apiClient.get<ApiResponse<NotifyTemplate[]>>(`${API_PATH.notify}/template`)
    return response.data
  },
  async updateNotifyTemplate(data: NotifyTemplate): Promise<NotifyTemplate> {
    const response = await apiClient.put<ApiResponse<NotifyTemplate>>(`${API_PATH.notify}/template`, data)
    return response.data
  },
  async getShares(id?: number): Promise<ShareResponse[]> {
    const url = id ? `${API_PATH.share}?id=${id}` : API_PATH.share
    const response = await apiClient.get<ApiResponse<ShareResponse[]>>(url)
    return response.data
  },
  async createShare(data: ShareRequest): Promise<ShareResponse> {
    const response = await apiClient.post<ApiResponse<ShareResponse>>(API_PATH.share, data)
    return response.data
  },
  async updateShare(id: number, data: ShareRequest): Promise<ShareResponse> {
    const response = await apiClient.put<ApiResponse<ShareResponse>>(`${API_PATH.share}/${id}`, data)
    return response.data
  },
  async deleteShare(id: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`${API_PATH.share}/${id}`)
  },
  async getSettings(): Promise<Setting[]> {
    const response = await apiClient.get<ApiResponse<Setting[]>>(API_PATH.setting)
    return response.data
  },
  async updateSettings(data: Setting[]): Promise<void> {
    await apiClient.put<ApiResponse<void>>(API_PATH.setting, data)
  },

  async getLatestUpdates(): Promise<UpdateResponse> {
    const response = await apiClient.get<ApiResponse<UpdateResponse>>(API_PATH.update.latest)
    return response.data
  },

  async updateComponent(component: UpdateComponent): Promise<void> {
    await apiClient.post<ApiResponse<void>>(`${API_PATH.update.base}/${component}`, {})
  },

  async getSystemVersion(): Promise<SystemVersion> {
    const response = await apiClient.get<ApiResponse<SystemVersion>>(API_PATH.system.version)
    return response.data
  },
}
