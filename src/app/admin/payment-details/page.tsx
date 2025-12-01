'use client'

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ArrowLeft, 
  CreditCard, 
  User, 
  Building, 
  Calendar, 
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Edit,
  Save,
  Heart,
  Receipt,
  Banknote
} from "lucide-react"
import Navigation from "@/components/layout/Navigation"
import AuthGuard from "@/components/auth/AuthGuard"
import { supabase } from "@/lib/supabase/client"

function PaymentDetailsPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const paymentId = searchParams.get('id')
  
  const [payment, setPayment] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    const loadPaymentDetails = async () => {
      if (!paymentId) { 
        setLoading(false)
        return 
      }

      try {
        // Fetch payment details with related data
        const { data: paymentData, error: paymentError } = await supabase
          .from('payments')
          .select(`
            *,
            donor:donors(name, first_name, last_name, email, phone),
            student:students(name, first_name, last_name, email, phone),
            sponsorship:sponsorships(name, monthly_amount, start_date, status)
          `)
          .eq('name', paymentId)
          .single()

        if (paymentError) throw paymentError

        setPayment(paymentData)
        setFormData({
          amount: paymentData.amount,
          payment_method: paymentData.payment_method,
          status: paymentData.status,
          notes: paymentData.notes || '',
          reference_number: paymentData.reference_number || ''
        })
      } catch (error) {
        console.error('Error loading payment details:', error)
        router.push('/admin/dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadPaymentDetails()
  }, [paymentId, router])

  const updatePayment = async () => {
    setUpdating(true)
    try {
      const { error } = await supabase
        .from('payments')
        .update({
          amount: formData.amount,
          payment_method: formData.payment_method,
          status: formData.status,
          notes: formData.notes,
          reference_number: formData.reference_number
        })
        .eq('name', paymentId)

      if (error) throw error

      // Refresh payment data
      const { data: updatedPayment } = await supabase
        .from('payments')
        .select(`
          *,
          donor:donors(name, first_name, last_name, email, phone),
          student:students(name, first_name, last_name, email, phone),
          sponsorship:sponsorships(name, monthly_amount, start_date, status)
        `)
        .eq('name', paymentId)
        .single()

      if (updatedPayment) {
        setPayment(updatedPayment)
        setEditing(false)
      }
    } catch (error) {
      console.error('Error updating payment:', error)
      alert('Error updating payment')
    } finally {
      setUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>
      case 'failed':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>
      case 'refunded':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800"><Receipt className="h-3 w-3 mr-1" />Refunded</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (date: string) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString()
  }

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    return `$${num?.toLocaleString() || 0}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading payment details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Payment Not Found</h1>
            <p className="text-muted-foreground mb-4">The payment you're looking for doesn't exist.</p>
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
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
                Payment Details: {payment.name}
              </h1>
              <p className="text-muted-foreground">
                Processed on {formatDate(payment.processed_date)}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {getStatusBadge(payment.status)}
              <div className="text-right">
                <div className="text-2xl font-bold">{formatCurrency(payment.amount)}</div>
                <div className="text-sm text-muted-foreground">{payment.payment_method}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payment Information
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditing(!editing)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    {editing ? 'Cancel' : 'Edit'}
                  </Button>
                </CardTitle>
                <CardDescription>
                  Payment transaction details and status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {editing ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          value={formData.amount}
                          onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="payment_method">Payment Method</Label>
                        <Select value={formData.payment_method} onValueChange={(value) => setFormData({...formData, payment_method: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="credit_card">Credit Card</SelectItem>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="check">Check</SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                            <SelectItem value="stripe">Stripe</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                            <SelectItem value="refunded">Refunded</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="reference_number">Reference Number</Label>
                        <Input
                          id="reference_number"
                          value={formData.reference_number}
                          onChange={(e) => setFormData({...formData, reference_number: e.target.value})}
                          placeholder="Transaction reference"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        placeholder="Payment notes..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button onClick={updatePayment} disabled={updating}>
                        <Save className="mr-2 h-4 w-4" />
                        {updating ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button variant="outline" onClick={() => setEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Amount:</span>
                        <span className="text-sm font-medium">{formatCurrency(payment.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Method:</span>
                        <span className="text-sm font-medium">{payment.payment_method}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <span className="text-sm">{getStatusBadge(payment.status)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Type:</span>
                        <span className="text-sm font-medium">{payment.payment_type || 'Regular'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Processed:</span>
                        <span className="text-sm font-medium">{formatDate(payment.processed_date)}</span>
                      </div>
                      {payment.reference_number && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Reference:</span>
                          <span className="text-sm font-medium">{payment.reference_number}</span>
                        </div>
                      )}
                    </div>
                    
                    {payment.notes && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="text-sm font-medium mb-2">Notes</h4>
                          <p className="text-sm text-muted-foreground">{payment.notes}</p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Related Sponsorship */}
            {payment.sponsorship && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="mr-2 h-5 w-5" />
                    Related Sponsorship
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Sponsorship ID:</span>
                    <span className="text-sm font-medium">{payment.sponsorship.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Monthly Amount:</span>
                    <span className="text-sm font-medium">{formatCurrency(payment.sponsorship.monthly_amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Start Date:</span>
                    <span className="text-sm font-medium">{formatDate(payment.sponsorship.start_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <span className="text-sm font-medium">
                      <Badge variant={payment.sponsorship.status === 'active' ? 'default' : 'secondary'}>
                        {payment.sponsorship.status}
                      </Badge>
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Donor Information */}
            {payment.donor && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Donor Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {payment.donor.first_name?.[0]}{payment.donor.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {payment.donor.first_name} {payment.donor.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">{payment.donor.email}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Donor ID:</span>
                      <span className="text-sm">{payment.donor.name}</span>
                    </div>
                    {payment.donor.phone && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Phone:</span>
                        <span className="text-sm">{payment.donor.phone}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Student Information */}
            {payment.student && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Student Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {payment.student.first_name?.[0]}{payment.student.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {payment.student.first_name} {payment.student.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">{payment.student.email}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Student ID:</span>
                      <span className="text-sm">{payment.student.name}</span>
                    </div>
                    {payment.student.phone && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Phone:</span>
                        <span className="text-sm">{payment.student.phone}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {payment.status === 'pending' && (
                  <>
                    <Button 
                      className="w-full"
                      onClick={() => {
                        setFormData({...formData, status: 'completed'})
                        setEditing(true)
                      }}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Completed
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={() => {
                        setFormData({...formData, status: 'failed'})
                        setEditing(true)
                      }}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Mark as Failed
                    </Button>
                  </>
                )}
                
                {payment.status === 'completed' && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setFormData({...formData, status: 'refunded'})
                      setEditing(true)
                    }}
                  >
                    <Receipt className="mr-2 h-4 w-4" />
                    Process Refund
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentDetailsPage() {
  return (
    <AuthGuard requiredRole="admin">
      <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-background to-muted" />}>
        <PaymentDetailsPageInner />
      </Suspense>
    </AuthGuard>
  )
}
