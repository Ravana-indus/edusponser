'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Save, CheckCircle, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface FrappeConfig {
  url: string
  apiKey: string
  apiSecret: string
  enabled: boolean
}

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<FrappeConfig>({
    url: '',
    apiKey: '',
    apiSecret: '',
    enabled: false
  })
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [testMessage, setTestMessage] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/settings/frappe')
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      }
    } catch (error) {
      console.error('Failed to load config:', error)
    }
  }

  const saveConfig = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/settings/frappe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      })

      if (response.ok) {
        toast({
          title: 'Settings Saved',
          description: 'Frappe configuration has been saved successfully.'
        })
      } else {
        throw new Error('Failed to save configuration')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save configuration. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const testConnection = async () => {
    setTesting(true)
    setTestStatus('idle')
    setTestMessage('')

    try {
      const response = await fetch('/api/settings/frappe/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: config.url,
          apiKey: config.apiKey,
          apiSecret: config.apiSecret
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setTestStatus('success')
        setTestMessage('Connection successful! Frappe ERPNext is accessible.')
      } else {
        setTestStatus('error')
        setTestMessage(result.message || 'Connection failed. Please check your credentials.')
      }
    } catch (error) {
      setTestStatus('error')
      setTestMessage('Connection failed. Please check your network and credentials.')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">Configure Frappe ERPNext integration</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frappe ERPNext Configuration</CardTitle>
          <CardDescription>
            Configure the connection to your Frappe ERPNext instance for data synchronization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="enabled"
              checked={config.enabled}
              onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
            />
            <Label htmlFor="enabled">Enable Frappe ERPNext Integration</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="url">Frappe URL</Label>
              <Input
                id="url"
                placeholder="https://your-frappe-instance.com"
                value={config.url}
                onChange={(e) => setConfig({ ...config, url: e.target.value })}
                disabled={!config.enabled}
              />
              <p className="text-sm text-muted-foreground">
                The base URL of your Frappe ERPNext instance
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key"
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                disabled={!config.enabled}
              />
              <p className="text-sm text-muted-foreground">
                Your Frappe API key for authentication
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiSecret">API Secret</Label>
              <Input
                id="apiSecret"
                type="password"
                placeholder="Enter your API secret"
                value={config.apiSecret}
                onChange={(e) => setConfig({ ...config, apiSecret: e.target.value })}
                disabled={!config.enabled}
              />
              <p className="text-sm text-muted-foreground">
                Your Frappe API secret for authentication
              </p>
            </div>
          </div>

          {testStatus !== 'idle' && (
            <Alert className={testStatus === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              {testStatus === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={testStatus === 'success' ? 'text-green-800' : 'text-red-800'}>
                {testMessage}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-wrap gap-4">
            <Button
              onClick={testConnection}
              disabled={!config.enabled || !config.url || !config.apiKey || !config.apiSecret || testing}
              variant="outline"
            >
              {testing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing Connection
                </>
              ) : (
                'Test Connection'
              )}
            </Button>

            <Button
              onClick={saveConfig}
              disabled={!config.enabled || !config.url || !config.apiKey || !config.apiSecret || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Configuration
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">1. Create API Key in Frappe</h4>
            <p className="text-sm text-muted-foreground">
              Go to Frappe ERPNext → User → Select your user → Allow API Access → Generate API Key and Secret
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">2. Configure Permissions</h4>
            <p className="text-sm text-muted-foreground">
              Ensure the user has permissions to access all EduSponsor doctypes (Student, Donor, Vendor, etc.)
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">3. Test Connection</h4>
            <p className="text-sm text-muted-foreground">
              Use the "Test Connection" button to verify your configuration before saving
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}