'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
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
  Area,
  RadialBarChart,
  RadialBar
} from 'recharts'
import { 
  Heart, 
  TrendingUp, 
  Calendar, 
  CreditCard, 
  MessageCircle, 
  Settings,
  Star,
  Award,
  BookOpen,
  Target,
  Users,
  Plus,
  Edit,
  Eye,
  Send,
  Mail,
  Phone,
  Building,
  DollarSign,
  Gift,
  Clock,
  User,
  School,
  ChevronRight,
  History,
  Bell,
  Download,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingDown,
  Activity,
  CheckCircle,
  AlertCircle,
  Globe,
  Camera,
  FileText,
  Zap,
  Sparkles,
  MapPin,
  Briefcase,
  GraduationCap
} from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/layout/Navigation"
import { useAuth } from "@/lib/frappe/auth"
import AuthGuard from "@/components/auth/AuthGuard"
import { 
  useEnhancedDonorData,
  useDonorCommunication,
  useSponsorshipManagement
} from "@/hooks/useSupabaseData"

export default function DonorDashboard() {
  return (
    <AuthGuard requiredRole="donor">
      <DonorDashboardContent />
    </AuthGuard>
  )
}

function DonorDashboardContent() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isHydrated, setIsHydrated] = useState(false)
  useEffect(() => { setIsHydrated(true) }, [])

  // Authentication
  const auth = useAuth()
  const donorIdentifier = auth?.user?.email || auth?.user?.username

  // Use enhanced hooks for donor functionality
  const { donor, sponsorships, payments, loading: donorLoading, updateDonorProfile } = useEnhancedDonorData(donorIdentifier)
  const { communications, sendMessage, loading: commLoading } = useDonorCommunication(donor?.name)
  const { assignAvailableStudentToDonor, loading: sponsorLoading } = useSponsorshipManagement()

  // Dialog states
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [isMessageOpen, setIsMessageOpen] = useState(false)
  const [isSponsorStudentOpen, setIsSponsorStudentOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)

  // Form states
  const [profileFormData, setProfileFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    occupation: "",
    company: "",
    bio: "",
    motivation: "",
    student_preference: "",
    communication_frequency: "monthly",
    anonymous: false,
    newsletter_subscription: true,
    address: "",
    city: "",
    country: "",
    linkedin_profile: "",
    preferred_contact_method: "email",
    donation_goal: "",
    interests: "",
    availability: "weekdays"
  })

  const [messageFormData, setMessageFormData] = useState({
    message: "",
    type: "message"
  })

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize profile form when donor data loads
  useEffect(() => {
    if (donor) {
      setProfileFormData({
        first_name: donor.first_name || "",
        last_name: donor.last_name || "",
        phone: donor.phone || "",
        occupation: donor.occupation || "",
        company: donor.company || "",
        bio: donor.bio || "",
        motivation: donor.motivation || "",
        student_preference: donor.student_preference || "",
        communication_frequency: donor.communication_frequency || "monthly",
        anonymous: donor.anonymous || false,
        newsletter_subscription: donor.newsletter_subscription || true,
        address: donor.address || "",
        city: donor.city || "",
        country: donor.country || "",
        linkedin_profile: donor.linkedin_profile || "",
        preferred_contact_method: donor.preferred_contact_method || "email",
        donation_goal: donor.donation_goal || "",
        interests: donor.interests || "",
        availability: donor.availability || "weekdays"
      })
    }
  }, [donor])

  // Utility functions
  const formatCurrency = (amount: number) => `$${amount?.toLocaleString() || 0}`
  const formatDate = (date: string) => {
    if (!isHydrated || !date) return ''
    try {
      return new Date(date).toLocaleDateString()
    } catch {
      return date
    }
  }
  const formatDateTime = (date: string) => {
    if (!isHydrated || !date) return ''
    try {
      return new Date(date).toLocaleString()
    } catch {
      return date
    }
  }
  const extractInitials = (name: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??'

  // Calculate impact metrics
  const totalDonated = payments?.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) || 0
  const activeStudents = sponsorships?.filter(s => s.status === 'active').length || 0
  const monthlyCommitment = sponsorships?.reduce((sum, s) => sum + (s.monthly_amount || 0), 0) || 0
  const donationHistory = payments?.length || 0

  // Handlers
  const handleUpdateProfile = async () => {
    if (!donor?.name) return

    setIsSubmitting(true)

    try {
      const success = await updateDonorProfile(profileFormData)
      if (success) {
        setIsEditProfileOpen(false)
        alert('Profile updated successfully!')
      } else {
        alert('Failed to update profile. Please try again.')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      alert('An error occurred while updating your profile.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendMessage = async () => {
    if (!selectedStudent?.name || !messageFormData.message.trim()) return

    setIsSubmitting(true)
    
    try {
      const success = await sendMessage(selectedStudent.name, messageFormData.message, messageFormData.type)
      if (success) {
        setMessageFormData({ message: "", type: "message" })
        setIsMessageOpen(false)
        alert('Message sent successfully!')
      } else {
        alert('Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Message send error:', error)
      alert('An error occurred while sending the message.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSponsorStudent = async () => {
    if (!donor?.name) return

    setIsSubmitting(true)
    
    try {
      const success = await assignAvailableStudentToDonor(donor.name)
      if (success) {
        setIsSponsorStudentOpen(false)
        alert('Student sponsorship assigned successfully!')
        // Refresh data by calling the hook's refetch function if available
        window.location.reload() // Simple refresh for now
      } else {
        alert('No available students found or assignment failed.')
      }
    } catch (error) {
      console.error('Sponsor assignment error:', error)
      alert('An error occurred while assigning sponsorship.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Chart data
  const donationTrendData = [
    { month: 'Jan', amount: 450, goal: 500 },
    { month: 'Feb', amount: 520, goal: 500 },
    { month: 'Mar', amount: 610, goal: 600 },
    { month: 'Apr', amount: 680, goal: 650 },
    { month: 'May', amount: 750, goal: 700 },
    { month: 'Jun', amount: monthlyCommitment || 500, goal: 800 }
  ]

  const impactData = [
    { category: 'Education', value: 65, color: '#3B82F6' },
    { category: 'Health', value: 20, color: '#10B981' },
    { category: 'Technology', value: 10, color: '#8B5CF6' },
    { category: 'Other', value: 5, color: '#F59E0B' }
  ]

  const studentProgressData = sponsorships?.map((sponsorship, index) => ({
    name: `${sponsorship.student?.first_name} ${sponsorship.student?.last_name}`,
    progress: 75 + (index * 5), // Mock progress data
    grade: sponsorship.student?.education_level || 'N/A',
    subject: ['Math', 'Science', 'English', 'History'][index % 4]
  })) || []

  const achievementData = [
    { name: 'Total Impact', value: 92, max: 100, color: '#10B981' },
    { name: 'Student Progress', value: 88, max: 100, color: '#3B82F6' },
    { name: 'Communication', value: 76, max: 100, color: '#8B5CF6' },
    { name: 'Consistency', value: 94, max: 100, color: '#F59E0B' }
  ]

  // Prevent hydration mismatches
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading donor dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {donor?.first_name || 'Donor'}!
            </h1>
            <p className="text-muted-foreground">
              Your generosity is changing lives and building futures
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isSponsorStudentOpen} onOpenChange={setIsSponsorStudentOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                  <Heart className="mr-2 h-4 w-4" />
                  Sponsor a Student
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sponsor a New Student</DialogTitle>
                  <DialogDescription>
                    Help us match you with a student who needs your support.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    We'll automatically assign you to a qualified student seeking sponsorship.
                    Your monthly contribution helps provide education, health insurance, and future opportunities.
                  </p>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsSponsorStudentOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSponsorStudent} disabled={isSubmitting || sponsorLoading}>
                      {isSubmitting || sponsorLoading ? 'Processing...' : 'Confirm Sponsorship'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="impact">Impact</TabsTrigger>
            <TabsTrigger value="sponsorships">Sponsorships</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalDonated)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Lifetime contribution
                  </p>
                  <div className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +15% this month
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Students Sponsored</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {activeStudents}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Active sponsorships
                  </p>
                  <div className="text-xs text-blue-600 flex items-center mt-1">
                    <Heart className="h-3 w-3 mr-1" />
                    Lives impacted
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Commitment</CardTitle>
                  <CreditCard className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(monthlyCommitment)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Current monthly
                  </p>
                  <div className="text-xs text-purple-600 flex items-center mt-1">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Auto-renewing
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Donation History</CardTitle>
                  <History className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {donationHistory}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total transactions
                  </p>
                  <div className="text-xs text-orange-600 flex items-center mt-1">
                    <Activity className="h-3 w-3 mr-1" />
                    Since {formatDate(donor?.creation || '')}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Quick Actions */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Donation Trends</CardTitle>
                  <CardDescription>Your monthly giving compared to personal goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={donationTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Amount']} />
                      <Area type="monotone" dataKey="goal" stackId="1" stroke="#E5E7EB" fill="#E5E7EB" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="amount" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Impact Distribution</CardTitle>
                  <CardDescription>How your donations are being utilized</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={impactData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {impactData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setIsSponsorStudentOpen(true)}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Sponsor Another Student
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("communication")}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Message Students
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("payments")}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    View Payment History
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setIsEditProfileOpen(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Update Profile
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Communications</CardTitle>
                  <CardDescription>Latest messages and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {communications?.slice(0, 4).map((comm) => (
                      <div key={comm.id} className="flex items-start space-x-3 text-sm">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={comm.student?.profile_image} />
                          <AvatarFallback>{comm.student?.first_name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{comm.student?.first_name}</p>
                          <p className="text-muted-foreground line-clamp-1">{comm.message}</p>
                          <p className="text-xs text-muted-foreground">{formatDateTime(comm.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                    {(!communications || communications.length === 0) && (
                      <div className="text-center py-4 text-muted-foreground text-sm">
                        No recent communications
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Achievement Score</CardTitle>
                  <CardDescription>Your impact and engagement metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {achievementData.map((achievement) => (
                    <div key={achievement.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{achievement.name}</span>
                        <span className="text-muted-foreground">{achievement.value}%</span>
                      </div>
                      <Progress value={achievement.value} className="h-2" />
                    </div>
                  ))}
                  <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="text-sm font-medium">Super Supporter</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      You're in the top 10% of our donors!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Impact Analytics Tab */}
          <TabsContent value="impact" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Student Progress Tracking</CardTitle>
                  <CardDescription>Academic and personal development of sponsored students</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={studentProgressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="progress" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Impact Over Time</CardTitle>
                  <CardDescription>Cumulative impact of your contributions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={donationTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="amount" stroke="#10B981" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Impact Stories */}
            <Card>
              <CardHeader>
                <CardTitle>Success Stories</CardTitle>
                <CardDescription>Real stories of transformation from your sponsored students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sponsorships?.slice(0, 3).map((sponsorship, index) => (
                    <div key={sponsorship.name} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={sponsorship.student?.profile_image} />
                          <AvatarFallback>
                            {extractInitials(`${sponsorship.student?.first_name} ${sponsorship.student?.last_name}`)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{sponsorship.student?.first_name} {sponsorship.student?.last_name}</h4>
                          <p className="text-sm text-muted-foreground">{sponsorship.student?.education_level}</p>
                        </div>
                      </div>
                      <p className="text-sm">
                        "Thanks to your support, I was able to purchase essential textbooks and improve my grades significantly. 
                        I'm now in the top 10% of my class!"
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        Sponsored since {formatDate(sponsorship.start_date)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sponsorships Tab */}
          <TabsContent value="sponsorships" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Your Sponsored Students
                  <Badge variant="outline">{sponsorships?.length || 0} Active</Badge>
                </CardTitle>
                <CardDescription>Manage your sponsorship relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sponsorships?.map((sponsorship) => (
                    <div key={sponsorship.name} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={sponsorship.student?.profile_image} />
                            <AvatarFallback>
                              {extractInitials(`${sponsorship.student?.first_name} ${sponsorship.student?.last_name}`)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-lg">
                              {sponsorship.student?.first_name} {sponsorship.student?.last_name}
                            </h4>
                            <p className="text-muted-foreground">{sponsorship.student?.education_level}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm">
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {sponsorship.student?.city}, {sponsorship.student?.state}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Since {formatDate(sponsorship.start_date)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-green-600">
                            {formatCurrency(sponsorship.monthly_amount)}/month
                          </div>
                          <Badge 
                            variant={sponsorship.status === 'active' ? 'default' : 'secondary'}
                            className="mt-1"
                          >
                            {sponsorship.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <label className="font-medium">Academic Focus</label>
                          <p className="text-muted-foreground">{sponsorship.student?.field_of_study || 'General Studies'}</p>
                        </div>
                        <div>
                          <label className="font-medium">Current Points</label>
                          <p className="text-muted-foreground">{sponsorship.student?.available_points?.toLocaleString() || 0} points</p>
                        </div>
                        <div>
                          <label className="font-medium">Last Update</label>
                          <p className="text-muted-foreground">{formatDate(sponsorship.student?.last_update || '')}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedStudent(sponsorship.student)
                            setIsMessageOpen(true)
                          }}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Progress
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Reports
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {(!sponsorships || sponsorships.length === 0) && (
                    <div className="text-center py-12">
                      <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Active Sponsorships</h3>
                      <p className="text-muted-foreground mb-4">
                        Start making a difference by sponsoring a student today.
                      </p>
                      <Button onClick={() => setIsSponsorStudentOpen(true)}>
                        <Heart className="mr-2 h-4 w-4" />
                        Sponsor a Student
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communication Tab */}
          <TabsContent value="communication" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Message History
                    <Button 
                      size="sm"
                      onClick={() => setIsMessageOpen(true)}
                      disabled={!sponsorships || sponsorships.length === 0}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      New Message
                    </Button>
                  </CardTitle>
                  <CardDescription>Communication with your sponsored students</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {communications?.map((comm) => (
                      <div key={comm.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comm.student?.profile_image} />
                          <AvatarFallback>{comm.student?.first_name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium">{comm.student?.first_name} {comm.student?.last_name}</h5>
                            <span className="text-xs text-muted-foreground">{formatDateTime(comm.timestamp)}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{comm.message}</p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {comm.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {(!communications || communications.length === 0) && (
                      <div className="text-center py-8 text-muted-foreground">
                        No communications yet. Start a conversation with your sponsored students!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Communication Preferences</CardTitle>
                  <CardDescription>Manage how you receive updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Email Notifications</label>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Monthly Reports</label>
                      <p className="text-sm text-muted-foreground">Get detailed monthly progress reports</p>
                    </div>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Achievement Alerts</label>
                      <p className="text-sm text-muted-foreground">Be notified of student achievements</p>
                    </div>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Communication Frequency</label>
                    <Select defaultValue={donor?.communication_frequency || "monthly"}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Payment History
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Make Donation
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>Track your donation history and manage payments</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments?.map((payment) => (
                      <TableRow key={payment.name}>
                        <TableCell>{formatDate(payment.processed_date)}</TableCell>
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
                        <TableCell>
                          <Badge 
                            variant={payment.status === 'completed' ? 'default' : 
                                   payment.status === 'pending' ? 'secondary' : 'destructive'}
                          >
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{payment.payment_method || 'Card'}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {(!payments || payments.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    No payment history available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Profile Information
                    <Button onClick={() => setIsEditProfileOpen(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  </CardTitle>
                  <CardDescription>Manage your personal information and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                        <p className="font-medium">{donor?.first_name} {donor?.last_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <p className="font-medium">{donor?.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Phone</label>
                        <p className="font-medium">{donor?.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Occupation</label>
                        <p className="font-medium">{donor?.occupation || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Company</label>
                        <p className="font-medium">{donor?.company || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Location</label>
                        <p className="font-medium">{donor?.city}, {donor?.country || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                        <p className="font-medium">{formatDate(donor?.creation || '')}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Communication Frequency</label>
                        <p className="font-medium capitalize">{donor?.communication_frequency || 'Monthly'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {donor?.bio && (
                    <div className="mt-6">
                      <label className="text-sm font-medium text-muted-foreground">Bio</label>
                      <p className="mt-1">{donor.bio}</p>
                    </div>
                  )}
                  
                  {donor?.motivation && (
                    <div className="mt-4">
                      <label className="text-sm font-medium text-muted-foreground">Motivation</label>
                      <p className="mt-1">{donor.motivation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Your account settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Anonymous Donations</label>
                      <p className="text-xs text-muted-foreground">Hide your identity from students</p>
                    </div>
                    <input type="checkbox" checked={donor?.anonymous || false} readOnly />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Newsletter</label>
                      <p className="text-xs text-muted-foreground">Receive platform updates</p>
                    </div>
                    <input type="checkbox" checked={donor?.newsletter_subscription || false} readOnly />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Student Preference</label>
                    <p className="text-xs text-muted-foreground">
                      {donor?.student_preference || 'No specific preference'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Donation Goal</label>
                    <p className="text-xs text-muted-foreground">
                      {donor?.donation_goal || 'Not set'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Profile Dialog */}
        <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Update your personal information and preferences
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={profileFormData.first_name}
                    onChange={(e) => setProfileFormData({...profileFormData, first_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={profileFormData.last_name}
                    onChange={(e) => setProfileFormData({...profileFormData, last_name: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileFormData.phone}
                    onChange={(e) => setProfileFormData({...profileFormData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={profileFormData.occupation}
                    onChange={(e) => setProfileFormData({...profileFormData, occupation: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profileFormData.company}
                    onChange={(e) => setProfileFormData({...profileFormData, company: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profileFormData.city}
                    onChange={(e) => setProfileFormData({...profileFormData, city: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileFormData.bio}
                  onChange={(e) => setProfileFormData({...profileFormData, bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <Label htmlFor="motivation">Motivation for Donating</Label>
                <Textarea
                  id="motivation"
                  value={profileFormData.motivation}
                  onChange={(e) => setProfileFormData({...profileFormData, motivation: e.target.value})}
                  placeholder="What motivates you to support education?"
                />
              </div>

              <div>
                <Label htmlFor="communication_frequency">Communication Frequency</Label>
                <Select 
                  value={profileFormData.communication_frequency} 
                  onValueChange={(value) => setProfileFormData({...profileFormData, communication_frequency: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={profileFormData.anonymous}
                  onChange={(e) => setProfileFormData({...profileFormData, anonymous: e.target.checked})}
                />
                <Label htmlFor="anonymous">Make my donations anonymous</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditProfileOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateProfile} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Send Message Dialog */}
        <Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Message</DialogTitle>
              <DialogDescription>
                {selectedStudent ? 
                  `Send a message to ${selectedStudent.first_name} ${selectedStudent.last_name}` :
                  'Select a student to message'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {!selectedStudent && sponsorships && sponsorships.length > 0 && (
                <div>
                  <Label htmlFor="student">Select Student</Label>
                  <Select onValueChange={(value) => {
                    const student = sponsorships.find(s => s.student?.name === value)?.student
                    setSelectedStudent(student)
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {sponsorships.map((sponsorship) => (
                        <SelectItem key={sponsorship.student?.name} value={sponsorship.student?.name || ''}>
                          {sponsorship.student?.first_name} {sponsorship.student?.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="message_type">Message Type</Label>
                <Select value={messageFormData.type} onValueChange={(value) => setMessageFormData({...messageFormData, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="message">General Message</SelectItem>
                    <SelectItem value="encouragement">Encouragement</SelectItem>
                    <SelectItem value="question">Question</SelectItem>
                    <SelectItem value="congratulations">Congratulations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={messageFormData.message}
                  onChange={(e) => setMessageFormData({...messageFormData, message: e.target.value})}
                  placeholder="Type your message here..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsMessageOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSendMessage} 
                  disabled={isSubmitting || !selectedStudent || !messageFormData.message.trim()}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}