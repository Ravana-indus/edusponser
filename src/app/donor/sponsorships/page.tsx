"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  GraduationCap, 
  Heart, 
  CreditCard, 
  Calendar, 
  Users, 
  Plus,
  Minus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  MapPin,
  BookOpen,
  Target
} from "lucide-react"
import Navigation from "@/components/layout/Navigation"
import { supabase } from '@/lib/supabase/client'
import { useAuthState } from '@/lib/frappe'

export default function DonorSponsorships() {
  const [searchTerm, setSearchTerm] = useState("")
  const [educationFilter, setEducationFilter] = useState<string>("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)
  const [showOptOutDialog, setShowOptOutDialog] = useState(false)
  const [optOutReason, setOptOutReason] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [selectedSponsorship, setSelectedSponsorship] = useState<any>(null)
  const [commitmentAmount, setCommitmentAmount] = useState(50)
  const [processing, setProcessing] = useState(false)
  const [loading, setLoading] = useState(true)
  const auth = useAuthState()

  const [donor, setDonor] = useState<any | null>(null)
  const [allSponsorships, setAllSponsorships] = useState<any[]>([])
  const [activeSponsorships, setActiveSponsorships] = useState<any[]>([])
  const [studentsByName, setStudentsByName] = useState<Record<string, any>>({})
  const [availableStudents, setAvailableStudents] = useState<any[]>([])
  const [optOutPendingMap, setOptOutPendingMap] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const load = async () => {
      if (!auth?.user?.email) return
      setLoading(true)
      try {
        // Current donor by email
        const { data: d } = await supabase.from('donors').select('*').eq('email', auth.user.email).maybeSingle()
        if (!d) { setLoading(false); return }
        setDonor(d)

        // Sponsorships for donor (active + opt-out-pending)
        const { data: sp } = await supabase
          .from('sponsorships')
          .select('name, donor, student, status, start_date, end_date, monthly_amount, monthly_points, student_info_hidden, opt_out_requested_date, opt_out_effective_date, opt_out_reason')
          .eq('donor', d.name)
        const sponsorships = sp || []
        setAllSponsorships(sponsorships)
        setActiveSponsorships(sponsorships.filter(s => s.status === 'active'))

        // Students referenced by these sponsorships
        const studentNames = Array.from(new Set((sponsorships || []).map(s => s.student)))
        let sponsorStudents: any[] = []
        if (studentNames.length > 0) {
          const { data: studs } = await supabase
            .from('students')
            .select('name, first_name, last_name, school, education_level, gpa, profile_image, district, province, age, major, stream, grade, why_need_support, goals, bio')
            .in('name', studentNames)
          sponsorStudents = studs || []
        }
        const map: Record<string, any> = {}
        sponsorStudents.forEach(st => {
          map[st.name] = {
            id: st.name,
            name: st.name,
            firstName: st.first_name,
            lastName: st.last_name,
            school: st.school,
            educationLevel: st.education_level,
            gpa: st.gpa,
            profileImage: st.profile_image,
            district: st.district,
            province: st.province,
            age: st.age,
            major: st.major,
            stream: st.stream,
            grade: st.grade,
            whyNeedSupport: st.why_need_support,
            goals: st.goals,
            bio: st.bio,
          }
        })
        setStudentsByName(map)

        // Students available for sponsorship: approved, not already sponsored by this donor, and not in opt-out-pending globally
        const { data: optSp } = await supabase
          .from('sponsorships')
          .select('student, status')
          .eq('status', 'opt-out-pending')
        const optOutSet = new Set<string>((optSp || []).map(s => s.student))
        const optMap: Record<string, boolean> = {}
        ;(optSp || []).forEach(s => { optMap[s.student] = true })
        setOptOutPendingMap(optMap)

        const alreadySponsored = new Set<string>(sponsorships.map(s => s.student))
        const { data: avail } = await supabase
          .from('students')
          .select('name, first_name, last_name, school, education_level, gpa, profile_image, district, province, age, major, stream, grade, why_need_support, goals, bio, status')
          .eq('status', 'approved')
        const available = (avail || [])
          .filter(st => !alreadySponsored.has(st.name) && !optOutSet.has(st.name))
          .map(st => ({
            id: st.name,
            name: st.name,
            firstName: st.first_name,
            lastName: st.last_name,
            school: st.school,
            educationLevel: st.education_level,
            gpa: st.gpa,
            profileImage: st.profile_image,
            district: st.district,
            province: st.province,
            age: st.age,
            major: st.major,
            stream: st.stream,
            grade: st.grade,
            whyNeedSupport: st.why_need_support,
            goals: st.goals,
            bio: st.bio,
          }))
        setAvailableStudents(available)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [auth.user?.email])

  const sponsoredStudents = useMemo(() => {
    return allSponsorships
      .map(s => studentsByName[s.student])
      .filter(Boolean)
  }, [allSponsorships, studentsByName])
  const monthlyCommitment = useMemo(() => activeSponsorships.reduce((sum, s) => sum + Number(s.monthly_amount || 0), 0), [activeSponsorships])

  // Available students and filter are already in state; compute filtered view next

  // Filter students based on search and education level
  const filteredStudents = (availableStudents || []).filter(student => {
    const matchesSearch = student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.school.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEducation = educationFilter === "all" || student.educationLevel === educationFilter
    return matchesSearch && matchesEducation
  })

  const handleAddStudent = async () => {
    if (!selectedStudent || !donor) return
    setProcessing(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      const { error } = await supabase.from('sponsorships').insert({
        donor: donor.name,
        student: selectedStudent.name,
        start_date: today,
        status: 'active',
        monthly_amount: commitmentAmount,
        monthly_points: commitmentAmount * 1000,
        student_info_hidden: false,
      })
      if (error) throw error
      // Refresh
      setShowAddDialog(false)
      setSelectedStudent(null)
      setCommitmentAmount(50)
      // Reload data
      const { data: sp } = await supabase
        .from('sponsorships')
        .select('name, donor, student, status, start_date, end_date, monthly_amount, monthly_points, student_info_hidden, opt_out_requested_date, opt_out_effective_date, opt_out_reason')
        .eq('donor', donor.name)
      setAllSponsorships(sp || [])
    } catch (e) {
      console.error(e)
    } finally {
      setProcessing(false)
    }
  }

  const handleRemoveStudent = async () => {
    if (!selectedStudent || !donor) return
    const s = allSponsorships.find(sp => sp.student === selectedStudent.name && sp.status === 'active')
    if (!s) return
    setProcessing(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      const { error } = await supabase
        .from('sponsorships')
        .update({ status: 'cancelled', end_date: today })
        .eq('name', s.name)
      if (error) throw error
      setShowRemoveDialog(false)
      setSelectedStudent(null)
      // Refresh
      const { data: sp } = await supabase
        .from('sponsorships')
        .select('name, donor, student, status, start_date, end_date, monthly_amount, monthly_points, student_info_hidden, opt_out_requested_date, opt_out_effective_date, opt_out_reason')
        .eq('donor', donor.name)
      setAllSponsorships(sp || [])
    } catch (e) {
      console.error(e)
    } finally {
      setProcessing(false)
    }
  }

  const handleOptOut = async () => {
    if (!selectedSponsorship) return
    setProcessing(true)
    try {
      const requestedDate = new Date()
      const effective = new Date(requestedDate)
      effective.setMonth(effective.getMonth() + 1)
      const { error } = await supabase
        .from('sponsorships')
        .update({
          status: 'opt-out-pending',
          opt_out_requested_date: requestedDate.toISOString().split('T')[0],
          opt_out_effective_date: effective.toISOString().split('T')[0],
          opt_out_reason: optOutReason || null,
          student_info_hidden: true,
        })
        .eq('name', selectedSponsorship.name)
      if (error) throw error
      setShowOptOutDialog(false)
      setSelectedSponsorship(null)
      setOptOutReason("")
      // refresh single sponsorship locally
      setAllSponsorships(prev => prev.map(sp => sp.name === selectedSponsorship.name ? { ...sp, status: 'opt-out-pending' } : sp))
    } catch (e) {
      console.error(e)
    } finally {
      setProcessing(false)
    }
  }

  const handleCancelOptOut = async () => {
    if (!selectedSponsorship) return
    setProcessing(true)
    try {
      const { error } = await supabase
        .from('sponsorships')
        .update({
          status: 'active',
          opt_out_requested_date: null,
          opt_out_effective_date: null,
          opt_out_reason: null,
          student_info_hidden: false,
        })
        .eq('name', selectedSponsorship.name)
      if (error) throw error
      setSelectedSponsorship(null)
      setAllSponsorships(prev => prev.map(sp => sp.name === selectedSponsorship.name ? { ...sp, status: 'active' } : sp))
    } catch (e) {
      console.error(e)
    } finally {
      setProcessing(false)
    }
  }

  const getCommitmentOptions = () => {
    const baseOptions = [50, 100, 150, 200, 250, 300]
    return baseOptions.map(amount => ({
      value: amount,
      label: `$${amount}/month (${amount * 1000} points)`,
      students: Math.floor(amount / 50)
    }))
  }

  const getStudentDisplayInfo = (student: any) => {
    const educationInfo = student.major || student.stream || student.grade || student.educationLevel
    return {
      ...student,
      displayInfo: `${educationInfo} at ${student.school}`
    }
  }

  // Get safe student info for available students (based on global opt-out map)
  const getSafeStudentInfo = (student: any) => student

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
          <h1 className="text-3xl font-bold mb-2">Manage Your Sponsorships</h1>
          <p className="text-muted-foreground">
            Add or remove students from your sponsorship portfolio. Commitments are in multiples of $50 per student.
          </p>
        </div>

        {/* Current Commitment Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5" />
              <span>Current Sponsorships</span>
            </CardTitle>
            <CardDescription>
              You're currently supporting {sponsoredStudents.length} student{sponsoredStudents.length !== 1 ? 's' : ''} 
              with a monthly commitment of ${monthlyCommitment}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{sponsoredStudents.length}</div>
                <div className="text-sm text-muted-foreground">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">${monthlyCommitment}</div>
                <div className="text-sm text-muted-foreground">Monthly Commitment</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{(monthlyCommitment * 1000).toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Monthly Points</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sponsored Students */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Sponsored Students</CardTitle>
                <CardDescription>
                  Students currently receiving your support
                </CardDescription>
              </div>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allSponsorships.map((sponsorship) => {
                const student = studentsByName[sponsorship.student]
                if (!student) return null
                
                const studentInfo = getStudentDisplayInfo(student)
                const isOptOutPending = sponsorship.status === 'opt-out-pending'
                const daysUntilEffective = isOptOutPending && sponsorship.opt_out_effective_date
                  ? Math.max(0, Math.ceil((new Date(sponsorship.opt_out_effective_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                  : 0
                
                return (
                  <div key={sponsorship.name} className={`flex items-center justify-between p-4 border rounded-lg ${isOptOutPending ? 'bg-orange-50 border-orange-200' : ''}`}>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={student.profileImage} />
                        <AvatarFallback>{student.firstName?.[0]}{student.lastName?.[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{student.firstName} {student.lastName}</h3>
                          {isOptOutPending && (
                            <Badge variant="destructive" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              Opting Out
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{studentInfo.displayInfo}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary">{student.educationLevel}</Badge>
                          {student.gpa && <Badge variant="outline">GPA: {student.gpa}</Badge>}
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{student.district}{student.province ? `, ${student.province}` : ''}</span>
                          </div>
                        </div>
                        {isOptOutPending && (
                          <div className="mt-2 p-2 bg-orange-100 rounded text-xs text-orange-800">
                            <AlertTriangle className="h-3 w-3 inline mr-1" />
                            Opt-out effective in {daysUntilEffective} days ({sponsorship.opt_out_effective_date})
                            {sponsorship.opt_out_reason && (
                              <div className="mt-1">Reason: {sponsorship.opt_out_reason}</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium text-green-600">${sponsorship.monthly_amount}/month</div>
                        <div className="text-sm text-muted-foreground">
                          Since {new Date(sponsorship.start_date).toLocaleDateString()}
                        </div>
                      </div>
                      {isOptOutPending ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedSponsorship(sponsorship)
                            handleCancelOptOut()
                          }}
                          disabled={processing}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Cancel Opt-Out
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedSponsorship(sponsorship)
                            setSelectedStudent(student)
                            setShowOptOutDialog(true)
                          }}
                        >
                          <Minus className="mr-2 h-4 w-4" />
                          Opt Out
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
              
              {allSponsorships.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Students Sponsored Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start making a difference by sponsoring your first student.
                  </p>
                  <Button onClick={() => setShowAddDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Student
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Available Students */}
        <Card>
          <CardHeader>
            <CardTitle>Available Students</CardTitle>
            <CardDescription>
              Students waiting for sponsorship support
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students by name, school..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={educationFilter} onValueChange={setEducationFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Education Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="ordinary-level">O/L</SelectItem>
                  <SelectItem value="advanced-level">A/L</SelectItem>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="graduate">Graduate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Student Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => {
                const safeStudent = getSafeStudentInfo(student)
                const studentInfo = getStudentDisplayInfo(safeStudent)
                const isHidden = !!optOutPendingMap[student.name]
                
                return (
                  <Card key={student.name} className={`relative ${isHidden ? 'bg-orange-50 border-orange-200' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={safeStudent.profileImage} />
                            <AvatarFallback>
                              {safeStudent.firstName?.[0]}{safeStudent.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{safeStudent.firstName} {safeStudent.lastName}</CardTitle>
                            <CardDescription className="text-xs">
                              {safeStudent.age ? `${safeStudent.age} years old • ` : ''}{safeStudent.district}
                            </CardDescription>
                            {isHidden && (
                              <Badge variant="destructive" className="text-xs mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                Transitioning
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {String(safeStudent.educationLevel || '').replace('-', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                          <span className="truncate">{studentInfo.displayInfo}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Target className="h-4 w-4" />
                          <span className="truncate">{safeStudent.goals}</span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {safeStudent.whyNeedSupport}
                        </p>
                        
                        {isHidden && (
                          <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription className="text-xs">
                              This student is currently transitioning between sponsors. Personal information is hidden for privacy protection until a new sponsor is assigned.
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        <Button 
                          className="w-full" 
                          size="sm"
                          onClick={() => {
                            setSelectedStudent(student)
                            setShowAddDialog(true)
                          }}
                          disabled={isHidden}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          {isHidden ? 'Unavailable' : 'Sponsor Student'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Students Found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Student Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sponsor New Student</DialogTitle>
            <DialogDescription>
              {selectedStudent && (
                <>Add {selectedStudent.firstName} {selectedStudent.lastName} to your sponsorships</>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedStudent.profileImage} />
                  <AvatarFallback>{selectedStudent.firstName?.[0]}{selectedStudent.lastName?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedStudent.firstName} {selectedStudent.lastName}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedStudent.educationLevel} • {selectedStudent.school}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="commitment">Monthly Commitment</Label>
                <Select value={commitmentAmount.toString()} onValueChange={(value) => setCommitmentAmount(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getCommitmentOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Each $50 commitment sponsors one student and generates 50,000 educational points per month.
                </p>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This will increase your monthly commitment from ${monthlyCommitment} to ${monthlyCommitment + commitmentAmount}.
                  Your next payment will be processed on the 1st of next month.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStudent} disabled={processing || !selectedStudent}>
              {processing ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm Sponsorship
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Student Dialog */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Student Sponsorship</DialogTitle>
            <DialogDescription>
              This action will stop your monthly support for this student.
            </DialogDescription>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedStudent.profileImage} />
                  <AvatarFallback>{selectedStudent.firstName?.[0]}{selectedStudent.lastName?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedStudent.firstName} {selectedStudent.lastName}</div>
                  <div className="text-sm text-muted-foreground">
                    Currently receiving $50/month
                  </div>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Removing this student will decrease your monthly commitment from ${monthlyCommitment} to ${monthlyCommitment - 50}.
                  The student will need to find a new sponsor.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRemoveDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRemoveStudent} 
              disabled={processing || !selectedStudent}
            >
              {processing ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Remove Student
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Opt-Out Confirmation Dialog */}
      <Dialog open={showOptOutDialog} onOpenChange={setShowOptOutDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Opt Out of Sponsorship</DialogTitle>
            <DialogDescription>
              This will initiate the opt-out process with a 1-month notice period.
            </DialogDescription>
          </DialogHeader>
          
          {selectedStudent && selectedSponsorship && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedStudent.profileImage} />
                  <AvatarFallback>{selectedStudent.firstName?.[0]}{selectedStudent.lastName?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedStudent.firstName} {selectedStudent.lastName}</div>
                  <div className="text-sm text-muted-foreground">
                    Currently receiving ${selectedSponsorship.monthly_amount}/month
                  </div>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div><strong>1-Month Notice Period Required:</strong></div>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Your sponsorship will continue for 1 more month</li>
                      <li>The student's information will be hidden immediately</li>
                      <li>We need time to find a new sponsor for the student</li>
                      <li>During this period, the student will still receive $50/month</li>
                      <li>Your sponsorship will officially end after the notice period</li>
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="optOutReason">Reason for Opting Out (Optional)</Label>
                <textarea
                  id="optOutReason"
                  className="w-full p-2 border rounded-md text-sm"
                  rows={3}
                  placeholder="Please let us know why you're opting out (this helps us improve our service)..."
                  value={optOutReason}
                  onChange={(e) => setOptOutReason(e.target.value)}
                />
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-800">
                  <strong>Important:</strong> After opting out, the student's personal information (name, photo, contact details) will be hidden from your dashboard until a new sponsor is assigned. This protects the student's privacy during the transition period.
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOptOutDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleOptOut} 
              disabled={processing || !selectedSponsorship}
            >
              {processing ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Clock className="mr-2 h-4 w-4" />
                  Initiate Opt-Out
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}