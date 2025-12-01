'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Navigation from '@/components/layout/Navigation'
import { useAuthState } from '@/lib/frappe'
import { useState } from 'react'

export default function AdminProfilePage() {
  const auth = useAuthState()
  const user = auth.user
  const [first, setFirst] = useState(user?.first_name || '')
  const [last, setLast] = useState(user?.last_name || '')

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Navigation user={{
        id: 1,
        firstName: first || 'Admin',
        lastName: last || 'User',
        email: user?.email || 'admin@example.com',
        role: 'admin',
      }} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Admin Profile</CardTitle>
            <CardDescription>Update your basic profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first">First Name</Label>
                <Input id="first" value={first} onChange={(e) => setFirst(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="last">Last Name</Label>
                <Input id="last" value={last} onChange={(e) => setLast(e.target.value)} />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email || ''} disabled />
            </div>
            <div className="flex justify-end">
              <Button disabled>Save (coming soon)</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


