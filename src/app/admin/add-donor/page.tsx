'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Save, 
  User, 
  Briefcase, 
  Heart, 
  AlertTriangle,
  Plus,
  CheckCircle,
  Building,
  DollarSign
} from "lucide-react"
import Navigation from "@/components/layout/Navigation"
import { supabase } from '@/lib/supabase/client'
import type { Donor as MockDonor } from "@/lib/data/mockData"

export default function AddDonorPage() {
  const router = useRouter()
  
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<MockDonor>>({
    status: 'active',
    totalDonated: 0,
    totalPoints: 0,
    anonymous: false,
    joinDate: new Date().toISOString().split('T')[0]
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: keyof MockDonor, value: string | number | boolean) => {
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
      // Invite user by email first
      if (formData.email) {
        await fetch('/api/admin/auth/invite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, role: 'donor', user_metadata: { first_name: formData.firstName, last_name: formData.lastName } })
        })
      }
      const donorName = `DONOR-${Date.now()}`
      const insert: any = {
        name: donorName,
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
        anonymous: formData.anonymous || false,
        status: formData.status,
        join_date: formData.joinDate,
        total_donated: formData.totalDonated || 0,
        total_points: formData.totalPoints || 0,
      }
      await supabase.from('donors').insert(insert)

      // Show success message
      alert('Donor created successfully!')
      
      // Navigate back to admin dashboard
      router.push('/admin/dashboard')
    } catch (error) {
      console.error('Error creating donor:', error)
      alert('Error creating donor')
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
          
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                Add New Donor
              </h1>
              <p className="text-muted-foreground">
                Create a new donor profile in the EduSponsor system
              </p>
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
                  <Label htmlFor="status">Initial Status</Label>
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
                  <Label htmlFor="totalDonated">Initial Donated ($)</Label>
                  <Input
                    id="totalDonated"
                    type="number"
                    value={formData.totalDonated || 0}
                    onChange={(e) => handleInputChange('totalDonated', parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="totalPoints">Initial Points</Label>
                  <Input
                    id="totalPoints"
                    type="number"
                    value={formData.totalPoints || 0}
                    onChange={(e) => handleInputChange('totalPoints', parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="joinDate">Join Date</Label>
                  <Input
                    id="joinDate"
                    type="date"
                    value={formData.joinDate || ''}
                    onChange={(e) => handleInputChange('joinDate', e.target.value)}
                  />
                </div>

                <Separator />

                <Button 
                  onClick={handleSave} 
                  className="w-full" 
                  disabled={saving}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Creating...' : 'Create Donor'}
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
                  <span className="text-sm text-muted-foreground">Total Donors:</span>
                  <span className="text-sm">—</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">New ID:</span>
                  <span className="text-sm">Auto</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Monthly Donation:</span>
                  <span className="text-sm">$50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Monthly Points:</span>
                  <span className="text-sm">50,000</span>
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
                  <span className="text-sm text-muted-foreground">Initial Donated:</span>
                  <span className="text-sm font-medium">${formData.totalDonated || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Initial Points:</span>
                  <span className="text-sm font-medium">{(formData.totalPoints || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Annual Income:</span>
                  <span className="text-sm font-medium">
                    {formData.annualIncome ? formData.annualIncome.replace('-', ' - ') : 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Anonymous:</span>
                  <span className="text-sm font-medium">{formData.anonymous ? 'Yes' : 'No'}</span>
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

            {/* Success Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Tips for Success
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Fill in all required fields marked with *</p>
                  <p>• Provide detailed personal statements</p>
                  <p>• Ensure contact information is accurate</p>
                  <p>• Select appropriate student preferences</p>
                  <p>• Set communication frequency expectations</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}