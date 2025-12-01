'use client'

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  ArrowLeft, 
  Heart, 
  User, 
  GraduationCap, 
  Calendar, 
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Edit,
  CreditCard,
  Star,
  Award,
  TrendingUp,
  Mail,
  Phone
} from "lucide-react"
import Navigation from "@/components/layout/Navigation"
import AuthGuard from "@/components/auth/AuthGuard"
import { supabase } from "@/lib/supabase/client"

function SponsorshipDetailsPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sponsorshipId = searchParams.get('id')
  
  const [sponsorship, setSponsorship] = useState<any | null>(null)
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSponsorshipDetails = async () => {
      if (!sponsorshipId) { 
        setLoading(false)
        return 
      }

      try {
        // Fetch sponsorship details with related data
        const { data: sponsorshipData, error: sponsorshipError } = await supabase
          .from('sponsorships')
          .select(`
            *,
            donor:donors(name, first_name, last_name, email, phone, occupation, company, bio, profile_image),
            student:students(name, first_name, last_name, email, phone, age, education_level, school, district, province, bio, profile_image)
          `)
          .eq('name', sponsorshipId)
          .single()

        if (sponsorshipError) throw sponsorshipError

        setSponsorship(sponsorshipData)

        // Fetch related payments
        const { data: paymentsData, error: paymentsError } = await supabase
          .from('payments')
          .select('*')
          .eq('sponsorship', sponsorshipId)
          .order('processed_date', { ascending: false })

        if (paymentsError) throw paymentsError

        setPayments(paymentsData || [])
      } catch (error) {
        console.error('Error loading sponsorship details:', error)
        router.push('/admin/dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadSponsorshipDetails()
  }, [sponsorshipId, router])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>
      case 'paused':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Paused</Badge>
      case 'ended':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800"><XCircle className="h-3 w-3 mr-1" />Ended</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (date: string) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString()
  }

  const formatCurrency = (amount: number) => `$${amount?.toLocaleString() || 0}`

  const calculateSponsorshipStats = () => {
    const totalPaid = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + parseFloat(p.amount), 0)
    const paymentCount = payments.filter(p => p.status === 'completed').length
    const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + parseFloat(p.amount), 0)
    
    const startDate = new Date(sponsorship?.start_date)
    const currentDate = new Date()
    const monthsActive = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44))
    
    return {
      totalPaid,
      paymentCount,
      pendingAmount,
      monthsActive: Math.max(0, monthsActive),
      expectedTotal: (sponsorship?.monthly_amount || 0) * Math.max(1, monthsActive)
    }
  }

  const stats = sponsorship ? calculateSponsorshipStats() : null

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading sponsorship details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!sponsorship) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Sponsorship Not Found</h1>
            <p className="text-muted-foreground mb-4">The sponsorship you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/admin/dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Navigation user={{
        id: 1,
        firstName: "Admin",
        lastName: "User",
        email: "admin@edusponsor.com",
        role: "admin"
      }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/admin/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Sponsorship Details: {sponsorship.name}
              </h1>
              <p className="text-muted-foreground">
                Started on {formatDate(sponsorship.start_date)}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {getStatusBadge(sponsorship.status)}
              <div className="text-right">
                <div className="text-2xl font-bold">{formatCurrency(sponsorship.monthly_amount)}</div>
                <div className="text-sm text-muted-foreground">Monthly</div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalPaid)}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.paymentCount} payments completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Months Active</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.monthsActive}</div>
                <p className="text-xs text-muted-foreground">
                  Since {formatDate(sponsorship.start_date)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.pendingAmount)}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting payment
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.expectedTotal > 0 ? Math.round((stats.totalPaid / stats.expectedTotal) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Of expected amount
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Donor & Student Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Donor Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="mr-2 h-5 w-5 text-red-500" />
                    Donor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={sponsorship.donor?.profile_image} />
                      <AvatarFallback>
                        {sponsorship.donor?.first_name?.[0]}{sponsorship.donor?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-lg">
                        {sponsorship.donor?.first_name} {sponsorship.donor?.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">{sponsorship.donor?.email}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {sponsorship.donor?.occupation && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Occupation:</span>
                        <span className="text-sm">{sponsorship.donor.occupation}</span>
                      </div>
                    )}
                    {sponsorship.donor?.company && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Company:</span>
                        <span className="text-sm">{sponsorship.donor.company}</span>
                      </div>
                    )}
                    {sponsorship.donor?.phone && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Phone:</span>
                        <span className="text-sm">{sponsorship.donor.phone}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      <User className="mr-2 h-4 w-4" />
                      View Donor Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Student Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GraduationCap className="mr-2 h-5 w-5 text-blue-500" />
                    Student
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={sponsorship.student?.profile_image} />
                      <AvatarFallback>
                        {sponsorship.student?.first_name?.[0]}{sponsorship.student?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-lg">
                        {sponsorship.student?.first_name} {sponsorship.student?.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">{sponsorship.student?.email}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {sponsorship.student?.age && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Age:</span>
                        <span className="text-sm">{sponsorship.student.age}</span>
                      </div>
                    )}
                    {sponsorship.student?.education_level && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Education:</span>
                        <span className="text-sm">{sponsorship.student.education_level}</span>
                      </div>
                    )}
                    {sponsorship.student?.school && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">School:</span>
                        <span className="text-sm">{sponsorship.student.school}</span>
                      </div>
                    )}
                    {sponsorship.student?.district && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Location:</span>
                        <span className="text-sm">{sponsorship.student.district}, {sponsorship.student.province}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      View Student Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payment History
                </CardTitle>
                <CardDescription>
                  All payments related to this sponsorship
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.name}>
                        <TableCell>{formatDate(payment.processed_date)}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(parseFloat(payment.amount))}</TableCell>
                        <TableCell>{payment.payment_method}</TableCell>
                        <TableCell>{getPaymentStatusBadge(payment.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {payment.reference_number || payment.name}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {payments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No payments found for this sponsorship
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sponsorship Details */}
            <Card>
              <CardHeader>
                <CardTitle>Sponsorship Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Sponsorship ID:</span>
                  <span className="text-sm font-medium">{sponsorship.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Monthly Amount:</span>
                  <span className="text-sm font-medium">{formatCurrency(sponsorship.monthly_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Points per Month:</span>
                  <span className="text-sm font-medium">{sponsorship.monthly_points?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Start Date:</span>
                  <span className="text-sm font-medium">{formatDate(sponsorship.start_date)}</span>
                </div>
                {sponsorship.end_date && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">End Date:</span>
                    <span className="text-sm font-medium">{formatDate(sponsorship.end_date)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span className="text-sm">{getStatusBadge(sponsorship.status)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Sponsorship Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push(`/admin/assign-sponsorship?edit=${sponsorship.name}`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Sponsorship
                </Button>
                
                {sponsorship.status === 'active' && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Pause Sponsorship
                  </Button>
                )}
                
                {sponsorship.status === 'paused' && (
                  <Button 
                    className="w-full"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Resume Sponsorship
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Add Manual Payment
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Send Update to Donor
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Payment Success Rate:</span>
                  <span className="text-sm font-medium">
                    {payments.length > 0 ? Math.round((payments.filter(p => p.status === 'completed').length / payments.length) * 100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Average Payment:</span>
                  <span className="text-sm font-medium">
                    {payments.length > 0 ? formatCurrency(payments.reduce((sum, p) => sum + parseFloat(p.amount), 0) / payments.length) : '$0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Payment:</span>
                  <span className="text-sm font-medium">
                    {payments.length > 0 ? formatDate(payments[0].processed_date) : 'None'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SponsorshipDetailsPage() {
  return (
    <AuthGuard requiredRole="admin">
      <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-background to-muted" />}>
        <SponsorshipDetailsPageInner />
      </Suspense>
    </AuthGuard>
  )
}
