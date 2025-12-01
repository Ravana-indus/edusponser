'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { GraduationCap, ArrowLeft, CheckCircle, AlertCircle, Heart, CreditCard, Users } from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/layout/Navigation"
import { supabase } from '@/lib/supabase/client'

export default function DonorRegister() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    company: "",
    occupation: "",
    annualIncome: "",
    bio: "",
    motivation: "",
    studentPreference: "",
    communicationFrequency: "monthly",
    anonymous: false,
    agreeToTerms: false
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
    if (!formData.occupation.trim()) newErrors.occupation = "Occupation is required"
    if (!formData.annualIncome) newErrors.annualIncome = "Please select your annual income range"
    if (!formData.bio.trim()) newErrors.bio = "Bio is required"
    if (!formData.motivation.trim()) newErrors.motivation = "Motivation is required"
    if (!formData.studentPreference) newErrors.studentPreference = "Please select your preference"
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms and conditions"
    
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
            role: 'donor', 
            first_name: formData.firstName, 
            last_name: formData.lastName,
            username: formData.email.split('@')[0]
          },
          emailRedirectTo: `${siteUrl}/auth/callback`
        }
      })
      if (signErr) throw signErr
      const insert: any = {
        name: `DONOR-${Date.now()}`,
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
        status: 'active',
        join_date: new Date().toISOString().split('T')[0],
        total_donated: 0,
        total_points: 0,
      }
      await supabase.from('donors').insert(insert)
      setIsSubmitting(false)
      setIsSubmitted(true)
    } catch (err) {
      setIsSubmitting(false)
      setErrors(prev => ({ ...prev, email: 'Failed to sign up. Please try again.' }))
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
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
            <CardTitle>Welcome to EduSponsor!</CardTitle>
            <CardDescription>
              Thank you for becoming a donor. You'll be matched with a student within 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Monthly Contribution</span>
                  <Badge variant="secondary">$50</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Points to Student</span>
                  <Badge variant="default">50,000</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Your first donation will be processed on the 1st of next month. You'll receive updates about your sponsored student's progress.
              </p>
            </div>
            <Button asChild className="w-full">
              <Link href="/donor/dashboard">Go to Donor Dashboard</Link>
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
            <Badge variant="secondary" className="mb-4">Donor Registration</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Become a Sponsor</h1>
            <p className="text-lg text-muted-foreground">
              Transform a student's life with just $50 per month. Your contribution becomes 50,000 points for educational resources.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">$50/month</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Affordable monthly commitment
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Auto-matched</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Automatically paired with a student
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">50,000 pts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monthly points to your student
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Donor Information</CardTitle>
              <CardDescription>
                Tell us about yourself and your motivation to support education
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
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="occupation">Occupation *</Label>
                    <Input
                      id="occupation"
                      value={formData.occupation}
                      onChange={(e) => handleInputChange("occupation", e.target.value)}
                      className={errors.occupation ? "border-red-500" : ""}
                    />
                    {errors.occupation && (
                      <p className="text-sm text-red-500 mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.occupation}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="annualIncome">Annual Income Range *</Label>
                  <Select value={formData.annualIncome} onValueChange={(value) => handleInputChange("annualIncome", value)}>
                    <SelectTrigger className={errors.annualIncome ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select your annual income range" />
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
                    <p className="text-sm text-red-500 mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.annualIncome}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="bio">Personal Bio *</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself, your background, and what you're passionate about..."
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
                  <Label htmlFor="motivation">Why do you want to support education? *</Label>
                  <Textarea
                    id="motivation"
                    placeholder="Share your motivation for becoming a donor and what you hope to achieve..."
                    value={formData.motivation}
                    onChange={(e) => handleInputChange("motivation", e.target.value)}
                    className={errors.motivation ? "border-red-500" : ""}
                    rows={3}
                  />
                  {errors.motivation && (
                    <p className="text-sm text-red-500 mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.motivation}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="studentPreference">Student Preference *</Label>
                  <Select value={formData.studentPreference} onValueChange={(value) => handleInputChange("studentPreference", value)}>
                    <SelectTrigger className={errors.studentPreference ? "border-red-500" : ""}>
                      <SelectValue placeholder="What type of student would you prefer to support?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any student in need</SelectItem>
                      <SelectItem value="stem">STEM students</SelectItem>
                      <SelectItem value="arts">Arts & Humanities</SelectItem>
                      <SelectItem value="business">Business & Economics</SelectItem>
                      <SelectItem value="healthcare">Healthcare & Medicine</SelectItem>
                      <SelectItem value="undergraduate">Undergraduate students</SelectItem>
                      <SelectItem value="graduate">Graduate students</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.studentPreference && (
                    <p className="text-sm text-red-500 mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.studentPreference}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="communicationFrequency">Communication Preference</Label>
                  <Select value={formData.communicationFrequency} onValueChange={(value) => handleInputChange("communicationFrequency", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly updates</SelectItem>
                      <SelectItem value="monthly">Monthly updates</SelectItem>
                      <SelectItem value="quarterly">Quarterly updates</SelectItem>
                      <SelectItem value="minimal">Minimal communication</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="anonymous"
                      checked={formData.anonymous}
                      onCheckedChange={(checked) => handleInputChange("anonymous", checked as boolean)}
                    />
                    <Label htmlFor="anonymous">I wish to remain anonymous to my sponsored student</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                      className={errors.agreeToTerms ? "border-red-500" : ""}
                    />
                    <Label htmlFor="agreeToTerms" className={errors.agreeToTerms ? "text-red-500" : ""}>
                      I agree to the terms and conditions and understand that $50 will be charged monthly *
                    </Label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.agreeToTerms}
                    </p>
                  )}
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">What happens next?</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• You'll be matched with a student within 24 hours</li>
                    <li>• Your first $50 donation will be charged on the 1st of next month</li>
                    <li>• Your student will receive 50,000 points monthly</li>
                    <li>• You'll receive updates based on your communication preference</li>
                    <li>• You can cancel or pause your sponsorship at any time</li>
                  </ul>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Creating Your Account..." : "Become a Donor - $50/month"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}