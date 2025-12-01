'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Globe, 
  Edit,
  Save,
  Camera,
  Calendar,
  DollarSign,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Banknote,
  FileText,
  Star,
  Award,
  Users
} from "lucide-react"
import Navigation from "@/components/layout/Navigation"

interface Vendor {
  id: number
  name: string
  category: string
  contactPerson: string
  email: string
  phone: string
  address: string
  bankAccount: string
  bankName: string
  status: 'active' | 'inactive' | 'pending'
  totalOrders: number
  totalAmount: number
  lastPaymentDate: string
  nextPaymentDate: string
  joinDate: string
  description: string
  website?: string
  businessRegistration?: string
  taxId?: string
  businessType?: 'sole_proprietorship' | 'partnership' | 'corporation' | 'llc'
  employeeCount?: number
  establishedYear?: number
  specialties?: string[]
  certifications?: string[]
  averageRating?: number
  totalReviews?: number
  responseTime?: string
  fulfillmentRate?: number
  profileImage?: string
  coverImage?: string
}

export default function VendorProfilePage() {
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editForm, setEditForm] = useState<Partial<Vendor>>({})

  useEffect(() => {
    // Load vendor data
    const mockVendor: Vendor = {
      id: 1,
      name: "Book Haven",
      category: "books",
      contactPerson: "Mr. Silva",
      email: "books@bookhaven.lk",
      phone: "+94 112 345 678",
      address: "123 Main St, Colombo",
      bankAccount: "1234567890",
      bankName: "Bank of Ceylon",
      status: "active",
      totalOrders: 45,
      totalAmount: 225000,
      lastPaymentDate: "2024-02-25",
      nextPaymentDate: "2024-03-25",
      joinDate: "2023-06-15",
      description: "Leading educational bookstore in Sri Lanka, providing quality textbooks, workbooks, and educational materials to students across all education levels.",
      website: "https://bookhaven.lk",
      businessRegistration: "BR123456789",
      taxId: "TX987654321",
      businessType: "corporation",
      employeeCount: 12,
      establishedYear: 2018,
      specialties: ["Educational Books", "Stationery", "School Supplies", "Digital Learning Materials"],
      certifications: ["Ministry of Education Approved", "ISO 9001:2015 Certified"],
      averageRating: 4.8,
      totalReviews: 127,
      responseTime: "2 hours",
      fulfillmentRate: 98,
      profileImage: "/placeholder-vendor.jpg",
      coverImage: "/placeholder-cover.jpg"
    }

    setVendor(mockVendor)
    setEditForm(mockVendor)
    setLoading(false)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "inactive":
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleSave = () => {
    if (vendor && editForm) {
      setVendor({ ...vendor, ...editForm } as Vendor)
      setIsEditing(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setEditForm(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading vendor profile...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Navigation user={{
        id: 1,
        firstName: vendor?.contactPerson || "Vendor",
        lastName: "",
        email: vendor?.email || "",
        role: "vendor"
      }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Vendor Profile</h1>
              <p className="text-muted-foreground">
                Manage your business information and settings
              </p>
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Cover Image and Profile */}
        <div className="relative mb-8">
          <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg overflow-hidden">
            <img 
              src={vendor?.coverImage} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>
          
          <div className="absolute -bottom-16 left-8 flex items-end space-x-4">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarImage src={vendor?.profileImage} />
                <AvatarFallback className="text-2xl">{vendor?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-bold text-white">{vendor?.name}</h2>
                {getStatusBadge(vendor?.status || '')}
              </div>
              <p className="text-white/80">{vendor?.category}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>Basic details about your business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          value={editForm.name || ''}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={editForm.category || ''} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="books">Books</SelectItem>
                            <SelectItem value="stationery">Stationery</SelectItem>
                            <SelectItem value="uniforms">Uniforms</SelectItem>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="equipment">Equipment</SelectItem>
                            <SelectItem value="fees">Fees</SelectItem>
                            <SelectItem value="transport">Transport</SelectItem>
                            <SelectItem value="meals">Meals</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={editForm.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={editForm.website || ''}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="businessType">Business Type</Label>
                        <Select value={editForm.businessType || ''} onValueChange={(value) => handleInputChange('businessType', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="corporation">Corporation</SelectItem>
                            <SelectItem value="llc">LLC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="establishedYear">Established Year</Label>
                        <Input
                          id="establishedYear"
                          type="number"
                          value={editForm.establishedYear || ''}
                          onChange={(e) => handleInputChange('establishedYear', parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="employeeCount">Employee Count</Label>
                        <Input
                          id="employeeCount"
                          type="number"
                          value={editForm.employeeCount || ''}
                          onChange={(e) => handleInputChange('employeeCount', parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="businessRegistration">Business Registration</Label>
                        <Input
                          id="businessRegistration"
                          value={editForm.businessRegistration || ''}
                          onChange={(e) => handleInputChange('businessRegistration', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">{vendor?.name}</h3>
                      <p className="text-muted-foreground">{vendor?.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{vendor?.businessType?.replace('_', ' ').toUpperCase()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Est. {vendor?.establishedYear}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{vendor?.employeeCount} employees</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{vendor?.businessRegistration}</span>
                      </div>
                    </div>

                    {vendor?.website && (
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {vendor.website}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>How customers and administrators can reach you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactPerson">Contact Person</Label>
                      <Input
                        id="contactPerson"
                        value={editForm.contactPerson || ''}
                        onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={editForm.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={editForm.address || ''}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{vendor?.contactPerson}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{vendor?.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{vendor?.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{vendor?.address}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Specializations & Certifications */}
            <Card>
              <CardHeader>
                <CardTitle>Specializations & Certifications</CardTitle>
                <CardDescription>Your areas of expertise and professional qualifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="specialties">Specialties (comma-separated)</Label>
                      <Input
                        id="specialties"
                        value={editForm.specialties?.join(', ') || ''}
                        onChange={(e) => handleInputChange('specialties', e.target.value.split(',').map(s => s.trim()))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="certifications">Certifications (comma-separated)</Label>
                      <Input
                        id="certifications"
                        value={editForm.certifications?.join(', ') || ''}
                        onChange={(e) => handleInputChange('certifications', e.target.value.split(',').map(s => s.trim()))}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Specialties</h4>
                      <div className="flex flex-wrap gap-2">
                        {vendor?.specialties?.map((specialty, index) => (
                          <Badge key={index} variant="outline">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Certifications</h4>
                      <div className="flex flex-wrap gap-2">
                        {vendor?.certifications?.map((cert, index) => (
                          <Badge key={index} className="bg-green-100 text-green-800">
                            <Award className="h-3 w-3 mr-1" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Your business performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Rating</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{vendor?.averageRating}/5.0</div>
                    <div className="text-xs text-muted-foreground">{vendor?.totalReviews} reviews</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Fulfillment Rate</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{vendor?.fulfillmentRate}%</div>
                    <div className="text-xs text-muted-foreground">On-time delivery</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Response Time</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{vendor?.responseTime}</div>
                    <div className="text-xs text-muted-foreground">Average</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Total Revenue</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{vendor?.totalAmount.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Points earned</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>Bank account details for payments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Banknote className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{vendor?.bankName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-mono">{vendor?.bankAccount}</span>
                </div>
                
                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Last Payment</span>
                    <span>{vendor?.lastPaymentDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Next Payment</span>
                    <span>{vendor?.nextPaymentDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Information */}
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
                <CardDescription>Your current account status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Current Status</span>
                  {getStatusBadge(vendor?.status || '')}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span>Member Since</span>
                  <span>{vendor?.joinDate}</span>
                </div>

                {vendor?.status === 'active' && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Your account is in good standing</span>
                  </div>
                )}

                {vendor?.status === 'pending' && (
                  <div className="flex items-center space-x-2 text-yellow-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">Your account is under review</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}