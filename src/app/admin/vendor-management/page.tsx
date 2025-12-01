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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
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
  Globe
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
  status: 'active' | 'inactive' | 'pending' | 'suspended'
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
  averageRating?: number
  totalReviews?: number
  responseTime?: string
  fulfillmentRate?: number
  profileImage?: string
  documents?: {
    businessRegistration?: string
    taxCertificate?: string
    bankStatement?: string
    identification?: string
  }
  verificationStatus?: 'verified' | 'pending' | 'rejected'
  notes?: string
}

interface VendorStats {
  totalVendors: number
  activeVendors: number
  pendingVendors: number
  inactiveVendors: number
  totalRevenue: number
  totalOrders: number
  averageRating: number
  topCategories: Array<{
    category: string
    count: number
    revenue: number
  }>
}

export default function VendorManagementPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [stats, setStats] = useState<VendorStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Form states
  const [editForm, setEditForm] = useState<Partial<Vendor>>({})
  const [newVendor, setNewVendor] = useState<Partial<Vendor>>({
    name: '',
    category: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    bankAccount: '',
    bankName: '',
    status: 'pending',
    description: '',
    businessType: 'sole_proprietorship',
    verificationStatus: 'pending'
  })

  useEffect(() => {
    loadVendors()
    loadStats()
  }, [])

  const loadVendors = () => {
    const mockVendors: Vendor[] = [
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
        status: "active",
        totalOrders: 45,
        totalAmount: 225000,
        lastPaymentDate: "2024-02-25",
        nextPaymentDate: "2024-03-25",
        joinDate: "2023-06-15",
        description: "Leading educational bookstore in Sri Lanka",
        website: "https://bookhaven.lk",
        businessRegistration: "BR123456789",
        taxId: "TX987654321",
        businessType: "corporation",
        employeeCount: 12,
        establishedYear: 2018,
        averageRating: 4.8,
        totalReviews: 127,
        responseTime: "2 hours",
        fulfillmentRate: 98,
        verificationStatus: "verified",
        documents: {
          businessRegistration: "verified",
          taxCertificate: "verified",
          bankStatement: "verified",
          identification: "verified"
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
        status: "active",
        totalOrders: 23,
        totalAmount: 460000,
        lastPaymentDate: "2024-02-25",
        nextPaymentDate: "2024-03-25",
        joinDate: "2023-08-20",
        description: "Technology solutions for education",
        businessType: "llc",
        employeeCount: 8,
        establishedYear: 2020,
        averageRating: 4.6,
        totalReviews: 89,
        responseTime: "1 hour",
        fulfillmentRate: 95,
        verificationStatus: "verified"
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
        status: "pending",
        totalOrders: 0,
        totalAmount: 0,
        lastPaymentDate: "",
        nextPaymentDate: "",
        joinDate: "2024-03-01",
        description: "School uniforms and accessories",
        businessType: "sole_proprietorship",
        employeeCount: 5,
        establishedYear: 2019,
        averageRating: 0,
        totalReviews: 0,
        responseTime: "3 hours",
        fulfillmentRate: 0,
        verificationStatus: "pending",
        documents: {
          businessRegistration: "pending",
          taxCertificate: "pending",
          bankStatement: "pending",
          identification: "pending"
        },
        notes: "Awaiting document verification"
      },
      {
        id: 4,
        name: "Stationery Hub",
        category: "Stationery",
        contactPerson: "Mrs. Kumari",
        email: "info@stationeryhub.lk",
        phone: "+94 112 333 444",
        address: "321 Stationery St, Galle",
        bankAccount: "7777777777",
        bankName: "Sampath Bank",
        status: "inactive",
        totalOrders: 15,
        totalAmount: 75000,
        lastPaymentDate: "2024-01-25",
        nextPaymentDate: "",
        joinDate: "2023-10-10",
        description: "Complete stationery solutions",
        businessType: "partnership",
        employeeCount: 3,
        establishedYear: 2021,
        averageRating: 4.2,
        totalReviews: 34,
        responseTime: "4 hours",
        fulfillmentRate: 88,
        verificationStatus: "verified"
      },
      {
        id: 5,
        name: "Educational Equipment Co",
        category: "Equipment",
        contactPerson: "Dr. Wijesinghe",
        email: "contact@eduequip.lk",
        phone: "+94 112 555 666",
        address: "654 Equipment Ave, Jaffna",
        bankAccount: "8888888888",
        bankName: "Hatton National Bank",
        status: "suspended",
        totalOrders: 8,
        totalAmount: 120000,
        lastPaymentDate: "2023-12-25",
        nextPaymentDate: "",
        joinDate: "2023-05-05",
        description: "Educational equipment and supplies",
        businessType: "corporation",
        employeeCount: 15,
        establishedYear: 2017,
        averageRating: 3.8,
        totalReviews: 21,
        responseTime: "6 hours",
        fulfillmentRate: 75,
        verificationStatus: "verified",
        notes: "Suspended due to quality issues and customer complaints"
      }
    ]

    setVendors(mockVendors)
    setLoading(false)
  }

  const loadStats = () => {
    const mockStats: VendorStats = {
      totalVendors: 5,
      activeVendors: 2,
      pendingVendors: 1,
      inactiveVendors: 1,
      totalRevenue: 880000,
      totalOrders: 91,
      averageRating: 4.4,
      topCategories: [
        { category: "Books", count: 1, revenue: 225000 },
        { category: "Technology", count: 1, revenue: 460000 },
        { category: "Stationery", count: 1, revenue: 75000 },
        { category: "Uniforms", count: 1, revenue: 0 },
        { category: "Equipment", count: 1, revenue: 120000 }
      ]
    }
    setStats(mockStats)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "inactive":
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>
      case "suspended":
        return <Badge className="bg-orange-100 text-orange-800">Suspended</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getVerificationBadge = (status?: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getDocumentStatus = (status?: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || vendor.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleApproveVendor = (vendorId: number) => {
    setVendors(prev => prev.map(v => 
      v.id === vendorId 
        ? { ...v, status: 'active', verificationStatus: 'verified' }
        : v
    ))
  }

  const handleRejectVendor = (vendorId: number) => {
    setVendors(prev => prev.map(v => 
      v.id === vendorId 
        ? { ...v, status: 'inactive', verificationStatus: 'rejected' }
        : v
    ))
  }

  const handleSuspendVendor = (vendorId: number) => {
    setVendors(prev => prev.map(v => 
      v.id === vendorId 
        ? { ...v, status: 'suspended' }
        : v
    ))
  }

  const handleActivateVendor = (vendorId: number) => {
    setVendors(prev => prev.map(v => 
      v.id === vendorId 
        ? { ...v, status: 'active' }
        : v
    ))
  }

  const handleSaveEdit = () => {
    if (selectedVendor && editForm) {
      setVendors(prev => prev.map(v => 
        v.id === selectedVendor.id 
          ? { ...v, ...editForm } as Vendor
          : v
      ))
      setIsEditOpen(false)
      setSelectedVendor(null)
    }
  }

  const handleAddVendor = () => {
    const vendorObj: Vendor = {
      id: vendors.length + 1,
      name: newVendor.name || '',
      category: newVendor.category || '',
      contactPerson: newVendor.contactPerson || '',
      email: newVendor.email || '',
      phone: newVendor.phone || '',
      address: newVendor.address || '',
      bankAccount: newVendor.bankAccount || '',
      bankName: newVendor.bankName || '',
      status: newVendor.status as any || 'pending',
      totalOrders: 0,
      totalAmount: 0,
      lastPaymentDate: '',
      nextPaymentDate: '',
      joinDate: new Date().toISOString().split('T')[0],
      description: newVendor.description || '',
      businessType: newVendor.businessType as any,
      verificationStatus: newVendor.verificationStatus as any,
      employeeCount: newVendor.employeeCount || 0,
      establishedYear: newVendor.establishedYear || new Date().getFullYear(),
      averageRating: 0,
      totalReviews: 0,
      responseTime: "24 hours",
      fulfillmentRate: 0
    }

    setVendors([...vendors, vendorObj])
    setIsAddOpen(false)
    setNewVendor({
      name: '',
      category: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      bankAccount: '',
      bankName: '',
      status: 'pending',
      description: '',
      businessType: 'sole_proprietorship',
      verificationStatus: 'pending'
    })
  }

  const openVendorDetail = (vendor: Vendor) => {
    setSelectedVendor(vendor)
    setEditForm(vendor)
    setIsDetailOpen(true)
  }

  const openEditDialog = (vendor: Vendor) => {
    setSelectedVendor(vendor)
    setEditForm(vendor)
    setIsEditOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading vendor management...</p>
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
              <h1 className="text-3xl font-bold">Vendor Management</h1>
              <p className="text-muted-foreground">
                Manage vendors, applications, and performance
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Vendor
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Vendor</DialogTitle>
                    <DialogDescription>
                      Register a new vendor on the platform
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Business Name</Label>
                        <Input
                          id="name"
                          value={newVendor.name || ''}
                          onChange={(e) => setNewVendor(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter business name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={newVendor.category || ''} onValueChange={(value) => setNewVendor(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contactPerson">Contact Person</Label>
                        <Input
                          id="contactPerson"
                          value={newVendor.contactPerson || ''}
                          onChange={(e) => setNewVendor(prev => ({ ...prev, contactPerson: e.target.value }))}
                          placeholder="Enter contact person"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newVendor.email || ''}
                          onChange={(e) => setNewVendor(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={newVendor.phone || ''}
                          onChange={(e) => setNewVendor(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={newVendor.address || ''}
                          onChange={(e) => setNewVendor(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="Enter business address"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input
                          id="bankName"
                          value={newVendor.bankName || ''}
                          onChange={(e) => setNewVendor(prev => ({ ...prev, bankName: e.target.value }))}
                          placeholder="Enter bank name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bankAccount">Bank Account</Label>
                        <Input
                          id="bankAccount"
                          value={newVendor.bankAccount || ''}
                          onChange={(e) => setNewVendor(prev => ({ ...prev, bankAccount: e.target.value }))}
                          placeholder="Enter account number"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newVendor.description || ''}
                        onChange={(e) => setNewVendor(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter business description"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="businessType">Business Type</Label>
                        <Select value={newVendor.businessType || ''} onValueChange={(value) => setNewVendor(prev => ({ ...prev, businessType: value as any }))}>
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
                      <div>
                        <Label htmlFor="employeeCount">Employee Count</Label>
                        <Input
                          id="employeeCount"
                          type="number"
                          value={newVendor.employeeCount || ''}
                          onChange={(e) => setNewVendor(prev => ({ ...prev, employeeCount: parseInt(e.target.value) }))}
                          placeholder="Enter employee count"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddVendor}>
                        Add Vendor
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalVendors}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeVendors} active, {stats.pendingVendors} pending
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  From {stats.totalOrders} orders
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageRating}/5.0</div>
                <p className="text-xs text-muted-foreground">
                  Across all vendors
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingVendors}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting review
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
                    placeholder="Search vendors..."
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="stationery">Stationery</SelectItem>
                    <SelectItem value="uniforms">Uniforms</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vendors Table */}
        <Card>
          <CardHeader>
            <CardTitle>Vendors</CardTitle>
            <CardDescription>Manage and monitor all vendors on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={vendor.profileImage} />
                          <AvatarFallback>{vendor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{vendor.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {vendor.totalOrders} orders • {vendor.totalAmount.toLocaleString()} pts
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{vendor.category}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{vendor.contactPerson}</div>
                        <div className="text-muted-foreground">{vendor.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                    <TableCell>{getVerificationBadge(vendor.verificationStatus)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span>{vendor.averageRating || 'N/A'}</span>
                        </div>
                        <div className="text-muted-foreground">
                          {vendor.fulfillmentRate || 0}% fulfillment
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openVendorDetail(vendor)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(vendor)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        {vendor.status === 'pending' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleApproveVendor(vendor.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleRejectVendor(vendor.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        
                        {vendor.status === 'active' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleSuspendVendor(vendor.id)}
                            className="text-orange-600 hover:text-orange-700"
                          >
                            <AlertTriangle className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {vendor.status === 'suspended' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleActivateVendor(vendor.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Vendor Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Vendor Details</DialogTitle>
              <DialogDescription>
                Detailed information about {selectedVendor?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedVendor && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={selectedVendor.profileImage} />
                          <AvatarFallback>{selectedVendor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{selectedVendor.name}</h3>
                          <p className="text-sm text-muted-foreground">{selectedVendor.category}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedVendor.contactPerson}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedVendor.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedVendor.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedVendor.address}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Status</span>
                          {getStatusBadge(selectedVendor.status)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Verification</span>
                          {getVerificationBadge(selectedVendor.verificationStatus)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Member Since</span>
                          <span className="text-sm">{selectedVendor.joinDate}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 border rounded-lg">
                          <div className="text-2xl font-bold">{selectedVendor.totalOrders}</div>
                          <div className="text-sm text-muted-foreground">Total Orders</div>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                          <div className="text-2xl font-bold">{selectedVendor.totalAmount.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Total Revenue</div>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                          <div className="text-2xl font-bold">{selectedVendor.averageRating || 'N/A'}</div>
                          <div className="text-sm text-muted-foreground">Average Rating</div>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                          <div className="text-2xl font-bold">{selectedVendor.fulfillmentRate || 0}%</div>
                          <div className="text-sm text-muted-foreground">Fulfillment Rate</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Response Time</span>
                          <span className="text-sm font-medium">{selectedVendor.responseTime}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Total Reviews</span>
                          <span className="text-sm font-medium">{selectedVendor.totalReviews}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Employees</span>
                          <span className="text-sm font-medium">{selectedVendor.employeeCount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Est. Year</span>
                          <span className="text-sm font-medium">{selectedVendor.establishedYear}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Documents */}
                <Card>
                  <CardHeader>
                    <CardTitle>Document Verification</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        {getDocumentStatus(selectedVendor.documents?.businessRegistration)}
                        <div>
                          <div className="text-sm font-medium">Business Registration</div>
                          <div className="text-xs text-muted-foreground">
                            {selectedVendor.documents?.businessRegistration || 'Not submitted'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        {getDocumentStatus(selectedVendor.documents?.taxCertificate)}
                        <div>
                          <div className="text-sm font-medium">Tax Certificate</div>
                          <div className="text-xs text-muted-foreground">
                            {selectedVendor.documents?.taxCertificate || 'Not submitted'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        {getDocumentStatus(selectedVendor.documents?.bankStatement)}
                        <div>
                          <div className="text-sm font-medium">Bank Statement</div>
                          <div className="text-xs text-muted-foreground">
                            {selectedVendor.documents?.bankStatement || 'Not submitted'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        {getDocumentStatus(selectedVendor.documents?.identification)}
                        <div>
                          <div className="text-sm font-medium">Identification</div>
                          <div className="text-xs text-muted-foreground">
                            {selectedVendor.documents?.identification || 'Not submitted'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes */}
                {selectedVendor.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{selectedVendor.notes}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={() => {
                    setIsDetailOpen(false)
                    openEditDialog(selectedVendor)
                  }}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Vendor
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Vendor Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Vendor</DialogTitle>
              <DialogDescription>
                Update vendor information and settings
              </DialogDescription>
            </DialogHeader>
            {selectedVendor && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editName">Business Name</Label>
                    <Input
                      id="editName"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editStatus">Status</Label>
                    <Select value={editForm.status || ''} onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value as any }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editContactPerson">Contact Person</Label>
                    <Input
                      id="editContactPerson"
                      value={editForm.contactPerson || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, contactPerson: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editEmail">Email</Label>
                    <Input
                      id="editEmail"
                      value={editForm.email || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editPhone">Phone</Label>
                    <Input
                      id="editPhone"
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editAddress">Address</Label>
                    <Input
                      id="editAddress"
                      value={editForm.address || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="editDescription">Description</Label>
                  <Textarea
                    id="editDescription"
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="editNotes">Notes</Label>
                  <Textarea
                    id="editNotes"
                    value={editForm.notes || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={2}
                    placeholder="Add any additional notes about this vendor"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEdit}>
                    Save Changes
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