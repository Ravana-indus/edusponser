'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  Shield, 
  CreditCard,
  Target,
  Plus,
  Edit,
  Eye,
  User,
  GraduationCap,
  MapPin,
  Heart,
  Clock,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Activity,
  Settings,
  LogOut
} from "lucide-react"
import Navigation from "@/components/layout/Navigation"
import { 
  mockStudents,
  mockPointsTransactions,
  mockStudentGoals,
  mockWithdrawalRequests,
  mockInvestments,
  mockHealthInsurance,
  mockEducationUpdates,
  getStudentGoalsByStudentId,
  getWithdrawalRequestsByStudentId,
  getInvestmentsByStudentId,
  getHealthInsuranceByStudentId,
  getPointsTransactionsByStudentId,
  getEducationUpdatesByStudentId
} from "@/lib/data/mockData"
import { 
  Student, 
  PointsTransaction, 
  StudentGoal, 
  WithdrawalRequest, 
  Investment, 
  HealthInsurance, 
  EducationUpdate
} from "@/lib/data/mockData"

export default function StudentPortalPage() {
  const router = useRouter()
  
  // Mock current student (in real app, this would come from authentication)
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null)
  const [transactions, setTransactions] = useState<PointsTransaction[]>([])
  const [goals, setGoals] = useState<StudentGoal[]>([])
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([])
  const [investments, setInvestments] = useState<Investment[]>([])
  const [insurance, setInsurance] = useState<HealthInsurance[]>([])
  const [educationUpdates, setEducationUpdates] = useState<EducationUpdate[]>([])
  const [loading, setLoading] = useState(true)

  // Form states
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetAmount: '',
    category: 'education',
    targetDate: ''
  })
  const [newWithdrawal, setNewWithdrawal] = useState({
    amount: '',
    reason: '',
    category: 'emergency',
    bankDetails: {
      bankName: '',
      accountNumber: '',
      accountHolder: '',
      branch: ''
    }
  })

  useEffect(() => {
    // Simulate loading current student data
    // In a real app, this would come from authentication context
    const student = mockStudents.find(s => s.id === 1) // Using student ID 1 as example
    if (student) {
      setCurrentStudent(student)
      setTransactions(getPointsTransactionsByStudentId(student.id))
      setGoals(getStudentGoalsByStudentId(student.id))
      setWithdrawalRequests(getWithdrawalRequestsByStudentId(student.id))
      setInvestments(getInvestmentsByStudentId(student.id))
      setInsurance(getHealthInsuranceByStudentId(student.id))
      setEducationUpdates(getEducationUpdatesByStudentId(student.id))
    }
    setLoading(false)
  }, [])

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

  const getGoalCategoryIcon = (category: string) => {
    switch (category) {
      case "education":
        return <GraduationCap className="h-4 w-4" />
      case "laptop":
        return <BookOpen className="h-4 w-4" />
      case "trip":
        return <MapPin className="h-4 w-4" />
      case "equipment":
        return <Target className="h-4 w-4" />
      case "health":
        return <Heart className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const handleCreateGoal = () => {
    if (!currentStudent || !newGoal.title || !newGoal.targetAmount || !newGoal.targetDate) return

    const goal: StudentGoal = {
      id: goals.length + 1,
      studentId: currentStudent.id,
      title: newGoal.title,
      description: newGoal.description,
      targetAmount: parseInt(newGoal.targetAmount),
      currentAmount: 0,
      category: newGoal.category as any,
      targetDate: newGoal.targetDate,
      status: 'active',
      isPublic: true,
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0]
    }

    setGoals([...goals, goal])
    setNewGoal({ title: '', description: '', targetAmount: '', category: 'education', targetDate: '' })
    setShowGoalForm(false)
  }

  const handleCreateWithdrawal = () => {
    if (!currentStudent || !newWithdrawal.amount || !newWithdrawal.reason || !newWithdrawal.bankDetails.bankName) return

    const request: WithdrawalRequest = {
      id: withdrawalRequests.length + 1,
      studentId: currentStudent.id,
      amount: parseInt(newWithdrawal.amount),
      reason: newWithdrawal.reason,
      category: newWithdrawal.category as any,
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0],
      bankDetails: newWithdrawal.bankDetails
    }

    setWithdrawalRequests([...withdrawalRequests, request])
    setNewWithdrawal({
      amount: '',
      reason: '',
      category: 'emergency',
      bankDetails: { bankName: '', accountNumber: '', accountHolder: '', branch: '' }
    })
    setShowWithdrawalForm(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading student portal...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentStudent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Student Not Found</h1>
            <p className="text-muted-foreground mb-4">Please log in to access your portal.</p>
            <Button onClick={() => router.push('/')}>
              <LogOut className="mr-2 h-4 w-4" />
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Navigation user={{
        id: currentStudent.id,
        firstName: currentStudent.firstName,
        lastName: currentStudent.lastName,
        email: currentStudent.email,
        role: "student"
      }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={currentStudent.profileImage} />
                <AvatarFallback className="text-xl">
                  {currentStudent.firstName[0]}{currentStudent.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">
                  Welcome back, {currentStudent.firstName}!
                </h1>
                <p className="text-muted-foreground">
                  {currentStudent.educationLevel} • {currentStudent.school}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  {getStatusBadge(currentStudent.status)}
                  <Badge variant="outline">
                    Class: {currentStudent.studentClass || 'N/A'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => router.push('/admin/student-profile?id=' + currentStudent.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View Profile
              </Button>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Points Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Points</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentStudent.availablePoints.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Ready to use
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Invested Points</CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentStudent.investedPoints.toLocaleString()}</div>
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
              <div className="text-2xl font-bold">{currentStudent.insurancePoints.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Health coverage
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentStudent.totalPoints.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Lifetime earnings
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Your latest points transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getTransactionTypeIcon(transaction.type)}
                          <div>
                            <p className="text-sm font-medium">{transaction.description}</p>
                            <p className="text-xs text-muted-foreground">{transaction.date}</p>
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
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Active Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5" />
                    Active Goals
                  </CardTitle>
                  <CardDescription>
                    Your current saving goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {goals.filter(goal => goal.status === 'active').slice(0, 3).map((goal) => (
                      <div key={goal.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getGoalCategoryIcon(goal.category)}
                            <div>
                              <p className="text-sm font-medium">{goal.title}</p>
                              <p className="text-xs text-muted-foreground">{goal.category}</p>
                            </div>
                          </div>
                          {getStatusBadge(goal.status)}
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{goal.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Progress:</span>
                            <span>{goal.currentAmount.toLocaleString()} / {goal.targetAmount.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Target Date: {goal.targetDate}</span>
                            <span>{Math.round((goal.currentAmount / goal.targetAmount) * 100)}% Complete</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => setShowGoalForm(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Goal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Health Insurance Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Health Insurance Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {insurance.length > 0 ? (
                  <div className="space-y-4">
                    {insurance.map((policy) => (
                      <div key={policy.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-sm font-medium">{policy.provider}</p>
                            <p className="text-xs text-muted-foreground">Policy: {policy.policyNumber}</p>
                          </div>
                          {getStatusBadge(policy.status)}
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
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-muted-foreground">No active health insurance</p>
                    <p className="text-sm text-muted-foreground">Contact admin to enroll in health insurance</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Target className="mr-2 h-5 w-5" />
                    My Goals
                  </div>
                  <Button onClick={() => setShowGoalForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Goal
                  </Button>
                </CardTitle>
                <CardDescription>
                  Set and track your financial goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                {showGoalForm && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Create New Goal</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="goal-title">Goal Title</Label>
                        <Input
                          id="goal-title"
                          value={newGoal.title}
                          onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                          placeholder="e.g., Laptop for Programming"
                        />
                      </div>
                      <div>
                        <Label htmlFor="goal-description">Description</Label>
                        <Textarea
                          id="goal-description"
                          value={newGoal.description}
                          onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                          placeholder="Describe your goal..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="goal-amount">Target Amount (points)</Label>
                          <Input
                            id="goal-amount"
                            type="number"
                            value={newGoal.targetAmount}
                            onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                            placeholder="100000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="goal-category">Category</Label>
                          <Select value={newGoal.category} onValueChange={(value) => setNewGoal({...newGoal, category: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="laptop">Laptop</SelectItem>
                              <SelectItem value="trip">Trip</SelectItem>
                              <SelectItem value="equipment">Equipment</SelectItem>
                              <SelectItem value="health">Health</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="goal-date">Target Date</Label>
                        <Input
                          id="goal-date"
                          type="date"
                          value={newGoal.targetDate}
                          onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={handleCreateGoal}>Create Goal</Button>
                        <Button variant="outline" onClick={() => setShowGoalForm(false)}>Cancel</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {goals.map((goal) => (
                    <div key={goal.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getGoalCategoryIcon(goal.category)}
                          <div>
                            <p className="text-sm font-medium">{goal.title}</p>
                            <p className="text-xs text-muted-foreground">{goal.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(goal.status)}
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{goal.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Progress:</span>
                          <span>{goal.currentAmount.toLocaleString()} / {goal.targetAmount.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Target Date: {goal.targetDate}</span>
                          <span>{Math.round((goal.currentAmount / goal.targetAmount) * 100)}% Complete</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Withdrawals Tab */}
          <TabsContent value="withdrawals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Withdrawal Requests
                  </div>
                  <Button onClick={() => setShowWithdrawalForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Request
                  </Button>
                </CardTitle>
                <CardDescription>
                  Request special withdrawals from your points
                </CardDescription>
              </CardHeader>
              <CardContent>
                {showWithdrawalForm && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg">New Withdrawal Request</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="withdrawal-amount">Amount (points)</Label>
                          <Input
                            id="withdrawal-amount"
                            type="number"
                            value={newWithdrawal.amount}
                            onChange={(e) => setNewWithdrawal({...newWithdrawal, amount: e.target.value})}
                            placeholder="10000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="withdrawal-category">Category</Label>
                          <Select value={newWithdrawal.category} onValueChange={(value) => setNewWithdrawal({...newWithdrawal, category: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="emergency">Emergency</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="health">Health</SelectItem>
                              <SelectItem value="personal">Personal</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="withdrawal-reason">Reason</Label>
                        <Textarea
                          id="withdrawal-reason"
                          value={newWithdrawal.reason}
                          onChange={(e) => setNewWithdrawal({...newWithdrawal, reason: e.target.value})}
                          placeholder="Explain why you need this withdrawal..."
                        />
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium">Bank Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="bank-name">Bank Name</Label>
                            <Input
                              id="bank-name"
                              value={newWithdrawal.bankDetails.bankName}
                              onChange={(e) => setNewWithdrawal({
                                ...newWithdrawal,
                                bankDetails: {...newWithdrawal.bankDetails, bankName: e.target.value}
                              })}
                              placeholder="Bank of Ceylon"
                            />
                          </div>
                          <div>
                            <Label htmlFor="account-number">Account Number</Label>
                            <Input
                              id="account-number"
                              value={newWithdrawal.bankDetails.accountNumber}
                              onChange={(e) => setNewWithdrawal({
                                ...newWithdrawal,
                                bankDetails: {...newWithdrawal.bankDetails, accountNumber: e.target.value}
                              })}
                              placeholder="1234567890"
                            />
                          </div>
                          <div>
                            <Label htmlFor="account-holder">Account Holder</Label>
                            <Input
                              id="account-holder"
                              value={newWithdrawal.bankDetails.accountHolder}
                              onChange={(e) => setNewWithdrawal({
                                ...newWithdrawal,
                                bankDetails: {...newWithdrawal.bankDetails, accountHolder: e.target.value}
                              })}
                              placeholder="Your Name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="branch">Branch</Label>
                            <Input
                              id="branch"
                              value={newWithdrawal.bankDetails.branch}
                              onChange={(e) => setNewWithdrawal({
                                ...newWithdrawal,
                                bankDetails: {...newWithdrawal.bankDetails, branch: e.target.value}
                              })}
                              placeholder="Main Branch"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={handleCreateWithdrawal}>Submit Request</Button>
                        <Button variant="outline" onClick={() => setShowWithdrawalForm(false)}>Cancel</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {withdrawalRequests.map((request) => (
                    <div key={request.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {request.status === 'pending' && <Clock className="h-4 w-4 text-yellow-600" />}
                          {request.status === 'approved' && <CheckCircle className="h-4 w-4 text-green-600" />}
                          {request.status === 'rejected' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                          {request.status === 'processed' && <CheckCircle className="h-4 w-4 text-blue-600" />}
                          <div>
                            <p className="text-sm font-medium">{request.amount.toLocaleString()} points</p>
                            <p className="text-xs text-muted-foreground">
                              {request.category} • Requested: {request.requestDate}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{request.reason}</p>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-muted-foreground">Bank:</span>
                          <span className="ml-1 font-medium">{request.bankDetails.bankName}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Account:</span>
                          <span className="ml-1 font-medium">{request.bankDetails.accountNumber}</span>
                        </div>
                      </div>
                      {request.processedDate && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Processed: {request.processedDate}
                        </div>
                      )}
                    </div>
                  ))}
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
                  My Investments
                </CardTitle>
                <CardDescription>
                  Your NFT investments and their performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {investments.map((investment) => (
                    <div key={investment.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm font-medium">{investment.platform}</p>
                          <p className="text-xs text-muted-foreground">{investment.investmentType.toUpperCase()}</p>
                        </div>
                        {getStatusBadge(investment.status)}
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Complete Activity
                </CardTitle>
                <CardDescription>
                  Your complete activity timeline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {[
                    ...transactions.map(t => ({ ...t, type: 'transaction', date: t.date })),
                    ...educationUpdates.map(e => ({ ...e, type: 'update', date: e.date })),
                    ...withdrawalRequests.map(w => ({ ...w, type: 'withdrawal', date: w.requestDate })),
                    ...investments.map(i => ({ ...i, type: 'investment', date: i.investmentDate }))
                  ]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 15)
                  .map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="mt-0.5">
                        {activity.type === 'transaction' && getTransactionTypeIcon((activity as any).type)}
                        {activity.type === 'update' && <BookOpen className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'withdrawal' && (
                          (activity as any).status === 'pending' ? <Clock className="h-4 w-4 text-yellow-600" /> :
                          (activity as any).status === 'approved' ? <CheckCircle className="h-4 w-4 text-green-600" /> :
                          (activity as any).status === 'rejected' ? <AlertTriangle className="h-4 w-4 text-red-600" /> :
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                        )}
                        {activity.type === 'investment' && <PiggyBank className="h-4 w-4 text-purple-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {activity.type === 'transaction' && (activity as any).description}
                          {activity.type === 'update' && (activity as any).title}
                          {activity.type === 'withdrawal' && `Withdrawal: ${(activity as any).amount.toLocaleString()} points`}
                          {activity.type === 'investment' && `Investment: ${(activity as any).amount.toLocaleString()} points`}
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}