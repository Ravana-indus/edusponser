'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GraduationCap, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/frappe/auth"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  
  const auth = useAuth()
  const { login, error } = auth
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (auth.isLoading) return
    
    try {
      setLoginError('')
      await login(formData.username, formData.password)
        // Inline redirect for reliability
        const role = auth.getUserRole()
        if (role === 'student') window.location.href = '/student/dashboard'
        else if (role === 'donor') window.location.href = '/donor/dashboard'
        else if (role === 'vendor') window.location.href = '/vendor/dashboard'
        else if (role === 'admin') window.location.href = '/admin/dashboard'
        else window.location.href = '/student/dashboard'
    } catch (error) {
      setLoginError('Invalid username or password')
    }
  }

  // Redirect after auth state flips to authenticated
  useEffect(() => {
    if (!auth.isAuthenticated) return
    const role = auth.getUserRole()
    if (role === 'student') window.location.href = '/student/dashboard'
    else if (role === 'donor') window.location.href = '/donor/dashboard'
    else if (role === 'vendor') window.location.href = '/vendor/dashboard'
    else if (role === 'admin') window.location.href = '/admin/dashboard'
  }, [auth.isAuthenticated, auth.user])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">EduSponsor</h1>
          <p className="text-gray-600 mt-2">Educational Sponsorship Platform</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {loginError && (
                <Alert variant="destructive">
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div>
                <Label htmlFor="username">Username or Email</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username or email"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="mt-1"
                />

              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>

              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={auth.isLoading}
              >
                {auth.isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="text-blue-600 hover:underline">
                  Register here
                </Link>
              </p>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                <Link href="/forgot-password" className="text-blue-600 hover:underline">
                  Forgot your password?
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Demo Credentials</h3>
          <div className="text-xs text-blue-800 space-y-1">
            <p><strong>Student:</strong> student / password</p>
            <p><strong>Donor:</strong> donor / password</p>
            <p><strong>Vendor:</strong> vendor / password</p>
            <p><strong>Admin:</strong> admin / password</p>
          </div>
        </div>
      </div>
    </div>
  )
}