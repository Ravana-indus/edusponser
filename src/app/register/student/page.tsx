'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/layout/Navigation"
import { supabase } from '@/lib/supabase/client'

export default function StudentRegister() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    age: "",
    educationLevel: "",
    school: "",
    major: "",
    gpa: "",
    bio: "",
    goals: "",
    challenges: "",
    whyNeedSupport: ""
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.password || formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    if (!formData.age || parseInt(formData.age) < 16 || parseInt(formData.age) > 35) {
      newErrors.age = "Age must be between 16 and 35"
    }
    if (!formData.educationLevel) newErrors.educationLevel = "Education level is required"
    if (!formData.school.trim()) newErrors.school = "School name is required"
    if (!formData.major.trim()) newErrors.major = "Major/Field of study is required"
    if (!formData.gpa || parseFloat(formData.gpa) < 0 || parseFloat(formData.gpa) > 4) {
      newErrors.gpa = "GPA must be between 0 and 4"
    }
    if (!formData.bio.trim()) newErrors.bio = "Bio is required"
    if (!formData.goals.trim()) newErrors.goals = "Educational goals are required"
    if (!formData.challenges.trim()) newErrors.challenges = "Challenges description is required"
    if (!formData.whyNeedSupport.trim()) newErrors.whyNeedSupport = "This field is required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    try {
      const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
      const { error: signErr } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { 
            role: 'student', 
            first_name: formData.firstName, 
            last_name: formData.lastName,
            username: formData.email.split('@')[0]
          },
          emailRedirectTo: `${siteUrl}/auth/callback`
        }
      })
      if (signErr) throw signErr
      const insert: any = {
        name: `ST-${Date.now()}`,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        age: Number(formData.age),
        education_level: formData.educationLevel,
        school: formData.school,
        major: formData.major,
        gpa: formData.gpa ? Number(formData.gpa) : null,
        bio: formData.bio,
        goals: formData.goals,
        challenges: formData.challenges,
        why_need_support: formData.whyNeedSupport,
        status: 'pending',
        join_date: new Date().toISOString().split('T')[0],
        total_points: 0,
      }
      await supabase.from('students').insert(insert)
      setIsSubmitting(false)
      setIsSubmitted(true)
    } catch (err) {
      setIsSubmitting(false)
      setErrors(prev => ({ ...prev, email: 'Failed to sign up. Please try again.' }))
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle>Application Submitted!</CardTitle>
            <CardDescription>
              Thank you for applying to EduSponsor. We'll review your application and match you with a donor soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              You'll receive an email confirmation within 24 hours. Our team will carefully review your application and reach out with next steps.
            </p>
            <Button asChild className="w-full">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">Student Application</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Apply for Educational Sponsorship</h1>
            <p className="text-lg text-muted-foreground">
              Join our community of motivated students and get the support you need to achieve your educational goals.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Tell us about yourself and your educational journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500 mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500 mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500 mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={errors.password ? "border-red-500" : ""}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500 mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.password}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className={errors.confirmPassword ? "border-red-500" : ""}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500 mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      className={errors.age ? "border-red-500" : ""}
                    />
                    {errors.age && (
                      <p className="text-sm text-red-500 mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.age}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="educationLevel">Education Level *</Label>
                    <Select value={formData.educationLevel} onValueChange={(value) => handleInputChange("educationLevel", value)}>
                      <SelectTrigger className={errors.educationLevel ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high-school">High School</SelectItem>
                        <SelectItem value="undergraduate">Undergraduate</SelectItem>
                        <SelectItem value="graduate">Graduate</SelectItem>
                        <SelectItem value="postgraduate">Postgraduate</SelectItem>
                        <SelectItem value="vocational">Vocational Training</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.educationLevel && (
                      <p className="text-sm text-red-500 mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.educationLevel}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="school">School/Institution *</Label>
                    <Input
                      id="school"
                      value={formData.school}
                      onChange={(e) => handleInputChange("school", e.target.value)}
                      className={errors.school ? "border-red-500" : ""}
                    />
                    {errors.school && (
                      <p className="text-sm text-red-500 mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.school}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="major">Major/Field of Study *</Label>
                    <Input
                      id="major"
                      value={formData.major}
                      onChange={(e) => handleInputChange("major", e.target.value)}
                      className={errors.major ? "border-red-500" : ""}
                    />
                    {errors.major && (
                      <p className="text-sm text-red-500 mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.major}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="gpa">GPA (0-4 scale) *</Label>
                  <Input
                    id="gpa"
                    type="number"
                    step="0.01"
                    value={formData.gpa}
                    onChange={(e) => handleInputChange("gpa", e.target.value)}
                    className={errors.gpa ? "border-red-500" : ""}
                  />
                  {errors.gpa && (
                    <p className="text-sm text-red-500 mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.gpa}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="bio">Personal Bio *</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself, your background, and what drives you..."
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    className={errors.bio ? "border-red-500" : ""}
                    rows={3}
                  />
                  {errors.bio && (
                    <p className="text-sm text-red-500 mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.bio}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="goals">Educational Goals *</Label>
                  <Textarea
                    id="goals"
                    placeholder="What are your educational goals and aspirations?"
                    value={formData.goals}
                    onChange={(e) => handleInputChange("goals", e.target.value)}
                    className={errors.goals ? "border-red-500" : ""}
                    rows={3}
                  />
                  {errors.goals && (
                    <p className="text-sm text-red-500 mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.goals}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="challenges">Current Challenges *</Label>
                  <Textarea
                    id="challenges"
                    placeholder="Describe any challenges or obstacles you're facing in your education..."
                    value={formData.challenges}
                    onChange={(e) => handleInputChange("challenges", e.target.value)}
                    className={errors.challenges ? "border-red-500" : ""}
                    rows={3}
                  />
                  {errors.challenges && (
                    <p className="text-sm text-red-500 mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.challenges}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="whyNeedSupport">Why Do You Need Support? *</Label>
                  <Textarea
                    id="whyNeedSupport"
                    placeholder="Explain why you're seeking sponsorship and how it will help you achieve your goals..."
                    value={formData.whyNeedSupport}
                    onChange={(e) => handleInputChange("whyNeedSupport", e.target.value)}
                    className={errors.whyNeedSupport ? "border-red-500" : ""}
                    rows={3}
                  />
                  {errors.whyNeedSupport && (
                    <p className="text-sm text-red-500 mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.whyNeedSupport}
                    </p>
                  )}
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">What happens next?</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• We review your application within 3-5 business days</li>
                    <li>• If approved, you'll be matched with a donor</li>
                    <li>• You'll receive 50,000 points monthly ($50 value)</li>
                    <li>• Points can be used for educational expenses</li>
                  </ul>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting Application..." : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}