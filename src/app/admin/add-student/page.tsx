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
  GraduationCap, 
  MapPin, 
  Target, 
  AlertTriangle,
  Plus,
  CheckCircle
} from "lucide-react"
import Navigation from "@/components/layout/Navigation"
import { supabase } from '@/lib/supabase/client'
import { supabase as supa } from '@/lib/supabase/client'
import type { Student as MockStudent } from "@/lib/data/mockData"

export default function AddStudentPage() {
  const router = useRouter()
  
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<MockStudent>>({
    status: 'pending',
    totalPoints: 0,
    donorId: null,
    joinDate: new Date().toISOString().split('T')[0]
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: keyof MockStudent, value: string | number) => {
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
    if (!formData.age || formData.age < 5 || formData.age > 30) newErrors.age = 'Age must be between 5 and 30'
    if (!formData.educationLevel) newErrors.educationLevel = 'Education level is required'
    if (!formData.school?.trim()) newErrors.school = 'School is required'
    if (!formData.district?.trim()) newErrors.district = 'District is required'
    if (!formData.province?.trim()) newErrors.province = 'Province is required'
    if (!formData.bio?.trim()) newErrors.bio = 'Bio is required'
    if (!formData.goals?.trim()) newErrors.goals = 'Goals are required'
    if (!formData.challenges?.trim()) newErrors.challenges = 'Challenges are required'
    if (!formData.whyNeedSupport?.trim()) newErrors.whyNeedSupport = 'Why need support is required'

    // Education level specific validations
    if (formData.educationLevel === 'primary' || formData.educationLevel === 'secondary') {
      if (!formData.grade || formData.grade < 1 || formData.grade > 13) {
        newErrors.grade = 'Grade must be between 1 and 13'
      }
    }
    
    if (formData.educationLevel === 'advanced-level') {
      if (!formData.stream) newErrors.stream = 'Stream is required for A/L students'
    }
    
    if (formData.educationLevel === 'undergraduate' || formData.educationLevel === 'graduate') {
      if (!formData.major?.trim()) newErrors.major = 'Major is required for university students'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setSaving(true)
    try {
      // Invite user by email first (if provided)
      if (formData.email) {
        await fetch('/api/admin/auth/invite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, role: 'student', user_metadata: { first_name: formData.firstName, last_name: formData.lastName } })
        })
      }
      // Insert into Supabase
      const insert: any = {
        name: `ST-${Date.now()}`,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        age: formData.age,
        education_level: formData.educationLevel,
        grade: formData.grade,
        school: formData.school,
        major: formData.major,
        stream: formData.stream,
        gpa: formData.gpa,
        exam_results: formData.examResults,
        bio: formData.bio,
        goals: formData.goals,
        challenges: formData.challenges,
        why_need_support: formData.whyNeedSupport,
        status: formData.status,
        join_date: formData.joinDate,
        total_points: formData.totalPoints || 0,
        district: formData.district,
        province: formData.province,
      }
      await supabase.from('students').insert(insert)
      
      // Show success message
      alert('Student created successfully!')
      
      // Navigate back to admin dashboard
      router.push('/admin/dashboard')
    } catch (error) {
      console.error('Error creating student:', error)
      alert('Error creating student')
    } finally {
      setSaving(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
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
                Add New Student
              </h1>
              <p className="text-muted-foreground">
                Create a new student profile in the EduSponsor system
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

                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    min="5"
                    max="30"
                    value={formData.age || ''}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                    className={errors.age ? 'border-red-500' : ''}
                  />
                  {errors.age && (
                    <p className="text-sm text-red-500 mt-1">{errors.age}</p>
                  )}
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
                <CardDescription>
                  Educational background and current studies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="educationLevel">Education Level *</Label>
                  <Select 
                    value={formData.educationLevel || ''} 
                    onValueChange={(value) => handleInputChange('educationLevel', value)}
                  >
                    <SelectTrigger className={errors.educationLevel ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primary (Grade 1-5)</SelectItem>
                      <SelectItem value="secondary">Secondary (Grade 6-11)</SelectItem>
                      <SelectItem value="ordinary-level">Ordinary Level (O/L)</SelectItem>
                      <SelectItem value="advanced-level">Advanced Level (A/L)</SelectItem>
                      <SelectItem value="undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                      <SelectItem value="postgraduate">Postgraduate</SelectItem>
                      <SelectItem value="vocational">Vocational</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.educationLevel && (
                    <p className="text-sm text-red-500 mt-1">{errors.educationLevel}</p>
                  )}
                </div>

                {(formData.educationLevel === 'primary' || formData.educationLevel === 'secondary') && (
                  <div>
                    <Label htmlFor="grade">Grade *</Label>
                    <Input
                      id="grade"
                      type="number"
                      min="1"
                      max="13"
                      value={formData.grade || ''}
                      onChange={(e) => handleInputChange('grade', parseInt(e.target.value))}
                      className={errors.grade ? 'border-red-500' : ''}
                    />
                    {errors.grade && (
                      <p className="text-sm text-red-500 mt-1">{errors.grade}</p>
                    )}
                  </div>
                )}

                {formData.educationLevel === 'advanced-level' && (
                  <div>
                    <Label htmlFor="stream">A/L Stream *</Label>
                    <Select 
                      value={formData.stream || ''} 
                      onValueChange={(value) => handleInputChange('stream', value)}
                    >
                      <SelectTrigger className={errors.stream ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select stream" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Science">Science</SelectItem>
                        <SelectItem value="Commerce">Commerce</SelectItem>
                        <SelectItem value="Arts">Arts</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.stream && (
                      <p className="text-sm text-red-500 mt-1">{errors.stream}</p>
                    )}
                  </div>
                )}

                {(formData.educationLevel === 'undergraduate' || formData.educationLevel === 'graduate') && (
                  <div>
                    <Label htmlFor="major">Major/Field of Study *</Label>
                    <Input
                      id="major"
                      value={formData.major || ''}
                      onChange={(e) => handleInputChange('major', e.target.value)}
                      className={errors.major ? 'border-red-500' : ''}
                    />
                    {errors.major && (
                      <p className="text-sm text-red-500 mt-1">{errors.major}</p>
                    )}
                  </div>
                )}

                <div>
                  <Label htmlFor="school">School/Institution *</Label>
                  <Input
                    id="school"
                    value={formData.school || ''}
                    onChange={(e) => handleInputChange('school', e.target.value)}
                    className={errors.school ? 'border-red-500' : ''}
                  />
                  {errors.school && (
                    <p className="text-sm text-red-500 mt-1">{errors.school}</p>
                  )}
                </div>

                {(formData.educationLevel === 'ordinary-level' || formData.educationLevel === 'advanced-level') && (
                  <div>
                    <Label htmlFor="examResults">Exam Results</Label>
                    <Textarea
                      id="examResults"
                      placeholder="Enter exam results (e.g., A's in Mathematics, Science, English)"
                      value={formData.examResults || ''}
                      onChange={(e) => handleInputChange('examResults', e.target.value)}
                      rows={2}
                    />
                  </div>
                )}

                {(formData.educationLevel === 'undergraduate' || formData.educationLevel === 'graduate') && (
                  <div>
                    <Label htmlFor="gpa">GPA</Label>
                    <Input
                      id="gpa"
                      type="number"
                      step="0.1"
                      min="0"
                      max="4"
                      value={formData.gpa || ''}
                      onChange={(e) => handleInputChange('gpa', parseFloat(e.target.value))}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Location Information
                </CardTitle>
                <CardDescription>
                  Geographic location details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="district">District *</Label>
                    <Select 
                      value={formData.district || ''} 
                      onValueChange={(value) => handleInputChange('district', value)}
                    >
                      <SelectTrigger className={errors.district ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Colombo">Colombo</SelectItem>
                        <SelectItem value="Gampaha">Gampaha</SelectItem>
                        <SelectItem value="Kalutara">Kalutara</SelectItem>
                        <SelectItem value="Kandy">Kandy</SelectItem>
                        <SelectItem value="Matale">Matale</SelectItem>
                        <SelectItem value="Nuwara Eliya">Nuwara Eliya</SelectItem>
                        <SelectItem value="Galle">Galle</SelectItem>
                        <SelectItem value="Matara">Matara</SelectItem>
                        <SelectItem value="Hambantota">Hambantota</SelectItem>
                        <SelectItem value="Jaffna">Jaffna</SelectItem>
                        <SelectItem value="Kilinochchi">Kilinochchi</SelectItem>
                        <SelectItem value="Mannar">Mannar</SelectItem>
                        <SelectItem value="Vavuniya">Vavuniya</SelectItem>
                        <SelectItem value="Mullaitivu">Mullaitivu</SelectItem>
                        <SelectItem value="Batticaloa">Batticaloa</SelectItem>
                        <SelectItem value="Ampara">Ampara</SelectItem>
                        <SelectItem value="Trincomalee">Trincomalee</SelectItem>
                        <SelectItem value="Kurunegala">Kurunegala</SelectItem>
                        <SelectItem value="Puttalam">Puttalam</SelectItem>
                        <SelectItem value="Anuradhapura">Anuradhapura</SelectItem>
                        <SelectItem value="Polonnaruwa">Polonnaruwa</SelectItem>
                        <SelectItem value="Badulla">Badulla</SelectItem>
                        <SelectItem value="Moneragala">Moneragala</SelectItem>
                        <SelectItem value="Ratnapura">Ratnapura</SelectItem>
                        <SelectItem value="Kegalle">Kegalle</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.district && (
                      <p className="text-sm text-red-500 mt-1">{errors.district}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="province">Province *</Label>
                    <Select 
                      value={formData.province || ''} 
                      onValueChange={(value) => handleInputChange('province', value)}
                    >
                      <SelectTrigger className={errors.province ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Western">Western</SelectItem>
                        <SelectItem value="Central">Central</SelectItem>
                        <SelectItem value="Southern">Southern</SelectItem>
                        <SelectItem value="Northern">Northern</SelectItem>
                        <SelectItem value="Eastern">Eastern</SelectItem>
                        <SelectItem value="North Western">North Western</SelectItem>
                        <SelectItem value="North Central">North Central</SelectItem>
                        <SelectItem value="Uva">Uva</SelectItem>
                        <SelectItem value="Sabaragamuwa">Sabaragamuwa</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.province && (
                      <p className="text-sm text-red-500 mt-1">{errors.province}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Statement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Personal Statement
                </CardTitle>
                <CardDescription>
                  Tell us about yourself, your goals, and why you need support
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
                  <Label htmlFor="goals">Educational Goals *</Label>
                  <Textarea
                    id="goals"
                    placeholder="What are your educational goals and aspirations?"
                    value={formData.goals || ''}
                    onChange={(e) => handleInputChange('goals', e.target.value)}
                    rows={3}
                    className={errors.goals ? 'border-red-500' : ''}
                  />
                  {errors.goals && (
                    <p className="text-sm text-red-500 mt-1">{errors.goals}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="challenges">Challenges *</Label>
                  <Textarea
                    id="challenges"
                    placeholder="What challenges are you facing in your education?"
                    value={formData.challenges || ''}
                    onChange={(e) => handleInputChange('challenges', e.target.value)}
                    rows={3}
                    className={errors.challenges ? 'border-red-500' : ''}
                  />
                  {errors.challenges && (
                    <p className="text-sm text-red-500 mt-1">{errors.challenges}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="whyNeedSupport">Why You Need Support *</Label>
                  <Textarea
                    id="whyNeedSupport"
                    placeholder="Explain why you need financial support for your education..."
                    value={formData.whyNeedSupport || ''}
                    onChange={(e) => handleInputChange('whyNeedSupport', e.target.value)}
                    rows={3}
                    className={errors.whyNeedSupport ? 'border-red-500' : ''}
                  />
                  {errors.whyNeedSupport && (
                    <p className="text-sm text-red-500 mt-1">{errors.whyNeedSupport}</p>
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
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
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
                  {saving ? 'Creating...' : 'Create Student'}
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
                  <span className="text-sm text-muted-foreground">Total Students:</span>
                  <span className="text-sm">—</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">New ID:</span>
                  <span className="text-sm">Auto</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Default Points:</span>
                  <span className="text-sm">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Monthly Points:</span>
                  <span className="text-sm">50,000</span>
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
                  <p>• Provide detailed information in personal statements</p>
                  <p>• Ensure contact information is accurate</p>
                  <p>• Double-check education level and grade</p>
                  <p>• Select the correct district and province</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}