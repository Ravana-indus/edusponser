'use client'

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  ArrowLeft, 
  Package, 
  User, 
  Building, 
  Calendar, 
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Eye,
  Edit,
  Truck,
  MapPin
} from "lucide-react"
import Navigation from "@/components/layout/Navigation"
import AuthGuard from "@/components/auth/AuthGuard"
import { supabase } from "@/lib/supabase/client"

function OrderDetailsPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('id')
  
  const [order, setOrder] = useState<any | null>(null)
  const [orderItems, setOrderItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const loadOrderDetails = async () => {
      if (!orderId) { 
        setLoading(false)
        return 
      }

      try {
        // Fetch order details
        const { data: orderData, error: orderError } = await supabase
          .from('view_purchase_orders_full')
          .select('*')
          .eq('order_id', orderId)
          .single()

        if (orderError) throw orderError

        setOrder(orderData)

        // Fetch order items
        const { data: itemsData, error: itemsError } = await supabase
          .from('view_purchase_order_items_expanded')
          .select('*')
          .eq('order_id', orderId)

        if (itemsError) throw itemsError

        setOrderItems(itemsData || [])
      } catch (error) {
        console.error('Error loading order details:', error)
        router.push('/admin/dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadOrderDetails()
  }, [orderId, router])

  const updateOrderStatus = async (newStatus: string, notes?: string) => {
    setUpdating(true)
    try {
      const update: any = { status: newStatus }
      
      if (newStatus === 'approved') {
        update.approved_date = new Date().toISOString().split('T')[0]
      } else if (newStatus === 'fulfilled') {
        update.fulfilled_date = new Date().toISOString().split('T')[0]
      } else if (newStatus === 'rejected' && notes) {
        update.rejection_reason = notes
      }
      
      if (notes) update.notes = notes

      const { error } = await supabase
        .from('purchase_orders')
        .update(update)
        .eq('name', orderId)

      if (error) throw error

      // Refresh order data
      const { data: updatedOrder } = await supabase
        .from('view_purchase_orders_full')
        .select('*')
        .eq('order_id', orderId)
        .single()

      if (updatedOrder) {
        setOrder(updatedOrder)
      }
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Error updating order status')
    } finally {
      setUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'approved':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case 'fulfilled':
        return <Badge variant="default" className="bg-green-100 text-green-800"><Package className="h-3 w-3 mr-1" />Fulfilled</Badge>
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (date: string) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString()
  }

  const formatCurrency = (amount: number) => `$${amount?.toLocaleString() || 0}`

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading order details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
            <p className="text-muted-foreground mb-4">The order you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/admin/dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
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
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Order Details: {order.order_id}
              </h1>
              <p className="text-muted-foreground">
                Placed on {formatDate(order.request_date)}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {getStatusBadge(order.status)}
              <div className="text-right">
                <div className="text-2xl font-bold">{order.total_points?.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Order Items
                </CardTitle>
                <CardDescription>
                  Items included in this purchase order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Points Each</TableHead>
                      <TableHead>Total Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="font-medium">{item.item_name}</div>
                          <div className="text-sm text-muted-foreground">
                            Item ID: {item.item}
                          </div>
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.points_per_item?.toLocaleString()}</TableCell>
                        <TableCell className="font-medium">
                          {item.total_points?.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Order Total:</span>
                  <span className="text-2xl font-bold">{order.total_points?.toLocaleString()} Points</span>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">Order Placed</div>
                      <div className="text-sm text-muted-foreground">{formatDate(order.request_date)}</div>
                    </div>
                  </div>
                  
                  {order.approved_date && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <div className="font-medium">Order Approved</div>
                        <div className="text-sm text-muted-foreground">{formatDate(order.approved_date)}</div>
                      </div>
                    </div>
                  )}
                  
                  {order.fulfilled_date && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div>
                        <div className="font-medium">Order Fulfilled</div>
                        <div className="text-sm text-muted-foreground">{formatDate(order.fulfilled_date)}</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Student Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Student Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="font-medium">{order.student_name}</div>
                  <div className="text-sm text-muted-foreground">Student ID: {order.student_id}</div>
                </div>
              </CardContent>
            </Card>

            {/* Vendor Information */}
            {order.vendor_name && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="mr-2 h-5 w-5" />
                    Vendor Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="font-medium">{order.vendor_name}</div>
                    <div className="text-sm text-muted-foreground">Vendor ID: {order.vendor_id}</div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Delivery Information */}
            {order.delivery_method && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="mr-2 h-5 w-5" />
                    Delivery Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Method:</span>
                    <span className="text-sm font-medium">{order.delivery_method}</span>
                  </div>
                  {order.delivery_address && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Address:</span>
                      <span className="text-sm">{order.delivery_address}</span>
                    </div>
                  )}
                  {order.expected_delivery_date && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Expected:</span>
                      <span className="text-sm">{formatDate(order.expected_delivery_date)}</span>
                    </div>
                  )}
                  {order.actual_delivery_date && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Delivered:</span>
                      <span className="text-sm">{formatDate(order.actual_delivery_date)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Order Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Order Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.status === 'pending' && (
                  <>
                    <Button 
                      className="w-full"
                      onClick={() => updateOrderStatus('approved')}
                      disabled={updating}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve Order
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={() => updateOrderStatus('rejected', 'Rejected by admin')}
                      disabled={updating}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject Order
                    </Button>
                  </>
                )}
                
                {order.status === 'approved' && (
                  <Button 
                    className="w-full"
                    onClick={() => updateOrderStatus('fulfilled')}
                    disabled={updating}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Mark as Fulfilled
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push(`/admin/edit-order?id=${order.order_id}`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Order
                </Button>
              </CardContent>
            </Card>

            {/* Notes */}
            {order.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{order.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OrderDetailsPage() {
  return (
    <AuthGuard requiredRole="admin">
      <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-background to-muted" />}>
        <OrderDetailsPageInner />
      </Suspense>
    </AuthGuard>
  )
}
