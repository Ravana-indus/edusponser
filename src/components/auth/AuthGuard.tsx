'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/frappe/auth'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: 'student' | 'donor' | 'vendor' | 'admin'
  redirectTo?: string
}

export default function AuthGuard({ 
  children, 
  requiredRole, 
  redirectTo = '/login' 
}: AuthGuardProps) {
  const auth = useAuth()
  const router = useRouter()
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    // Wait for hydration and auth to initialize
    if (!isHydrated || auth.isLoading) return

    // If not authenticated, redirect to login
    if (!auth.isAuthenticated) {
      router.push(redirectTo)
      return
    }

    // If specific role required, check it
    if (requiredRole) {
      const userRole = auth.getUserRole()
      if (userRole !== requiredRole && requiredRole !== 'admin') {
        // Redirect to appropriate dashboard based on user's actual role
        if (userRole === 'student') router.push('/student/dashboard')
        else if (userRole === 'donor') router.push('/donor/dashboard')
        else if (userRole === 'vendor') router.push('/vendor/dashboard')
        else router.push('/login')
        return
      }
      
      // Special handling for admin role - check if user has admin privileges
      if (requiredRole === 'admin') {
        const hasAdminRole = auth.hasAnyRole(['admin', 'administrator', 'System Manager'])
        if (!hasAdminRole) {
          // Redirect to their actual dashboard
          if (userRole === 'student') router.push('/student/dashboard')
          else if (userRole === 'donor') router.push('/donor/dashboard')
          else if (userRole === 'vendor') router.push('/vendor/dashboard')
          else router.push('/login')
          return
        }
      }
    }
  }, [isHydrated, auth.isLoading, auth.isAuthenticated, auth.user, requiredRole, redirectTo, router])

  // Show loading while hydrating or auth is being checked
  if (!isHydrated || auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Don't render children until auth is confirmed
  if (!auth.isAuthenticated) {
    return null
  }

  // If role is required, don't render until role is confirmed
  if (requiredRole) {
    const userRole = auth.getUserRole()
    
    if (requiredRole === 'admin') {
      const hasAdminRole = auth.hasAnyRole(['admin', 'administrator', 'System Manager'])
      if (!hasAdminRole) return null
    } else if (userRole !== requiredRole) {
      return null
    }
  }

  return <>{children}</>
}
