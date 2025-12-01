"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../supabase/client'

class FrappeAuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FrappeAuthError'
  }
}

export interface User {
  username: string
  email: string
  first_name: string
  last_name: string
  roles: string[]
  user_image?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

class AuthManager {
  private static instance: AuthManager
  private authState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  }
  private listeners: Array<(state: AuthState) => void> = []

  private constructor() {
    // Initialize auth state from localStorage
    this.loadAuthState()
  }

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager()
    }
    return AuthManager.instance
  }

  // Subscribe to auth state changes
  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener)
    // Do not immediately call listener to avoid double setState during hydration
    
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  // Notify all listeners of state changes
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.authState))
  }

  // Update auth state
  private updateAuthState(updates: Partial<AuthState>): void {
    this.authState = { ...this.authState, ...updates }
    this.saveAuthState()
    this.notifyListeners()
  }

  private async resolveRolesFromDatabase(email: string): Promise<string[]> {
    try {
      const roles: string[] = []
      if (!email) return roles
      const { data: d } = await supabase.from('donors').select('name').eq('email', email).maybeSingle()
      if (d?.name) roles.push('donor')
      const { data: s } = await supabase.from('students').select('name').eq('email', email).maybeSingle()
      if (s?.name) roles.push('student')
      const { data: v } = await supabase.from('vendors').select('name').eq('email', email).maybeSingle()
      if (v?.name) roles.push('vendor')
      return roles
    } catch {
      return []
    }
  }

  // Save auth state to localStorage
  private saveAuthState(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('edusponsor_auth', JSON.stringify({
        user: this.authState.user,
        isAuthenticated: this.authState.isAuthenticated,
      }))
    }
  }

  // Load auth state from localStorage
  private loadAuthState(): void {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('edusponsor_auth')
        if (saved) {
          const { user, isAuthenticated } = JSON.parse(saved)
          this.authState.user = user
          this.authState.isAuthenticated = isAuthenticated
        }
      } catch (error) {
        console.error('Failed to load auth state:', error)
      }
    }
  }

  // Login
  async login(usernameOrEmail: string, password: string): Promise<void> {
    this.updateAuthState({ isLoading: true, error: null })

    try {
      // Resolve email from username without pre-auth DB reads (RLS would block)
      let email = usernameOrEmail
      if (!usernameOrEmail.includes('@')) {
        email = `${usernameOrEmail}@example.com`
      }

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        // Dev/test fallback: allow demo example.com users without Supabase
        const isExampleDemo = /@example\.com$/i.test(email) && password === 'password'
        if (isExampleDemo) {
          const inferredRole = email.startsWith('admin')
            ? 'admin'
            : email.startsWith('vendor')
              ? 'vendor'
              : email.startsWith('donor')
                ? 'donor'
                : 'student'

          const user: User = {
            username: email.split('@')[0],
            email,
            first_name: inferredRole.charAt(0).toUpperCase() + inferredRole.slice(1),
            last_name: 'User',
            roles: [inferredRole],
            user_image: undefined,
          }

          this.updateAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          return
        }
        throw new FrappeAuthError(signInError.message)
      }

      // Fetch profile for additional fields
      const userId = signInData.user?.id
      let profile: any = null
      if (userId) {
        const { data } = await supabase
          .from('profiles')
          .select('username, first_name, last_name, email, roles, user_image')
          .eq('id', userId)
          .maybeSingle()
        profile = data
      }

      const appMeta = (signInData.user?.app_metadata as any) || {}
      const userMeta = (signInData.user?.user_metadata as any) || {}
      const rolesFromMeta = appMeta.roles || appMeta.role || userMeta.role || []
      let roles: string[] = Array.isArray(profile?.roles)
        ? profile.roles
        : Array.isArray(rolesFromMeta)
          ? rolesFromMeta
          : (typeof rolesFromMeta === 'string' && rolesFromMeta)
            ? [rolesFromMeta]
            : []

      if (roles.length === 0) {
        const fallbackRoles = await this.resolveRolesFromDatabase(signInData.user?.email || profile?.email || '')
        if (fallbackRoles.length > 0) roles = fallbackRoles
      }

      const user: User = {
        username: profile?.username || (signInData.user?.email || ''),
        email: signInData.user?.email || profile?.email || '',
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || '',
        roles,
        user_image: profile?.user_image || undefined,
      }

      this.updateAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      const authError = error as FrappeAuthError
      this.updateAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: authError.message,
      })
      throw authError
    }
  }

  // Logout
  async logout(): Promise<void> {
    this.updateAuthState({ isLoading: true, error: null })

    try {
      await supabase.auth.signOut()
      
      this.updateAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
      if (typeof window !== 'undefined') {
        try { localStorage.removeItem('edusponsor_auth') } catch {}
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Still clear local state even if logout fails on server
      this.updateAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
      if (typeof window !== 'undefined') {
        try { localStorage.removeItem('edusponsor_auth') } catch {}
      }
    }
  }

  // Check if user is authenticated
  async checkAuth(): Promise<void> {
    this.updateAuthState({ isLoading: true, error: null })

    try {
      if (!isSupabaseConfigured) {
        // In dev without Supabase, keep existing state (from localStorage)
        this.updateAuthState({ isLoading: false })
        return
      }
      const { data: userResp } = await supabase.auth.getUser()
      if (!userResp?.user) {
        // Preserve demo fallback auth (example.com) when no Supabase session
        const current = this.authState
        if (current.isAuthenticated && /@example\.com$/i.test(current.user?.email || '')) {
          this.updateAuthState({ isLoading: false })
          return
        }
        this.updateAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
        return
      }

      const supaUser = userResp.user
      // Load profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, first_name, last_name, email, roles, user_image')
        .eq('id', supaUser.id)
        .maybeSingle()

      const appMeta = (supaUser.app_metadata as any) || {}
      const userMeta = (supaUser.user_metadata as any) || {}
      const rolesFromMeta = appMeta.roles || appMeta.role || userMeta.role || []
      let roles: string[] = Array.isArray(profile?.roles)
        ? profile.roles
        : Array.isArray(rolesFromMeta)
          ? rolesFromMeta
          : (typeof rolesFromMeta === 'string' && rolesFromMeta)
            ? [rolesFromMeta]
            : []

      if (roles.length === 0) {
        const fallbackRoles = await this.resolveRolesFromDatabase(supaUser.email || profile?.email || '')
        if (fallbackRoles.length > 0) roles = fallbackRoles
      }

      const user: User = {
        username: profile?.username || (supaUser.email || ''),
        email: supaUser.email || profile?.email || '',
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || '',
        roles,
        user_image: profile?.user_image || undefined,
      }

      this.updateAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      this.updateAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null, // Don't show error for initial auth check
      })
    }
  }

  // Get current auth state
  getAuthState(): AuthState {
    return { ...this.authState }
  }

  // Check if user has specific role
  hasRole(role: string): boolean {
    return this.authState.user?.roles.includes(role) || false
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role))
  }

  // Get user role (simplified for EduSponsor)
  getUserRole(): 'student' | 'donor' | 'vendor' | 'admin' | null {
    const user = this.authState.user
    if (!user) return null

    const lowerRoles = (user.roles || []).map(r => r.toLowerCase())

    if (lowerRoles.some(r => ['system manager','administrator','admin'].includes(r))) {
      return 'admin'
    }
    if (lowerRoles.includes('donor')) {
      return 'donor'
    }
    if (lowerRoles.includes('student')) {
      return 'student'
    }
    if (lowerRoles.includes('vendor')) {
      return 'vendor'
    }

    return null
  }

  // Clear auth state (for testing or forced logout)
  clearAuth(): void {
    this.updateAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
  }
}

