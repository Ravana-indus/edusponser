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
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  CreditCard,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Edit,
  Eye,
  Settings,
  Calendar,
  BarChart3,
  Building,
  Truck,
  QrCode,
  Store,
  FileText,
  Target,
  Percent,
  Timer,
  Phone,
  Mail,
  MapPin,
  Banknote,
  Box,
  PlusCircle,
  MinusCircle
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
}

interface Product {
  id: number
  name: string
  description: string
  category: string
  pointPrice: number
  approximateValueLKR: number
  image?: string
  isActive: boolean
  stockQuantity: number
  createdDate: string
  lastUpdated: string
  educationLevels: string[]
  maxQuantityPerMonth: number
}

interface PurchaseOrder {
  id: number
  studentId: number
  studentName: string
  items: OrderItem[]
  totalPoints: number
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled' | 'cancelled'
  requestDate: string
  approvedDate?: string
  fulfilledDate?: string
  rejectionReason?: string
  qrCode?: string
  notes?: string
  deliveryMethod: 'pickup' | 'delivery'
  deliveryAddress?: string
}

interface OrderItem {
  id: number
  catalogItemId: number
  productName: string
  quantity: number
  pointsPerItem: number
  totalPoints: number
}

interface PaymentAccount {
  id: number
  bankName: string
  accountNumber: string
  accountHolder: string
  branch: string
  isPrimary: boolean
  status: 'active' | 'inactive'
}

