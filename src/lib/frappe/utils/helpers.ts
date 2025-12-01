import { frappeClient } from '../client'
import { DOCTYPES } from '../types'

// Date and time utilities
export const dateUtils = {
  formatDate: (date: string | Date, format: 'short' | 'long' | 'time' = 'short'): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    switch (format) {
      case 'long':
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      case 'time':
        return dateObj.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })
      default:
        return dateObj.toLocaleDateString('en-US')
    }
  },

  formatDateTime: (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  },

  getRelativeTime: (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffMs = now.getTime() - dateObj.getTime()
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSeconds < 60) return 'just now'
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    
    return dateUtils.formatDate(dateObj)
  },

  isValidDate: (date: string): boolean => {
    return !isNaN(Date.parse(date))
  },

  addDays: (date: string | Date, days: number): Date => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const result = new Date(dateObj)
    result.setDate(result.getDate() + days)
    return result
  },

  subtractDays: (date: string | Date, days: number): Date => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const result = new Date(dateObj)
    result.setDate(result.getDate() - days)
    return result
  },
}

// Number and currency utilities
export const numberUtils = {
  formatCurrency: (amount: number, currency: string = 'LKR'): string => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount)
  },

  formatNumber: (num: number, decimals: number = 0): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num)
  },

  formatPoints: (points: number): string => {
    if (points >= 1000000) {
      return `${(points / 1000000).toFixed(1)}M`
    }
    if (points >= 1000) {
      return `${(points / 1000).toFixed(1)}K`
    }
    return points.toString()
  },

  formatPercentage: (value: number, decimals: number = 1): string => {
    return `${value.toFixed(decimals)}%`
  },

  calculatePercentage: (part: number, total: number): number => {
    return total === 0 ? 0 : (part / total) * 100
  },

  roundToTwo: (num: number): number => {
    return Math.round((num + Number.EPSILON) * 100) / 100
  },
}

