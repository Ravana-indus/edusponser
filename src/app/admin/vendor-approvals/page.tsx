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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Search,
  Filter,
  Download,
  RefreshCw,
  Building,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Package,
  Users,
  Star,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  FileText,
  Settings,
  Zap,
  Shield,
  Banknote,
  Award,
  Globe,
  Eye,
  Edit,
  MessageSquare,
  Check,
  X,
  Upload,
  Download as DownloadIcon,
  File,
  Image,
  User,
  CreditCard,
  FileCheck,
  FileX,
  ThumbsUp,
  ThumbsDown,
  Info
} from "lucide-react"
import Navigation from "@/components/layout/Navigation"

interface VendorApplication {
  id: number
  name: string
  category: string
  contactPerson: string
  email: string
  phone: string
  address: string
  bankAccount: string
  bankName: string
  description: string
  website?: string
  businessRegistration?: string
  taxId?: string
  businessType?: 'sole_proprietorship' | 'partnership' | 'corporation' | 'llc'
  employeeCount?: number
  establishedYear?: number
  applicationDate: string
  status: 'pending' | 'under_review' | 'approved' | 'rejected'
  verificationStatus: 'not_started' | 'in_progress' | 'verified' | 'failed'
  documents: {
    businessRegistration?: {
      status: 'not_uploaded' | 'pending' | 'approved' | 'rejected'
      file?: string
      notes?: string
    }
    taxCertificate?: {
      status: 'not_uploaded' | 'pending' | 'approved' | 'rejected'
      file?: string
      notes?: string
    }
    bankStatement?: {
      status: 'not_uploaded' | 'pending' | 'approved' | 'rejected'
      file?: string
      notes?: string
    }
    identification?: {
      status: 'not_uploaded' | 'pending' | 'approved' | 'rejected'
      file?: string
      notes?: string
    }
    proofOfAddress?: {
      status: 'not_uploaded' | 'pending' | 'approved' | 'rejected'
      file?: string
      notes?: string
    }
  }
  reviewNotes?: string
  reviewer?: string
  reviewDate?: string
  rejectionReason?: string
  riskScore?: number
  complianceCheck?: {
    passed: boolean
    issues: string[]
    lastChecked: string
  }
}

interface ApprovalStats {
  totalApplications: number
  pendingReview: number
  underReview: number
  approved: number
  rejected: number
  averageProcessingTime: string
  completionRate: number
}

