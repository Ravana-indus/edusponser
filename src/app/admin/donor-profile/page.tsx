"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  ArrowLeft, 
  User, 
  Heart, 
  MapPin, 
  Target, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Award,
  Phone,
  Mail,
  Building,
  Calendar,
  Activity,
  CreditCard,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  Eye,
  Edit,
  Send,
  Gift,
  Users,
  Globe,
  Star,
  MessageCircle,
  Briefcase,
  GraduationCap,
  School,
  PiggyBank,
  Zap,
  AlertCircle,
  Plus
} from "lucide-react"
import Navigation from "@/components/layout/Navigation"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'

function DonorProfilePageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const donorId = searchParams.get('id')
  
  const [donor, setDonor] = useState<any | null>(null)
  const [sponsorships, setSponsorships] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [communications, setCommunications] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [donorStats, setDonorStats] = useState<any>({})
  const [loading, setLoading] = useState(true)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  useEffect(() => {
    const load = async () => {
      try {
        if (!donorId) { setLoading(false); return }

        // Fetch donor details
        const { data: donorData, error: donorErr } = await supabase
          .from('donors')
          .select('*')
          .eq('name', donorId)
          .maybeSingle()
        if (donorErr) console.error(donorErr)
        if (!donorData) { router.push('/admin/dashboard'); return }
        setDonor(donorData)

        // Fetch sponsorships
        const { data: sponsorshipData, error: sponsorshipErr } = await supabase
          .from('sponsorships')
          .select(`
            *,
            student:students(*)
          `)
          .eq('donor', donorId)
          .order('start_date', { ascending: false })
        if (sponsorshipErr) console.error(sponsorshipErr)
        setSponsorships(sponsorshipData || [])

        // Get unique students
        const uniqueStudents = sponsorshipData?.map(s => s.student).filter(Boolean) || []
        setStudents(uniqueStudents)

        // Fetch payments
        const { data: paymentData, error: paymentErr } = await supabase
          .from('payments')
          .select(`
            *,
            student:students(name, first_name, last_name, profile_image),
            sponsorship:sponsorships(name)
          `)
          .eq('donor', donorId)
          .order('processed_date', { ascending: false })
        if (paymentErr) console.error(paymentErr)
        setPayments(paymentData || [])

        // Fetch communications (if exists)
        const { data: commData } = await supabase
          .from('communications')
          .select('*')
          .eq('donor', donorId)
          .order('date', { ascending: false })
          .limit(10)
        setCommunications(commData || [])

        // Calculate donor statistics
        const totalDonated = paymentData?.filter(p => p.status === 'completed')
          .reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0
        const totalPayments = paymentData?.filter(p => p.status === 'completed').length || 0
        const activeSponsorships = sponsorshipData?.filter(s => s.status === 'active').length || 0
        const totalSponsorships = sponsorshipData?.length || 0
        const avgPaymentAmount = totalPayments > 0 ? totalDonated / totalPayments : 0
        const monthlyCommitment = sponsorshipData?.filter(s => s.status === 'active')
          .reduce((sum, s) => sum + (s.monthly_amount || 0), 0) || 0

        // Payment history for charts
        const paymentHistory = paymentData?.filter(p => p.status === 'completed')
          .map(p => ({
            date: p.processed_date || p.date,
            amount: parseFloat(p.amount),
            month: new Date(p.processed_date || p.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          })) || []

        setDonorStats({
          totalDonated,
          totalPayments,
          activeSponsorships,
          totalSponsorships,
          avgPaymentAmount,
          monthlyCommitment,
          paymentHistory,
          studentsSupported: uniqueStudents.length,
          joinDate: donorData.created_at || donorData.join_date,
          lastPayment: paymentData?.[0]?.processed_date || paymentData?.[0]?.date,
          donationFrequency: totalPayments > 0 ? Math.round(365 / (totalPayments / ((new Date().getTime() - new Date(donorData.created_at || '2024-01-01').getTime()) / (1000 * 3600 * 24)))) : 0
        })

      } catch (error) {
        console.error('Error loading donor profile:', error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [donorId, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!donor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Donor Not Found</CardTitle>
              <CardDescription>The requested donor profile could not be found.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push('/admin/dashboard')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  // Prepare chart data
  const monthlyPayments = donorStats.paymentHistory?.reduce((acc: any, payment: any) => {
    const existing = acc.find((item: any) => item.month === payment.month)
    if (existing) {
      existing.amount += payment.amount
      existing.count += 1
    } else {
      acc.push({
        month: payment.month,
        amount: payment.amount,
        count: 1
      })
    }
    return acc
  }, []).slice(-12) || []

  const sponsorshipStatusData = [
    { name: 'Active', value: donorStats.activeSponsorships, color: '#00C49F' },
    { name: 'Completed', value: donorStats.totalSponsorships - donorStats.activeSponsorships, color: '#0088FE' }
  ].filter(item => item.value > 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Donor Profile</h1>
              <p className="text-gray-600">Comprehensive donor information and analytics</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link href={`/admin/edit-donor?id=${donor.name}`}>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </Link>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </div>
        </div>

        {/* Donor Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(donorStats.totalDonated)}
              </div>
              <p className="text-xs text-muted-foreground">
                {donorStats.totalPayments} payments made
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sponsorships</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {donorStats.activeSponsorships}
              </div>
              <p className="text-xs text-muted-foreground">
                {donorStats.studentsSupported} students supported
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Commitment</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(donorStats.monthlyCommitment)}
              </div>
              <p className="text-xs text-muted-foreground">
                Per month contribution
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Payment</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(donorStats.avgPaymentAmount)}
              </div>
              <p className="text-xs text-muted-foreground">
                Average donation amount
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sponsorships">Sponsorships</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
            <TabsTrigger value="profile">Profile Details</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Donor Information */}
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="mr-2 h-5 w-5" />
                      Donor Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={donor.profile_image} />
                        <AvatarFallback className="text-lg">
                          {donor.first_name?.[0]}{donor.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">
                          {donor.first_name} {donor.last_name}
                        </h3>
                        <p className="text-gray-600">{donor.email}</p>
                        <Badge variant="secondary" className="mt-1">
                          {donor.status || 'Active'} Donor
                        </Badge>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Donor ID:</span>
                        <span className="text-sm font-medium">{donor.name}</span>
                      </div>
                      {donor.phone && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Phone:</span>
                          <span className="text-sm font-medium">{donor.phone}</span>
                        </div>
                      )}
                      {donor.occupation && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Occupation:</span>
                          <span className="text-sm font-medium">{donor.occupation}</span>
                        </div>
                      )}
                      {donor.company && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Company:</span>
                          <span className="text-sm font-medium">{donor.company}</span>
                        </div>
                      )}
                      {donorStats.joinDate && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Member Since:</span>
                          <span className="text-sm font-medium">{formatDate(donorStats.joinDate)}</span>
                        </div>
                      )}
                      {donorStats.lastPayment && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Last Payment:</span>
                          <span className="text-sm font-medium">{formatDate(donorStats.lastPayment)}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="mr-2 h-5 w-5" />
                      Impact Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Students Impacted</span>
                        <span className="font-semibold text-blue-600">{donorStats.studentsSupported}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Sponsorships</span>
                        <span className="font-semibold text-purple-600">{donorStats.totalSponsorships}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Payment Frequency</span>
                        <span className="font-semibold text-orange-600">
                          {donorStats.donationFrequency > 0 ? `Every ${donorStats.donationFrequency} days` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Completion Rate</span>
                        <span className="font-semibold text-green-600">
                          {donorStats.totalSponsorships > 0 ? 
                            Math.round(((donorStats.totalSponsorships - donorStats.activeSponsorships) / donorStats.totalSponsorships) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts and Analytics */}
              <div className="lg:col-span-2 space-y-6">
                {/* Payment History Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>Monthly donation amounts over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={monthlyPayments}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Amount']} />
                        <Area type="monotone" dataKey="amount" stroke="#0088FE" fill="#0088FE" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Sponsorship Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Sponsorship Distribution</CardTitle>
                    <CardDescription>Active vs completed sponsorships</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center">
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={sponsorshipStatusData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}`}
                          >
                            {sponsorshipStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.slice(0, 5).map((payment) => (
                    <div key={payment.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Payment of {formatCurrency(parseFloat(payment.amount))}</p>
                          <p className="text-sm text-gray-600">
                            To: {payment.student?.first_name} {payment.student?.last_name} • {formatDateTime(payment.processed_date || payment.date)}
                          </p>
                        </div>
                      </div>
                      <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                        {payment.status}
                      </Badge>
                    </div>
                  ))}
                  {payments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No recent activities found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sponsorships Tab */}
          <TabsContent value="sponsorships" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Heart className="mr-2 h-5 w-5" />
                    Sponsorships ({sponsorships.length})
                  </span>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    New Sponsorship
                  </Button>
                </CardTitle>
                <CardDescription>All sponsored students and sponsorship details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sponsorships.map((sponsorship) => (
                    <Card key={sponsorship.name} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={sponsorship.student?.profile_image} />
                            <AvatarFallback>
                              {sponsorship.student?.first_name?.[0]}{sponsorship.student?.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">
                              {sponsorship.student?.first_name} {sponsorship.student?.last_name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {sponsorship.student?.school} • {sponsorship.student?.education_level}
                            </p>
                            <p className="text-sm text-gray-600">
                              Started: {formatDate(sponsorship.start_date)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-lg">
                            {formatCurrency(sponsorship.monthly_amount)}/month
                          </div>
                          <Badge variant={sponsorship.status === 'active' ? 'default' : 'secondary'}>
                            {sponsorship.status}
                          </Badge>
                          <div className="flex space-x-2 mt-2">
                            <Link href={`/admin/sponsorship-details?id=${sponsorship.name}`}>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </Link>
                            <Link href={`/admin/student-profile?id=${sponsorship.student?.name}`}>
                              <Button size="sm" variant="outline">
                                <User className="h-4 w-4 mr-1" />
                                Student
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {sponsorships.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No sponsorships found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payment History ({payments.length})
                </CardTitle>
                <CardDescription>Complete payment transaction history</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.name}>
                        <TableCell>{formatDate(payment.processed_date || payment.date)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={payment.student?.profile_image} />
                              <AvatarFallback>{payment.student?.first_name?.[0]}</AvatarFallback>
                            </Avatar>
                            <span>{payment.student?.first_name} {payment.student?.last_name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">{formatCurrency(parseFloat(payment.amount))}</TableCell>
                        <TableCell>{payment.payment_method || 'Card'}</TableCell>
                        <TableCell>
                          <Badge variant={payment.status === 'completed' ? 'default' : payment.status === 'pending' ? 'secondary' : 'destructive'}>
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Link href={`/admin/payment-details?id=${payment.name}`}>
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {payments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No payments found
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Donation Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Donation Trends</CardTitle>
                  <CardDescription>Payment amounts and frequency over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyPayments}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="amount" fill="#0088FE" name="Amount" />
                      <Line yAxisId="right" type="monotone" dataKey="count" stroke="#00C49F" name="Count" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Impact Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Impact Metrics</CardTitle>
                  <CardDescription>Donor contribution analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Donation Goal Progress</span>
                        <span className="text-sm text-gray-600">
                          {formatCurrency(donorStats.totalDonated)} / {formatCurrency(donorStats.totalDonated * 1.2)}
                        </span>
                      </div>
                      <Progress value={83} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Sponsorship Commitment</span>
                        <span className="text-sm text-gray-600">
                          {donorStats.activeSponsorships} / {donorStats.totalSponsorships}
                        </span>
                      </div>
                      <Progress 
                        value={donorStats.totalSponsorships > 0 ? (donorStats.activeSponsorships / donorStats.totalSponsorships) * 100 : 0} 
                        className="h-2" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{donorStats.studentsSupported}</div>
                        <div className="text-sm text-blue-600">Students Helped</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{donorStats.totalPayments}</div>
                        <div className="text-sm text-green-600">Total Donations</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Communications
                  </span>
                  <Button size="sm">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </CardTitle>
                <CardDescription>Message history and communication log</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {communications.map((comm, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            <MessageCircle className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{comm.subject || 'Message'}</h4>
                            <span className="text-sm text-gray-600">{formatDateTime(comm.date)}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{comm.message}</p>
                          <Badge variant="outline" className="mt-2">{comm.type || 'message'}</Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {communications.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No communications found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Details Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Complete Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Full Name</label>
                      <p className="font-medium">{donor.first_name} {donor.last_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="font-medium">{donor.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone</label>
                      <p className="font-medium">{donor.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Occupation</label>
                      <p className="font-medium">{donor.occupation || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Company</label>
                      <p className="font-medium">{donor.company || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Location</label>
                      <p className="font-medium">
                        {[donor.city, donor.country].filter(Boolean).join(', ') || 'Not provided'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Bio</label>
                      <p className="font-medium">{donor.bio || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Motivation</label>
                      <p className="font-medium">{donor.motivation || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Student Preference</label>
                      <p className="font-medium">{donor.student_preference || 'No preference'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Communication Frequency</label>
                      <p className="font-medium">{donor.communication_frequency || 'Monthly'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Preferred Contact</label>
                      <p className="font-medium">{donor.preferred_contact_method || 'Email'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Member Since</label>
                      <p className="font-medium">{donorStats.joinDate ? formatDate(donorStats.joinDate) : 'Unknown'}</p>
                    </div>
                  </div>
                </div>
                
                {(donor.interests || donor.donation_goal) && (
                  <>
                    <Separator className="my-6" />
                    <div className="space-y-4">
                      {donor.interests && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Interests</label>
                          <p className="font-medium">{donor.interests}</p>
                        </div>
                      )}
                      {donor.donation_goal && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Donation Goal</label>
                          <p className="font-medium">{donor.donation_goal}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function DonorProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    }>
      <DonorProfilePageInner />
    </Suspense>
  )
}
