"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  GraduationCap, 
  Heart, 
  TrendingUp, 
  Calendar, 
  CreditCard, 
  MessageCircle, 
  Settings,
  LogOut,
  Star,
  Award,
  BookOpen,
  Target,
  DollarSign,
  Coins,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  Info,
  Plus,
  Minus,
  Pause,
  Play
} from "lucide-react"
import Navigation from "@/components/layout/Navigation"
import { supabase } from '@/lib/supabase/client'
import { useAuthState } from '@/lib/frappe'

export default function DonorPayments() {
  const [activeTab, setActiveTab] = useState("overview")
  const [simulationRunning, setSimulationRunning] = useState(false)
  const [simulationProgress, setSimulationProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const auth = useAuthState()

  const [donor, setDonor] = useState<any | null>(null)
  const [sponsorships, setSponsorships] = useState<any[]>([])
  const [studentsByName, setStudentsByName] = useState<Record<string, any>>({})
  const [payments, setPayments] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      if (!auth?.user?.email) return
      setLoading(true)
      try {
        const { data: d } = await supabase.from('donors').select('*').eq('email', auth.user.email).maybeSingle()
        if (!d) { setLoading(false); return }
        setDonor(d)

        const { data: sp } = await supabase
          .from('sponsorships')
          .select('name, donor, student, status, start_date, monthly_amount, monthly_points')
          .eq('donor', d.name)
        setSponsorships(sp || [])
        const studentNames = Array.from(new Set((sp || []).map(s => s.student)))
        if (studentNames.length > 0) {
          const { data: studs } = await supabase
            .from('students')
            .select('name, first_name, last_name, school, education_level, gpa, profile_image, join_date')
            .in('name', studentNames)
          const map: Record<string, any> = {}
          ;(studs || []).forEach(st => {
            map[st.name] = {
              id: st.name,
              name: st.name,
              firstName: st.first_name,
              lastName: st.last_name,
              school: st.school,
              educationLevel: st.education_level,
              gpa: st.gpa,
              profileImage: st.profile_image,
              joinDate: st.join_date,
            }
          })
          setStudentsByName(map)
        } else {
          setStudentsByName({})
        }

        const { data: pays } = await supabase
          .from('payments')
          .select('name, date, amount, points, status, student')
          .eq('donor', d.name)
          .order('date', { ascending: false })
          .limit(100)
        setPayments(pays || [])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [auth.user?.email])

  const sponsoredStudents = useMemo(() => {
    return (sponsorships || []).map(s => studentsByName[s.student]).filter(Boolean)
  }, [sponsorships, studentsByName])
  const activeSponsorships = useMemo(() => (sponsorships || []).filter(s => s.status === 'active'), [sponsorships])
  const monthlyCommitment = useMemo(() => activeSponsorships.reduce((sum, s) => sum + Number(s.monthly_amount || 0), 0), [activeSponsorships])
  const monthlyPoints = useMemo(() => activeSponsorships.reduce((sum, s) => sum + Number(s.monthly_points || 0), 0), [activeSponsorships])

  // Generate upcoming payments for each sponsored student
  const upcomingPayments = sponsoredStudents.flatMap(student => [
    {
      id: `next-${student.id}`,
      date: '2024-04-01',
      amount: 50,
      points: 50000,
      status: 'scheduled' as const,
      student: `${student.firstName} ${student.lastName}`
    },
    {
      id: `future-${student.id}`,
      date: '2024-05-01',
      amount: 50,
      points: 50000,
      status: 'scheduled' as const,
      student: `${student.firstName} ${student.lastName}`
    }
  ])

  const runPaymentSimulation = () => {
    setSimulationRunning(true)
    setSimulationProgress(0)
    
    const interval = setInterval(() => {
      setSimulationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setSimulationRunning(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const paymentConversionSteps = [
    {
      step: 1,
      title: "Monthly Charge",
      description: "$50 charged to your payment method",
      icon: <CreditCard className="h-6 w-6" />,
      duration: "Instant"
    },
    {
      step: 2,
      title: "Platform Processing",
      description: "Payment processing and verification",
      icon: <Settings className="h-6 w-6" />,
      duration: "1-2 minutes"
    },
    {
      step: 3,
      title: "Points Conversion",
      description: "$50 converted to 50,000 points",
      icon: <Coins className="h-6 w-6" />,
      duration: "Instant"
    },
    {
      step: 4,
      title: "Student Allocation",
      description: "Points deposited to student's account",
      icon: <GraduationCap className="h-6 w-6" />,
      duration: "Instant"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Navigation user={{
        id: 1,
        firstName: donor?.first_name || 'Donor',
        lastName: donor?.last_name || '',
        email: donor?.email || '',
        role: 'donor'
      }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Payment Management</h1>
          <p className="text-muted-foreground">
            Manage your monthly contributions and track how your donations are converted to educational points.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="conversion">Conversion Process</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
            <TabsTrigger value="manage">Manage Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Payment Summary */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Amount</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${monthlyCommitment}</div>
                  <p className="text-xs text-muted-foreground">
                    For {sponsoredStudents.length} student{sponsoredStudents.length !== 1 ? 's' : ''}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Points Generated</CardTitle>
                  <Coins className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{monthlyPoints.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Monthly points total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${Number(donor?.total_donated || 0)}</div>
                  <p className="text-xs text-muted-foreground">
                    All time
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Apr 1</div>
                  <p className="text-xs text-muted-foreground">
                    ${monthlyCommitment} total
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Conversion Visualization */}
            <Card>
              <CardHeader>
                <CardTitle>How Your Monthly Commitment Becomes Educational Points</CardTitle>
                <CardDescription>
                  See exactly how your ${monthlyCommitment} monthly donation is converted and allocated across {sponsoredStudents.length} student{sponsoredStudents.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <DollarSign className="h-8 w-8 text-green-600" />
                      </div>
                      <div className="font-semibold">${monthlyCommitment}</div>
                      <div className="text-sm text-muted-foreground">Your Monthly Donation</div>
                    </div>
                    
                    <ArrowRight className="h-8 w-8 text-muted-foreground" />
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Coins className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="font-semibold">{monthlyPoints.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Educational Points</div>
                    </div>
                    
                    <ArrowRight className="h-8 w-8 text-muted-foreground" />
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <GraduationCap className="h-8 w-8 text-purple-600" />
                      </div>
                      <div className="font-semibold">{sponsoredStudents.length}</div>
                      <div className="text-sm text-muted-foreground">Student{sponsoredStudents.length !== 1 ? 's' : ''} Supported</div>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Info className="h-4 w-4" />
                      <span className="font-medium">Point Allocation Per Student</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="font-medium">50,000 pts</div>
                        <div className="text-muted-foreground">Per Student</div>
                      </div>
                      <div>
                        <div className="font-medium">1,000 pts</div>
                        <div className="text-muted-foreground">Textbooks</div>
                      </div>
                      <div>
                        <div className="font-medium">2,000 pts</div>
                        <div className="text-muted-foreground">Course Materials</div>
                      </div>
                      <div>
                        <div className="font-medium">5,000 pts</div>
                        <div className="text-muted-foreground">Technology</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Payments */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Payments</CardTitle>
                <CardDescription>
                  Your scheduled monthly contributions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">${payment.amount} Payment</h4>
                          <p className="text-sm text-muted-foreground">For {payment.student}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{payment.points.toLocaleString()} points</div>
                        <div className="text-sm text-muted-foreground">{payment.date}</div>
                        {getPaymentStatusBadge(payment.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversion" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Conversion Simulation</CardTitle>
                <CardDescription>
                  Watch how your ${monthlyCommitment} donation is processed and converted to {monthlyPoints.toLocaleString()} educational points
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <Button 
                      onClick={runPaymentSimulation} 
                      disabled={simulationRunning}
                      className="mb-4"
                    >
                      {simulationRunning ? (
                        <>
                          <Pause className="mr-2 h-4 w-4" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Run Conversion Simulation
                        </>
                      )}
                    </Button>
                    
                    {simulationRunning && (
                      <div className="max-w-md mx-auto">
                        <Progress value={simulationProgress} className="mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Converting ${monthlyCommitment} to {monthlyPoints.toLocaleString()} points... {simulationProgress}%
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-4">Conversion Process</h4>
                      <div className="space-y-4">
                        {paymentConversionSteps.map((step, index) => (
                          <div key={step.step} className="flex items-start space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              simulationProgress > (index * 25) ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'
                            }`}>
                              {step.icon}
                            </div>
                            <div>
                              <h5 className="font-medium">{step.title}</h5>
                              <p className="text-sm text-muted-foreground">{step.description}</p>
                              <p className="text-xs text-muted-foreground">Duration: {step.duration}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-4">Point Allocation</h4>
                      <div className="space-y-3">
                        {sponsoredStudents.map((student, index) => (
                          <div key={student.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                            <span className="font-medium">{student.firstName} {student.lastName}</span>
                            <span className="font-bold text-green-600">50,000 pts</span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                          <span className="font-medium">Total Monthly Points</span>
                          <span className="font-bold text-blue-600">{monthlyPoints.toLocaleString()} pts</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Point Value Examples</CardTitle>
                <CardDescription>
                  See how students can use their 50,000 monthly points
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">5,000 pts</div>
                    <div className="text-sm font-medium mb-1">Scientific Calculator</div>
                    <div className="text-xs text-muted-foreground">Essential for STEM courses</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-2">15,000 pts</div>
                    <div className="text-sm font-medium mb-1">Semester Textbooks</div>
                    <div className="text-xs text-muted-foreground">All required course materials</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-2">25,000 pts</div>
                    <div className="text-sm font-medium mb-1">Laptop/Tablet</div>
                    <div className="text-xs text-muted-foreground">For online learning and research</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                  Complete history of your contributions and point generation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">${payment.amount} Payment</h4>
                          <p className="text-sm text-muted-foreground">
                            {studentsByName[payment.student] ? `For ${studentsByName[payment.student].firstName} ${studentsByName[payment.student].lastName}` : 'Student'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{payment.points.toLocaleString()} points</div>
                        <div className="text-sm text-muted-foreground">{payment.date}</div>
                        {getPaymentStatusBadge(payment.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Annual Summary</CardTitle>
                <CardDescription>
                  Your contribution impact over the past year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">$600</div>
                    <div className="text-sm text-muted-foreground">Total Donated This Year</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">600,000</div>
                    <div className="text-sm text-muted-foreground">Points Generated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">12</div>
                    <div className="text-sm text-muted-foreground">Monthly Payments</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>
                    Manage your payment information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">•••• •••• •••• 4242</div>
                          <div className="text-sm text-muted-foreground">Expires 12/25</div>
                        </div>
                      </div>
                      <Badge variant="secondary">Default</Badge>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sponsorship Management</CardTitle>
                  <CardDescription>
                    Control your sponsorship settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Monthly Amount</div>
                        <div className="text-sm text-muted-foreground">$50.00 per month</div>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Payment Schedule</div>
                        <div className="text-sm text-muted-foreground">1st of each month</div>
                      </div>
                      <Button variant="outline" size="sm">Change</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Auto-renewal</div>
                        <div className="text-sm text-muted-foreground">Enabled</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Pause className="mr-1 h-3 w-3" />
                        Pause
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>
                  Configure your payment preferences and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4">Notifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Payment Receipts</span>
                        <Badge variant="secondary">Email</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Payment Reminders</span>
                        <Badge variant="secondary">Email & SMS</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Student Updates</span>
                        <Badge variant="secondary">Email</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-4">Billing Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Billing Address</span>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Tax Receipts</span>
                        <Button variant="outline" size="sm">Download</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Payment History</span>
                        <Button variant="outline" size="sm">Export</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                <CardDescription>
                  Actions that will affect your sponsorship
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                    <div>
                      <h4 className="font-medium text-red-800">Pause Sponsorship</h4>
                      <p className="text-sm text-red-600">Temporarily pause your monthly contributions</p>
                    </div>
                    <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                    <div>
                      <h4 className="font-medium text-red-800">Cancel Sponsorship</h4>
                      <p className="text-sm text-red-600">Permanently stop your contributions</p>
                    </div>
                    <Button variant="destructive">
                      <Minus className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}