'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  GraduationCap, 
  Heart, 
  TrendingUp, 
  Calendar, 
  CreditCard, 
  MessageCircle, 
  Settings,
  LogOut,
  Star,
  Award,
  BookOpen,
  Target,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Shield,
  Plus,
  Edit,
  Eye,
  Package,
  Trash2,
  Save,
  X,
  Search,
  Filter,
  Download,
  ShoppingCart,
  Minus,
  Home,
  School,
  FileText,
  Heart as HealthIcon,
  Globe,
  Languages,
  UserCheck,
  DollarSign,
  MinusCircle,
  PlusCircle
} from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/layout/Navigation"
import { useAuth } from "@/lib/frappe/auth"
import AuthGuard from "@/components/auth/AuthGuard"
import { 
  useStudentData, 
  useStudentGoals, 
  useStudentUpdates, 
  usePointsTransactions, 
  useSponsorship,
  useNotifications,
  useProfileManagement,
  useCatalog,
  useShoppingCart
} from "@/hooks/useSupabaseData"

export default function StudentDashboard() {
  return (
    <AuthGuard requiredRole="student">
      <StudentDashboardContent />
    </AuthGuard>
  )
}

function StudentDashboardContent() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isHydrated, setIsHydrated] = useState(false)
  useEffect(() => { setIsHydrated(true) }, [])

  // Authentication
  const auth = useAuth()
  const { user, isAuthenticated, getUserRole } = auth
  
  // Determine student identifier for data fetching
  const studentIdentifier = user?.email || user?.username
  
  // Use Supabase hooks for real data
  const { student, loading: studentLoading, error: studentError, refetch: refetchStudent } = useStudentData(studentIdentifier)
  const { goals, createGoal, updateGoal } = useStudentGoals(student?.name)
  const { updates, createUpdate, updateStudentUpdate, deleteStudentUpdate } = useStudentUpdates(student?.name)
  const { transactions } = usePointsTransactions(student?.name, 50)
  const { sponsorship } = useSponsorship(student?.name)
  const { notifications, unreadCount, markAsRead } = useNotifications('student', student?.name)
  const { updateProfile } = useProfileManagement(student?.name)
  
  // Catalog and shopping cart hooks
  const { items: catalogItems, categories, loading: catalogLoading } = useCatalog()
  const { 
    cartItems, 
    addToCart, 
    updateCartItem, 
    removeFromCart, 
    clearCart, 
    checkout, 
    getTotalPoints, 
    getTotalItems 
  } = useShoppingCart(student?.name)
  
  // Dialog states
  const [isCreateUpdateOpen, setIsCreateUpdateOpen] = useState(false)
  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [isShoppingOpen, setIsShoppingOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [editingUpdate, setEditingUpdate] = useState<any>(null)
  const [editingGoal, setEditingGoal] = useState<any>(null)

  // Form states
  const [updateFormData, setUpdateFormData] = useState({
    title: "",
    content: "",
    type: "academic" as 'academic' | 'project' | 'personal' | 'milestone'
  })

  const [goalFormData, setGoalFormData] = useState({
    title: "",
    description: "",
    target_date: "",
    status: "active"
  })

  const [profileFormData, setProfileFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    age: undefined as number | undefined,
    district: "",
    province: "",
    grade: undefined as number | undefined,
    major: "",
    stream: "",
    gpa: undefined as number | undefined,
    exam_results: "",
    bio: "",
    goals: "",
    challenges: "",
    why_need_support: "",
    school_address: "",
    school_phone: "",
    school_principal: "",
    school_type: "",
    student_class: "",
    index_number: "",
    blood_group: "",
    nationality: "",
    religion: "",
    languages: "",
    health_insurance_status: "",
    health_insurance_provider: "",
    grama_niladharai_division: "",
    grama_niladharai_name: "",
    grama_niladharai_contact: ""
  })

  // Filter states
  const [transactionFilter, setTransactionFilter] = useState("all")
  const [updatesFilter, setUpdatesFilter] = useState("all")
  const [catalogFilter, setCatalogFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize profile form when student data loads
  useEffect(() => {
    if (student) {
      setProfileFormData({
        first_name: student.first_name || "",
        last_name: student.last_name || "",
        phone: student.phone || "",
        age: student.age || undefined,
        district: student.district || "",
        province: student.province || "",
        grade: student.grade || undefined,
        major: student.major || "",
        stream: student.stream || "",
        gpa: student.gpa || undefined,
        exam_results: student.exam_results || "",
        bio: student.bio || "",
        goals: student.goals || "",
        challenges: student.challenges || "",
        why_need_support: student.why_need_support || "",
        school_address: student.school_address || "",
        school_phone: student.school_phone || "",
        school_principal: student.school_principal || "",
        school_type: student.school_type || "",
        student_class: student.student_class || "",
        index_number: student.index_number || "",
        blood_group: student.blood_group || "",
        nationality: student.nationality || "",
        religion: student.religion || "",
        languages: student.languages || "",
        health_insurance_status: student.health_insurance_status || "",
        health_insurance_provider: student.health_insurance_provider || "",
        grama_niladharai_division: student.grama_niladharai_division || "",
        grama_niladharai_name: student.grama_niladharai_name || "",
        grama_niladharai_contact: student.grama_niladharai_contact || ""
      })
    }
  }, [student])

  // Simple utility functions with hydration safety
  const formatPoints = (points: number) => {
    if (!isHydrated) return '0'
    return points?.toLocaleString() || '0'
  }
  const formatCurrency = (amount: number) => `$${amount || 0}`
  const formatDate = (date: string) => {
    if (!isHydrated || !date) return ''
    try {
      return new Date(date).toLocaleDateString()
    } catch {
      return date
    }
  }
  const formatDateTime = (date: string) => {
    if (!isHydrated || !date) return ''
    try {
      return new Date(date).toLocaleString()
    } catch {
      return date
    }
  }
  const extractInitials = (name: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??'

  // Handlers
  const handleCreateUpdate = async () => {
    if (!student?.name || !updateFormData.title.trim() || !updateFormData.content.trim()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const result = await createUpdate({
        title: updateFormData.title,
        content: updateFormData.content,
        type: updateFormData.type,
        is_public: true
      })
      
      if (result) {
        setUpdateFormData({ title: "", content: "", type: "academic" })
        setIsCreateUpdateOpen(false)
      }
    } catch (error) {
      console.error('Failed to create update:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditUpdate = async () => {
    if (!editingUpdate || !updateFormData.title.trim() || !updateFormData.content.trim()) {
      return
    }

    setIsSubmitting(true)

    try {
      const result = await updateStudentUpdate(editingUpdate.name, {
        title: updateFormData.title,
        content: updateFormData.content,
        type: updateFormData.type
      })

      if (result) {
        setEditingUpdate(null)
        setUpdateFormData({ title: "", content: "", type: "academic" })
      }
    } catch (error) {
      console.error('Failed to update:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteUpdate = async (updateName: string) => {
    if (!confirm('Are you sure you want to delete this update?')) return

    const success = await deleteStudentUpdate(updateName)
    if (!success) {
      alert('Failed to delete update')
    }
  }

  const handleCreateGoal = async () => {
    if (!student?.name || !goalFormData.title.trim()) {
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createGoal({
        title: goalFormData.title,
        description: goalFormData.description,
        target_date: goalFormData.target_date,
        status: goalFormData.status
      })

      if (result) {
        setGoalFormData({ title: "", description: "", target_date: "", status: "active" })
        setIsCreateGoalOpen(false)
      }
    } catch (error) {
      console.error('Failed to create goal:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateProfile = async () => {
    if (!student?.name) return

    setIsSubmitting(true)

    try {
      const result = await updateProfile(profileFormData)
      if (result) {
        setIsEditProfileOpen(false)
        refetchStudent() // Refresh student data
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddToCart = async (itemName: string) => {
    const success = await addToCart(itemName, 1)
    if (success) {
      // Show success feedback
    }
  }

  const handleCheckout = async () => {
    if (getTotalPoints() > (student?.available_points || 0)) {
      alert('Insufficient points for this purchase')
      return
    }

    const success = await checkout()
    if (success) {
      alert('Purchase successful!')
      setIsCartOpen(false)
      refetchStudent() // Refresh student data
    } else {
      alert('Purchase failed. Please try again.')
    }
  }

  // Get sponsorship status
  const getSponsorshipStatus = () => {
    if (!student) {
      return { status: 'pending', label: 'Loading...', color: 'yellow' }
    }
    
    if (student.status === 'pending') {
      return { status: 'pending', label: 'Pending Approval', color: 'yellow' }
    }
    
    if (sponsorship?.status === 'active') {
      return { status: 'sponsored', label: 'Sponsored', color: 'green' }
    }
    
    return { status: 'unsponsored', label: 'Seeking Sponsor', color: 'red' }
  }

  const sponsorshipStatus = getSponsorshipStatus()

  // Filter data
  const filteredTransactions = transactions?.filter(t => {
    if (transactionFilter === 'all') return true
    if (transactionFilter === 'earned') return t.amount > 0
    if (transactionFilter === 'spent') return t.amount < 0
    return true
  }) || []

  const filteredUpdates = updates?.filter(u => {
    if (updatesFilter === 'all') return true
    return u.type === updatesFilter
  }) || []

  const filteredCatalogItems = catalogItems.filter(item => {
    const matchesCategory = catalogFilter === 'all' || item.category === catalogFilter
    const matchesSearch = searchTerm === '' || 
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  // Prevent hydration mismatches
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  // Loading state after hydration
  if (studentLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading student data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Error state
  if (studentError || !student) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">Error loading student data</p>
              <p className="text-muted-foreground mb-4">Please try again later</p>
              <Button onClick={() => refetchStudent()}>Retry</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Navigation />
      
      {/* Notification Bell and Cart */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <div className="relative">
          <Button variant="outline" size="sm" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart className="h-4 w-4" />
            {getTotalItems() > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                {getTotalItems()}
              </Badge>
            )}
          </Button>
        </div>
        <div className="relative">
          <Button variant="outline" size="sm" onClick={() => setActiveTab("notifications")}>
            <MessageCircle className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {student.first_name}!</h1>
            <p className="text-muted-foreground">
              Here's your educational journey overview
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsCreateUpdateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Update
            </Button>
            <Button variant="outline" onClick={() => setIsCreateGoalOpen(true)}>
              <Target className="mr-2 h-4 w-4" />
              New Goal
            </Button>
            <Button variant="outline" onClick={() => setIsShoppingOpen(true)}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Shop
            </Button>
          </div>
        </div>

        {/* Shopping Cart Dialog */}
        <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Shopping Cart</DialogTitle>
              <DialogDescription>
                Review your items before checkout
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Your cart is empty
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.catalog_item?.item_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatPoints(item.unit_points)} pts each
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateCartItem(item.name, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateCartItem(item.name, item.quantity + 1)}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-medium">{formatPoints(item.total_points)} pts</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total: {formatPoints(getTotalPoints())} points</span>
                      <span>Available: {formatPoints(student.available_points || 0)} points</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleCheckout} 
                      disabled={getTotalPoints() > (student.available_points || 0)}
                      className="flex-1"
                    >
                      Checkout
                    </Button>
                    <Button variant="outline" onClick={() => clearCart()}>
                      Clear Cart
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Shopping Dialog */}
        <Dialog open={isShoppingOpen} onOpenChange={setIsShoppingOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Educational Items Catalog</DialogTitle>
              <DialogDescription>
                Browse and add items to your cart
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={catalogFilter} onValueChange={setCatalogFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.category_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {filteredCatalogItems.map((item) => (
                  <Card key={item.name} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold">{item.item_name}</h3>
                          {item.description && (
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-lg font-bold text-primary">
                            {formatPoints(item.point_price)} pts
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => handleAddToCart(item.name)}
                          >
                            Add to Cart
                          </Button>
                        </div>
                        {item.stock_quantity !== null && (
                          <div className="text-xs text-muted-foreground">
                            Stock: {item.stock_quantity}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredCatalogItems.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No items found matching your criteria
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* All other dialogs from the previous version... */}
        {/* Create Update Dialog */}
        <Dialog open={isCreateUpdateOpen} onOpenChange={setIsCreateUpdateOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Update</DialogTitle>
              <DialogDescription>
                Share your progress and achievements with your sponsor
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="update-title">Title</Label>
                <Input
                  id="update-title"
                  placeholder="Enter update title"
                  value={updateFormData.title}
                  onChange={(e) => setUpdateFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="update-type">Type</Label>
                <Select
                  value={updateFormData.type}
                  onValueChange={(value) => setUpdateFormData(prev => ({ ...prev, type: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="milestone">Milestone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="update-content">Content</Label>
                <Textarea
                  id="update-content"
                  placeholder="Share your update..."
                  rows={4}
                  value={updateFormData.content}
                  onChange={(e) => setUpdateFormData(prev => ({ ...prev, content: e.target.value }))}
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={handleCreateUpdate} 
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Creating...' : 'Create Update'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateUpdateOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isCreateGoalOpen} onOpenChange={setIsCreateGoalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription>
                Set a new educational or personal goal to track your progress
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="goal-title">Goal Title</Label>
                <Input
                  id="goal-title"
                  placeholder="Enter goal title"
                  value={goalFormData.title}
                  onChange={(e) => setGoalFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="goal-description">Description</Label>
                <Textarea
                  id="goal-description"
                  placeholder="Describe your goal..."
                  rows={3}
                  value={goalFormData.description}
                  onChange={(e) => setGoalFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="goal-date">Target Date</Label>
                <Input
                  id="goal-date"
                  type="date"
                  value={goalFormData.target_date}
                  onChange={(e) => setGoalFormData(prev => ({ ...prev, target_date: e.target.value }))}
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={handleCreateGoal} 
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Creating...' : 'Create Goal'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateGoalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Enhanced Profile Edit Dialog */}
        <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Update your comprehensive profile information
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first-name">First Name</Label>
                    <Input
                      id="first-name"
                      value={profileFormData.first_name}
                      onChange={(e) => setProfileFormData(prev => ({ ...prev, first_name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                      id="last-name"
                      value={profileFormData.last_name}
                      onChange={(e) => setProfileFormData(prev => ({ ...prev, last_name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileFormData.phone}
                      onChange={(e) => setProfileFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={profileFormData.age || ''}
                      onChange={(e) => setProfileFormData(prev => ({ ...prev, age: parseInt(e.target.value) || undefined }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="blood-group">Blood Group</Label>
                    <Select
                      value={profileFormData.blood_group}
                      onValueChange={(value) => setProfileFormData(prev => ({ ...prev, blood_group: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input
                      id="nationality"
                      value={profileFormData.nationality}
                      onChange={(e) => setProfileFormData(prev => ({ ...prev, nationality: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="religion">Religion</Label>
                    <Input
                      id="religion"
                      value={profileFormData.religion}
                      onChange={(e) => setProfileFormData(prev => ({ ...prev, religion: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="languages">Languages</Label>
                    <Input
                      id="languages"
                      placeholder="e.g., Sinhala, English, Tamil"
                      value={profileFormData.languages}
                      onChange={(e) => setProfileFormData(prev => ({ ...prev, languages: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      rows={3}
                      value={profileFormData.bio}
                      onChange={(e) => setProfileFormData(prev => ({ ...prev, bio: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="goals-text">Goals</Label>
                    <Textarea
                      id="goals-text"
                      rows={3}
                      value={profileFormData.goals}
                      onChange={(e) => setProfileFormData(prev => ({ ...prev, goals: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="challenges">Challenges</Label>
                    <Textarea
                      id="challenges"
                      rows={3}
                      value={profileFormData.challenges}
                      onChange={(e) => setProfileFormData(prev => ({ ...prev, challenges: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="why-need-support">Why Need Support</Label>
                    <Textarea
                      id="why-need-support"
                      rows={3}
                      value={profileFormData.why_need_support}
                      onChange={(e) => setProfileFormData(prev => ({ ...prev, why_need_support: e.target.value }))}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="education" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="grade">Grade</Label>
                    <Input
                      id="grade"
                      type="number"
                      value={profileFormData.grade || ''}
                      onChange={(e) => setProfileFormData(prev => ({ ...prev, grade: parseInt(e.target.value) || undefined }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="major">Major/Subject</Label>
                    <Input
                      id="major"
                      value={profileFormData.major}
                      onChange={(e) => setProfileFormData(prev => ({ ...prev, major: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stream">Stream</Label>
                    <Select
                      value={profileFormData.stream}
                      onValueChange={(value) => setProfileFormData(prev => ({ ...prev, stream: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select stream" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Science">Science</SelectItem>
                        <SelectItem value="Arts">Arts</SelectItem>
                        <SelectItem value="Commerce">Commerce</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="gpa">GPA</Label>
                    <Input
                      id="gpa"
                      type="number"
                      step="0.01"
                      value={profileFormData.gpa || ''}
                      onChange={(e) => setProfileFormData(prev => ({ ...prev, gpa: parseFloat(e.target.value) || undefined }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="student-class">Class</Label>
                    <Input
                      id="student-class"
                      value={profileFormData.student_class}
                      onChange={(e) => setProfileFormData(prev => ({ ...prev, student_class: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="index-number">Index Number</Label>
                    <Input
                      id="index-number"
                      value={profileFormData.index_number}
                      onChange={(e) => setProfileFormData(prev => ({ ...prev, index_number: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="exam-results">Exam Results</Label>
                  <Textarea
                    id="exam-results"
                    rows={3}
                    placeholder="List your exam results and achievements"
                    value={profileFormData.exam_results}
                    onChange={(e) => setProfileFormData(prev => ({ ...prev, exam_results: e.target.value }))}
                  />
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">School Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="school-address">School Address</Label>
                      <Input
                        id="school-address"
                        value={profileFormData.school_address}
                        onChange={(e) => setProfileFormData(prev => ({ ...prev, school_address: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="school-phone">School Phone</Label>
                      <Input
                        id="school-phone"
                        value={profileFormData.school_phone}
                        onChange={(e) => setProfileFormData(prev => ({ ...prev, school_phone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="school-principal">Principal Name</Label>
                      <Input
                        id="school-principal"
                        value={profileFormData.school_principal}
                        onChange={(e) => setProfileFormData(prev => ({ ...prev, school_principal: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="school-type">School Type</Label>
                      <Select
                        value={profileFormData.school_type}
                        onValueChange={(value) => setProfileFormData(prev => ({ ...prev, school_type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select school type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Government">Government</SelectItem>
                          <SelectItem value="Private">Private</SelectItem>
                          <SelectItem value="Semi-Government">Semi-Government</SelectItem>
                          <SelectItem value="International">International</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="location" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      value={profileFormData.district}
                      onChange={(e) => setProfileFormData(prev => ({ ...prev, district: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="province">Province</Label>
                    <Select
                      value={profileFormData.province}
                      onValueChange={(value) => setProfileFormData(prev => ({ ...prev, province: value }))}
                    >
                      <SelectTrigger>
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
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Grama Niladhari Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gn-division">GN Division</Label>
                      <Input
                        id="gn-division"
                        value={profileFormData.grama_niladharai_division}
                        onChange={(e) => setProfileFormData(prev => ({ ...prev, grama_niladharai_division: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gn-name">GN Name</Label>
                      <Input
                        id="gn-name"
                        value={profileFormData.grama_niladharai_name}
                        onChange={(e) => setProfileFormData(prev => ({ ...prev, grama_niladharai_name: e.target.value }))}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="gn-contact">GN Contact</Label>
                      <Input
                        id="gn-contact"
                        value={profileFormData.grama_niladharai_contact}
                        onChange={(e) => setProfileFormData(prev => ({ ...prev, grama_niladharai_contact: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="other" className="space-y-4">
                <div className="space-y-4">
                  <h4 className="font-semibold">Health Insurance</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="insurance-status">Insurance Status</Label>
                      <Select
                        value={profileFormData.health_insurance_status}
                        onValueChange={(value) => setProfileFormData(prev => ({ ...prev, health_insurance_status: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="None">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="insurance-provider">Insurance Provider</Label>
                      <Input
                        id="insurance-provider"
                        value={profileFormData.health_insurance_provider}
                        onChange={(e) => setProfileFormData(prev => ({ ...prev, health_insurance_provider: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex space-x-2 mt-6">
              <Button 
                onClick={handleUpdateProfile} 
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Updating...' : 'Update Profile'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditProfileOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="points">Points</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="shop">Shop</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                     {formatPoints(student.total_points || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Lifetime points received
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Points</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                     {formatPoints(student.available_points || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ready to use
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {goals?.filter(g => g.status === 'active').length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Current goals
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Status</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">
                    {sponsorshipStatus.status === 'sponsored' ? 'Active' : 'Inactive'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Account status
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sponsorship Status - same as before */}
            <Card>
              <CardHeader>
                <CardTitle>Sponsorship Status</CardTitle>
                <CardDescription>
                  Your current sponsorship status and information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sponsorshipStatus.status === 'sponsored' && sponsorship?.donor && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={sponsorship.donor.profile_image} />
                          <AvatarFallback>
                            {extractInitials(sponsorship.donor.first_name + ' ' + sponsorship.donor.last_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">
                            Sponsored by {sponsorship.donor.first_name} {sponsorship.donor.last_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{sponsorship.donor.occupation}</p>
                        </div>
                      </div>
                      <Badge
                        className={
                          sponsorshipStatus.status === 'sponsored'
                            ? 'bg-green-100 text-green-800'
                            : sponsorshipStatus.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }
                      >
                        {sponsorshipStatus.label}
                      </Badge>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(sponsorship?.monthly_amount || 50)}
                        </div>
                        <div className="text-sm text-muted-foreground">Monthly Sponsorship</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{formatPoints(sponsorship?.monthly_points || 50000)}</div>
                        <div className="text-sm text-muted-foreground">Monthly Points</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {transactions?.length || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Payments Received</div>
                      </div>
                    </div>
                  </div>
                )}

                {sponsorshipStatus.status === 'pending' && (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Application Under Review</h3>
                    <p className="text-muted-foreground mb-4">
                      Your application is being reviewed by our team. We'll notify you once a decision is made.
                    </p>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {sponsorshipStatus.label}
                    </Badge>
                  </div>
                )}

                {sponsorshipStatus.status === 'unsponsored' && (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Seeking Sponsor</h3>
                    <p className="text-muted-foreground mb-4">
                      You're currently seeking a sponsor. We're working to match you with a donor who shares your educational goals.
                    </p>
                    <Badge className="bg-red-100 text-red-800">
                      {sponsorshipStatus.label}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Your latest points transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions?.slice(0, 3).map((transaction) => (
                      <div key={transaction.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            transaction.type === 'earned' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            <CreditCard className={`h-4 w-4 ${
                              transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                            }`} />
                          </div>
                          <div>
                            <h4 className="font-medium">
                              {transaction.amount > 0 ? 'Earned' : 'Spent'} {formatPoints(Math.abs(transaction.amount))} pts
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {formatDateTime(transaction.date)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatPoints(transaction.balance)} pts</div>
                          <Badge variant="secondary" className="text-xs">
                            {transaction.category}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {(!transactions || transactions.length === 0) && (
                      <div className="text-center py-4 text-muted-foreground">
                        No transactions yet
                      </div>
                    )}
                  </div>
                  {transactions && transactions.length > 3 && (
                    <Button variant="outline" className="w-full mt-4" onClick={() => setActiveTab("points")}>
                      View All Transactions
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Latest Updates</CardTitle>
                  <CardDescription>
                    Your most recent updates to share with your sponsor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {updates?.slice(0, 3).map((update) => (
                      <div key={update.name} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <div className="flex-shrink-0">
                          {update.type === 'academic' && <BookOpen className="h-5 w-5 text-blue-500" />}
                          {update.type === 'project' && <Target className="h-5 w-5 text-green-500" />}
                          {update.type === 'personal' && <MessageCircle className="h-5 w-5 text-purple-500" />}
                          {update.type === 'milestone' && <Award className="h-5 w-5 text-yellow-500" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{update.title}</h4>
                          <p className="text-sm text-muted-foreground">{formatDate(update.date)}</p>
                        </div>
                      </div>
                    ))}
                    {(!updates || updates.length === 0) && (
                      <div className="text-center py-4 text-muted-foreground">
                        No updates posted yet
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setActiveTab("updates")}>
                      View All Updates
                    </Button>
                    <Button className="flex-1" onClick={() => setIsCreateUpdateOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      New Update
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Points Management Tab */}
          <TabsContent value="points">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Points Management
                  <Select value={transactionFilter} onValueChange={setTransactionFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="earned">Earned</SelectItem>
                      <SelectItem value="spent">Spent</SelectItem>
                    </SelectContent>
                  </Select>
                </CardTitle>
                <CardDescription>Manage your points and view transaction history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{formatPoints(student.total_points || 0)}</div>
                    <div className="text-sm text-muted-foreground">Total Earned</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{formatPoints(student.available_points || 0)}</div>
                    <div className="text-sm text-muted-foreground">Available</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {formatPoints((student.total_points || 0) - (student.available_points || 0))}
                    </div>
                    <div className="text-sm text-muted-foreground">Spent</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredTransactions.map((transaction) => (
                    <div key={transaction.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <CreditCard className={`h-5 w-5 ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {transaction.description || (transaction.amount > 0 ? 'Points Earned' : 'Points Spent')}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {formatDateTime(transaction.date)} • {transaction.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount > 0 ? '+' : ''}{formatPoints(transaction.amount)} pts
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Balance: {formatPoints(transaction.balance)} pts
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No transactions found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Updates Management Tab */}
          <TabsContent value="updates">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Your Updates
                  <div className="flex gap-2">
                    <Select value={updatesFilter} onValueChange={setUpdatesFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="milestone">Milestone</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={() => setIsCreateUpdateOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      New Update
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>Manage your progress updates and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUpdates.map((update) => (
                    <div key={update.name} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {update.type === 'academic' && <BookOpen className="h-5 w-5 text-blue-500" />}
                            {update.type === 'project' && <Target className="h-5 w-5 text-green-500" />}
                            {update.type === 'personal' && <MessageCircle className="h-5 w-5 text-purple-500" />}
                            {update.type === 'milestone' && <Award className="h-5 w-5 text-yellow-500" />}
                          </div>
                          <div>
                            <h4 className="font-semibold">{update.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(update.date)} • {update.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingUpdate(update)
                              setUpdateFormData({
                                title: update.title,
                                content: update.content,
                                type: update.type
                              })
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUpdate(update.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{update.content}</p>
                    </div>
                  ))}
                  {filteredUpdates.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No updates found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Your Goals
                  <Button onClick={() => setIsCreateGoalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Goal
                  </Button>
                </CardTitle>
                <CardDescription>Set and track your educational goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goals?.map((goal) => (
                    <div key={goal.name} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Target className="h-5 w-5 text-blue-500" />
                            <h4 className="font-semibold">{goal.title}</h4>
                            <Badge variant={goal.status === 'active' ? 'default' : 'secondary'}>
                              {goal.status}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-2">{goal.description}</p>
                          <p className="text-sm text-muted-foreground">
                            Target Date: {formatDate(goal.target_date)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateGoal(goal.name, { 
                            status: goal.status === 'active' ? 'completed' : 'active' 
                          })}
                        >
                          {goal.status === 'active' ? 'Mark Complete' : 'Reactivate'}
                        </Button>
                      </div>
                    </div>
                  ))}
                  {(!goals || goals.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                      No goals set yet. Create your first goal to get started!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shop Tab */}
          <TabsContent value="shop">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Educational Items Catalog
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      Cart: {getTotalItems()} items ({formatPoints(getTotalPoints())} pts)
                    </Badge>
                    <Button onClick={() => setIsCartOpen(true)} disabled={cartItems.length === 0}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      View Cart
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>Browse and purchase educational items with your points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={catalogFilter} onValueChange={setCatalogFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.name} value={category.name}>
                            {category.category_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCatalogItems.map((item) => (
                      <Card key={item.name} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <h3 className="font-semibold">{item.item_name}</h3>
                              {item.description && (
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                              )}
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="text-lg font-bold text-primary">
                                {formatPoints(item.point_price)} pts
                              </div>
                              <Button 
                                size="sm" 
                                onClick={() => handleAddToCart(item.name)}
                                disabled={item.point_price > (student.available_points || 0)}
                              >
                                Add to Cart
                              </Button>
                            </div>
                            {item.stock_quantity !== null && (
                              <div className="text-xs text-muted-foreground">
                                Stock: {item.stock_quantity}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {filteredCatalogItems.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No items found matching your criteria
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Profile Information
                  <Button onClick={() => setIsEditProfileOpen(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </CardTitle>
                <CardDescription>View and manage your comprehensive profile information</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                    <TabsTrigger value="location">Location</TabsTrigger>
                    <TabsTrigger value="other">Other</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="personal" className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={student.profile_image} />
                        <AvatarFallback className="text-lg">
                          {extractInitials(student.first_name + ' ' + student.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">{student.first_name} {student.last_name}</h3>
                        <p className="text-muted-foreground">{student.email}</p>
                        <Badge variant="outline" className="mt-1">
                          {student.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Personal Information
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{student.email}</span>
                          </div>
                          {student.phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{student.phone}</span>
                            </div>
                          )}
                          {student.age && (
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>{student.age} years old</span>
                            </div>
                          )}
                          {student.blood_group && (
                            <div className="flex items-center space-x-2">
                              <HealthIcon className="h-4 w-4 text-muted-foreground" />
                              <span>Blood Group: {student.blood_group}</span>
                            </div>
                          )}
                          {student.nationality && (
                            <div className="flex items-center space-x-2">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              <span>{student.nationality}</span>
                            </div>
                          )}
                          {student.religion && (
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>Religion: {student.religion}</span>
                            </div>
                          )}
                          {student.languages && (
                            <div className="flex items-center space-x-2">
                              <Languages className="h-4 w-4 text-muted-foreground" />
                              <span>Languages: {student.languages}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Location
                        </h4>
                        <div className="space-y-2">
                          {student.district && (
                            <div>
                              <span className="text-sm text-muted-foreground">District:</span>
                              <div>{student.district}</div>
                            </div>
                          )}
                          {student.province && (
                            <div>
                              <span className="text-sm text-muted-foreground">Province:</span>
                              <div>{student.province}</div>
                            </div>
                          )}
                          {student.grama_niladharai_division && (
                            <div>
                              <span className="text-sm text-muted-foreground">GN Division:</span>
                              <div>{student.grama_niladharai_division}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {student.bio && (
                      <div>
                        <h4 className="font-semibold mb-2">Bio</h4>
                        <p className="text-muted-foreground">{student.bio}</p>
                      </div>
                    )}

                    {student.goals && (
                      <div>
                        <h4 className="font-semibold mb-2">Goals</h4>
                        <p className="text-muted-foreground">{student.goals}</p>
                      </div>
                    )}

                    {student.challenges && (
                      <div>
                        <h4 className="font-semibold mb-2">Challenges</h4>
                        <p className="text-muted-foreground">{student.challenges}</p>
                      </div>
                    )}

                    {student.why_need_support && (
                      <div>
                        <h4 className="font-semibold mb-2">Why I Need Support</h4>
                        <p className="text-muted-foreground">{student.why_need_support}</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="education" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          Academic Information
                        </h4>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm text-muted-foreground">Education Level:</span>
                            <div>{student.education_level}</div>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Institution:</span>
                            <div>{student.school}</div>
                          </div>
                          {student.grade && (
                            <div>
                              <span className="text-sm text-muted-foreground">Grade:</span>
                              <div>{student.grade}</div>
                            </div>
                          )}
                          {student.major && (
                            <div>
                              <span className="text-sm text-muted-foreground">Major/Subject:</span>
                              <div>{student.major}</div>
                            </div>
                          )}
                          {student.stream && (
                            <div>
                              <span className="text-sm text-muted-foreground">Stream:</span>
                              <div>{student.stream}</div>
                            </div>
                          )}
                          {student.gpa && (
                            <div>
                              <span className="text-sm text-muted-foreground">GPA:</span>
                              <div>{student.gpa}</div>
                            </div>
                          )}
                          {student.student_class && (
                            <div>
                              <span className="text-sm text-muted-foreground">Class:</span>
                              <div>{student.student_class}</div>
                            </div>
                          )}
                          {student.index_number && (
                            <div>
                              <span className="text-sm text-muted-foreground">Index Number:</span>
                              <div>{student.index_number}</div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                          <School className="h-4 w-4" />
                          School Information
                        </h4>
                        <div className="space-y-2">
                          {student.school_address && (
                            <div>
                              <span className="text-sm text-muted-foreground">Address:</span>
                              <div>{student.school_address}</div>
                            </div>
                          )}
                          {student.school_phone && (
                            <div>
                              <span className="text-sm text-muted-foreground">Phone:</span>
                              <div>{student.school_phone}</div>
                            </div>
                          )}
                          {student.school_principal && (
                            <div>
                              <span className="text-sm text-muted-foreground">Principal:</span>
                              <div>{student.school_principal}</div>
                            </div>
                          )}
                          {student.school_type && (
                            <div>
                              <span className="text-sm text-muted-foreground">Type:</span>
                              <div>{student.school_type}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {student.exam_results && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Exam Results
                        </h4>
                        <p className="text-muted-foreground">{student.exam_results}</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="location" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Address Information
                        </h4>
                        <div className="space-y-2">
                          {student.district && (
                            <div>
                              <span className="text-sm text-muted-foreground">District:</span>
                              <div>{student.district}</div>
                            </div>
                          )}
                          {student.province && (
                            <div>
                              <span className="text-sm text-muted-foreground">Province:</span>
                              <div>{student.province}</div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                          <UserCheck className="h-4 w-4" />
                          Grama Niladhari Information
                        </h4>
                        <div className="space-y-2">
                          {student.grama_niladharai_division && (
                            <div>
                              <span className="text-sm text-muted-foreground">Division:</span>
                              <div>{student.grama_niladharai_division}</div>
                            </div>
                          )}
                          {student.grama_niladharai_name && (
                            <div>
                              <span className="text-sm text-muted-foreground">Name:</span>
                              <div>{student.grama_niladharai_name}</div>
                            </div>
                          )}
                          {student.grama_niladharai_contact && (
                            <div>
                              <span className="text-sm text-muted-foreground">Contact:</span>
                              <div>{student.grama_niladharai_contact}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="other" className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <HealthIcon className="h-4 w-4" />
                        Health Insurance
                      </h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          {student.health_insurance_status && (
                            <div>
                              <span className="text-sm text-muted-foreground">Status:</span>
                              <div>{student.health_insurance_status}</div>
                            </div>
                          )}
                          {student.health_insurance_provider && (
                            <div>
                              <span className="text-sm text-muted-foreground">Provider:</span>
                              <div>{student.health_insurance_provider}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Points Information
                      </h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{formatPoints(student.total_points || 0)}</div>
                          <div className="text-sm text-muted-foreground">Total Points</div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{formatPoints(student.available_points || 0)}</div>
                          <div className="text-sm text-muted-foreground">Available Points</div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">{formatPoints(student.invested_points || 0)}</div>
                          <div className="text-sm text-muted-foreground">Invested Points</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Join Date:</span>
                        <div>{formatDate(student.join_date)}</div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Last Updated:</span>
                        <div>{formatDateTime(student.last_updated)}</div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>View and manage your notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications?.map((notification) => (
                    <div 
                      key={notification.name} 
                      className={`p-3 border rounded-lg cursor-pointer hover:bg-muted/50 ${
                        notification.status === 'unread' ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => markAsRead(notification.name)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatDateTime(notification.created_date || '')}
                          </p>
                        </div>
                        {notification.status === 'unread' && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!notifications || notifications.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                      No notifications
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Update Dialog */}
        {editingUpdate && (
          <Dialog open={!!editingUpdate} onOpenChange={() => setEditingUpdate(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Update</DialogTitle>
                <DialogDescription>
                  Make changes to your update
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={updateFormData.title}
                    onChange={(e) => setUpdateFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-type">Type</Label>
                  <Select
                    value={updateFormData.type}
                    onValueChange={(value) => setUpdateFormData(prev => ({ ...prev, type: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="milestone">Milestone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-content">Content</Label>
                  <Textarea
                    id="edit-content"
                    rows={4}
                    value={updateFormData.content}
                    onChange={(e) => setUpdateFormData(prev => ({ ...prev, content: e.target.value }))}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleEditUpdate} 
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? 'Updating...' : 'Save Changes'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingUpdate(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}