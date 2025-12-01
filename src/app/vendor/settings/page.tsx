'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Settings, 
  Bell, 
  Shield, 
  Mail, 
  Phone, 
  Globe, 
  CreditCard,
  Lock,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Info,
  Database,
  Zap,
  BarChart3,
  Users,
  FileText,
  Calendar,
  MapPin,
  Building,
  Key,
  Edit,
  Plus
} from "lucide-react"
import Navigation from "@/components/layout/Navigation"

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  orderUpdates: boolean
  paymentAlerts: boolean
  systemUpdates: boolean
  marketingEmails: boolean
  frequency: 'immediate' | 'daily' | 'weekly' | 'monthly'
}

interface SecuritySettings {
  twoFactorAuth: boolean
  loginAlerts: boolean
  sessionTimeout: number
  passwordExpiry: number
  allowedIPs: string[]
  apiAccess: boolean
  apiKey?: string
}

interface BusinessSettings {
  autoOrderProcessing: boolean
  inventoryManagement: boolean
  orderConfirmationRequired: boolean
  deliveryRadius: number
  minimumOrderValue: number
  maximumOrderValue: number
  businessHours: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
  holidays: string[]
  timezone: string
}

interface IntegrationSettings {
  accountingSoftware: string
  paymentGateway: string
  shippingProvider: string
  emailProvider: string
  analyticsProvider: string
  crmSystem: string
  inventorySystem: string
}