// Export singleton instance
export const authManager = AuthManager.getInstance()

// React hook for auth state
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(authManager.getAuthState())

  useEffect(() => {
    const unsubscribe = authManager.subscribe(setAuthState)
    return unsubscribe
  }, [])

  return {
    ...authState,
    login: authManager.login.bind(authManager),
    logout: authManager.logout.bind(authManager),
    checkAuth: authManager.checkAuth.bind(authManager),
    hasRole: authManager.hasRole.bind(authManager),
    hasAnyRole: authManager.hasAnyRole.bind(authManager),
    getUserRole: authManager.getUserRole.bind(authManager),
  }
}

// Auth context provider
interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  hasRole: (role: string) => boolean
  hasAnyRole: (roles: string[]) => boolean
  getUserRole: () => 'student' | 'donor' | 'vendor' | 'admin' | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(authManager.getAuthState())

  useEffect(() => {
    const unsubscribe = authManager.subscribe(setAuthState)
    
    // Check auth on mount
    authManager.checkAuth()
    
    return unsubscribe
  }, [])

  const value: AuthContextType = {
    ...authState,
    login: authManager.login.bind(authManager),
    logout: authManager.logout.bind(authManager),
    checkAuth: authManager.checkAuth.bind(authManager),
    hasRole: authManager.hasRole.bind(authManager),
    hasAnyRole: authManager.hasAnyRole.bind(authManager),
    getUserRole: authManager.getUserRole.bind(authManager),
  }

  return React.createElement(AuthContext.Provider, { value }, children)
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}