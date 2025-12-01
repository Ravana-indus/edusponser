"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Save, 
  User, 
  Briefcase, 
  Heart, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Building,
  DollarSign
} from "lucide-react"
import Navigation from "@/components/layout/Navigation"
import { supabase } from '@/lib/supabase/client'

function EditDonorPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const donorId = searchParams.get('id')
  
  const [donor, setDonor] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const load = async () => {
      if (!donorId) { setLoading(false); return }
      const { data: dn } = await supabase
        .from('donors')
        .select('*')
        .eq('name', donorId)
        .maybeSingle()
      if (!dn) { router.push('/admin/dashboard'); return }
      const mapped = {
        id: dn.name,
        firstName: dn.first_name,
        lastName: dn.last_name,
        email: dn.email,
        phone: dn.phone,
        company: dn.company,
        occupation: dn.occupation,
        annualIncome: dn.annual_income,
        bio: dn.bio,
        motivation: dn.motivation,
        studentPreference: dn.student_preference,
        communicationFrequency: dn.communication_frequency,
        anonymous: dn.anonymous,
        status: dn.status,
        joinDate: dn.join_date,
        totalDonated: Number(dn.total_donated || 0),
        totalPoints: Number(dn.total_points || 0),
        profileImage: dn.profile_image,
      }
      setDonor(mapped)
      setFormData(mapped)
      setLoading(false)
    }
    load()
  }, [donorId, router])

  const handleInputChange = (field: keyof Donor, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when field is changed
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName?.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email?.trim()) newErrors.email = 'Email is required'
    if (!formData.phone?.trim()) newErrors.phone = 'Phone is required'
    if (!formData.occupation?.trim()) newErrors.occupation = 'Occupation is required'
    if (!formData.annualIncome) newErrors.annualIncome = 'Annual income is required'
    if (!formData.bio?.trim()) newErrors.bio = 'Bio is required'
    if (!formData.motivation?.trim()) newErrors.motivation = 'Motivation is required'
    if (!formData.studentPreference) newErrors.studentPreference = 'Student preference is required'
    if (!formData.communicationFrequency) newErrors.communicationFrequency = 'Communication frequency is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setSaving(true)
    try {
      const update: any = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        occupation: formData.occupation,
        annual_income: formData.annualIncome,
        bio: formData.bio,
        motivation: formData.motivation,
        student_preference: formData.studentPreference,
        communication_frequency: formData.communicationFrequency,
        anonymous: formData.anonymous,
        status: formData.status,
      }
      await supabase.from('donors').update(update).eq('name', donor?.id)

      // Show success message (you could use a toast here)
      alert('Donor updated successfully!')
      
      // Navigate back to admin dashboard
      router.push('/admin/dashboard')
    } catch (error) {
      console.error('Error saving donor:', error)
      alert('Error saving donor data')
    } finally {
      setSaving(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>
      case "suspended":
        return <Badge className="bg-yellow-100 text-yellow-800">Suspended</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
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
              <p>Loading donor data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!donor) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Donor Not Found</h1>
            <p className="text-muted-foreground mb-4">The donor you're looking for doesn't exist.</p>
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
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={donor.profileImage} />
                <AvatarFallback className="text-lg">
                  {donor.firstName[0]}{donor.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">
                  Edit Donor: {donor.firstName} {donor.lastName}
                </h1>
                <p className="text-muted-foreground">
                  {donor.occupation} {donor.company ? `at ${donor.company}` : ''}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  {getStatusBadge(donor.status)}
                  <Badge variant="outline">
                    ID: {donor.id}
                  </Badge>
                  <Badge variant="outline">
                    Total Donated: ${donor.totalDonated}
                  </Badge>
                  <Badge variant="outline">
                    Points: {donor.totalPoints.toLocaleString()}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Basic personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName || ''}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={errors.firstName ? 'border-red-500' : ''}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName || ''}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={errors.lastName ? 'border-red-500' : ''}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Professional Information
                </CardTitle>
                <CardDescription>
                  Employment and financial details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="occupation">Occupation *</Label>
                    <Input
                      id="occupation"
                      value={formData.occupation || ''}
                      onChange={(e) => handleInputChange('occupation', e.target.value)}
                      className={errors.occupation ? 'border-red-500' : ''}
                    />
                    {errors.occupation && (
                      <p className="text-sm text-red-500 mt-1">{errors.occupation}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company || ''}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="annualIncome">Annual Income *</Label>
                  <Select 
                    value={formData.annualIncome || ''} 
                    onValueChange={(value) => handleInputChange('annualIncome', value)}
                  >
                    <SelectTrigger className={errors.annualIncome ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select annual income range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-50k">Under $50,000</SelectItem>
                      <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                      <SelectItem value="100k-150k">$100,000 - $150,000</SelectItem>
                      <SelectItem value="150k-200k">$150,000 - $200,000</SelectItem>
                      <SelectItem value="200k-250k">$200,000 - $250,000</SelectItem>
                      <SelectItem value="over-250k">Over $250,000</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.annualIncome && (
                    <p className="text-sm text-red-500 mt-1">{errors.annualIncome}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Donation Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-5 w-5" />
                  Donation Preferences
                </CardTitle>
                <CardDescription>
                  How you'd like to contribute and support students
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="studentPreference">Student Preference *</Label>
                  <Select 
                    value={formData.studentPreference || ''} 
                    onValueChange={(value) => handleInputChange('studentPreference', value)}
                  >
                    <SelectTrigger className={errors.studentPreference ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select student preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Student</SelectItem>
                      <SelectItem value="stem">STEM Students</SelectItem>
                      <SelectItem value="arts">Arts Students</SelectItem>
                      <SelectItem value="business">Business Students</SelectItem>
                      <SelectItem value="healthcare">Healthcare Students</SelectItem>
                      <SelectItem value="undergraduate">Undergraduate Students</SelectItem>
                      <SelectItem value="graduate">Graduate Students</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.studentPreference && (
                    <p className="text-sm text-red-500 mt-1">{errors.studentPreference}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="communicationFrequency">Communication Frequency *</Label>
                  <Select 
                    value={formData.communicationFrequency || ''} 
                    onValueChange={(value) => handleInputChange('communicationFrequency', value)}
                  >
                    <SelectTrigger className={errors.communicationFrequency ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select communication frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly Updates</SelectItem>
                      <SelectItem value="monthly">Monthly Updates</SelectItem>
                      <SelectItem value="quarterly">Quarterly Updates</SelectItem>
                      <SelectItem value="minimal">Minimal Communication</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.communicationFrequency && (
                    <p className="text-sm text-red-500 mt-1">{errors.communicationFrequency}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={formData.anonymous || false}
                    onChange={(e) => handleInputChange('anonymous', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="anonymous">Donate anonymously</Label>
                </div>
              </CardContent>
            </Card>

            {/* Personal Statement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  Personal Statement
                </CardTitle>
                <CardDescription>
                  Tell us about yourself and your motivation for supporting education
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bio">Biography *</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself, your background, and your interests..."
                    value={formData.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={3}
                    className={errors.bio ? 'border-red-500' : ''}
                  />
                  {errors.bio && (
                    <p className="text-sm text-red-500 mt-1">{errors.bio}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="motivation">Motivation for Donating *</Label>
                  <Textarea
                    id="motivation"
                    placeholder="What motivates you to support students' education?"
                    value={formData.motivation || ''}
                    onChange={(e) => handleInputChange('motivation', e.target.value)}
                    rows={3}
                    className={errors.motivation ? 'border-red-500' : ''}
                  />
                  {errors.motivation && (
                    <p className="text-sm text-red-500 mt-1">{errors.motivation}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Status & Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Current Status</Label>
                  <div className="mt-2">
                    {getStatusBadge(donor.status)}
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">Change Status</Label>
                  <Select 
                    value={formData.status || ''} 
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="totalDonated">Total Donated ($)</Label>
                  <Input
                    id="totalDonated"
                    type="number"
                    value={formData.totalDonated || 0}
                    onChange={(e) => handleInputChange('totalDonated', parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="totalPoints">Total Points</Label>
                  <Input
                    id="totalPoints"
                    type="number"
                    value={formData.totalPoints || 0}
                    onChange={(e) => handleInputChange('totalPoints', parseInt(e.target.value))}
                  />
                </div>

                <Separator />

                <Button 
                  onClick={handleSave} 
                  className="w-full" 
                  disabled={saving}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Join Date:</span>
                  <span className="text-sm">{donor.joinDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Donor ID:</span>
                  <span className="text-sm">{donor.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Monthly Donation:</span>
                  <span className="text-sm">$50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Monthly Points:</span>
                  <span className="text-sm">50,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Anonymous:</span>
                  <span className="text-sm">{donor.anonymous ? 'Yes' : 'No'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Financial Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Donated:</span>
                  <span className="text-sm font-medium">${donor.totalDonated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Points:</span>
                  <span className="text-sm font-medium">{donor.totalPoints.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Annual Income:</span>
                  <span className="text-sm font-medium">{donor.annualIncome ? donor.annualIncome.replace('-', ' - ') : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Avg Monthly:</span>
                  <span className="text-sm font-medium">${(donor.totalDonated / 12).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Form Errors */}
            {Object.keys(errors).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-red-600">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Form Errors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {Object.values(errors).map((error, index) => (
                      <p key={index} className="text-sm text-red-600">• {error}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EditDonorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-background to-muted" /> }>
      <EditDonorPageInner />
    </Suspense>
  )
}