// String utilities
export const stringUtils = {
  truncate: (str: string, maxLength: number): string => {
    if (str.length <= maxLength) return str
    return str.slice(0, maxLength - 3) + '...'
  },

  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  },

  titleCase: (str: string): string => {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
  },

  slugify: (str: string): string => {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  },

  extractInitials: (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2)
  },

  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
  },

  highlightText: (text: string, query: string): string => {
    if (!query) return text
    const regex = new RegExp(`(${query})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  },
}

// File utilities
export const fileUtils = {
  getFileExtension: (filename: string): string => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
  },

  getFileSize: (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  },

  isValidFileType: (filename: string, allowedTypes: string[]): boolean => {
    const extension = fileUtils.getFileExtension(filename).toLowerCase()
    return allowedTypes.includes(extension)
  },

  isValidFileSize: (file: File, maxSizeMB: number): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    return file.size <= maxSizeBytes
  },

  downloadFile: async (url: string, filename: string): Promise<void> => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Failed to download file:', error)
    }
  },
}

// Validation utilities
export const validationUtils = {
  required: (value: any): string | undefined => {
    return value ? undefined : 'This field is required'
  },

  email: (value: string): string | undefined => {
    if (!value) return undefined
    return stringUtils.isValidEmail(value) ? undefined : 'Please enter a valid email address'
  },

  phone: (value: string): string | undefined => {
    if (!value) return undefined
    return stringUtils.isValidPhone(value) ? undefined : 'Please enter a valid phone number'
  },

  minLength: (min: number) => (value: string): string | undefined => {
    if (!value) return undefined
    return value.length >= min ? undefined : `Minimum ${min} characters required`
  },

  maxLength: (max: number) => (value: string): string | undefined => {
    if (!value) return undefined
    return value.length <= max ? undefined : `Maximum ${max} characters allowed`
  },

  minValue: (min: number) => (value: number): string | undefined => {
    if (value === undefined || value === null) return undefined
    return value >= min ? undefined : `Value must be at least ${min}`
  },

  maxValue: (max: number) => (value: number): string | undefined => {
    if (value === undefined || value === null) return undefined
    return value <= max ? undefined : `Value must be at most ${max}`
  },

  pattern: (regex: RegExp, message: string) => (value: string): string | undefined => {
    if (!value) return undefined
    return regex.test(value) ? undefined : message
  },
}

// API utilities
export const apiUtils = {
  handleApiError: (error: any): string => {
    if (error?.message) {
      return error.message
    }
    if (error?.exc) {
      return 'Server error occurred'
    }
    return 'An unexpected error occurred'
  },

  retry: async <T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    delayMs: number = 1000
  ): Promise<T> => {
    let lastError: Error
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error as Error
        
        if (attempt === maxAttempts) {
          break
        }
        
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }
    
    throw lastError!
  },

  buildFilters: (filters: Record<string, any>): Record<string, any> => {
    const frappeFilters: Record<string, any> = {}
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return
      }
      
      if (Array.isArray(value)) {
        if (value.length > 0) {
          frappeFilters[key] = ['in', ...value]
        }
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([operator, operand]) => {
          if (operator === 'min') {
            frappeFilters[key] = ['>=', operand]
          } else if (operator === 'max') {
            frappeFilters[key] = ['<=', operand]
          } else if (operator === 'like') {
            frappeFilters[key] = ['like', `%${operand}%`]
          }
        })
      } else {
        frappeFilters[key] = value
      }
    })
    
    return frappeFilters
  },

  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void => {
    let timeout: NodeJS.Timeout
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  },
}

// UI utilities
export const uiUtils = {
  getStatusColor: (status: string): string => {
    const statusColors: Record<string, string> = {
      active: 'green',
      inactive: 'red',
      pending: 'yellow',
      approved: 'green',
      rejected: 'red',
      completed: 'blue',
      failed: 'red',
      success: 'green',
      warning: 'yellow',
      error: 'red',
      verified: 'green',
      unverified: 'gray',
    }
    
    return statusColors[status.toLowerCase()] || 'gray'
  },

  getStatusBadge: (status: string): { label: string; color: string } => {
    const statusMap: Record<string, { label: string; color: string }> = {
      active: { label: 'Active', color: 'green' },
      inactive: { label: 'Inactive', color: 'red' },
      pending: { label: 'Pending', color: 'yellow' },
      approved: { label: 'Approved', color: 'green' },
      rejected: { label: 'Rejected', color: 'red' },
      completed: { label: 'Completed', color: 'blue' },
      failed: { label: 'Failed', color: 'red' },
      success: { label: 'Success', color: 'green' },
      warning: { label: 'Warning', color: 'yellow' },
      error: { label: 'Error', color: 'red' },
      verified: { label: 'Verified', color: 'green' },
      unverified: { label: 'Unverified', color: 'gray' },
    }
    
    return statusMap[status.toLowerCase()] || { label: status, color: 'gray' }
  },

  getAvatarColor: (name: string): string => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ]
    
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    return colors[Math.abs(hash) % colors.length]
  },

  scrollToElement: (elementId: string): void => {
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  },

  copyToClipboard: async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      return false
    }
  },
}

// Error handling utilities
export const errorUtils = {
  logError: (error: Error, context?: string): void => {
    console.error(`Error${context ? ` in ${context}` : ''}:`, error)
    
    // In production, you might want to send errors to a monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: sendToErrorMonitoring(error, context)
    }
  },

  getUserFriendlyMessage: (error: any): string => {
    if (typeof error === 'string') return error
    
    if (error?.message) {
      // Handle specific error types
      if (error.message.includes('Network Error')) {
        return 'Network connection error. Please check your internet connection.'
      }
      if (error.message.includes('Unauthorized')) {
        return 'You are not authorized to perform this action.'
      }
      if (error.message.includes('Not Found')) {
        return 'The requested resource was not found.'
      }
      
      return error.message
    }
    
    return 'An unexpected error occurred. Please try again.'
  },

  isNetworkError: (error: any): boolean => {
    return error?.message?.includes('Network Error') || 
           error?.message?.includes('fetch') ||
           error?.code === 'NETWORK_ERROR'
  },

  isAuthError: (error: any): boolean => {
    return error?.message?.includes('Unauthorized') ||
           error?.message?.includes('Authentication') ||
           error?.status === 401
  },
}

// Export all utilities
export const utils = {
  date: dateUtils,
  number: numberUtils,
  string: stringUtils,
  file: fileUtils,
  validation: validationUtils,
  api: apiUtils,
  ui: uiUtils,
  error: errorUtils,
}