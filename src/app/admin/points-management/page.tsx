"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  Shield, 
  CreditCard,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Edit,
  Eye,
  Settings,
  Calendar,
  BarChart3,
  Building,
  Truck,
  QrCode,
  Store,
  FileText,
  Target,
  Percent,
  Timer
} from "lucide-react"
import Navigation from "@/components/layout/Navigation"
import { supabase } from '@/lib/supabase/client'

interface InvestmentSettings {
  autoInvestEnabled: boolean
  investmentPercentage: number
  minimumThreshold: number
  investmentPlatform: string
  investmentType: string
  expectedReturnRate: number
  processingDay: number // Day of month (1-31)
}

interface Vendor {
  id: number
  name: string
  category: string
  contactPerson: string
  email: string
  phone: string
  address: string
  bankAccount: string
  bankName: string
  status: 'active' | 'inactive' | 'pending'
  totalOrders: number
  totalAmount: number
  lastPaymentDate: string
  nextPaymentDate: string
  joinDate: string
}

export default function PointsManagementPage() {
  const [students, setStudents] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [investments, setInvestments] = useState<any[]>([])
  const [insurance, setInsurance] = useState<any[]>([])
  const [withdrawalRequests, setWithdrawalRequests] = useState<any[]>([])
  const [goals, setGoals] = useState<any[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null)
  const [isStudentDetailsOpen, setIsStudentDetailsOpen] = useState(false)
  const [investmentSettings, setInvestmentSettings] = useState<InvestmentSettings>({
    autoInvestEnabled: true,
    investmentPercentage: 20,
    minimumThreshold: 10000,
    investmentPlatform: 'NFT Fund',
    investmentType: 'conservative',
    expectedReturnRate: 8.5,
    processingDay: 1
  })

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        // Students
        const { data: s } = await supabase
          .from('students')
          .select('name, first_name, last_name, email, status, total_points, available_points, invested_points, insurance_points, profile_image, school, education_level')
          .limit(500)
        setStudents((s || []).map(st => ({
          id: st.name,
          name: st.name,
          firstName: (st as any).first_name,
          lastName: (st as any).last_name,
          email: st.email,
          status: st.status,
          totalPoints: st.total_points || 0,
          availablePoints: st.available_points || 0,
          investedPoints: st.invested_points || 0,
          insurancePoints: st.insurance_points || 0,
          profileImage: (st as any).profile_image,
          school: (st as any).school,
          educationLevel: (st as any).education_level,
        })))

        // Points transactions
        const { data: pt } = await supabase
          .from('points_transactions')
          .select('id, student, type, amount, description, date, balance, category')
          .order('date', { ascending: false })
          .limit(1000)
        setTransactions(pt || [])

        // Investments
        const { data: inv } = await supabase
          .from('investments')
          .select('id, student, amount, platform, investment_type, status, investment_date, maturity_date, expected_return, current_value, description')
          .order('investment_date', { ascending: false })
          .limit(1000)
        setInvestments((inv || []).map((i: any) => ({
          id: i.id,
          student: i.student,
          amount: i.amount,
          platform: i.platform,
          investmentType: i.investment_type,
          status: i.status,
          investmentDate: i.investment_date,
          maturityDate: i.maturity_date,
          expectedReturn: i.expected_return,
          currentValue: i.current_value,
          description: i.description,
        })))

        // Insurance
        const { data: ins } = await supabase
          .from('health_insurance')
          .select('id, student, provider, policy_number, coverage_amount, premium_amount, start_date, expiry_date, status, coverage_details')
          .limit(1000)
        setInsurance((ins || []).map((p: any) => ({
          id: p.id,
          student: p.student,
          provider: p.provider,
          policyNumber: p.policy_number,
          coverageAmount: Number(p.coverage_amount || 0),
          premiumAmount: Number(p.premium_amount || 0),
          startDate: p.start_date,
          expiryDate: p.expiry_date,
          status: p.status,
          coverageDetails: Array.isArray(p.coverage_details) ? p.coverage_details : (p.coverage_details ? String(p.coverage_details).split(',').map((s: string) => s.trim()) : []),
        })))

        // Withdrawals
        const { data: wr } = await supabase
          .from('withdrawal_requests')
          .select('id, student, amount, reason, category, status, request_date, processed_date, bank_name, account_number, account_holder, branch')
          .order('request_date', { ascending: false })
          .limit(500)
        setWithdrawalRequests((wr || []).map(w => ({
          id: w.id,
          student: w.student,
          amount: w.amount,
          reason: w.reason,
          category: w.category,
          status: w.status,
          requestDate: w.request_date,
          processedDate: w.processed_date,
          bankDetails: {
            bankName: (w as any).bank_name,
            accountNumber: (w as any).account_number,
            accountHolder: (w as any).account_holder,
            branch: (w as any).branch,
          }
        })))

        // Goals
        const { data: sg } = await supabase
          .from('student_goals')
          .select('id, student, title, description, target_amount, current_amount, category, target_date, status, is_public, created_date, updated_date')
          .limit(1000)
        setGoals(sg || [])

        // Purchase Orders (view)
        const { data: po } = await supabase
          .from('view_purchase_orders_full')
          .select('order_id, student_name, vendor_id, vendor_name, total_points, status, request_date, approved_date, fulfilled_date, delivery_method, delivery_address')
          .limit(1000)
        setPurchaseOrders((po || []).map(o => ({
          id: o.order_id,
          studentId: o.student_name,
          studentName: o.student_name,
          vendorId: (o as any).vendor_id,
          vendorName: (o as any).vendor_name,
          items: [],
          totalPoints: o.total_points || 0,
          status: o.status,
          requestDate: o.request_date,
          approvedDate: o.approved_date,
          fulfilledDate: o.fulfilled_date,
          deliveryMethod: o.delivery_method,
          deliveryAddress: o.delivery_address,
        })))

        // Vendors (basic)
        const { data: v } = await supabase
          .from('vendors')
          .select('id, name, category, contact_person, email, phone, address, status, join_date')
          .limit(500)
        // Compute per-vendor current-month payout based on fulfilled orders
        const now = new Date()
        const thisMonth = now.getMonth()
        const thisYear = now.getFullYear()
        const vendorsComputed = (v || []).map((vend: any, idx: number) => {
          const monthOrders = purchaseOrders.filter((o: any) => {
            const d = o.fulfilledDate || o.approvedDate || o.requestDate
            const dt = d ? new Date(d) : null
            return o.vendorName === vend.name && o.status === 'fulfilled' && dt && dt.getMonth() === thisMonth && dt.getFullYear() === thisYear
          })
          const totalAmount = monthOrders.reduce((s: number, o: any) => s + Number(o.totalPoints || 0), 0)
          return {
            id: idx + 1,
            name: vend.name,
            category: vend.category || 'general',
            contactPerson: vend.contact_person || '',
            email: vend.email || '',
            phone: vend.phone || '',
            address: vend.address || '',
            bankAccount: '',
            bankName: '',
            status: vend.status || 'active',
            totalOrders: monthOrders.length,
            totalAmount,
            lastPaymentDate: '',
            nextPaymentDate: `${thisYear}-${String(thisMonth + 1).padStart(2,'0')}-25`,
            joinDate: vend.join_date || '',
          } as Vendor
        })
        setVendors(vendorsComputed)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Helpers for student detail panel
  const getPointsTransactionsByStudentId = (studentId: string) =>
    transactions.filter((t: any) => t.student === studentId)

  const getInvestmentsByStudentId = (studentId: string) =>
    investments.filter((i: any) => i.student === studentId)

  const getPurchaseOrdersByStudentId = (studentId: string) => {
    const st = students.find(s => s.id === studentId)
    const full = st ? `${st.firstName} ${st.lastName}` : null
    return purchaseOrders.filter((o: any) => o.studentId === studentId || (full && o.studentName === full))
  }

  // Calculate statistics
  const totalPoints = students.reduce((sum, student) => sum + Number(student.totalPoints || 0), 0)
  const totalInvested = students.reduce((sum, student) => sum + Number(student.investedPoints || 0), 0)
  const totalInsurance = students.reduce((sum, student) => sum + Number(student.insurancePoints || 0), 0)
  const totalAvailable = students.reduce((sum, student) => sum + Number(student.availablePoints || 0), 0)
  const pendingWithdrawals = withdrawalRequests.filter(w => w.status === 'pending')
  const activeInvestments = investments.filter((inv: any) => inv.status === 'active')
  const activeInsurance = insurance.filter((ins: any) => ins.status === 'active')
  const pendingOrders = purchaseOrders.filter((order: any) => order.status === 'pending')
  const fulfilledOrders = purchaseOrders.filter((order: any) => order.status === 'fulfilled')

  // Calculate monthly investment potential
  const monthlyInvestmentPotential = students.reduce((sum, student) => {
    const unusedPoints = student.availablePoints
    return sum + (unusedPoints * (investmentSettings.investmentPercentage / 100))
  }, 0)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
      case "active":
      case "fulfilled":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "rejected":
      case "inactive":
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // Dynamic investment type distribution helpers
  const invCounts = investments.reduce((acc: Record<string, number>, i: any) => {
    const key = (i.investmentType || '').toString().toLowerCase() || 'other'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
  const invTotal = Object.values(invCounts).reduce((a: number, b: any) => a + Number(b), 0) || 1
  const invPct = (key: string) => Math.round(((invCounts[key] || 0) / invTotal) * 100)

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case "earned":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "spent":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case "invested":
        return <PiggyBank className="h-4 w-4 text-blue-600" />
      case "withdrawn":
        return <CreditCard className="h-4 w-4 text-orange-600" />
      case "insurance":
        return <Shield className="h-4 w-4 text-purple-600" />
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />
    }
  }

  const handleAutoInvestToggle = (checked: boolean) => {
    setInvestmentSettings(prev => ({
      ...prev,
      autoInvestEnabled: checked
    }))
  }

  const handleInvestmentSettingsChange = (field: keyof InvestmentSettings, value: any) => {
    setInvestmentSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const processMonthlyInvestments = () => {
    // Simulate processing monthly investments
    const newInvestments: any[] = []
    
    students.forEach(student => {
      const unusedPoints = student.availablePoints
      const investableAmount = Math.floor(unusedPoints * (investmentSettings.investmentPercentage / 100))
      
      if (investableAmount >= investmentSettings.minimumThreshold) {
        const newInvestment: any = {
          id: investments.length + newInvestments.length + 1,
          studentId: student.id,
          amount: investableAmount,
          platform: investmentSettings.investmentPlatform,
          investmentType: investmentSettings.investmentType as any,
          expectedReturn: Math.floor(investableAmount * (1 + investmentSettings.expectedReturnRate / 100)),
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'active',
          description: `Auto-investment for ${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}`
        }
        newInvestments.push(newInvestment)
      }
    })
    
    setInvestments(prev => [...prev, ...newInvestments])
    
    // Show success message (in real app, this would be a toast)
    alert(`Successfully processed ${newInvestments.length} auto-investments totaling ${newInvestments.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()} points`)
  }

  const processVendorPayments = () => {
    // Simulate processing vendor payments (25th of month)
    const vendorsToPay = vendors.filter(v => v.status === 'active')
    const totalPayment = vendorsToPay.reduce((sum, vendor) => {
      const monthlyOrders = purchaseOrders.filter(order => 
        order.status === 'fulfilled' && 
        new Date(order.requestDate).getMonth() === new Date().getMonth() - 1
      )
      const vendorOrders = monthlyOrders.filter(order => {
        // In real app, this would check if order belongs to vendor
        return true
      })
      return sum + vendorOrders.reduce((orderSum, order) => orderSum + order.totalPoints, 0)
    }, 0)
    
    alert(`Processing vendor payments: ${totalPayment.toLocaleString()} points to ${vendorsToPay.length} vendors`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading points management...</p>
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
        firstName: "Admin",
        lastName: "User",
        email: "admin@edusponsor.com",
        role: "admin"
      }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Points Management System</h1>
              <p className="text-muted-foreground">
                Manage automatic investments, student points history, insurance, and vendor payments
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={processMonthlyInvestments}>
                <Timer className="mr-2 h-4 w-4" />
                Process Monthly Investments
              </Button>
              <Button variant="outline" onClick={processVendorPayments}>
                <CreditCard className="mr-2 h-4 w-4" />
                Process Vendor Payments
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPoints.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Across all students
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Points</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAvailable.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Ready for use
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Invested Points</CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInvested.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                In investments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Insurance Points</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInsurance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Health coverage
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Investment</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.floor(monthlyInvestmentPotential).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Potential auto-invest
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vendors.filter(v => v.status === 'active').length}</div>
              <p className="text-xs text-muted-foreground">
                Payment partners
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="investments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="investments">Auto Investments</TabsTrigger>
            <TabsTrigger value="students">Student Points</TabsTrigger>
            <TabsTrigger value="insurance">Insurance</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Auto Investments Tab */}
          <TabsContent value="investments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Investment Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    Auto-Investment Settings
                  </CardTitle>
                  <CardDescription>
                    Configure automatic investment of unused points at month end
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Enable Auto-Investment</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically invest unused points on {investmentSettings.processingDay}st of each month
                      </p>
                    </div>
                    <Switch
                      checked={investmentSettings.autoInvestEnabled}
                      onCheckedChange={handleAutoInvestToggle}
                    />
                  </div>

                  {investmentSettings.autoInvestEnabled && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="investment-percentage">Investment Percentage</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="investment-percentage"
                            type="number"
                            value={investmentSettings.investmentPercentage}
                            onChange={(e) => handleInvestmentSettingsChange('investmentPercentage', parseInt(e.target.value))}
                            className="w-20"
                            min="1"
                            max="100"
                          />
                          <span className="text-sm text-muted-foreground">% of unused points</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="minimum-threshold">Minimum Threshold</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="minimum-threshold"
                            type="number"
                            value={investmentSettings.minimumThreshold}
                            onChange={(e) => handleInvestmentSettingsChange('minimumThreshold', parseInt(e.target.value))}
                            className="w-32"
                            min="1000"
                          />
                          <span className="text-sm text-muted-foreground">points minimum</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="processing-day">Processing Day</Label>
                        <Select 
                          value={investmentSettings.processingDay.toString()} 
                          onValueChange={(value) => handleInvestmentSettingsChange('processingDay', parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1st of month</SelectItem>
                            <SelectItem value="2">2nd of month</SelectItem>
                            <SelectItem value="3">3rd of month</SelectItem>
                            <SelectItem value="5">5th of month</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="investment-platform">Investment Platform</Label>
                        <Input
                          id="investment-platform"
                          value={investmentSettings.investmentPlatform}
                          onChange={(e) => handleInvestmentSettingsChange('investmentPlatform', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="investment-type">Investment Type</Label>
                        <Select 
                          value={investmentSettings.investmentType} 
                          onValueChange={(value) => handleInvestmentSettingsChange('investmentType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="conservative">Conservative</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="aggressive">Aggressive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="expected-return">Expected Return Rate</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="expected-return"
                            type="number"
                            value={investmentSettings.expectedReturnRate}
                            onChange={(e) => handleInvestmentSettingsChange('expectedReturnRate', parseFloat(e.target.value))}
                            className="w-20"
                            step="0.1"
                            min="0"
                            max="50"
                          />
                          <span className="text-sm text-muted-foreground">% annually</span>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-end pt-4 border-t">
                    <Button onClick={() => {
                      // Save investment settings
                      alert('Investment settings saved successfully!')
                    }}>
                      <Settings className="mr-2 h-4 w-4" />
                      Save Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Investment Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Investment Summary
                  </CardTitle>
                  <CardDescription>
                    Current investment portfolio and projections
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Invested</p>
                      <p className="text-lg font-bold">{totalInvested.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Active Investments</p>
                      <p className="text-lg font-bold">{activeInvestments.length}</p>
                    </div>
                  </div>

                  <div className="text-center p-3 border rounded-lg bg-blue-50">
                    <p className="text-sm text-muted-foreground">Next Month's Potential</p>
                    <p className="text-xl font-bold text-blue-600">{Math.floor(monthlyInvestmentPotential).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {investmentSettings.investmentPercentage}% of {totalAvailable.toLocaleString()} available points
                    </p>
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    <h4 className="font-medium">Recent Investments</h4>
                    {investments.slice(0, 5).map((investment) => {
                      const student = students.find(s => s.id === investment.studentId)
                      return (
                        <div key={investment.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-sm font-medium">{investment.platform}</p>
                              <p className="text-xs text-muted-foreground">
                                {student?.firstName} {student?.lastName} • {investment.investmentType.toUpperCase()}
                              </p>
                            </div>
                            {getStatusBadge(investment.status)}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">Amount:</span>
                              <span className="ml-1 font-medium">{investment.amount.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Expected:</span>
                              <span className="ml-1 font-medium">{investment.expectedReturn.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Management Cost Allocation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Percent className="mr-2 h-5 w-5" />
                    Management Cost Allocation
                  </CardTitle>
                  <CardDescription>
                    Configure 20% management fee from each $50 points allocation monthly
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 border rounded-lg bg-orange-50">
                      <p className="text-sm text-muted-foreground">Management Fee Rate</p>
                      <p className="text-2xl font-bold text-orange-600">20%</p>
                      <p className="text-xs text-muted-foreground">From each $50 allocation</p>
                    </div>
                    
                    <div className="text-center p-4 border rounded-lg bg-blue-50">
                      <p className="text-sm text-muted-foreground">Monthly Collection</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {Math.floor(students.length * 10).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Points from {students.length} students</p>
                    </div>
                    
                    <div className="text-center p-4 border rounded-lg bg-green-50">
                      <p className="text-sm text-muted-foreground">Annual Projection</p>
                      <p className="text-2xl font-bold text-green-600">
                        {Math.floor(students.length * 10 * 12).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Total management fees</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Enable Management Fee Collection</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically deduct 20% management fee from each $50 monthly allocation
                        </p>
                      </div>
                      <Switch
                        checked={true}
                        onCheckedChange={(checked) => {
                          // Handle management fee toggle
                          alert(`Management fee collection ${checked ? 'enabled' : 'disabled'}`)
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fee-amount">Fee Amount per $50</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="fee-amount"
                          type="number"
                          value={10}
                          readOnly
                          className="w-20"
                        />
                        <span className="text-sm text-muted-foreground">points (20% of $50)</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="processing-day-fee">Processing Day</Label>
                      <Select defaultValue="1">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st of month</SelectItem>
                          <SelectItem value="5">5th of month</SelectItem>
                          <SelectItem value="10">10th of month</SelectItem>
                          <SelectItem value="15">15th of month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                      <Button onClick={() => {
                        // Save management fee settings
                        alert('Management fee settings saved successfully!')
                      }}>
                        <Settings className="mr-2 h-4 w-4" />
                        Save Fee Settings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Student Points Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Student Points Management
                </CardTitle>
                <CardDescription>
                  View detailed points status, history, and manage individual student accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Search students by name or email..."
                    className="max-w-sm"
                  />
                </div>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {students.map((student) => {
                    const studentTransactions = transactions.filter(t => t.student === student.id)
                    const studentInvestments = investments.filter(i => i.student === student.id)
                    const studentInsurance = insurance.filter(i => i.student === student.id)
                    const studentGoals = goals.filter(g => g.student === student.id)
                    const studentOrders = purchaseOrders.filter(o => o.studentId === student.id || o.studentName === `${student.firstName} ${student.lastName}`)
                    
                    return (
                      <div key={student.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={student.profileImage} />
                              <AvatarFallback>{student.firstName[0]}{student.lastName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{student.firstName} {student.lastName}</h4>
                              <p className="text-sm text-muted-foreground">{student.email}</p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedStudent(student)
                              setIsStudentDetailsOpen(true)
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div className="text-center p-2 bg-muted rounded">
                            <p className="font-medium">{student.totalPoints.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Total</p>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded">
                            <p className="font-medium text-green-600">{student.availablePoints.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Available</p>
                          </div>
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <p className="font-medium text-blue-600">{student.investedPoints.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Invested</p>
                          </div>
                          <div className="text-center p-2 bg-purple-50 rounded">
                            <p className="font-medium text-purple-600">{student.insurancePoints.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Insurance</p>
                          </div>
                          <div className="text-center p-2 bg-orange-50 rounded">
                            <p className="font-medium text-orange-600">{studentOrders.length}</p>
                            <p className="text-xs text-muted-foreground">Orders</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insurance Management Tab */}
          <TabsContent value="insurance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Insurance Overview
                  </CardTitle>
                  <CardDescription>
                    Health insurance coverage across all students
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Active Policies</p>
                      <p className="text-2xl font-bold">{activeInsurance.length}</p>
                      <p className="text-xs text-muted-foreground">Students covered</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Coverage</p>
                      <p className="text-2xl font-bold">
                        {activeInsurance.reduce((sum, policy) => sum + policy.coverageAmount, 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">LKR</p>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    <h4 className="font-medium">Active Insurance Policies</h4>
                    {activeInsurance.slice(0, 5).map((policy) => {
                      const student = students.find(s => s.id === policy.studentId)
                      return (
                        <div key={policy.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-sm font-medium">{policy.provider}</p>
                              <p className="text-xs text-muted-foreground">
                                {student?.firstName} {student?.lastName}
                              </p>
                            </div>
                            {getStatusBadge(policy.status)}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">Coverage:</span>
                              <span className="ml-1 font-medium">{policy.coverageAmount.toLocaleString()} LKR</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Premium:</span>
                              <span className="ml-1 font-medium">{policy.premiumAmount.toLocaleString()} pts</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Insurance Management
                  </CardTitle>
                  <CardDescription>
                    Manage insurance policies and claims
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Default Insurance Section */}
                    <div className="p-4 border rounded-lg bg-blue-50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">Default Insurance Policy</h4>
                          <p className="text-sm text-muted-foreground">Set a default policy for all students</p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => {
                            // Assign default insurance to all students
                            alert('Default insurance policy assigned to all students successfully!')
                          }}
                        >
                          Assign to All
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="default-provider">Provider</Label>
                            <Input id="default-provider" defaultValue="National Health Insurance" />
                          </div>
                          <div>
                            <Label htmlFor="default-coverage">Coverage Amount (LKR)</Label>
                            <Input id="default-coverage" type="number" defaultValue="500000" />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="default-premium">Premium (points)</Label>
                            <Input id="default-premium" type="number" defaultValue="1000" />
                          </div>
                          <div>
                            <Label htmlFor="default-duration">Duration (months)</Label>
                            <Select defaultValue="12">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="6">6 months</SelectItem>
                                <SelectItem value="12">12 months</SelectItem>
                                <SelectItem value="24">24 months</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          <p>• This policy will be automatically assigned to new students</p>
                          <p>• Students without insurance will receive this default policy</p>
                          <p>• Premium will be deducted from student's available points</p>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Insurance Policy
                    </Button>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Pending Actions</h4>
                      {(() => {
                        const now = new Date()
                        const sameMonth = (d?: string) => {
                          if (!d) return false
                          const dt = new Date(d)
                          return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear()
                        }
                        const renewals = insurance.filter((p: any) => sameMonth(p.expiryDate)).length
                        const claimsPending = withdrawalRequests.filter((w: any) => w.category === 'health' && w.status === 'pending').length
                        return (
                          <>
                            <div className="p-3 border rounded-lg bg-yellow-50">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium">Policy Renewals</p>
                                  <p className="text-xs text-muted-foreground">{renewals} policies expiring this month</p>
                                </div>
                                <Button size="sm">Review</Button>
                              </div>
                            </div>
                            <div className="p-3 border rounded-lg bg-blue-50">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium">Claims Processing</p>
                                  <p className="text-xs text-muted-foreground">{claimsPending} health withdrawals under review</p>
                                </div>
                                <Button size="sm">Review</Button>
                              </div>
                            </div>
                          </>
                        )
                      })()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Vendors Management Tab */}
          <TabsContent value="vendors" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="mr-2 h-5 w-5" />
                    Vendors Overview
                  </CardTitle>
                  <CardDescription>
                    Manage vendor partnerships and payment processing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Active Vendors</p>
                      <p className="text-2xl font-bold">{vendors.filter(v => v.status === 'active').length}</p>
                      <p className="text-xs text-muted-foreground">Payment partners</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Monthly Payout</p>
                      <p className="text-2xl font-bold">
                        {vendors.reduce((sum, v) => sum + v.totalAmount, 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Points this month</p>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    <h4 className="font-medium">Active Vendors</h4>
                    {vendors.filter(v => v.status === 'active').map((vendor) => (
                      <div key={vendor.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm font-medium">{vendor.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {vendor.category} • {vendor.contactPerson}
                            </p>
                          </div>
                          {getStatusBadge(vendor.status)}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Orders:</span>
                            <span className="ml-1 font-medium">{vendor.totalOrders}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Next Payment:</span>
                            <span className="ml-1 font-medium">{vendor.nextPaymentDate}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payment Processing
                  </CardTitle>
                  <CardDescription>
                    Process vendor payments and manage invoices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-blue-50">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">Next Payment Date</p>
                          <p className="text-sm text-muted-foreground">25th of this month</p>
                        </div>
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <p className="text-sm">
                        Processing payments for {vendors.filter(v => v.status === 'active').length} active vendors
                      </p>
                    </div>

                    <Button className="w-full" onClick={processVendorPayments}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Process Monthly Payments
                    </Button>

                    <div className="space-y-3">
                      <h4 className="font-medium">Recent Orders by Vendors</h4>
                      {purchaseOrders.slice(0, 3).map((order) => {
                        const student = students.find(s => s.id === order.studentId)
                        return (
                          <div key={order.id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="text-sm font-medium">Order #{order.id}</p>
                                <p className="text-xs text-muted-foreground">
                                  {student?.firstName} {student?.lastName} • {order.requestDate}
                                </p>
                              </div>
                              {getStatusBadge(order.status)}
                            </div>
                            <div className="text-xs">
                              <span className="text-muted-foreground">Amount:</span>
                              <span className="ml-1 font-medium">{order.totalPoints.toLocaleString()} pts</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Points Distribution
                  </CardTitle>
                  <CardDescription>
                    Overview of points allocation across the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Available Points</span>
                        <span>{((totalAvailable / totalPoints) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={(totalAvailable / totalPoints) * 100} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Invested Points</span>
                        <span>{((totalInvested / totalPoints) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={(totalInvested / totalPoints) * 100} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Insurance Points</span>
                        <span>{((totalInsurance / totalPoints) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={(totalInsurance / totalPoints) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5" />
                    Investment Performance
                  </CardTitle>
                  <CardDescription>
                    Track investment returns and performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Return</p>
                        <p className="text-lg font-bold text-green-600">
                          {activeInvestments.reduce((sum, inv) => sum + (inv.expectedReturn - inv.amount), 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">points gained</p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Avg. Return Rate</p>
                        <p className="text-lg font-bold text-blue-600">
                          {investmentSettings.expectedReturnRate}%
                        </p>
                        <p className="text-xs text-muted-foreground">annually</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Investment by Type</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Conservative</span>
                          <span>{invPct('conservative')}%</span>
                        </div>
                        <Progress value={invPct('conservative')} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Moderate</span>
                          <span>{invPct('moderate')}%</span>
                        </div>
                        <Progress value={invPct('moderate')} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Aggressive</span>
                          <span>{invPct('aggressive')}%</span>
                        </div>
                        <Progress value={invPct('aggressive')} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Student Details Dialog */}
      <Dialog open={isStudentDetailsOpen} onOpenChange={setIsStudentDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Points Details</DialogTitle>
            <DialogDescription>
              Complete points history and allocation for {selectedStudent?.firstName} {selectedStudent?.lastName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="space-y-6">
              {/* Student Info */}
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedStudent.profileImage} />
                  <AvatarFallback>{selectedStudent.firstName[0]}{selectedStudent.lastName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedStudent.firstName} {selectedStudent.lastName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedStudent.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedStudent.major} • {selectedStudent.university}</p>
                </div>
              </div>

              {/* Points Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Points</p>
                  <p className="text-2xl font-bold">{selectedStudent.totalPoints.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-green-50">
                  <p className="text-sm text-muted-foreground">Available</p>
                  <p className="text-2xl font-bold text-green-600">{selectedStudent.availablePoints.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-blue-50">
                  <p className="text-sm text-muted-foreground">Invested</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedStudent.investedPoints.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-purple-50">
                  <p className="text-sm text-muted-foreground">Insurance</p>
                  <p className="text-2xl font-bold text-purple-600">{selectedStudent.insurancePoints.toLocaleString()}</p>
                </div>
              </div>

              {/* Recent Transactions */}
              <div>
                <h4 className="font-medium mb-3">Recent Transactions</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {getPointsTransactionsByStudentId(selectedStudent.id).slice(0, 10).map((transaction: any) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getTransactionTypeIcon(transaction.type)}
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${transaction.type === 'earned' ? 'text-green-600' : transaction.type === 'spent' ? 'text-red-600' : 'text-blue-600'}`}>
                          {transaction.type === 'earned' ? '+' : transaction.type === 'spent' ? '-' : ''}{transaction.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">{transaction.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Investments */}
              <div>
                <h4 className="font-medium mb-3">Active Investments</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {getInvestmentsByStudentId(selectedStudent.id).filter((inv: any) => inv.status === 'active').map((investment: any) => (
                    <div key={investment.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{investment.platform}</p>
                          <p className="text-xs text-muted-foreground">{investment.investmentType} • {investment.investmentDate || investment.startDate || ''}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{investment.amount.toLocaleString()} pts</p>
                          <p className="text-xs text-muted-foreground">Expected: {investment.expectedReturn.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Purchase Orders */}
              <div>
                <h4 className="font-medium mb-3">Recent Orders</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {getPurchaseOrdersByStudentId(selectedStudent.id).slice(0, 5).map((order: any) => (
                    <div key={order.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-xs text-muted-foreground">{order.requestDate}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{order.totalPoints.toLocaleString()} pts</p>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}