export default function VendorDashboardPage() {
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<PurchaseOrder[]>([])
  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreatePOOpen, setIsCreatePOOpen] = useState(false)
  const [isManageProductsOpen, setIsManageProductsOpen] = useState(false)
  const [isManageAccountsOpen, setIsManageAccountsOpen] = useState(false)

  // Form states
  const [newOrder, setNewOrder] = useState({
    studentId: '',
    items: [{ productId: '', quantity: 1 }],
    deliveryMethod: 'pickup' as 'pickup' | 'delivery',
    deliveryAddress: '',
    notes: ''
  })

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    pointPrice: 0,
    approximateValueLKR: 0,
    stockQuantity: 0,
    maxQuantityPerMonth: 0,
    educationLevels: [] as string[]
  })

  const [newAccount, setNewAccount] = useState({
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    branch: '',
    isPrimary: false
  })

  useEffect(() => {
    // Load vendor data
    const mockVendor: Vendor = {
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
      description: "Leading educational bookstore in Sri Lanka, providing quality textbooks, workbooks, and educational materials to students across all education levels.",
      website: "https://bookhaven.lk"
    }

    const mockProducts: Product[] = [
      {
        id: 1,
        name: "Mathematics Textbook Grade 6",
        description: "Comprehensive mathematics textbook for Grade 6 students following the local curriculum",
        category: "books",
        pointPrice: 5000,
        approximateValueLKR: 2500,
        isActive: true,
        stockQuantity: 50,
        createdDate: "2024-01-15",
        lastUpdated: "2024-03-01",
        educationLevels: ["primary", "secondary"],
        maxQuantityPerMonth: 2
      },
      {
        id: 2,
        name: "Science Workbook Grade 8",
        description: "Interactive science workbook with practical exercises and experiments",
        category: "books",
        pointPrice: 3500,
        approximateValueLKR: 1750,
        isActive: true,
        stockQuantity: 30,
        createdDate: "2024-01-20",
        lastUpdated: "2024-03-01",
        educationLevels: ["secondary"],
        maxQuantityPerMonth: 3
      },
      {
        id: 3,
        name: "English Literature Guide",
        description: "Comprehensive guide to English literature for O/L students",
        category: "books",
        pointPrice: 4000,
        approximateValueLKR: 2000,
        isActive: true,
        stockQuantity: 25,
        createdDate: "2024-02-01",
        lastUpdated: "2024-03-01",
        educationLevels: ["ordinary-level"],
        maxQuantityPerMonth: 1
      }
    ]

    const mockOrders: PurchaseOrder[] = [
      {
        id: 1,
        studentId: 1,
        studentName: "Kavindu Perera",
        items: [
          {
            id: 1,
            catalogItemId: 1,
            productName: "Mathematics Textbook Grade 6",
            quantity: 1,
            pointsPerItem: 5000,
            totalPoints: 5000
          }
        ],
        totalPoints: 5000,
        status: "fulfilled",
        requestDate: "2024-03-01",
        fulfilledDate: "2024-03-02",
        deliveryMethod: "pickup",
        qrCode: "QR123456"
      },
      {
        id: 2,
        studentId: 2,
        studentName: "Nimali Rajapaksa",
        items: [
          {
            id: 2,
            catalogItemId: 2,
            productName: "Science Workbook Grade 8",
            quantity: 2,
            pointsPerItem: 3500,
            totalPoints: 7000
          }
        ],
        totalPoints: 7000,
        status: "pending",
        requestDate: "2024-03-10",
        deliveryMethod: "delivery",
        deliveryAddress: "Mahamaya Girls' College, Kandy"
      }
    ]

    const mockPaymentAccounts: PaymentAccount[] = [
      {
        id: 1,
        bankName: "Bank of Ceylon",
        accountNumber: "1234567890",
        accountHolder: "Book Haven",
        branch: "Main Branch, Colombo",
        isPrimary: true,
        status: "active"
      },
      {
        id: 2,
        bankName: "Commercial Bank",
        accountNumber: "0987654321",
        accountHolder: "Book Haven",
        branch: "Kandy Branch",
        isPrimary: false,
        status: "active"
      }
    ]

    setVendor(mockVendor)
    setProducts(mockProducts)
    setOrders(mockOrders)
    setPaymentAccounts(mockPaymentAccounts)
    setLoading(false)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
      case "active":
      case "fulfilled":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "rejected":
      case "inactive":
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // --- Purchase Order workflow actions wired to API ---
  const getPoName = (order: PurchaseOrder) => (order as any).name ?? `PO-${order.id}`

  const updateOrderStatus = (poName: string, status: PurchaseOrder['status']) => {
    setOrders(prev => prev.map(o => (getPoName(o) === poName ? { ...o, status, approvedDate: status === 'approved' ? new Date().toISOString().split('T')[0] : o.approvedDate, fulfilledDate: status === 'fulfilled' ? new Date().toISOString().split('T')[0] : o.fulfilledDate } : o)))
  }

  const approveOrder = async (order: PurchaseOrder) => {
    const poName = getPoName(order)
    await fetch(`/api/purchase-orders/${poName}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ by: 'vendor@example.com' })
    })
    updateOrderStatus(poName, 'approved')
  }

  const fulfillOrder = async (order: PurchaseOrder) => {
    const poName = getPoName(order)
    await fetch(`/api/purchase-orders/${poName}/fulfill`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ by: 'vendor@example.com' })
    })
    updateOrderStatus(poName, 'fulfilled')
  }

  const rejectOrder = async (order: PurchaseOrder, reason: string = 'Not available') => {
    const poName = getPoName(order)
    await fetch(`/api/purchase-orders/${poName}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    })
    updateOrderStatus(poName, 'rejected')
  }

  const cancelOrder = async (order: PurchaseOrder) => {
    const poName = getPoName(order)
    await fetch(`/api/purchase-orders/${poName}/cancel`, { method: 'POST' })
    updateOrderStatus(poName, 'cancelled')
  }

  const handleCreateOrder = () => {
    // In a real app, this would create the order via API
    const newOrderObj: PurchaseOrder = {
      id: orders.length + 1,
      studentId: parseInt(newOrder.studentId),
      studentName: "Student Name", // Would fetch from API
      items: newOrder.items.map((item, index) => ({
        id: index + 1,
        catalogItemId: parseInt(item.productId),
        productName: "Product Name", // Would fetch from API
        quantity: item.quantity,
        pointsPerItem: 1000, // Would fetch from product
        totalPoints: item.quantity * 1000
      })),
      totalPoints: newOrder.items.reduce((sum, item) => sum + (item.quantity * 1000), 0),
      status: "pending",
      requestDate: new Date().toISOString().split('T')[0],
      deliveryMethod: newOrder.deliveryMethod,
      deliveryAddress: newOrder.deliveryAddress,
      notes: newOrder.notes
    }

    setOrders([...orders, newOrderObj])
    setIsCreatePOOpen(false)
    setNewOrder({
      studentId: '',
      items: [{ productId: '', quantity: 1 }],
      deliveryMethod: 'pickup',
      deliveryAddress: '',
      notes: ''
    })
  }

  const handleAddProduct = () => {
    const newProductObj: Product = {
      id: products.length + 1,
      name: newProduct.name,
      description: newProduct.description,
      category: newProduct.category,
      pointPrice: newProduct.pointPrice,
      approximateValueLKR: newProduct.approximateValueLKR,
      isActive: true,
      stockQuantity: newProduct.stockQuantity,
      createdDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      educationLevels: newProduct.educationLevels,
      maxQuantityPerMonth: newProduct.maxQuantityPerMonth
    }

    setProducts([...products, newProductObj])
    setIsManageProductsOpen(false)
    setNewProduct({
      name: '',
      description: '',
      category: '',
      pointPrice: 0,
      approximateValueLKR: 0,
      stockQuantity: 0,
      maxQuantityPerMonth: 0,
      educationLevels: []
    })
  }

  const handleAddAccount = () => {
    const newAccountObj: PaymentAccount = {
      id: paymentAccounts.length + 1,
      bankName: newAccount.bankName,
      accountNumber: newAccount.accountNumber,
      accountHolder: newAccount.accountHolder,
      branch: newAccount.branch,
      isPrimary: newAccount.isPrimary,
      status: "active"
    }

    // If this is set as primary, remove primary from other accounts
    const updatedAccounts = newAccount.isPrimary 
      ? paymentAccounts.map(acc => ({ ...acc, isPrimary: false }))
      : paymentAccounts

    setPaymentAccounts([...updatedAccounts, newAccountObj])
    setIsManageAccountsOpen(false)
    setNewAccount({
      bankName: '',
      accountNumber: '',
      accountHolder: '',
      branch: '',
      isPrimary: false
    })
  }

  const addOrderItem = () => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { productId: '', quantity: 1 }]
    })
  }

  const removeOrderItem = (index: number) => {
    const items = newOrder.items.filter((_, i) => i !== index)
    setNewOrder({ ...newOrder, items })
  }

  const updateOrderItem = (index: number, field: string, value: any) => {
    const items = newOrder.items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    )
    setNewOrder({ ...newOrder, items })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading vendor dashboard...</p>
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your products, orders, and payment accounts
              </p>
            </div>
            <div className="flex space-x-2">
              <Dialog open={isCreatePOOpen} onOpenChange={setIsCreatePOOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Purchase Order
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Purchase Order</DialogTitle>
                    <DialogDescription>
                      Create a new purchase order for a student
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="studentId">Student ID</Label>
                      <Input
                        id="studentId"
                        value={newOrder.studentId}
                        onChange={(e) => setNewOrder({ ...newOrder, studentId: e.target.value })}
                        placeholder="Enter student ID"
                      />
                    </div>
                    
                    <div>
                      <Label>Order Items</Label>
                      {newOrder.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 mt-2">
                          <Select value={item.productId} onValueChange={(value) => updateOrderItem(index, 'productId', value)}>
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map(product => (
                                <SelectItem key={product.id} value={product.id.toString()}>
                                  {product.name} - {product.pointPrice} points
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value))}
                            placeholder="Qty"
                            className="w-20"
                          />
                          {newOrder.items.length > 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeOrderItem(index)}
                            >
                              <MinusCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addOrderItem}
                        className="mt-2"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Item
                      </Button>
                    </div>

                    <div>
                      <Label htmlFor="deliveryMethod">Delivery Method</Label>
                      <Select value={newOrder.deliveryMethod} onValueChange={(value: 'pickup' | 'delivery') => setNewOrder({ ...newOrder, deliveryMethod: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pickup">Pickup</SelectItem>
                          <SelectItem value="delivery">Delivery</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {newOrder.deliveryMethod === 'delivery' && (
                      <div>
                        <Label htmlFor="deliveryAddress">Delivery Address</Label>
                        <Textarea
                          id="deliveryAddress"
                          value={newOrder.deliveryAddress}
                          onChange={(e) => setNewOrder({ ...newOrder, deliveryAddress: e.target.value })}
                          placeholder="Enter delivery address"
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={newOrder.notes}
                        onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                        placeholder="Additional notes for the order"
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsCreatePOOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateOrder}>
                        Create Order
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isManageProductsOpen} onOpenChange={setIsManageProductsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Package className="mr-2 h-4 w-4" />
                    Manage Products
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                      Add a new product to your catalog
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="productName">Product Name</Label>
                      <Input
                        id="productName"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="Enter product name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="productDescription">Description</Label>
                      <Textarea
                        id="productDescription"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="Enter product description"
                      />
                    </div>

                    <div>
                      <Label htmlFor="productCategory">Category</Label>
                      <Select value={newProduct.category} onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pointPrice">Point Price</Label>
                        <Input
                          id="pointPrice"
                          type="number"
                          value={newProduct.pointPrice}
                          onChange={(e) => setNewProduct({ ...newProduct, pointPrice: parseInt(e.target.value) })}
                          placeholder="Enter point price"
                        />
                      </div>
                      <div>
                        <Label htmlFor="approximateValue">Approximate Value (LKR)</Label>
                        <Input
                          id="approximateValue"
                          type="number"
                          value={newProduct.approximateValueLKR}
                          onChange={(e) => setNewProduct({ ...newProduct, approximateValueLKR: parseInt(e.target.value) })}
                          placeholder="Enter approximate value"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="stockQuantity">Stock Quantity</Label>
                        <Input
                          id="stockQuantity"
                          type="number"
                          value={newProduct.stockQuantity}
                          onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: parseInt(e.target.value) })}
                          placeholder="Enter stock quantity"
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxQuantity">Max Quantity per Month</Label>
                        <Input
                          id="maxQuantity"
                          type="number"
                          value={newProduct.maxQuantityPerMonth}
                          onChange={(e) => setNewProduct({ ...newProduct, maxQuantityPerMonth: parseInt(e.target.value) })}
                          placeholder="Enter max quantity"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsManageProductsOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddProduct}>
                        Add Product
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isManageAccountsOpen} onOpenChange={setIsManageAccountsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Payment Accounts
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Payment Account</DialogTitle>
                    <DialogDescription>
                      Add a new payment account for receiving payments
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={newAccount.bankName}
                        onChange={(e) => setNewAccount({ ...newAccount, bankName: e.target.value })}
                        placeholder="Enter bank name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={newAccount.accountNumber}
                        onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
                        placeholder="Enter account number"
                      />
                    </div>

                    <div>
                      <Label htmlFor="accountHolder">Account Holder</Label>
                      <Input
                        id="accountHolder"
                        value={newAccount.accountHolder}
                        onChange={(e) => setNewAccount({ ...newAccount, accountHolder: e.target.value })}
                        placeholder="Enter account holder name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="branch">Branch</Label>
                      <Input
                        id="branch"
                        value={newAccount.branch}
                        onChange={(e) => setNewAccount({ ...newAccount, branch: e.target.value })}
                        placeholder="Enter branch name"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isPrimary"
                        checked={newAccount.isPrimary}
                        onCheckedChange={(checked) => setNewAccount({ ...newAccount, isPrimary: checked })}
                      />
                      <Label htmlFor="isPrimary">Set as primary account</Label>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsManageAccountsOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddAccount}>
                        Add Account
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Overview Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vendor?.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                Lifetime orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vendor?.totalAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Points earned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Products</CardTitle>
              <Box className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.filter(p => p.isActive).length}</div>
              <p className="text-xs text-muted-foreground">
                In catalog
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting processing
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="accounts">Payment Accounts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Information</CardTitle>
                  <CardDescription>Your business details and status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/placeholder-vendor.jpg" />
                      <AvatarFallback>{vendor?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{vendor?.name}</h3>
                      <p className="text-sm text-muted-foreground">{vendor?.category}</p>
                      {getStatusBadge(vendor?.status || '')}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{vendor?.contactPerson}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{vendor?.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{vendor?.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{vendor?.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Banknote className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{vendor?.bankName} - {vendor?.bankAccount}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">{vendor?.description}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Schedule</CardTitle>
                  <CardDescription>Upcoming and recent payments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Next Payment Date</span>
                    <span className="text-sm">{vendor?.nextPaymentDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Last Payment Date</span>
                    <span className="text-sm">{vendor?.lastPaymentDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Member Since</span>
                    <span className="text-sm">{vendor?.joinDate}</span>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Monthly Processing</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Payments are processed on the 25th of each month for fulfilled orders
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Purchase Orders</CardTitle>
                <CardDescription>Manage and track student purchase orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total Points</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell>{order.studentName}</TableCell>
                        <TableCell>{order.items.length} items</TableCell>
                        <TableCell>{order.totalPoints.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{order.requestDate}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {order.status === 'pending' && (
                              <>
                                <Button variant="outline" size="sm" onClick={() => approveOrder(order)}>Approve</Button>
                                <Button variant="outline" size="sm" onClick={() => rejectOrder(order)}>Reject</Button>
                                <Button variant="outline" size="sm" onClick={() => cancelOrder(order)}>Cancel</Button>
                              </>
                            )}
                            {order.status === 'approved' && (
                              <>
                                <Button variant="outline" size="sm" onClick={() => fulfillOrder(order)}>Fulfill</Button>
                                <Button variant="outline" size="sm" onClick={() => cancelOrder(order)}>Cancel</Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Catalog</CardTitle>
                <CardDescription>Manage your product offerings</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Point Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.pointPrice.toLocaleString()}</TableCell>
                        <TableCell>{product.stockQuantity}</TableCell>
                        <TableCell>{getStatusBadge(product.isActive ? 'active' : 'inactive')}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accounts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Accounts</CardTitle>
                <CardDescription>Manage your payment receiving accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bank Name</TableHead>
                      <TableHead>Account Number</TableHead>
                      <TableHead>Account Holder</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Primary</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium">{account.bankName}</TableCell>
                        <TableCell>{account.accountNumber}</TableCell>
                        <TableCell>{account.accountHolder}</TableCell>
                        <TableCell>{account.branch}</TableCell>
                        <TableCell>{getStatusBadge(account.status)}</TableCell>
                        <TableCell>
                          {account.isPrimary ? (
                            <Badge className="bg-green-100 text-green-800">Primary</Badge>
                          ) : (
                            <Badge variant="secondary">Secondary</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}