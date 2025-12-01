'use client'

import { useEffect, useState } from "react"
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
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Shield
} from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/layout/Navigation"
import { supabase } from '@/lib/supabase/client'
import { useAuthState } from '@/lib/frappe'

export default function StudentProfile() {
  const [activeTab, setActiveTab] = useState("overview")
  const auth = useAuthState()

  const [student, setStudent] = useState<any | null>(null)
  const [donor, setDonor] = useState<any | null>(null)
  const [payments, setPayments] = useState<any[]>([])
  const [updates, setUpdates] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      if (!auth?.user?.email && !auth?.user?.username) return

      // Load student by email (preferred) or by constructed name ST-<username>
      let st: any = null
      if (auth.user?.email) {
        const { data } = await supabase.from('students').select('*').eq('email', auth.user.email).maybeSingle()
        st = data
      }
      if (!st && auth.user?.username) {
        const constructed = `ST-${auth.user.username}`
        const { data } = await supabase.from('students').select('*').eq('name', constructed).maybeSingle()
        st = data
      }
      if (!st) return
      setStudent(st)

      // Sponsorship/donor
      const { data: sp } = await supabase
        .from('sponsorships')
        .select('donor, status')
        .eq('student', st.name)
        .eq('status', 'active')
        .maybeSingle()
      if (sp?.donor) {
        const { data: d } = await supabase.from('donors').select('*').eq('name', sp.donor).maybeSingle()
        setDonor(d)
      }

      // Payments for student
      const { data: pays } = await supabase
        .from('payments')
        .select('name, date, amount, points, status, donor')
        .eq('student', st.name)
        .order('date', { ascending: false })
        .limit(50)
      setPayments(pays || [])

      // Student updates (public + own)
      const { data: ups } = await supabase
        .from('education_updates')
        .select('name, title, content, type, date, is_public')
        .eq('student', st.name)
        .order('date', { ascending: false })
        .limit(50)
      setUpdates(ups || [])
    }
    load()
  }, [auth.user?.email, auth.user?.username])

  const getSponsorshipStatus = () => {
    if (!student) return { status: 'pending', label: 'Loading...', color: 'yellow' }
    if (student.status === 'pending') {
      return { status: 'pending', label: 'Pending Approval', color: 'yellow' }
    }
    if (donor) {
      return { status: 'sponsored', label: 'Sponsored', color: 'green' }
    }
    return { status: 'unsponsored', label: 'Seeking Sponsor', color: 'red' }
  }

  const sponsorshipStatus = getSponsorshipStatus()

  const getStatusBadge = (status: string, color: string) => {
    const colorClasses = {
      green: 'bg-green-100 text-green-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      red: 'bg-red-100 text-red-800'
    }
    
    return (
      <Badge className={colorClasses[color as keyof typeof colorClasses]}>
        {status}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Navigation user={{
        id: 1,
        firstName: student?.first_name || 'Student',
        lastName: student?.last_name || '',
        email: student?.email || '',
        role: 'student'
      }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={student?.profile_image} />
                <AvatarFallback className="text-2xl">
                  {(student?.first_name || 'S')[0]}
                  {(student?.last_name || 't')[0]}
                </AvatarFallback>
              </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold">{student?.first_name} {student?.last_name}</h1>
                {getStatusBadge(sponsorshipStatus.label, sponsorshipStatus.color)}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{student?.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>{student?.phone || ''}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{student?.age ? `${student.age} years old` : ''}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Joined {student?.join_date || ''}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{student?.education_level}</Badge>
                {student?.gpa && <Badge variant="outline">GPA: {student.gpa}</Badge>}
                <Badge variant="outline">{student?.school}</Badge>
              </div>
              
              <p className="text-muted-foreground mb-4">{student?.bio || ''}</p>
              
              {sponsorshipStatus.status === 'sponsored' && donor && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Sponsored by {donor.first_name} {donor.last_name}</span>
                  </div>
                  <p className="text-sm text-green-700">
                    You receive 50,000 points monthly from your sponsor to support your education.
                  </p>
                </div>
              )}
              
              {sponsorshipStatus.status === 'pending' && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Application Under Review</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Your application is being reviewed by our team. We'll notify you once a decision is made.
                  </p>
                </div>
              )}
              
              {sponsorshipStatus.status === 'unsponsored' && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-red-800">Seeking Sponsor</span>
                  </div>
                  <p className="text-sm text-red-700">
                    You're currently seeking a sponsor. We're working to match you with a donor who shares your educational goals.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="sponsorship">Sponsorship</TabsTrigger>
            <TabsTrigger value="updates">My Updates</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(student?.total_points || 0).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Lifetime points received
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Points</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sponsorshipStatus.status === 'sponsored' ? '50,000' : '0'}</div>
                  <p className="text-xs text-muted-foreground">
                    Monthly allocation
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Academic Level</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{student?.gpa || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Current GPA
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Status</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">
                    {sponsorshipStatus.status === 'sponsored' ? 'Active' : 'Inactive'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Account status
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Educational Goals */}
            <Card>
              <CardHeader>
                <CardTitle>Educational Goals</CardTitle>
                <CardDescription>
                  What I'm working towards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{student?.goals || ''}</p>
              </CardContent>
            </Card>

            {/* Challenges */}
            <Card>
              <CardHeader>
                <CardTitle>Current Challenges</CardTitle>
                <CardDescription>
                  Obstacles I'm facing in my education
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{student?.challenges || ''}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Educational Background</CardTitle>
                  <CardDescription>
                    Academic information and achievements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Current Institution</h4>
                    <p className="text-muted-foreground">{student?.school}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Field of Study</h4>
                    <p className="text-muted-foreground">{student?.major || ''}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Education Level</h4>
                    <p className="text-muted-foreground capitalize">{student?.education_level || ''}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Current GPA</h4>
                    <div className="flex items-center space-x-2">
                      <Progress value={((student?.gpa || 0) / 4) * 100} className="flex-1" />
                      <span className="text-sm font-medium">{student?.gpa || 0}/4.0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Academic Progress</CardTitle>
                  <CardDescription>
                    Track your educational journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Overall Progress</h4>
                    <Progress value={75} className="mb-2" />
                    <p className="text-sm text-muted-foreground">75% complete</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Credits Completed</h4>
                    <p className="text-2xl font-bold">90 / 120</p>
                    <p className="text-sm text-muted-foreground">Credit hours</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Expected Graduation</h4>
                    <p className="text-lg font-medium">May 2025</p>
                    <p className="text-sm text-muted-foreground">2 semesters remaining</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sponsorship" className="space-y-6">
            {donor ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Your Sponsor</CardTitle>
                    <CardDescription>
                      Information about your generous sponsor
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={donor.profileImage} />
                        <AvatarFallback>{donor.firstName[0]}{donor.lastName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{donor.firstName} {donor.lastName}</h3>
                        <p className="text-sm text-muted-foreground">{donor.occupation} at {donor.company || 'N/A'}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="secondary">Active Sponsor</Badge>
                          <Badge variant="outline">Since {student?.join_date || ''}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">{donor.bio}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sponsorship Details</CardTitle>
                    <CardDescription>
                      Your sponsorship arrangement and benefits
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-4">Monthly Benefits</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Monthly Contribution</span>
                            <span className="font-medium">$50.00</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Points Received</span>
                            <span className="font-medium">50,000</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Communication</span>
                            <span className="font-medium">Monthly Updates</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-4">Sponsorship Terms</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Start Date</span>
                            <span className="font-medium">{student?.join_date || ''}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Duration</span>
                            <span className="font-medium">Ongoing</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Status</span>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>
                      Track the payments made on your behalf
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {payments.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <CreditCard className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">${payment.amount} Payment</h4>
                              <p className="text-sm text-muted-foreground">From {donor.firstName} {donor.lastName}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{payment.points.toLocaleString()} points</div>
                            <div className="text-sm text-muted-foreground">{payment.date}</div>
                            <Badge variant="secondary" className="mt-1">{payment.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Seeking Sponsorship</CardTitle>
                  <CardDescription>
                    Your current sponsorship status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Currently Seeking a Sponsor</h3>
                    <p className="text-muted-foreground mb-4">
                      {student?.why_need_support || ''}
                    </p>
                    <div className="bg-muted p-4 rounded-lg max-w-md mx-auto">
                      <h4 className="font-medium mb-2">What happens when you get sponsored?</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 text-left">
                        <li>• Receive 50,000 points monthly ($50 value)</li>
                        <li>• Connect with a mentor in your field</li>
                        <li>• Get ongoing support and encouragement</li>
                        <li>• Join a community of sponsored students</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="updates" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Updates</CardTitle>
                    <CardDescription>
                      Share your progress and achievements with your sponsor
                    </CardDescription>
                  </div>
                  <Button>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    New Update
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {updates.map((update) => (
                    <div key={update.id} className="flex items-start space-x-3 p-4 rounded-lg border">
                      <div className="flex-shrink-0">
                        {update.type === 'academic' && <BookOpen className="h-5 w-5 text-blue-500" />}
                        {update.type === 'project' && <Target className="h-5 w-5 text-green-500" />}
                        {update.type === 'personal' && <MessageCircle className="h-5 w-5 text-purple-500" />}
                        {update.type === 'milestone' && <Award className="h-5 w-5 text-yellow-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{update.title}</h4>
                          <span className="text-sm text-muted-foreground">{update.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{update.content}</p>
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
                          </Badge>
                          {update.isPublic && (
                            <Badge variant="secondary" className="text-xs ml-2">
                              Public
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal and academic information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <User className="mr-2 h-4 w-4" />
                      Edit Personal Information
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      Update Academic Details
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="mr-2 h-4 w-4" />
                      Change Email Address
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="mr-2 h-4 w-4" />
                      Update Phone Number
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences and security
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Notification Preferences
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Communication Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="mr-2 h-4 w-4" />
                      Privacy Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
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