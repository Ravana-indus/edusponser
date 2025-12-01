'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Heart, 
  Search,
  Filter,
  ArrowLeft,
  Users,
  CheckCircle,
  XCircle
} from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/layout/Navigation"
import AuthGuard from "@/components/auth/AuthGuard"
import { useAuth } from '@/lib/frappe/auth'
import { 
  useSponsorshipManagement, 
  useAllSponsorships, 
  useStudentsAndDonors 
} from '@/hooks/useSupabaseData'

export default function AssignSponsorshipPage() {
  return (
    <AuthGuard requiredRole="admin">
      <AssignSponsorshipContent />
    </AuthGuard>
  )
}

function AssignSponsorshipContent() {
  const auth = useAuth()
  const { sponsorships, loading: sponsorshipsLoading, refetch } = useAllSponsorships()
  const { students, donors, loading: dataLoading } = useStudentsAndDonors()
  const { assignStudentToDonor, removeSponsorshipAssignment, loading: actionLoading } = useSponsorshipManagement()
  
  const [selectedStudent, setSelectedStudent] = useState('')
  const [selectedDonor, setSelectedDonor] = useState('')
  const [monthlyAmount, setMonthlyAmount] = useState(50)
  const [monthlyPoints, setMonthlyPoints] = useState(50000)
  const [studentSearchTerm, setStudentSearchTerm] = useState('')
  const [donorSearchTerm, setDonorSearchTerm] = useState('')
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const handleAssignSponsorship = async () => {
    if (!selectedStudent || !selectedDonor) return

    const result = await assignStudentToDonor(selectedStudent, selectedDonor, monthlyAmount, monthlyPoints)
    if (result) {
      setSelectedStudent('')
      setSelectedDonor('')
      refetch()
    }
  }

  const handleRemoveSponsorship = async (sponsorshipName: string) => {
    if (confirm('Are you sure you want to end this sponsorship?')) {
      const success = await removeSponsorshipAssignment(sponsorshipName)
      if (success) {
        refetch()
      }
    }
  }

  // Filter out already sponsored students
  const availableStudents = students.filter(student => 
    !sponsorships.some(sponsorship => 
      sponsorship.student?.name === student.name && sponsorship.status === 'active'
    )
  )

  // Filter students and donors based on search
  const filteredStudents = availableStudents.filter(student =>
    `${student.first_name} ${student.last_name} ${student.email}`.toLowerCase().includes(studentSearchTerm.toLowerCase())
  )

  const filteredDonors = donors.filter(donor =>
    `${donor.first_name} ${donor.last_name} ${donor.email}`.toLowerCase().includes(donorSearchTerm.toLowerCase())
  )

  if (sponsorshipsLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading sponsorship data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <Link href="/admin/dashboard">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
              <h1 className="text-3xl font-bold mb-2">Sponsorship Assignment</h1>
              <p className="text-muted-foreground">Assign students to donors and manage sponsorship relationships</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">
                  {isHydrated ? filteredStudents.length : 0}
                </div>
                <div className="text-sm text-muted-foreground">Available Students</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-green-600">
                  {isHydrated ? filteredDonors.length : 0}
                </div>
                <div className="text-sm text-muted-foreground">Active Donors</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-purple-600">
                  {isHydrated ? sponsorships.filter(s => s.status === 'active').length : 0}
                </div>
                <div className="text-sm text-muted-foreground">Active Sponsorships</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Assignment Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>Create New Sponsorship</span>
                </CardTitle>
                <CardDescription>
                  Select a student and donor to create a new sponsorship relationship
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Student Selection */}
                <div className="space-y-4">
                  <Label htmlFor="student-search">Select Student</Label>
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="student-search"
                        placeholder="Search students..."
                        value={studentSearchTerm}
                        onChange={(e) => setStudentSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a student" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredStudents.map((student) => (
                          <SelectItem key={student.name} value={student.name}>
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={student.profile_image} />
                                <AvatarFallback>
                                  {student.first_name?.[0]}{student.last_name?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{student.first_name} {student.last_name}</div>
                                <div className="text-xs text-muted-foreground">{student.email}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Donor Selection */}
                <div className="space-y-4">
                  <Label htmlFor="donor-search">Select Donor</Label>
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="donor-search"
                        placeholder="Search donors..."
                        value={donorSearchTerm}
                        onChange={(e) => setDonorSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={selectedDonor} onValueChange={setSelectedDonor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a donor" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredDonors.map((donor) => (
                          <SelectItem key={donor.name} value={donor.name}>
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={donor.profile_image} />
                                <AvatarFallback>
                                  {donor.first_name?.[0]}{donor.last_name?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{donor.first_name} {donor.last_name}</div>
                                <div className="text-xs text-muted-foreground">{donor.email}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Amount and Points */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="monthly-amount">Monthly Amount ($)</Label>
                    <Input
                      id="monthly-amount"
                      type="number"
                      value={monthlyAmount}
                      onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthly-points">Monthly Points</Label>
                    <Input
                      id="monthly-points"
                      type="number"
                      value={monthlyPoints}
                      onChange={(e) => setMonthlyPoints(Number(e.target.value))}
                      min="1000"
                      step="1000"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  onClick={handleAssignSponsorship}
                  disabled={!selectedStudent || !selectedDonor || actionLoading}
                  className="w-full"
                  size="lg"
                >
                  {actionLoading ? 'Creating Sponsorship...' : 'Create Sponsorship'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Current Sponsorships */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Active Sponsorships</span>
                </CardTitle>
                <CardDescription>
                  Manage current sponsorship relationships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sponsorships.filter(s => s.status === 'active').map((sponsorship) => (
                    <div key={sponsorship.name} className="border rounded-lg p-4 space-y-4">
                      {/* Student Info */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={sponsorship.student?.profile_image} />
                            <AvatarFallback>
                              {sponsorship.student?.first_name?.[0]}{sponsorship.student?.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {sponsorship.student?.first_name} {sponsorship.student?.last_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {sponsorship.student?.email}
                            </div>
                          </div>
                        </div>
                        <Badge variant="default">Student</Badge>
                      </div>

                      {/* Donor Info */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={sponsorship.donor?.profile_image} />
                            <AvatarFallback>
                              {sponsorship.donor?.first_name?.[0]}{sponsorship.donor?.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {sponsorship.donor?.first_name} {sponsorship.donor?.last_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {sponsorship.donor?.email}
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Donor</Badge>
                      </div>

                      {/* Sponsorship Details */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-sm">
                          <span className="font-medium">${sponsorship.monthly_amount || 0}/month</span>
                          <span className="text-muted-foreground"> • {(sponsorship.monthly_points || 0).toLocaleString()} points</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveSponsorship(sponsorship.name)}
                          disabled={actionLoading}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          End
                        </Button>
                      </div>
                    </div>
                  ))}

                  {sponsorships.filter(s => s.status === 'active').length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>No active sponsorships found.</p>
                      <p className="text-sm">Create the first sponsorship using the form on the left.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