export default function VendorApprovalsPage() {
  const [applications, setApplications] = useState<VendorApplication[]>([])
  const [stats, setStats] = useState<ApprovalStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<VendorApplication | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [verificationFilter, setVerificationFilter] = useState('all')

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    decision: 'approved' as 'approved' | 'rejected',
    notes: '',
    documentReviews: {} as Record<string, { status: 'approved' | 'rejected'; notes: string }>
  })

  useEffect(() => {
    loadApplications()
    loadStats()
  }, [])

  const loadApplications = () => {
    const mockApplications: VendorApplication[] = [
      {
        id: 1,
        name: "Book Haven",
        category: "Books",
        contactPerson: "Mr. Silva",
        email: "books@bookhaven.lk",
        phone: "+94 112 345 678",
        address: "123 Main St, Colombo",
        bankAccount: "1234567890",
        bankName: "Bank of Ceylon",
        description: "Leading educational bookstore in Sri Lanka, providing quality textbooks, workbooks, and educational materials to students across all education levels.",
        website: "https://bookhaven.lk",
        businessRegistration: "BR123456789",
        taxId: "TX987654321",
        businessType: "corporation",
        employeeCount: 12,
        establishedYear: 2018,
        applicationDate: "2024-03-01",
        status: "pending",
        verificationStatus: "in_progress",
        documents: {
          businessRegistration: {
            status: "approved",
            file: "/docs/br_123456789.pdf",
            notes: "Document verified and matches registration records"
          },
          taxCertificate: {
            status: "pending",
            file: "/docs/tax_987654321.pdf",
            notes: "Awaiting verification with tax department"
          },
          bankStatement: {
            status: "approved",
            file: "/docs/bank_123456789.pdf",
            notes: "Account verified and active"
          },
          identification: {
            status: "approved",
            file: "/docs/id_silva.pdf",
            notes: "Identity verified"
          },
          proofOfAddress: {
            status: "not_uploaded",
            notes: "Proof of address not provided"
          }
        },
        riskScore: 25,
        complianceCheck: {
          passed: true,
          issues: [],
          lastChecked: "2024-03-10"
        }
      },
      {
        id: 2,
        name: "Tech Solutions",
        category: "Technology",
        contactPerson: "Ms. Perera",
        email: "contact@techsolutions.lk",
        phone: "+94 112 987 654",
        address: "456 Tech Park, Colombo",
        bankAccount: "0987654321",
        bankName: "Commercial Bank",
        description: "Technology solutions for education, including laptops, tablets, and educational software.",
        businessType: "llc",
        employeeCount: 8,
        establishedYear: 2020,
        applicationDate: "2024-03-05",
        status: "under_review",
        verificationStatus: "in_progress",
        documents: {
          businessRegistration: {
            status: "approved",
            file: "/docs/br_tech.pdf",
            notes: "Business registration verified"
          },
          taxCertificate: {
            status: "approved",
            file: "/docs/tax_tech.pdf",
            notes: "Tax certificate verified"
          },
          bankStatement: {
            status: "pending",
            file: "/docs/bank_tech.pdf",
            notes: "Bank statement under review"
          },
          identification: {
            status: "approved",
            file: "/docs/id_perera.pdf",
            notes: "Identity verified"
          },
          proofOfAddress: {
            status: "approved",
            file: "/docs/address_tech.pdf",
            notes: "Proof of address verified"
          }
        },
        riskScore: 35,
        complianceCheck: {
          passed: true,
          issues: ["Bank statement requires additional verification"],
          lastChecked: "2024-03-12"
        }
      },
      {
        id: 3,
        name: "Uniform World",
        category: "Uniforms",
        contactPerson: "Mr. Fernando",
        email: "sales@uniformworld.lk",
        phone: "+94 112 111 222",
        address: "789 School Rd, Kandy",
        bankAccount: "5555555555",
        bankName: "People's Bank",
        description: "School uniforms and accessories for all education levels.",
        businessType: "sole_proprietorship",
        employeeCount: 5,
        establishedYear: 2019,
        applicationDate: "2024-03-10",
        status: "pending",
        verificationStatus: "not_started",
        documents: {
          businessRegistration: {
            status: "pending",
            file: "/docs/br_uniform.pdf",
            notes: "Business registration uploaded for review"
          },
          taxCertificate: {
            status: "not_uploaded",
            notes: "Tax certificate not uploaded"
          },
          bankStatement: {
            status: "not_uploaded",
            notes: "Bank statement not uploaded"
          },
          identification: {
            status: "pending",
            file: "/docs/id_fernando.pdf",
            notes: "Identification uploaded for review"
          },
          proofOfAddress: {
            status: "not_uploaded",
            notes: "Proof of address not uploaded"
          }
        },
        riskScore: 60,
        complianceCheck: {
          passed: false,
          issues: ["Multiple documents missing", "Incomplete application"],
          lastChecked: "2024-03-10"
        }
      },
      {
        id: 4,
        name: "Educational Equipment Co",
        category: "Equipment",
        contactPerson: "Dr. Wijesinghe",
        email: "contact@eduequip.lk",
        phone: "+94 112 555 666",
        address: "654 Equipment Ave, Jaffna",
        bankAccount: "8888888888",
        bankName: "Hatton National Bank",
        description: "Educational equipment and supplies for schools and universities.",
        businessRegistration: "BR987654321",
        taxId: "TX123456789",
        businessType: "corporation",
        employeeCount: 15,
        establishedYear: 2017,
        applicationDate: "2024-02-28",
        status: "rejected",
        verificationStatus: "failed",
        documents: {
          businessRegistration: {
            status: "rejected",
            file: "/docs/br_eduequip.pdf",
            notes: "Business registration expired"
          },
          taxCertificate: {
            status: "rejected",
            file: "/docs/tax_eduequip.pdf",
            notes: "Tax certificate invalid"
          },
          bankStatement: {
            status: "rejected",
            file: "/docs/bank_eduequip.pdf",
            notes: "Bank account inactive"
          },
          identification: {
            status: "approved",
            file: "/docs/id_wijesinghe.pdf",
            notes: "Identity verified"
          },
          proofOfAddress: {
            status: "rejected",
            file: "/docs/address_eduequip.pdf",
            notes: "Address proof invalid"
          }
        },
        reviewNotes: "Application rejected due to invalid business registration and expired tax certificate. Bank account appears to be inactive.",
        reviewer: "Admin User",
        reviewDate: "2024-03-01",
        rejectionReason: "Invalid documents and inactive bank account",
        riskScore: 85,
        complianceCheck: {
          passed: false,
          issues: ["Business registration expired", "Tax certificate invalid", "Bank account inactive", "Address proof invalid"],
          lastChecked: "2024-03-01"
        }
      }
    ]

    setApplications(mockApplications)
    setLoading(false)
  }

  const loadStats = () => {
    const mockStats: ApprovalStats = {
      totalApplications: 4,
      pendingReview: 2,
      underReview: 1,
      approved: 0,
      rejected: 1,
      averageProcessingTime: "5 days",
      completionRate: 25
    }
    setStats(mockStats)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "under_review":
        return <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case "not_started":
        return <Badge variant="outline">Not Started</Badge>
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getDocumentStatus = (status: string) => {
    switch (status) {
      case "not_uploaded":
        return { icon: <FileX className="h-4 w-4 text-gray-500" />, color: "text-gray-500" }
      case "pending":
        return { icon: <Clock className="h-4 w-4 text-yellow-500" />, color: "text-yellow-500" }
      case "approved":
        return { icon: <FileCheck className="h-4 w-4 text-green-500" />, color: "text-green-500" }
      case "rejected":
        return { icon: <XCircle className="h-4 w-4 text-red-500" />, color: "text-red-500" }
      default:
        return { icon: <File className="h-4 w-4 text-gray-500" />, color: "text-gray-500" }
    }
  }

  const getRiskScoreColor = (score: number) => {
    if (score <= 30) return "text-green-600"
    if (score <= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getRiskScoreLabel = (score: number) => {
    if (score <= 30) return "Low Risk"
    if (score <= 60) return "Medium Risk"
    return "High Risk"
  }

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    const matchesVerification = verificationFilter === 'all' || app.verificationStatus === verificationFilter

    return matchesSearch && matchesStatus && matchesVerification
  })

  const handleStartReview = (application: VendorApplication) => {
    setSelectedApplication(application)
    setReviewForm({
      decision: 'approved',
      notes: '',
      documentReviews: {}
    })
    setIsReviewOpen(true)
  }

  const handleSubmitReview = () => {
    if (selectedApplication) {
      const updatedApplications = applications.map(app => 
        app.id === selectedApplication.id 
          ? { 
              ...app, 
              status: reviewForm.decision,
              verificationStatus: reviewForm.decision === 'approved' ? 'verified' : 'failed',
              reviewNotes: reviewForm.notes,
              reviewer: "Admin User",
              reviewDate: new Date().toISOString().split('T')[0],
              rejectionReason: reviewForm.decision === 'rejected' ? reviewForm.notes : undefined
            }
          : app
      )
      setApplications(updatedApplications)
      setIsReviewOpen(false)
      setSelectedApplication(null)
    }
  }

  const handleApproveApplication = (applicationId: number) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { 
            ...app, 
            status: 'approved',
            verificationStatus: 'verified',
            reviewer: "Admin User",
            reviewDate: new Date().toISOString().split('T')[0]
          }
        : app
    ))
  }

  const handleRejectApplication = (applicationId: number, reason: string) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { 
            ...app, 
            status: 'rejected',
            verificationStatus: 'failed',
            rejectionReason: reason,
            reviewer: "Admin User",
            reviewDate: new Date().toISOString().split('T')[0]
          }
        : app
    ))
  }

  const openApplicationDetail = (application: VendorApplication) => {
    setSelectedApplication(application)
    setIsDetailOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading vendor approvals...</p>
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
        firstName: "Admin",
        lastName: "User",
        email: "admin@edusponsor.com",
        role: "admin"
      }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Vendor Approvals</h1>
              <p className="text-muted-foreground">
                Review and approve vendor applications
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
              <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalApplications}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.completionRate}% completion rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingReview}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting review
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Under Review</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.underReview}</div>
                <p className="text-xs text-muted-foreground">
                  Currently being reviewed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageProcessingTime}</div>
                <p className="text-xs text-muted-foreground">
                  Per application
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Verification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Verification</SelectItem>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Vendor Applications</CardTitle>
            <CardDescription>Review and manage vendor applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Vendor</th>
                    <th className="text-left p-4">Category</th>
                    <th className="text-left p-4">Contact</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Verification</th>
                    <th className="text-left p-4">Risk Score</th>
                    <th className="text-left p-4">Applied</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((application) => (
                    <tr key={application.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{application.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{application.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {application.businessType?.replace('_', ' ').toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{application.category}</td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div>{application.contactPerson}</div>
                          <div className="text-muted-foreground">{application.email}</div>
                        </div>
                      </td>
                      <td className="p-4">{getStatusBadge(application.status)}</td>
                      <td className="p-4">{getVerificationBadge(application.verificationStatus)}</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <span className={`font-medium ${getRiskScoreColor(application.riskScore || 0)}`}>
                            {application.riskScore || 0}
                          </span>
                          <span className={`text-xs ${getRiskScoreColor(application.riskScore || 0)}`}>
                            ({getRiskScoreLabel(application.riskScore || 0)})
                          </span>
                        </div>
                      </td>
                      <td className="p-4">{application.applicationDate}</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" onClick={() => openApplicationDetail(application)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {application.status === 'pending' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleStartReview(application)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {application.status === 'under_review' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleApproveApplication(application.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  const reason = prompt("Please provide rejection reason:")
                                  if (reason) handleRejectApplication(application.id, reason)
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Application Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
              <DialogDescription>
                Detailed review of vendor application for {selectedApplication?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedApplication && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Business Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>{selectedApplication.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{selectedApplication.name}</h3>
                          <p className="text-sm text-muted-foreground">{selectedApplication.category}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedApplication.contactPerson}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedApplication.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedApplication.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedApplication.address}</span>
                        </div>
                        {selectedApplication.website && (
                          <div className="flex items-center space-x-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <a href={selectedApplication.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                              {selectedApplication.website}
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Business Type</span>
                          <span className="text-sm font-medium">{selectedApplication.businessType?.replace('_', ' ').toUpperCase()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Employees</span>
                          <span className="text-sm font-medium">{selectedApplication.employeeCount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Established</span>
                          <span className="text-sm font-medium">{selectedApplication.establishedYear}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Applied</span>
                          <span className="text-sm font-medium">{selectedApplication.applicationDate}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Application Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 border rounded-lg">
                          <div className="text-sm font-medium">Application Status</div>
                          <div className="mt-1">{getStatusBadge(selectedApplication.status)}</div>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                          <div className="text-sm font-medium">Verification Status</div>
                          <div className="mt-1">{getVerificationBadge(selectedApplication.verificationStatus)}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Risk Score</span>
                          <div className="flex items-center space-x-2">
                            <span className={`font-medium ${getRiskScoreColor(selectedApplication.riskScore || 0)}`}>
                              {selectedApplication.riskScore || 0}
                            </span>
                            <span className={`text-xs ${getRiskScoreColor(selectedApplication.riskScore || 0)}`}>
                              ({getRiskScoreLabel(selectedApplication.riskScore || 0)})
                            </span>
                          </div>
                        </div>
                      </div>

                      {selectedApplication.complianceCheck && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Compliance Check</span>
                            {selectedApplication.complianceCheck.passed ? (
                              <Badge className="bg-green-100 text-green-800">Passed</Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800">Failed</Badge>
                            )}
                          </div>
                          {selectedApplication.complianceCheck.issues.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              Issues: {selectedApplication.complianceCheck.issues.join(', ')}
                            </div>
                          )}
                        </div>
                      )}

                      {selectedApplication.reviewNotes && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Review Notes</div>
                          <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                            {selectedApplication.reviewNotes}
                          </div>
                        </div>
                      )}

                      {selectedApplication.rejectionReason && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-red-600">Rejection Reason</div>
                          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                            {selectedApplication.rejectionReason}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Documents */}
                <Card>
                  <CardHeader>
                    <CardTitle>Document Verification</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(selectedApplication.documents).map(([docType, doc]) => (
                        <div key={docType} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {getDocumentStatus(doc.status).icon}
                              <span className="text-sm font-medium capitalize">
                                {docType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </span>
                            </div>
                            <span className={`text-xs ${getDocumentStatus(doc.status).color}`}>
                              {doc.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          
                          {doc.file && (
                            <div className="text-xs text-muted-foreground mb-2">
                              File: {doc.file.split('/').pop()}
                            </div>
                          )}
                          
                          {doc.notes && (
                            <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                              {doc.notes}
                            </div>
                          )}
                          
                          <div className="flex space-x-2 mt-2">
                            {doc.file && (
                              <Button variant="outline" size="sm">
                                <DownloadIcon className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              <Upload className="h-3 w-3 mr-1" />
                              Replace
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>Business Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedApplication.description}</p>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                    Close
                  </Button>
                  {selectedApplication.status === 'pending' && (
                    <Button onClick={() => {
                      setIsDetailOpen(false)
                      handleStartReview(selectedApplication)
                    }}>
                      <Edit className="mr-2 h-4 w-4" />
                      Start Review
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Review Dialog */}
        <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Review Application</DialogTitle>
              <DialogDescription>
                Review and make decision on vendor application for {selectedApplication?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedApplication && (
              <div className="space-y-6">
                {/* Application Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Application Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-sm font-medium">Risk Score</div>
                        <div className={`text-lg font-bold ${getRiskScoreColor(selectedApplication.riskScore || 0)}`}>
                          {selectedApplication.riskScore || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {getRiskScoreLabel(selectedApplication.riskScore || 0)}
                        </div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-sm font-medium">Documents</div>
                        <div className="text-lg font-bold">
                          {Object.values(selectedApplication.documents).filter(doc => doc.status === 'approved').length}/
                          {Object.keys(selectedApplication.documents).length}
                        </div>
                        <div className="text-xs text-muted-foreground">Verified</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-sm font-medium">Compliance</div>
                        <div className="text-lg font-bold">
                          {selectedApplication.complianceCheck?.passed ? 'Pass' : 'Fail'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {selectedApplication.complianceCheck?.issues.length || 0} issues
                        </div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-sm font-medium">Business Type</div>
                        <div className="text-lg font-bold">
                          {selectedApplication.businessType?.replace('_', ' ').toUpperCase()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {selectedApplication.employeeCount} employees
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Document Review */}
                <Card>
                  <CardHeader>
                    <CardTitle>Document Review</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(selectedApplication.documents).map(([docType, doc]) => (
                        <div key={docType} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getDocumentStatus(doc.status).icon}
                            <div>
                              <div className="text-sm font-medium capitalize">
                                {docType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {doc.file ? doc.file.split('/').pop() : 'Not uploaded'}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Select 
                              value={reviewForm.documentReviews[docType]?.status || doc.status === 'approved' ? 'approved' : 'rejected'}
                              onValueChange={(value) => setReviewForm(prev => ({
                                ...prev,
                                documentReviews: {
                                  ...prev.documentReviews,
                                  [docType]: {
                                    status: value as 'approved' | 'rejected',
                                    notes: prev.documentReviews[docType]?.notes || ''
                                  }
                                }
                              }))}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="approved">Approve</SelectItem>
                                <SelectItem value="rejected">Reject</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              placeholder="Notes..."
                              value={reviewForm.documentReviews[docType]?.notes || ''}
                              onChange={(e) => setReviewForm(prev => ({
                                ...prev,
                                documentReviews: {
                                  ...prev.documentReviews,
                                  [docType]: {
                                    ...prev.documentReviews[docType],
                                    notes: e.target.value
                                  }
                                }
                              }))}
                              className="w-48"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Decision */}
                <Card>
                  <CardHeader>
                    <CardTitle>Final Decision</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="decision">Decision</Label>
                      <Select value={reviewForm.decision} onValueChange={(value) => setReviewForm(prev => ({ ...prev, decision: value as 'approved' | 'rejected' }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="approved">Approve Application</SelectItem>
                          <SelectItem value="rejected">Reject Application</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="reviewNotes">Review Notes</Label>
                      <Textarea
                        id="reviewNotes"
                        value={reviewForm.notes}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Provide detailed notes about your decision..."
                        rows={4}
                      />
                    </div>

                    {reviewForm.decision === 'rejected' && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2 text-red-600">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-sm font-medium">Rejection requires detailed justification</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsReviewOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitReview}>
                    {reviewForm.decision === 'approved' ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve Application
                      </>
                    ) : (
                      <>
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject Application
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}