'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function RegisterLanding() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Choose the type of account to register</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Link href="/register/student" className="w-full">
            <Button className="w-full">Register as Student</Button>
          </Link>
          <Link href="/register/donor" className="w-full">
            <Button variant="outline" className="w-full">Register as Donor</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
