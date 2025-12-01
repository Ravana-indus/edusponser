'use client'

import { useEffect, useMemo, useState } from "react"
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
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Eye, 
  QrCode, 
  Package, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck,
  Store,
  BookOpen,
  PenTool,
  Shirt,
  Cpu,
  Wrench,
  GraduationCap,
  Car,
  Coffee
} from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/layout/Navigation"
import { supabase } from '@/lib/supabase/client'
import { useAuthState } from '@/lib/frappe'
import QRCode from "qrcode"

export default function StudentPurchase() {
  const [activeTab, setActiveTab] = useState("catalog")
  const [cart, setCart] = useState<Array<{item: any, quantity: number}>>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [orderNotes, setOrderNotes] = useState("")
  const [currentOrder, setCurrentOrder] = useState<any>(null)

  const auth = useAuthState()
  const [student, setStudent] = useState<any | null>(null)
  const [catalog, setCatalog] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [orderItemsMap, setOrderItemsMap] = useState<Record<string, any[]>>({})

  useEffect(() => {
    const load = async () => {
      if (!auth?.user) return
      // Student by email or ST-username
      let st: any = null
      if (auth.user.email) {
        const { data } = await supabase.from('students').select('*').eq('email', auth.user.email).maybeSingle()
        st = data
      }
      if (!st && auth.user.username) {
        const { data } = await supabase.from('students').select('*').eq('name', `ST-${auth.user.username}`).maybeSingle()
        st = data
      }
      if (!st) return
      setStudent(st)

      // Catalog
      const { data: ci } = await supabase
        .from('view_active_catalog')
        .select('item_id, item_name, description, category_name, point_price, approximate_value_lkr, is_active')
        .limit(500)
      setCatalog((ci || []).map((it, idx) => ({
        id: it.item_id || idx + 1,
        name: it.item_name,
        description: it.description,
        category: (it.category_name || 'other').toLowerCase(),
        pointPrice: it.point_price || 0,
        approximateValueLKR: Number(it.approximate_value_lkr || 0),
        isActive: it.is_active,
      })))

      // Orders
      const { data: po } = await supabase
        .from('purchase_orders')
        .select('name, status, request_date, approved_date, fulfilled_date, total_points, delivery_method, delivery_address, notes, qr_code')
        .eq('student', st.name)
        .order('request_date', { ascending: false })
        .limit(100)
      setOrders(po || [])

      const orderNames = (po || []).map(o => o.name)
      if (orderNames.length > 0) {
        const { data: items } = await supabase
          .from('purchase_order_items')
          .select('name, parent, item, quantity, points_per_item, total_points')
          .in('parent', orderNames)
        const map: Record<string, any[]> = {}
        ;(items || []).forEach(it => {
          map[it.parent] = map[it.parent] || []
          map[it.parent].push({
            id: it.name,
            catalogItemId: it.item,
            quantity: it.quantity,
            pointsPerItem: it.points_per_item,
            totalPoints: it.total_points,
          })
        })
        setOrderItemsMap(map)
      }
    }
    load()
  }, [auth.user?.email, auth.user?.username])

  const categories = [
    { id: "all", name: "All Items", icon: Package },
    { id: "books", name: "Books", icon: BookOpen },
    { id: "stationery", name: "Stationery", icon: PenTool },
    { id: "uniforms", name: "Uniforms", icon: Shirt },
    { id: "technology", name: "Technology", icon: Cpu },
    { id: "equipment", name: "Equipment", icon: Wrench },
    { id: "fees", name: "Fees", icon: GraduationCap },
    { id: "transport", name: "Transport", icon: Car },
    { id: "meals", name: "Meals", icon: Coffee },
    { id: "other", name: "Other", icon: Package }
  ]

  const filteredItems = useMemo(() => {
    const items = catalog
    if (selectedCategory === 'all') return items
    return items.filter(item => item.category === selectedCategory)
  }, [catalog, selectedCategory])

  const addToCart = (item: any) => {
    const existingItem = cart.find(cartItem => cartItem.item.id === item.id)
    if (existingItem) {
      if (existingItem.quantity < (item.maxQuantityPerMonth || 10)) {
        setCart(cart.map(cartItem => 
          cartItem.item.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        ))
      }
    } else {
      setCart([...cart, { item, quantity: 1 }])
    }
  }

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter(cartItem => cartItem.item.id !== itemId))
  }

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(itemId)
      return
    }
    
    const item = cart.find(cartItem => cartItem.item.id === itemId)?.item
    if (item && quantity <= (item.maxQuantityPerMonth || 10)) {
      setCart(cart.map(cartItem => 
        cartItem.item.id === itemId 
          ? { ...cartItem, quantity }
          : cartItem
      ))
    }
  }

  const getTotalPoints = () => {
    return cart.reduce((total, cartItem) => 
      total + (cartItem.item.pointPrice * cartItem.quantity), 0
    )
  }

  const canAfford = () => {
    return getTotalPoints() <= (student?.available_points ?? student?.total_points ?? 0)
  }

  const handleCheckout = async () => {
    if (!canAfford() || cart.length === 0) return
    if (!student) return

    const orderName = `PO-${Date.now()}`
    const totalPoints = getTotalPoints()

    // Insert order
    await supabase.from('purchase_orders').insert({
      name: orderName,
      student: student.name,
      vendor: null,
      total_points: totalPoints,
      status: 'pending',
      request_date: new Date().toISOString().slice(0,10),
      delivery_method: deliveryMethod,
      delivery_address: deliveryMethod === 'delivery' ? deliveryAddress : null,
      notes: orderNotes,
    })

    const orderItems = cart.map((cartItem, index) => ({
      name: `POI-${Date.now()}-${index+1}`,
      parent: orderName,
      parenttype: 'Purchase Order',
      parentfield: 'items',
      item: cartItem.item.id,
      quantity: cartItem.quantity,
      points_per_item: cartItem.item.pointPrice,
      total_points: cartItem.item.pointPrice * cartItem.quantity,
    }))

    if (orderItems.length > 0) {
      await supabase.from('purchase_order_items').insert(orderItems)
    }

    const newOrder = {
      id: orders.length + 1,
      name: orderName,
      studentId: 1,
      items: orderItems.map((oi, idx) => ({ id: idx+1, catalogItemId: oi.item, quantity: oi.quantity, pointsPerItem: oi.points_per_item, totalPoints: oi.total_points })),
      totalPoints,
      status: 'pending',
      requestDate: new Date().toISOString().slice(0,10),
      deliveryMethod,
      deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress : undefined,
      notes: orderNotes,
    }

    setCurrentOrder(newOrder)
    // Generate QR Code
    try {
      const qrData = JSON.stringify({
        orderId: orderName,
        studentId: student.name,
        totalPoints: newOrder.totalPoints,
        items: orderItems.length,
        timestamp: new Date().toISOString()
      })
      
      const qrCodeImage = await QRCode.toDataURL(qrData)
      setQrCodeUrl(qrCodeImage)
      
      // Persist QR code string in order
      await supabase.from('purchase_orders').update({ qr_code: qrData }).eq('name', orderName)
      newOrder.qrCode = qrData
    } catch (error) {
      console.error('Error generating QR code:', error)
    }

    setIsCheckoutOpen(false)
    setIsQRCodeOpen(true)
    setCart([])
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "approved":
        return <Badge className="bg-blue-100 text-blue-800">Approved</Badge>
      case "fulfilled":
        return <Badge className="bg-green-100 text-green-800">Fulfilled</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case "cancelled":
        return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, any> = {
      books: BookOpen,
      stationery: PenTool,
      uniforms: Shirt,
      technology: Cpu,
      equipment: Wrench,
      fees: GraduationCap,
      transport: Car,
      meals: Coffee,
      other: Package
    }
    return iconMap[category] || Package
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Navigation user={{
        id: 1,
        firstName: student?.first_name || 'Student',
        lastName: student?.last_name || '',
        email: student?.email || '',
        role: 'student'
      }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Student Store</h1>
          <p className="text-muted-foreground">
            Use your points to purchase educational materials and services
          </p>
          <div className="flex items-center space-x-4 mt-4">
            <div className="bg-primary/10 px-4 py-2 rounded-lg">
              <span className="text-sm font-medium">Available Points:</span>
              <span className="text-lg font-bold ml-2">{(student?.available_points ?? student?.total_points ?? 0).toLocaleString()}</span>
            </div>
            {cart.length > 0 && (
              <div className="bg-secondary px-4 py-2 rounded-lg">
                <span className="text-sm font-medium">Cart Items:</span>
                <span className="text-lg font-bold ml-2">{cart.length}</span>
              </div>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="catalog">Catalog</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="space-y-6">
            {/* Category Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>
                  Filter items by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {categories.map((category) => {
                    const Icon = category.icon
                    return (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        className="h-auto p-3 flex flex-col items-center space-y-2"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <Icon className="h-6 w-6" />
                        <span className="text-xs">{category.name}</span>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Cart Summary */}
            {cart.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Shopping Cart</CardTitle>
                      <CardDescription>
                        Review your selected items
                      </CardDescription>
                    </div>
                    <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                      <DialogTrigger asChild>
                        <Button disabled={!canAfford()}>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Checkout ({getTotalPoints().toLocaleString()} pts)
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Checkout</DialogTitle>
                          <DialogDescription>
                            Complete your purchase order
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Delivery Method</Label>
                            <Select value={deliveryMethod} onValueChange={(value: "pickup" | "delivery") => setDeliveryMethod(value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pickup">
                                  <div className="flex items-center space-x-2">
                                    <Store className="h-4 w-4" />
                                    <span>Pickup</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="delivery">
                                  <div className="flex items-center space-x-2">
                                    <Truck className="h-4 w-4" />
                                    <span>Delivery</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {deliveryMethod === "delivery" && (
                            <div>
                              <Label>Delivery Address</Label>
                              <Textarea
                                placeholder="Enter your delivery address"
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                              />
                            </div>
                          )}
                          
                          <div>
                            <Label>Order Notes (Optional)</Label>
                            <Textarea
                              placeholder="Any special instructions or notes"
                              value={orderNotes}
                              onChange={(e) => setOrderNotes(e.target.value)}
                            />
                          </div>
                          
                          <div className="border-t pt-4">
                            <div className="flex justify-between items-center mb-4">
                              <span className="font-medium">Total Points:</span>
                              <span className="text-lg font-bold">{getTotalPoints().toLocaleString()}</span>
                            </div>
                            {!canAfford() && (
                              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                <div className="flex items-center space-x-2">
                                  <AlertCircle className="h-4 w-4 text-red-600" />
                                  <span className="text-sm text-red-800">
                                    Insufficient points. You need {getTotalPoints().toLocaleString()} points but only have {currentStudent.totalPoints.toLocaleString()}.
                                  </span>
                                </div>
                              </div>
                            )}
                            <Button 
                              onClick={handleCheckout} 
                              disabled={!canAfford() || cart.length === 0}
                              className="w-full"
                            >
                              Complete Order
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cart.map((cartItem) => (
                      <div key={cartItem.item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            {React.createElement(getCategoryIcon(cartItem.item.category), { className: "h-5 w-5" })}
                          </div>
                          <div>
                            <h4 className="font-medium">{cartItem.item.name}</h4>
                            <p className="text-sm text-muted-foreground">{cartItem.item.pointPrice.toLocaleString()} pts each</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{cartItem.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                            disabled={cartItem.quantity >= (cartItem.item.maxQuantityPerMonth || 10)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromCart(cartItem.item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Product Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const Icon = getCategoryIcon(item.category)
                const isInCart = cart.find(cartItem => cartItem.item.id === item.id)
                
                return (
                  <Card key={item.id} className="relative">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                        </div>
                        <Badge variant="outline">{item.pointPrice.toLocaleString()} pts</Badge>
                      </div>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Approx. Value:</span>
                          <span>LKR {item.approximateValueLKR.toLocaleString()}</span>
                        </div>
                        {item.stockQuantity !== undefined && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Stock:</span>
                            <span>{item.stockQuantity} available</span>
                          </div>
                        )}
                        {item.maxQuantityPerMonth && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Max per month:</span>
                            <span>{item.maxQuantityPerMonth}</span>
                          </div>
                        )}
                        
                        {isInCart ? (
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, isInCart.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{isInCart.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, isInCart.quantity + 1)}
                              disabled={isInCart.quantity >= (item.maxQuantityPerMonth || 10)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFromCart(item.id)}
                              className="ml-auto"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            onClick={() => addToCart(item)}
                            className="w-full"
                            disabled={(student?.available_points ?? student?.total_points ?? 0) < item.pointPrice}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add to Cart
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Purchase Orders</CardTitle>
                <CardDescription>
                  Track your purchase orders and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order, idx) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">Order {order.name || `#${idx+1}`}</h4>
                            <p className="text-sm text-muted-foreground">
                              {order.request_date} • {(order.total_points || 0).toLocaleString()} points
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(order.status)}
                            {order.qr_code && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setCurrentOrder(order)
                                  setIsQRCodeOpen(true)
                                }}
                              >
                                <QrCode className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          {(orderItemsMap[order.name] || []).map((oi) => (
                            <div key={oi.id} className="flex items-center justify-between text-sm">
                              <span>{oi.catalogItemId}</span>
                              <span>{oi.quantity} × {oi.pointsPerItem?.toLocaleString?.() || oi.pointsPerItem} pts</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            {order.delivery_method === 'pickup' ? (
                              <>
                                <Store className="h-4 w-4" />
                                <span>Pickup</span>
                              </>
                            ) : (
                              <>
                                <Truck className="h-4 w-4" />
                                <span>Delivery to {order.delivery_address}</span>
                              </>
                            )}
                          </div>
                          {order.notes && (
                            <span>Notes: {order.notes}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                    <p>Browse the catalog and make your first purchase!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* QR Code Modal */}
      <Dialog open={isQRCodeOpen} onOpenChange={setIsQRCodeOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order Confirmation</DialogTitle>
            <DialogDescription>
              Your order has been submitted successfully!
            </DialogDescription>
          </DialogHeader>
          {currentOrder && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg inline-block">
                  {qrCodeUrl ? (
                    <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                  ) : (
                    <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                      <QrCode className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Show this QR code when collecting your order
                </p>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Order Details</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Order ID:</span>
                    <span>#{currentOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Points:</span>
                    <span>{currentOrder.totalPoints.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span>{currentOrder.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Items:</span>
                    <span>{currentOrder.items.length}</span>
                  </div>
                </div>
              </div>
              
              <Button onClick={() => setIsQRCodeOpen(false)} className="w-full">
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}