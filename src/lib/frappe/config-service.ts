// Supabase replaces Frappe config. Keep minimal shim so callers don't break.
export type FrappeConfig = {
  baseUrl: string
  apiKey?: string
  apiSecret?: string
  timeout: number
  retryAttempts: number
  retryDelay: number
}

const defaultConfig: FrappeConfig = {
  baseUrl: '',
  apiKey: undefined,
  apiSecret: undefined,
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
}

let cachedConfig: FrappeConfig | null = defaultConfig

export class FrappeConfigService {
  static async getConfig(): Promise<FrappeConfig> {
    return cachedConfig ?? defaultConfig
  }

  static getConfigSync(): FrappeConfig {
    return cachedConfig ?? defaultConfig
  }

  static clearCache(): void {
    cachedConfig = defaultConfig
  }

  static async isEnabled(): Promise<boolean> {
    // Always true in Supabase mode
    return true
  }

  static async getRawSettings(): Promise<{
    url: string
    apiKey: string
    apiSecret: string
    enabled: boolean
  }> {
    return { url: '', apiKey: '', apiSecret: '', enabled: true }
  }
}