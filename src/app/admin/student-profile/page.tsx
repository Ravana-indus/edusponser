"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  User, 
  GraduationCap, 
  MapPin, 
  Target, 
  Heart,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Shield,
  Clock,
  Award,
  BookOpen,
  Phone,
  Mail,
  Building,
  Calendar,
  Activity,
  DollarSign,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  Eye,
  Edit,
  ShoppingCart
} from "lucide-react"
import Navigation from "@/components/layout/Navigation"
import { supabase } from "@/lib/supabase/client"
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

function StudentProfilePageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const studentId = searchParams.get('id')
  
  const [student, setStudent] = useState<any | null>(null)
  const [donor, setDonor] = useState<any | null>(null)
  const [pointsTransactions, setPointsTransactions] = useState<any[]>([])
  const [goals, setGoals] = useState<any[]>([])
  const [withdrawalRequests, setWithdrawalRequests] = useState<any[]>([])
  const [investments, setInvestments] = useState<any[]>([])
  const [insurance, setInsurance] = useState<any[]>([])
  const [educationUpdates, setEducationUpdates] = useState<any[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    
    const load = async () => {
      try {
        if (!studentId) { setLoading(false); return }

        // Fetch student by Supabase primary key `name`
        const { data: st, error: stErr } = await supabase
          .from('students')
          .select('*')
          .eq('name', studentId)
          .maybeSingle()
        if (stErr) console.error(stErr)
        if (!st) { router.push('/admin/dashboard'); return }

        const mappedStudent = {
          id: st.name,
          firstName: st.first_name,
          lastName: st.last_name,
          email: st.email,
          phone: st.phone,
          age: st.age,
          educationLevel: st.education_level,
          school: st.school,
          schoolAddress: st.school_address,
          schoolPhone: st.school_phone,
          schoolPrincipal: st.school_principal,
          schoolType: st.school_type,
          studentClass: st.student_class,
          indexNumber: st.index_number,
          major: st.major,
          stream: st.stream,
          gpa: st.gpa,
          examResults: st.exam_results,
          bio: st.bio,
          goals: st.goals,
          challenges: st.challenges,
          whyNeedSupport: st.why_need_support,
          status: st.status,
          joinDate: st.join_date,
          totalPoints: st.total_points || 0,
          availablePoints: st.available_points || 0,
          investedPoints: st.invested_points || 0,
          insurancePoints: st.insurance_points || 0,
          healthInsuranceStatus: st.health_insurance_status,
          healthInsuranceProvider: st.health_insurance_provider,
          profileImage: st.profile_image,
          district: st.district,
          province: st.province,
          gramaNiladharaiDivision: st.grama_niladharai_division,
          gramaNiladharaiName: st.grama_niladharai_name,
          gramaNiladharaiContact: st.grama_niladharai_contact,
          bloodGroup: st.blood_group,
          nationality: st.nationality,
          religion: st.religion,
          languages: st.languages ? (typeof st.languages === 'string' ? st.languages.split(',') : st.languages) : [],
          grade: st.grade,
          name: st.name
        }
        setStudent(mappedStudent)

        // Active sponsor donor (optional display)
        const { data: sp } = await supabase
          .from('sponsorships')
          .select('donor')
          .eq('student', st.name)
          .eq('status', 'active')
          .maybeSingle()
        if (sp?.donor) {
          const { data: dn } = await supabase
            .from('donors')
            .select('*')
            .eq('name', sp.donor)
            .maybeSingle()
          if (dn) {
            setDonor({
              id: dn.name,
              firstName: dn.first_name,
              lastName: dn.last_name,
              occupation: dn.occupation,
              company: dn.company,
              bio: dn.bio,
            })
          }
        }

        // Related datasets in parallel
        const [txRes, glRes, wrRes, invRes, insRes, upRes, poRes] = await Promise.all([
          supabase.from('points_transactions').select('id, type, amount, description, date, balance, category').eq('student', st.name).order('date', { ascending: false }).limit(200),
          supabase.from('student_goals').select('id, title, description, target_amount, current_amount, category, target_date, status, updated_date').eq('student', st.name).order('updated_date', { ascending: false }).limit(100),
          supabase.from('withdrawal_requests').select('id, amount, reason, category, status, request_date, processed_date, bank_name, account_number, account_holder, branch').eq('student', st.name).order('request_date', { ascending: false }).limit(100),
          supabase.from('investments').select('id, amount, platform, investment_type, status, investment_date, maturity_date, expected_return, current_value, description').eq('student', st.name).order('investment_date', { ascending: false }).limit(100),
          supabase.from('health_insurance').select('id, provider, policy_number, coverage_amount, premium_amount, start_date, expiry_date, status, coverage_details').eq('student', st.name).limit(50),
          supabase.from('education_updates').select('name, title, content, type, date, is_public').eq('student', st.name).order('date', { ascending: false }).limit(50),
          supabase.from('purchase_orders').select('id, total_points, status, request_date').eq('student', st.name).order('request_date', { ascending: false }).limit(50),
        ])

        const tx = (txRes.data || [])
        setPointsTransactions(tx)

        const gl = (glRes.data || []).map(g => ({
          id: g.id,
          title: g.title,
          description: g.description,
          targetAmount: g.target_amount || 0,
          currentAmount: g.current_amount || 0,
          category: g.category,
          targetDate: g.target_date,
          updatedDate: g.updated_date,
          status: g.status,
        }))
        setGoals(gl)

        const wr = (wrRes.data || []).map(w => ({
          id: w.id,
          amount: w.amount || 0,
          reason: w.reason,
          category: w.category,
          status: w.status,
          requestDate: w.request_date,
          processedDate: w.processed_date,
          bankDetails: {
            bankName: w.bank_name,
            accountNumber: w.account_number,
            accountHolder: w.account_holder,
            branch: w.branch,
          }
        }))
        setWithdrawalRequests(wr)

        const inv = (invRes.data || []).map(i => ({
          id: i.id,
          amount: i.amount || 0,
          platform: i.platform,
          investmentType: i.investment_type,
          status: i.status,
          investmentDate: i.investment_date,
          maturityDate: i.maturity_date,
          expectedReturn: i.expected_return || 0,
          currentValue: i.current_value || 0,
          description: i.description,
        }))
        setInvestments(inv)

        const ins = (insRes.data || []).map(p => ({
          id: p.id,
          provider: p.provider,
          policyNumber: p.policy_number,
          coverageAmount: p.coverage_amount || 0,
          premiumAmount: p.premium_amount || 0,
          startDate: p.start_date,
          expiryDate: p.expiry_date,
          status: p.status,
          coverageDetails: Array.isArray(p.coverage_details) ? p.coverage_details : (p.coverage_details ? String(p.coverage_details).split(',').map(s => s.trim()) : []),
        }))
        setInsurance(ins)

        const ups = (upRes.data || []).map(u => ({
          id: u.name,
          title: u.title,
          content: u.content,
          type: u.type,
          date: u.date,
          isPublic: u.is_public,
          tags: [],
        }))
        setEducationUpdates(ups)

        const orders = poRes.data || []
        if (orders.length > 0) {
          const orderIds = orders.map(o => o.id)
          const { data: items } = await supabase
            .from('view_purchase_order_items_expanded')
            .select('order_id, item_name, quantity, total_points, points_per_item')
            .in('order_id', orderIds)
          const itemsByOrder: Record<number, any[]> = {}
          ;(items || []).forEach(it => {
            itemsByOrder[it.order_id] = itemsByOrder[it.order_id] || []
            itemsByOrder[it.order_id].push({
              id: `${it.order_id}-${itemsByOrder[it.order_id].length + 1}`,
              name: it.item_name,
              quantity: it.quantity,
              totalPoints: it.total_points,
              pointsPerItem: it.points_per_item,
            })
          })
          setPurchaseOrders(orders.map(o => ({
            id: o.id,
            items: itemsByOrder[o.id] || [],
            totalPoints: o.total_points || 0,
            status: o.status,
            requestDate: o.request_date,
          })))
        } else {
          setPurchaseOrders([])
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isHydrated, studentId, router])

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
      case "cancelled":
        return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>
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

  const getWithdrawalStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "processed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading student profile...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Student Not Found</h1>
            <p className="text-muted-foreground mb-4">The student you're looking for doesn't exist.</p>
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
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={student.profileImage} />
                <AvatarFallback className="text-xl">
                  {student.firstName[0]}{student.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">
                  {student.firstName} {student.lastName}
                </h1>
                <p className="text-muted-foreground">
                  {student.educationLevel} • {student.school} • {student.district}{student.province ? `, ${student.province}` : ''}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  {getStatusBadge(student.status)}
                  <Badge variant="outline">
                    ID: {student.id}
                  </Badge>
                  <Badge variant="outline">
                    Class: {student.studentClass || 'N/A'}
                  </Badge>
                  <Badge variant="outline">
                    Index: {student.indexNumber || 'N/A'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => router.push(`/admin/edit-student?id=${encodeURIComponent(student.id)}`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Points Overview */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(student.totalPoints || 0).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Available: {(student.availablePoints || 0).toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              {/* Invested Points */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Invested Points</CardTitle>
                  <PiggyBank className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(student.investedPoints || 0).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    In NFT funds
                  </p>
                </CardContent>
              </Card>

              {/* Insurance Points */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Insurance Points</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(student.insurancePoints || 0).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Health insurance
                  </p>
                </CardContent>
              </Card>

              {/* Health Insurance Status */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Health Insurance</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {student.healthInsuranceStatus === 'active' ? 'Active' : 'Inactive'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {student.healthInsuranceProvider || 'No provider'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Email:</span>
                    <span className="text-sm">{student.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Phone:</span>
                    <span className="text-sm">{student.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Age:</span>
                    <span className="text-sm">{student.age}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Blood Group:</span>
                    <span className="text-sm">{student.bloodGroup || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Nationality:</span>
                    <span className="text-sm">{student.nationality || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Languages:</span>
                    <span className="text-sm">{student.languages && student.languages.length ? student.languages.join(', ') : 'N/A'}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Education Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Education Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">School:</span>
                    <span className="text-sm">{student.school}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Education Level:</span>
                    <span className="text-sm">{student.educationLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">School Type:</span>
                    <span className="text-sm">{student.schoolType || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Class:</span>
                    <span className="text-sm">{student.studentClass || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Index Number:</span>
                    <span className="text-sm">{student.indexNumber || 'N/A'}</span>
                  </div>
                  {student.gpa && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">GPA:</span>
                      <span className="text-sm">{student.gpa}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Charts and Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Points Activity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Points Activity</CardTitle>
                  <CardDescription>Points earned and spent over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={pointsTransactions.slice(-12).map(t => ({
                      date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                      balance: t.balance || 0,
                      amount: Math.abs(t.amount || 0),
                      type: t.type
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => [Number(value).toLocaleString(), 'Points']} />
                      <Area type="monotone" dataKey="balance" stroke="#0088FE" fill="#0088FE" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Goal Progress Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Goal Categories</CardTitle>
                  <CardDescription>Distribution of goals by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={goals.reduce((acc: any[], goal: any) => {
                          const category = goal.category || 'other'
                          const existing = acc.find(item => item.name === category)
                          if (existing) {
                            existing.value += 1
                          } else {
                            acc.push({ name: category, value: 1 })
                          }
                          return acc
                        }, [])}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {goals.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Academic Progress Section */}
            <Card>
              <CardHeader>
                <CardTitle>Academic Performance</CardTitle>
                <CardDescription>Progress tracking and achievements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Academic Progress</span>
                    <span className="text-sm text-gray-600">{Math.min(100, ((student.gpa || 0) / 4.0) * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={Math.min(100, ((student.gpa || 0) / 4.0) * 100)} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Goal Completion</span>
                    <span className="text-sm text-gray-600">
                      {goals.length > 0 ? Math.round((goals.filter(g => g.status === 'completed').length / goals.length) * 100) : 0}%
                    </span>
                  </div>
                  <Progress 
                    value={goals.length > 0 ? (goals.filter(g => g.status === 'completed').length / goals.length) * 100 : 0} 
                    className="h-2" 
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{student.gpa || 'N/A'}</div>
                    <div className="text-sm text-blue-600">Current GPA</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{goals.filter(g => g.status === 'completed').length}</div>
                    <div className="text-sm text-green-600">Goals Achieved</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{purchaseOrders.filter(o => o.status === 'fulfilled').length}</div>
                    <div className="text-sm text-purple-600">Orders Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pointsTransactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
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
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6">
            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {(pointsTransactions[0]?.balance || 0).toLocaleString()} pts
                  </div>
                  <p className="text-xs text-muted-foreground">Available points</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {pointsTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0).toLocaleString()} pts
                  </div>
                  <p className="text-xs text-muted-foreground">Lifetime earnings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {pointsTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + Math.abs(t.amount), 0).toLocaleString()} pts
                  </div>
                  <p className="text-xs text-muted-foreground">Total purchases</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {pointsTransactions.length}
                  </div>
                  <p className="text-xs text-muted-foreground">Total transactions</p>
                </CardContent>
              </Card>
            </div>

            {/* Financial Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Balance History Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Points Balance History</CardTitle>
                  <CardDescription>Track your points balance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={pointsTransactions.slice(-20).map(t => ({
                      date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                      balance: t.balance || 0
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => [Number(value).toLocaleString(), 'Balance']} />
                      <Line type="monotone" dataKey="balance" stroke="#0088FE" strokeWidth={2} dot={{ fill: '#0088FE' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Transaction Types Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Transaction Categories</CardTitle>
                  <CardDescription>Breakdown of transaction types</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={pointsTransactions.reduce((acc: any[], t: any) => {
                      const category = t.category || 'other'
                      const existing = acc.find(item => item.name === category)
                      if (existing) {
                        existing.count += 1
                        existing.amount += Math.abs(t.amount)
                      } else {
                        acc.push({ name: category, count: 1, amount: Math.abs(t.amount) })
                      }
                      return acc
                    }, [])}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value, name) => [
                        name === 'count' ? value : Number(value).toLocaleString(), 
                        name === 'count' ? 'Transactions' : 'Points'
                      ]} />
                      <Bar dataKey="count" fill="#0088FE" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Points Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="mr-2 h-5 w-5" />
                    Points Transactions
                  </CardTitle>
                  <CardDescription>
                    Complete transaction history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {pointsTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getTransactionTypeIcon(transaction.type)}
                          <div>
                            <p className="text-sm font-medium">{transaction.description}</p>
                            <p className="text-xs text-muted-foreground">{transaction.date} • {transaction.category}</p>
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

              {/* Investments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PiggyBank className="mr-2 h-5 w-5" />
                    NFT Investments
                  </CardTitle>
                  <CardDescription>
                    Current investments and their performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {investments.map((investment) => (
                      <div key={investment.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm font-medium">{investment.platform}</p>
                            <p className="text-xs text-muted-foreground">{investment.investmentType.toUpperCase()}</p>
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
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Health Insurance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Health Insurance
                  </CardTitle>
                  <CardDescription>
                    Current health insurance coverage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {insurance.map((policy) => (
                      <div key={policy.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm font-medium">{policy.provider}</p>
                            <p className="text-xs text-muted-foreground">Policy: {policy.policyNumber}</p>
                          </div>
                          {getStatusBadge(policy.status)}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
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
                </CardContent>
              </Card>

              {/* Withdrawal Requests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Withdrawal Requests
                  </CardTitle>
                  <CardDescription>
                    Special withdrawal requests history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {withdrawalRequests.map((request) => (
                      <div key={request.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getWithdrawalStatusIcon(request.status)}
                            <div>
                              <p className="text-sm font-medium">{request.amount.toLocaleString()} points</p>
                              <p className="text-xs text-muted-foreground">{request.category}</p>
                            </div>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{request.reason}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Requested:</span>
                            <span className="ml-1 font-medium">{request.requestDate}</span>
                          </div>
                          {request.processedDate && (
                            <div>
                              <span className="text-muted-foreground">Processed:</span>
                              <span className="ml-1 font-medium">{request.processedDate}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* School Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="mr-2 h-5 w-5" />
                    School Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">School Name:</span>
                    <span className="text-sm">{student.school}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">School Address:</span>
                    <span className="text-sm">{student.schoolAddress || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">School Phone:</span>
                    <span className="text-sm">{student.schoolPhone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Principal:</span>
                    <span className="text-sm">{student.schoolPrincipal || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">School Type:</span>
                    <span className="text-sm">{student.schoolType || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Class:</span>
                    <span className="text-sm">{student.studentClass || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Index Number:</span>
                    <span className="text-sm">{student.indexNumber || 'N/A'}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Education Updates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Education Updates
                  </CardTitle>
                  <CardDescription>
                    Recent academic achievements and updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {educationUpdates.map((update) => (
                      <div key={update.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm font-medium">{update.title}</p>
                            <p className="text-xs text-muted-foreground">{update.date} • {update.type}</p>
                          </div>
                          {update.isPublic && <Eye className="h-4 w-4 text-blue-600" />}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{update.content}</p>
                        {update.tags && update.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {update.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Academic Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5" />
                  Academic Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {student.gpa && (
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Current GPA</p>
                      <p className="text-2xl font-bold">{student.gpa}</p>
                    </div>
                  )}
                  {student.examResults && (
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Exam Results</p>
                      <p className="text-lg font-medium">{student.examResults}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personal Tab */}
          <TabsContent value="personal" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Personal Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Full Name:</span>
                    <span className="text-sm">{student.firstName} {student.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Email:</span>
                    <span className="text-sm">{student.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Phone:</span>
                    <span className="text-sm">{student.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Age:</span>
                    <span className="text-sm">{student.age}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Blood Group:</span>
                    <span className="text-sm">{student.bloodGroup || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Nationality:</span>
                    <span className="text-sm">{student.nationality || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Religion:</span>
                    <span className="text-sm">{student.religion || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Languages:</span>
                    <span className="text-sm">{student.languages && student.languages.length ? student.languages.join(', ') : 'N/A'}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="mr-2 h-5 w-5" />
                    Emergency Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Contact Name:</span>
                    <span className="text-sm">{student.emergencyContactName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Contact Phone:</span>
                    <span className="text-sm">{student.emergencyContactPhone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Relationship:</span>
                    <span className="text-sm">{student.emergencyContactRelation || 'N/A'}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Grama Niladharai Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Grama Niladharai Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Division:</span>
                    <span className="text-sm">{student.gramaNiladharaiDivision || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Name:</span>
                    <span className="text-sm">{student.gramaNiladharaiName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Contact:</span>
                    <span className="text-sm">{student.gramaNiladharaiContact || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">District:</span>
                    <span className="text-sm">{student.district}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Province:</span>
                    <span className="text-sm">{student.province}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Health Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="mr-2 h-5 w-5" />
                    Health Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Blood Group:</span>
                    <span className="text-sm">{student.bloodGroup || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Medical Conditions:</span>
                    <span className="text-sm">{student.medicalConditions || 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Allergies:</span>
                    <span className="text-sm">{student.allergies || 'None'}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Personal Statement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Personal Statement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Biography</h4>
                  <p className="text-sm text-muted-foreground">{student.bio}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-2">Educational Goals</h4>
                  <p className="text-sm text-muted-foreground">{student.goals}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-2">Challenges</h4>
                  <p className="text-sm text-muted-foreground">{student.challenges}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-2">Why Support Needed</h4>
                  <p className="text-sm text-muted-foreground">{student.whyNeedSupport}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5" />
                    Active Goals
                  </CardTitle>
                  <CardDescription>
                    Current saving goals and objectives
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {goals.filter(goal => goal.status === 'active').map((goal) => (
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
                  </div>
                </CardContent>
              </Card>

              {/* Completed Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Completed Goals
                  </CardTitle>
                  <CardDescription>
                    Successfully achieved goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {goals.filter(goal => goal.status === 'completed').map((goal) => (
                      <div key={goal.id} className="p-3 border rounded-lg bg-green-50">
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
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Target: {goal.targetAmount.toLocaleString()}</span>
                          <span>Achieved: {goal.currentAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Completed: {goal.updatedDate}</span>
                          <span>Target Date: {goal.targetDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Purchase History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Purchase History
                  </CardTitle>
                  <CardDescription>
                    Recent purchases and orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {purchaseOrders.map((order) => (
                      <div key={order.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm font-medium">Order #{order.id}</p>
                            <p className="text-xs text-muted-foreground">{order.requestDate}</p>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="space-y-1">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-xs">
                              <span>{item.quantity}x Item</span>
                              <span>{item.totalPoints.toLocaleString()} points</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs font-medium mt-2 pt-2 border-t">
                          <span>Total:</span>
                          <span>{order.totalPoints.toLocaleString()} points</span>
                        </div>
                        {order.qrCode && (
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs text-muted-foreground">QR:</span>
                            <Badge variant="outline" className="text-xs">{order.qrCode}</Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* All Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-5 w-5" />
                    All Activity
                  </CardTitle>
                  <CardDescription>
                    Complete activity timeline
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {/* Combine all activities and sort by date */}
                    {[
                      ...pointsTransactions.map(t => ({ ...t, type: 'transaction', date: t.date })),
                      ...educationUpdates.map(e => ({ ...e, type: 'update', date: e.date })),
                      ...withdrawalRequests.map(w => ({ ...w, type: 'withdrawal', date: w.requestDate })),
                      ...investments.map(i => ({ ...i, type: 'investment', date: i.investmentDate }))
                    ]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 10)
                    .map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <div className="mt-0.5">
                          {activity.type === 'transaction' && getTransactionTypeIcon((activity as any).type)}
                          {activity.type === 'update' && <BookOpen className="h-4 w-4 text-blue-600" />}
                          {activity.type === 'withdrawal' && getWithdrawalStatusIcon((activity as any).status)}
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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function StudentProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-background to-muted" /> }>
      <StudentProfilePageInner />
    </Suspense>
  )
}