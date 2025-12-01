"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
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
  Settings
} from "lucide-react"
import Navigation from "@/components/layout/Navigation"
import { supabase } from '@/lib/supabase/client'
import { 
  Student, 
  PointsTransaction, 
  Investment, 
  HealthInsurance, 
  WithdrawalRequest, 
  StudentGoal
} from "@/lib/data/mockData"

export default function FinancialManagementPage() {
  const [students, setStudents] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [investments, setInvestments] = useState<any[]>([])
  const [insurance, setInsurance] = useState<any[]>([])
  const [withdrawalRequests, setWithdrawalRequests] = useState<any[]>([])
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const { data: s } = await supabase
          .from('students')
          .select('name, first_name, last_name, email, total_points, available_points, invested_points, insurance_points')
          .limit(500)
        setStudents((s || []).map(st => ({
          id: st.name,
          firstName: (st as any).first_name,
          lastName: (st as any).last_name,
          email: st.email,
          totalPoints: st.total_points || 0,
          availablePoints: (st as any).available_points || 0,
          investedPoints: (st as any).invested_points || 0,
          insurancePoints: (st as any).insurance_points || 0,
        })))

        const { data: pt } = await supabase
          .from('points_transactions')
          .select('id, student, type, amount, description, date, balance, category')
          .order('date', { ascending: false })
          .limit(1000)
        setTransactions(pt || [])

        const { data: inv } = await supabase
          .from('investments')
          .select('id, student, amount, platform, investment_type, status, investment_date, maturity_date, expected_return, current_value, description')
          .limit(1000)
        setInvestments(inv || [])

        const { data: ins } = await supabase
          .from('health_insurance')
          .select('id, student, provider, policy_number, coverage_amount, premium_amount, start_date, expiry_date, status, coverage_details')
          .limit(1000)
        setInsurance(ins || [])

        const { data: wr } = await supabase
          .from('withdrawal_requests')
          .select('id, student, amount, reason, category, status, request_date, processed_date, bank_name, account_number, account_holder, branch')
          .order('request_date', { ascending: false })
          .limit(500)
        setWithdrawalRequests((wr || []).map(w => ({
          id: w.id,
          studentId: w.student,
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

        const { data: sg } = await supabase
          .from('student_goals')
          .select('id, student, title, description, target_amount, current_amount, category, target_date, status, created_date, updated_date')
          .limit(1000)
        setGoals(sg || [])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Calculate statistics
  const totalPoints = students.reduce((sum, student) => sum + Number(student.totalPoints || 0), 0)
  const totalInvested = students.reduce((sum, student) => sum + Number(student.investedPoints || 0), 0)
  const totalInsurance = students.reduce((sum, student) => sum + Number(student.insurancePoints || 0), 0)
  const totalAvailable = students.reduce((sum, student) => sum + Number(student.availablePoints || 0), 0)
  const pendingWithdrawals = withdrawalRequests.filter(w => w.status === 'pending')
  const activeInvestments = investments.filter((inv: any) => inv.status === 'active')
  const activeInsurance = insurance.filter((ins: any) => ins.status === 'active')

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading financial management...</p>
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
              <h1 className="text-3xl font-bold">Financial Management</h1>
              <p className="text-muted-foreground">
                Manage points allocation, investments, insurance, and financial operations
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
                In NFT funds
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
              <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingWithdrawals.length}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting approval
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
            <TabsTrigger value="insurance">Insurance</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="mr-2 h-5 w-5" />
                    Recent Transactions
                  </CardTitle>
                  <CardDescription>
                    Latest points transactions across all students
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {transactions.slice(0, 8).map((transaction) => {
                      const student = students.find(s => s.id === transaction.studentId)
                      return (
                        <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getTransactionTypeIcon(transaction.type)}
                            <div>
                              <p className="text-sm font-medium">{transaction.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {student?.firstName} {student?.lastName} • {transaction.date}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-medium ${
                              transaction.type === 'earned' ? 'text-green-600' : 
                              transaction.type === 'spent' || transaction.type === 'withdrawn' ? 'text-red-600' : 
                              'text-blue-600'
                            }`}>
                              {transaction.type === 'earned' ? '+' : '-'}{transaction.amount.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">Balance: {transaction.balance.toLocaleString()}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Investment Portfolio Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PiggyBank className="mr-2 h-5 w-5" />
                    Investment Portfolio
                  </CardTitle>
                  <CardDescription>
                    Summary of all NFT investments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
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
                    
                    <div className="space-y-3 max-h-64 overflow-y-auto">
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
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Health Insurance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Health Insurance Overview
                </CardTitle>
                <CardDescription>
                  Summary of health insurance coverage across all students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Monthly Premiums</p>
                    <p className="text-2xl font-bold">
                      {activeInsurance.reduce((sum, policy) => sum + policy.premiumAmount, 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Points</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  All Transactions
                </CardTitle>
                <CardDescription>
                  Complete transaction history with filtering and search capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {transactions.map((transaction) => {
                    const student = students.find(s => s.id === transaction.studentId)
                    return (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          {getTransactionTypeIcon(transaction.type)}
                          <div>
                            <p className="text-sm font-medium">{transaction.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {student?.firstName} {student?.lastName} • {transaction.date} • {transaction.category}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${
                            transaction.type === 'earned' ? 'text-green-600' : 
                            transaction.type === 'spent' || transaction.type === 'withdrawn' ? 'text-red-600' : 
                            'text-blue-600'
                          }`}>
                            {transaction.type === 'earned' ? '+' : '-'}{transaction.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">Balance: {transaction.balance.toLocaleString()}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Investments Tab */}
          <TabsContent value="investments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PiggyBank className="mr-2 h-5 w-5" />
                  NFT Investment Management
                </CardTitle>
                <CardDescription>
                  Manage and monitor all NFT investments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {investments.map((investment) => {
                    const student = students.find(s => s.id === investment.studentId)
                    return (
                      <div key={investment.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-sm font-medium">{investment.platform}</p>
                            <p className="text-xs text-muted-foreground">
                              {student?.firstName} {student?.lastName} • {investment.investmentType.toUpperCase()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(investment.status)}
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          <div>
                            <span className="text-muted-foreground">Amount:</span>
                            <span className="ml-1 font-medium">{investment.amount.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Expected:</span>
                            <span className="ml-1 font-medium">{investment.expectedReturn.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Current:</span>
                            <span className="ml-1 font-medium">{investment.currentValue?.toLocaleString() || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Maturity:</span>
                            <span className="ml-1 font-medium">{investment.maturityDate || 'N/A'}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{investment.description}</p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insurance Tab */}
          <TabsContent value="insurance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Health Insurance Management
                </CardTitle>
                <CardDescription>
                  Manage health insurance policies and coverage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {insurance.map((policy) => {
                    const student = students.find(s => s.id === policy.studentId)
                    return (
                      <div key={policy.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-sm font-medium">{policy.provider}</p>
                            <p className="text-xs text-muted-foreground">
                              {student?.firstName} {student?.lastName} • Policy: {policy.policyNumber}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(policy.status)}
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          <div>
                            <span className="text-muted-foreground">Coverage:</span>
                            <span className="ml-1 font-medium">{policy.coverageAmount.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Premium:</span>
                            <span className="ml-1 font-medium">{policy.premiumAmount.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Start:</span>
                            <span className="ml-1 font-medium">{policy.startDate}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Expiry:</span>
                            <span className="ml-1 font-medium">{policy.expiryDate}</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">Coverage:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {policy.coverageDetails.map((detail, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {detail}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Withdrawals Tab */}
          <TabsContent value="withdrawals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Withdrawal Requests Management
                </CardTitle>
                <CardDescription>
                  Review and process special withdrawal requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {withdrawalRequests.map((request) => {
                    const student = students.find(s => s.id === request.studentId)
                    return (
                      <div key={request.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {request.status === 'pending' && <Clock className="h-4 w-4 text-yellow-600" />}
                            {request.status === 'approved' && <CheckCircle className="h-4 w-4 text-green-600" />}
                            {request.status === 'rejected' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                            {request.status === 'processed' && <CheckCircle className="h-4 w-4 text-blue-600" />}
                            <div>
                              <p className="text-sm font-medium">
                                {student?.firstName} {student?.lastName} • {request.amount.toLocaleString()} points
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {request.category} • Requested: {request.requestDate}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(request.status)}
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3 mr-1" />
                              Review
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{request.reason}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          <div>
                            <span className="text-muted-foreground">Bank:</span>
                            <span className="ml-1 font-medium">{request.bankDetails.bankName}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Account:</span>
                            <span className="ml-1 font-medium">{request.bankDetails.accountNumber}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Holder:</span>
                            <span className="ml-1 font-medium">{request.bankDetails.accountHolder}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Branch:</span>
                            <span className="ml-1 font-medium">{request.bankDetails.branch}</span>
                          </div>
                        </div>
                        {request.processedDate && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            Processed: {request.processedDate}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}