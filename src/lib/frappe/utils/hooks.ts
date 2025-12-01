import { useState, useEffect, useCallback } from 'react'
import { frappeClient } from '../client'
import { authManager, useAuth } from '../auth'
import { studentService } from '../services/studentService'
import { donorService } from '../services/donorService'
import { vendorService } from '../services/vendorService'
import { systemService } from '../services/systemService'

// Generic hook for API data fetching
export function useApi<T>(
  apiCall: () => Promise<T>,
  options: {
    enabled?: boolean
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
    retry?: number
  } = {}
) {
  const { enabled = true, onSuccess, onError, retry = 3 } = options
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    if (!enabled) return

    setLoading(true)
    setError(null)

    try {
      const result = await apiCall()
      setData(result)
      onSuccess?.(result)
    } catch (err) {
      const error = err as Error
      setError(error)
      onError?.(error)
    } finally {
      setLoading(false)
    }
  }, [apiCall, enabled, onSuccess, onError])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}

// Hook for managing form state
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  onSubmit: (values: T) => Promise<void> | void
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    // Clear error when value changes
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }, [errors])

  const setError = useCallback((name: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }))
  }, [])

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
  }, [initialValues])

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    if (isSubmitting) return

    setIsSubmitting(true)
    clearErrors()

    try {
      await onSubmit(values)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [values, onSubmit, isSubmitting, clearErrors])

  return {
    values,
    errors,
    isSubmitting,
    setValue,
    setError,
    clearErrors,
    reset,
    handleSubmit,
  }
}

// Hook for pagination
export function usePagination<T>(
  fetchFunction: (page: number, limit: number) => Promise<{ data: T[]; total: number }>,
  options: {
    pageSize?: number
    initialPage?: number
  } = {}
) {
  const { pageSize = 10, initialPage = 1 } = options
  const [data, setData] = useState<T[]>([])
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await fetchFunction(currentPage, pageSize)
      setData(result.data)
      setTotal(result.total)
    } catch (err) {
      const error = err as Error
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [fetchFunction, currentPage, pageSize])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const totalPages = Math.ceil(total / pageSize)
  const hasNext = currentPage < totalPages
  const hasPrevious = currentPage > 1

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }, [totalPages])

  const goToNext = useCallback(() => {
    if (hasNext) {
      setCurrentPage(prev => prev + 1)
    }
  }, [hasNext])

  const goToPrevious = useCallback(() => {
    if (hasPrevious) {
      setCurrentPage(prev => prev - 1)
    }
  }, [hasPrevious])

  return {
    data,
    currentPage,
    totalPages,
    total,
    loading,
    error,
    hasNext,
    hasPrevious,
    goToPage,
    goToNext,
    goToPrevious,
    refetch: fetchData,
  }
}

// Hook for search functionality
export function useSearch<T>(
  searchFunction: (query: string) => Promise<T[]>,
  options: {
    debounceMs?: number
    minQueryLength?: number
  } = {}
) {
  const { debounceMs = 300, minQueryLength = 2 } = options
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (query.length < minQueryLength) {
      setResults([])
      setLoading(false)
      setError(null)
      return
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true)
      setError(null)

      try {
        const searchResults = await searchFunction(query)
        setResults(searchResults)
      } catch (err) {
        const error = err as Error
        setError(error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [query, searchFunction, debounceMs, minQueryLength])

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    clearResults: () => setResults([]),
  }
}

// Hook for real-time data updates
export function useRealTimeData<T>(
  initialData: T,
  updateFunction: () => Promise<T>,
  options: {
    intervalMs?: number
    enabled?: boolean
  } = {}
) {
  const { intervalMs = 30000, enabled = true } = options
  const [data, setData] = useState<T>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!enabled) return

    const interval = setInterval(async () => {
      setLoading(true)
      setError(null)

      try {
        const updatedData = await updateFunction()
        setData(updatedData)
      } catch (err) {
        const error = err as Error
        setError(error)
      } finally {
        setLoading(false)
      }
    }, intervalMs)

    return () => clearInterval(interval)
  }, [updateFunction, intervalMs, enabled])

  return {
    data,
    loading,
    error,
    refetch: async () => {
      setLoading(true)
      setError(null)
      try {
        const updatedData = await updateFunction()
        setData(updatedData)
      } catch (err) {
        const error = err as Error
        setError(error)
      } finally {
        setLoading(false)
      }
    },
  }
}

// Hook for file uploads
export function useFileUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<Error | null>(null)

  const uploadFile = useCallback(async (
    file: File,
    options: {
      doctype?: string
      docname?: string
      fieldname?: string
      onProgress?: (progress: number) => void
    } = {}
  ) => {
    setUploading(true)
    setProgress(0)
    setError(null)

    try {
      // Simulate progress (in real implementation, you'd track actual upload progress)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      const result = await frappeClient.uploadFile(file, options)
      
      clearInterval(progressInterval)
      setProgress(100)
      
      return result
    } catch (err) {
      const error = err as Error
      setError(error)
      throw error
    } finally {
      setUploading(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }, [])

  return {
    uploading,
    progress,
    error,
    uploadFile,
    clearError: () => setError(null),
  }
}

// Hook for notifications
export function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchNotifications = useCallback(async () => {
    if (!user) return

    setLoading(true)
    try {
      const userNotifications = await systemService.getNotifications({
        filters: {
          recipient: user.username,
          recipient_type: user.roles?.[0]?.toLowerCase() || 'student',
        },
        limit: 20,
      })
      setNotifications(userNotifications)

      const count = await systemService.getUnreadCount(
        user.roles?.[0]?.toLowerCase() || 'student',
        user.username
      )
      setUnreadCount(count)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await systemService.markNotificationAsRead(notificationId)
      setNotifications(prev =>
        prev.map(n => n.name === notificationId ? { ...n, status: 'read' } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      for (const notification of notifications.filter(n => n.status === 'unread')) {
        await systemService.markNotificationAsRead(notification.name)
      }
      setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }, [notifications])

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  }
}

// Hook for authentication state
export function useAuthState() {
  const auth = useAuth()
  
  useEffect(() => {
    // Check authentication status on mount
    authManager.checkAuth()
  }, [])

  return auth
}

// Hook for student data
export function useStudentData(studentName?: string) {
  return useApi(
    async () => {
      if (!studentName) throw new Error('no key')
      try {
        return await studentService.getStudent(studentName)
      } catch (e) {
        // Fallback: if key is built from email username, also try direct email lookup
        if (studentName.includes('@')) {
          const s = await studentService.getStudentByEmail(studentName)
          if (s) return s
        }
        throw e
      }
    },
    { enabled: !!studentName }
  )
}

// Hook for donor data
export function useDonorData(donorName?: string) {
  return useApi(
    () => donorService.getDonor(donorName!),
    { enabled: !!donorName }
  )
}

// Hook for vendor data
export function useVendorData(vendorName?: string) {
  return useApi(
    () => vendorService.getVendor(vendorName!),
    { enabled: !!vendorName }
  )
}

// Hook for system settings
export function useSystemSettings() {
  return useApi(() => systemService.getSystemSettings())
}

// Hook for platform stats
export function usePlatformStats() {
  return useApi(() => systemService.getLatestPlatformStats())
}

// Hook for local storage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue] as const
}

// Hook for debouncing values
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Hook for online/offline status
export function useOnlineStatus() {
  const [online, setOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )

  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return online
}