export default function VendorSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("notifications")
  
  // Settings states
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    paymentAlerts: true,
    systemUpdates: true,
    marketingEmails: false,
    frequency: 'immediate'
  })

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    allowedIPs: [],
    apiAccess: false,
    apiKey: ''
  })

  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    autoOrderProcessing: true,
    inventoryManagement: true,
    orderConfirmationRequired: false,
    deliveryRadius: 50,
    minimumOrderValue: 1000,
    maximumOrderValue: 100000,
    businessHours: {
      monday: '09:00-17:00',
      tuesday: '09:00-17:00',
      wednesday: '09:00-17:00',
      thursday: '09:00-17:00',
      friday: '09:00-17:00',
      saturday: '09:00-13:00',
      sunday: 'closed'
    },
    holidays: [],
    timezone: 'Asia/Colombo'
  })

  const [integrationSettings, setIntegrationSettings] = useState<IntegrationSettings>({
    accountingSoftware: '',
    paymentGateway: 'stripe',
    shippingProvider: '',
    emailProvider: 'sendgrid',
    analyticsProvider: 'google-analytics',
    crmSystem: '',
    inventorySystem: ''
  })

  useEffect(() => {
    // Load settings (in real app, this would come from API)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  const handleSaveSettings = () => {
    // In real app, this would save to API
    alert('Settings saved successfully!')
  }

  const handleGenerateApiKey = () => {
    const newApiKey = 'sk_' + Math.random().toString(36).substr(2, 32)
    setSecuritySettings(prev => ({ ...prev, apiKey: newApiKey }))
  }

  const handleRevokeApiKey = () => {
    setSecuritySettings(prev => ({ ...prev, apiKey: '' }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading settings...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Navigation user={{
        id: 1,
        firstName: "Vendor",
        lastName: "User",
        email: "vendor@edusponsor.com",
        role: "vendor"
      }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account preferences and business configurations
              </p>
            </div>
            <Button onClick={handleSaveSettings}>
              <Save className="mr-2 h-4 w-4" />
              Save All Settings
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                  <CardDescription>
                    Choose how you want to receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="pushNotifications">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive push notifications in browser
                        </p>
                      </div>
                      <Switch
                        id="pushNotifications"
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="smsNotifications">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive text message alerts
                        </p>
                      </div>
                      <Switch
                        id="smsNotifications"
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings(prev => ({ ...prev, smsNotifications: checked }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Notification Types</h4>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="orderUpdates">Order Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          New orders and status changes
                        </p>
                      </div>
                      <Switch
                        id="orderUpdates"
                        checked={notificationSettings.orderUpdates}
                        onCheckedChange={(checked) => 
                          setNotificationSettings(prev => ({ ...prev, orderUpdates: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="paymentAlerts">Payment Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Payment processing and confirmations
                        </p>
                      </div>
                      <Switch
                        id="paymentAlerts"
                        checked={notificationSettings.paymentAlerts}
                        onCheckedChange={(checked) => 
                          setNotificationSettings(prev => ({ ...prev, paymentAlerts: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="systemUpdates">System Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Platform maintenance and updates
                        </p>
                      </div>
                      <Switch
                        id="systemUpdates"
                        checked={notificationSettings.systemUpdates}
                        onCheckedChange={(checked) => 
                          setNotificationSettings(prev => ({ ...prev, systemUpdates: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketingEmails">Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">
                          Promotional content and offers
                        </p>
                      </div>
                      <Switch
                        id="marketingEmails"
                        checked={notificationSettings.marketingEmails}
                        onCheckedChange={(checked) => 
                          setNotificationSettings(prev => ({ ...prev, marketingEmails: checked }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="frequency">Email Frequency</Label>
                    <Select value={notificationSettings.frequency} onValueChange={(value: 'immediate' | 'daily' | 'weekly' | 'monthly') => 
                      setNotificationSettings(prev => ({ ...prev, frequency: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Summary</SelectItem>
                        <SelectItem value="monthly">Monthly Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="h-5 w-5" />
                    <span>Email Templates</span>
                  </CardTitle>
                  <CardDescription>
                    Customize your email notification templates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Order Confirmation</h4>
                        <p className="text-sm text-muted-foreground">Sent when new order is received</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Payment Received</h4>
                        <p className="text-sm text-muted-foreground">Sent when payment is processed</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Order Shipped</h4>
                        <p className="text-sm text-muted-foreground">Sent when order is dispatched</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Security Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Manage your account security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security
                        </p>
                      </div>
                      <Switch
                        id="twoFactorAuth"
                        checked={securitySettings.twoFactorAuth}
                        onCheckedChange={(checked) => 
                          setSecuritySettings(prev => ({ ...prev, twoFactorAuth: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="loginAlerts">Login Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified of new login attempts
                        </p>
                      </div>
                      <Switch
                        id="loginAlerts"
                        checked={securitySettings.loginAlerts}
                        onCheckedChange={(checked) => 
                          setSecuritySettings(prev => ({ ...prev, loginAlerts: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="apiAccess">API Access</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable API access for integrations
                        </p>
                      </div>
                      <Switch
                        id="apiAccess"
                        checked={securitySettings.apiAccess}
                        onCheckedChange={(checked) => 
                          setSecuritySettings(prev => ({ ...prev, apiAccess: checked }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => 
                          setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                      <Input
                        id="passwordExpiry"
                        type="number"
                        value={securitySettings.passwordExpiry}
                        onChange={(e) => 
                          setSecuritySettings(prev => ({ ...prev, passwordExpiry: parseInt(e.target.value) }))
                        }
                      />
                    </div>
                  </div>

                  {securitySettings.apiAccess && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="apiKey">API Key</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="apiKey"
                            type="password"
                            value={securitySettings.apiKey}
                            readOnly
                            className="font-mono text-sm"
                          />
                          {securitySettings.apiKey ? (
                            <Button variant="outline" size="sm" onClick={handleRevokeApiKey}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" onClick={handleGenerateApiKey}>
                              <Key className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Keep your API key secure and never share it publicly
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="h-5 w-5" />
                    <span>Login Activity</span>
                  </CardTitle>
                  <CardDescription>
                    Recent login attempts and session history
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">Successful Login</p>
                          <p className="text-sm text-muted-foreground">Chrome on Windows • Colombo, Sri Lanka</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">2 hours ago</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">Successful Login</p>
                          <p className="text-sm text-muted-foreground">Mobile App • Colombo, Sri Lanka</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">1 day ago</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        <div>
                          <p className="font-medium">Failed Login Attempt</p>
                          <p className="text-sm text-muted-foreground">Unknown Device • London, UK</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">3 days ago</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button variant="outline" className="w-full">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      View Full Activity Log
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="business" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5" />
                    <span>Business Operations</span>
                  </CardTitle>
                  <CardDescription>
                    Configure your business operational settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="autoOrderProcessing">Auto Order Processing</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically process new orders
                        </p>
                      </div>
                      <Switch
                        id="autoOrderProcessing"
                        checked={businessSettings.autoOrderProcessing}
                        onCheckedChange={(checked) => 
                          setBusinessSettings(prev => ({ ...prev, autoOrderProcessing: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="inventoryManagement">Inventory Management</Label>
                        <p className="text-sm text-muted-foreground">
                          Track and manage stock levels
                        </p>
                      </div>
                      <Switch
                        id="inventoryManagement"
                        checked={businessSettings.inventoryManagement}
                        onCheckedChange={(checked) => 
                          setBusinessSettings(prev => ({ ...prev, inventoryManagement: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="orderConfirmationRequired">Order Confirmation Required</Label>
                        <p className="text-sm text-muted-foreground">
                          Manually approve each order
                        </p>
                      </div>
                      <Switch
                        id="orderConfirmationRequired"
                        checked={businessSettings.orderConfirmationRequired}
                        onCheckedChange={(checked) => 
                          setBusinessSettings(prev => ({ ...prev, orderConfirmationRequired: checked }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="deliveryRadius">Delivery Radius (km)</Label>
                      <Input
                        id="deliveryRadius"
                        type="number"
                        value={businessSettings.deliveryRadius}
                        onChange={(e) => 
                          setBusinessSettings(prev => ({ ...prev, deliveryRadius: parseInt(e.target.value) }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={businessSettings.timezone} onValueChange={(value) => 
                        setBusinessSettings(prev => ({ ...prev, timezone: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Colombo">Asia/Colombo</SelectItem>
                          <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                          <SelectItem value="Asia/Dubai">Asia/Dubai</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="minimumOrderValue">Minimum Order Value (points)</Label>
                      <Input
                        id="minimumOrderValue"
                        type="number"
                        value={businessSettings.minimumOrderValue}
                        onChange={(e) => 
                          setBusinessSettings(prev => ({ ...prev, minimumOrderValue: parseInt(e.target.value) }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="maximumOrderValue">Maximum Order Value (points)</Label>
                      <Input
                        id="maximumOrderValue"
                        type="number"
                        value={businessSettings.maximumOrderValue}
                        onChange={(e) => 
                          setBusinessSettings(prev => ({ ...prev, maximumOrderValue: parseInt(e.target.value) }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Business Hours</span>
                  </CardTitle>
                  <CardDescription>
                    Set your operating hours and holidays
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {Object.entries(businessSettings.businessHours).map(([day, hours]) => (
                      <div key={day} className="flex items-center justify-between">
                        <Label className="capitalize">{day}</Label>
                        <Input
                          value={hours}
                          onChange={(e) => 
                            setBusinessSettings(prev => ({
                              ...prev,
                              businessHours: {
                                ...prev.businessHours,
                                [day]: e.target.value
                              }
                            }))
                          }
                          className="w-32"
                          placeholder="09:00-17:00"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Holidays</span>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      No holidays scheduled. Add holidays when your business will be closed.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>Third-Party Integrations</span>
                  </CardTitle>
                  <CardDescription>
                    Connect with external services and tools
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="paymentGateway">Payment Gateway</Label>
                      <Select value={integrationSettings.paymentGateway} onValueChange={(value) => 
                        setIntegrationSettings(prev => ({ ...prev, paymentGateway: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="stripe">Stripe</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="square">Square</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="emailProvider">Email Provider</Label>
                      <Select value={integrationSettings.emailProvider} onValueChange={(value) => 
                        setIntegrationSettings(prev => ({ ...prev, emailProvider: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sendgrid">SendGrid</SelectItem>
                          <SelectItem value="mailgun">Mailgun</SelectItem>
                          <SelectItem value="ses">Amazon SES</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="analyticsProvider">Analytics Provider</Label>
                      <Select value={integrationSettings.analyticsProvider} onValueChange={(value) => 
                        setIntegrationSettings(prev => ({ ...prev, analyticsProvider: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="google-analytics">Google Analytics</SelectItem>
                          <SelectItem value="mixpanel">Mixpanel</SelectItem>
                          <SelectItem value="amplitude">Amplitude</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="accountingSoftware">Accounting Software</Label>
                      <Select value={integrationSettings.accountingSoftware} onValueChange={(value) => 
                        setIntegrationSettings(prev => ({ ...prev, accountingSoftware: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quickbooks">QuickBooks</SelectItem>
                          <SelectItem value="xero">Xero</SelectItem>
                          <SelectItem value="freshbooks">FreshBooks</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="shippingProvider">Shipping Provider</Label>
                      <Select value={integrationSettings.shippingProvider} onValueChange={(value) => 
                        setIntegrationSettings(prev => ({ ...prev, shippingProvider: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dhl">DHL</SelectItem>
                          <SelectItem value="fedex">FedEx</SelectItem>
                          <SelectItem value="ups">UPS</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5" />
                    <span>Data Management</span>
                  </CardTitle>
                  <CardDescription>
                    Export and manage your business data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Download className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium">Export Orders</p>
                          <p className="text-sm text-muted-foreground">Download order data (CSV)</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Export
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Download className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">Export Products</p>
                          <p className="text-sm text-muted-foreground">Download product catalog (CSV)</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Export
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <BarChart3 className="h-5 w-5 text-purple-500" />
                        <div>
                          <p className="font-medium">Export Analytics</p>
                          <p className="text-sm text-muted-foreground">Download performance reports</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Export
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Upload className="h-5 w-5 text-orange-500" />
                        <div>
                          <p className="font-medium">Import Products</p>
                          <p className="text-sm text-muted-foreground">Upload product catalog (CSV)</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Import
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Info className="h-4 w-4" />
                      <span>Data exports are available in CSV format for easy analysis</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}