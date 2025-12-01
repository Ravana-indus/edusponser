'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { 
  GraduationCap, 
  Menu, 
  X, 
  Heart, 
  Users, 
  Settings, 
  LogOut, 
  User,
  Shield,
  Bell,
  ShoppingCart,
  Store,
  BarChart3
} from "lucide-react"
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/frappe/auth'

interface NavigationProps {
  user?: {
    id: number
    firstName: string
    lastName: string
    email: string
    role: 'student' | 'donor' | 'admin' | 'vendor'
    profileImage?: string
  }
}

export default function Navigation({ user }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const router = useRouter()
  const auth = useAuth()

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Use auth state instead of prop if not provided, but only after hydration
  const currentUser = user || (isHydrated && auth.isAuthenticated && auth.user ? {
    id: 1,
    firstName: auth.user.first_name || auth.user.email?.split('@')[0] || 'User',
    lastName: auth.user.last_name || '',
    email: auth.user.email || '',
    role: auth.getUserRole() as 'student' | 'donor' | 'admin' | 'vendor',
    profileImage: auth.user.user_image
  } : null)

  // Debug logging (remove in production)
  if (isHydrated && auth.isAuthenticated) {
    console.log('Navigation Debug - Auth State:', {
      isAuthenticated: auth.isAuthenticated,
      user: auth.user,
      role: auth.getUserRole(),
      currentUser
    })
  }

  const performLogout = async () => {
    try {
      await auth.logout()
    } catch (e) {
      // ignore
    } finally {
      router.push('/')
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'student':
        return <Badge variant="secondary">Student</Badge>
      case 'donor':
        return <Badge className="bg-green-100 text-green-800">Donor</Badge>
      case 'admin':
        return <Badge variant="destructive">Admin</Badge>
      case 'vendor':
        return <Badge className="bg-blue-100 text-blue-800">Vendor</Badge>
      default:
        return null
    }
  }

  const getDashboardLink = (role: string) => {
    switch (role) {
      case 'student':
        return '/student/dashboard'
      case 'donor':
        return '/donor/dashboard'
      case 'admin':
        return '/admin/dashboard'
      case 'vendor':
        return '/vendor/dashboard'
      default:
        return '/'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student':
        return <GraduationCap className="h-4 w-4" />
      case 'donor':
        return <Heart className="h-4 w-4" />
      case 'admin':
        return <Shield className="h-4 w-4" />
      case 'vendor':
        return <Store className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const navigationItems = [
    { name: 'Home', href: '/', icon: <GraduationCap className="h-4 w-4" /> },
    { name: 'About', href: '/about', icon: <Users className="h-4 w-4" /> },
    { name: 'How It Works', href: '/how-it-works', icon: <Heart className="h-4 w-4" /> },
    { name: 'Impact', href: '/impact', icon: <Users className="h-4 w-4" /> },
  ]

  const authItems = currentUser ? [
    { name: 'Dashboard', href: getDashboardLink(currentUser.role), icon: getRoleIcon(currentUser.role) },
    ...(currentUser.role === 'student' ? [{ name: 'Store', href: '/student/purchase', icon: <ShoppingCart className="h-4 w-4" /> }] : []),
    ...(currentUser.role === 'donor' ? [{ name: 'Sponsorships', href: '/donor/sponsorships', icon: <Users className="h-4 w-4" /> }] : []),
    ...(currentUser.role === 'vendor' ? [
      { name: 'Orders', href: '/vendor/dashboard', icon: <ShoppingCart className="h-4 w-4" /> },
      { name: 'Analytics', href: '/vendor/analytics', icon: <BarChart3 className="h-4 w-4" /> }
    ] : []),
    { name: 'Profile', href: `/${currentUser.role}/profile`, icon: <User className="h-4 w-4" /> },
    { name: 'Settings', href: `/${currentUser.role}/settings`, icon: <Settings className="h-4 w-4" /> },
  ] : [
    { name: 'Login', href: '/login', icon: <User className="h-4 w-4" /> },
  ]

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">EduSponsor</span>
            </Link>
            {currentUser && getRoleBadge(currentUser.role)}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Main Navigation */}
            <div className="flex items-center space-x-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center space-x-1"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Authenticated User Menu */}
            {currentUser ? (
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser.profileImage} />
                        <AvatarFallback>
                          {currentUser.firstName[0]}{currentUser.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {currentUser.firstName} {currentUser.lastName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {currentUser.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {authItems.map((item) => (
                      <DropdownMenuItem key={item.name} asChild>
                        <Link href={item.href} className="flex items-center space-x-2">
                          {item.icon}
                          <span>{item.name}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-center space-x-2 text-red-600" onSelect={(e) => { e.preventDefault(); performLogout() }}>
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {currentUser ? (
                <>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex items-center space-x-2 px-3 py-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser.profileImage} />
                        <AvatarFallback>
                          {currentUser.firstName[0]}{currentUser.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{currentUser.firstName} {currentUser.lastName}</span>
                        {getRoleBadge(currentUser.role)}
                      </div>
                    </div>
                    {authItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                    <div className="border-t pt-2 mt-2">
                      <button onClick={performLogout} className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors w-full">
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="border-t pt-2 mt-2 space-y-2">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <User className="mr-2 h-4 w-4" />
                      Login
                    </Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}