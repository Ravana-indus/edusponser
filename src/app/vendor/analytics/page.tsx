'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Users, 
  Star,
  Clock,
  Truck,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  Target,
  Zap,
  Eye,
  ShoppingCart,
  CreditCard,
  MapPin,
  Phone,
  Mail
} from "lucide-react"
import Navigation from "@/components/layout/Navigation"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/lib/frappe/auth"

interface AnalyticsData {
  overview: {
    totalRevenue: number
    totalOrders: number
    averageOrderValue: number
    totalCustomers: number
    conversionRate: number
    fulfillmentRate: number
    averageRating: number
    responseTime: string
  }
  revenue: {
    monthly: Array<{
      month: string
      revenue: number
      orders: number
    }>
    byCategory: Array<{
      category: string
      revenue: number
      percentage: number
    }>
    topProducts: Array<{
      name: string
      revenue: number
      orders: number
    }>
  }
  orders: {
    statusBreakdown: Array<{
      status: string
      count: number
      percentage: number
    }>
    monthlyTrend: Array<{
      month: string
      orders: number
      completed: number
      cancelled: number
    }>
    deliveryPerformance: {
      onTime: number
      delayed: number
      averageDeliveryTime: string
    }
  }
  customers: {
    newVsReturning: {
      new: number
      returning: number
    }
    topCustomers: Array<{
      name: string
      orders: number
      revenue: number
    }>
    geographic: Array<{
      location: string
      orders: number
      revenue: number
    }>
  }
  performance: {
    ratingTrend: Array<{
      month: string
      rating: number
      reviews: number
    }>
    fulfillmentMetrics: {
      orderProcessingTime: string
      pickupTime: string
      deliveryTime: string
    }
    issues: Array<{
      type: string
      count: number
      trend: 'up' | 'down' | 'stable'
    }>
  }
}

export default function VendorAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('6months')
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const auth = useAuth()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        // 1) Resolve vendor identity (by logged-in email or fallback to first active vendor)
        const email = auth.user?.email || ''
        let vendorName: string | null = null
        if (email) {
          const { data: v } = await supabase.from('vendors').select('name').eq('email', email).maybeSingle()
          vendorName = v?.name || null
        }
        if (!vendorName) {
          const { data: v2 } = await supabase.from('vendors').select('name').eq('status','active').limit(1)
          vendorName = v2 && v2.length ? v2[0].name : null
        }
        if (!vendorName) {
          setAnalytics(null)
          setLoading(false)
          return
        }

        // Time range boundaries (approximate month windows)
        const now = new Date()
        const monthsBack = timeRange === '1month' ? 1 : timeRange === '3months' ? 3 : timeRange === '6months' ? 6 : 12
        const start = new Date(now.getFullYear(), now.getMonth() - (monthsBack - 1), 1)
        const startStr = start.toISOString().split('T')[0]

        // 2) Fetch orders for vendor
        const { data: orders } = await supabase
          .from('purchase_orders')
          .select('name, student, total_points, status, request_date, approved_date, fulfilled_date, expected_delivery_date, actual_delivery_date')
          .eq('vendor', vendorName)
          .gte('request_date', startStr)
          .limit(5000)

        const ord = orders || []
        const totalOrders = ord.length
        const fulfilled = ord.filter(o => o.status === 'fulfilled')
        const cancelled = ord.filter(o => o.status === 'cancelled' || o.status === 'rejected')
        const totalRevenue = fulfilled.reduce((s, o) => s + Number(o.total_points || 0), 0)
        const avgOrder = fulfilled.length ? totalRevenue / fulfilled.length : 0
        const uniqueStudents = Array.from(new Set(ord.map(o => o.student)))

        // 3) Status breakdown and monthly trend
        const statusCounts: Record<string, number> = {}
        ord.forEach(o => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1 })
        const statusBreakdown = Object.entries(statusCounts).map(([status, count]) => ({
          status: status === 'fulfilled' ? 'Completed' : status.charAt(0).toUpperCase() + status.slice(1),
          count,
          percentage: totalOrders ? Math.round((count / totalOrders) * 100) : 0,
        }))

        const byMonth: Record<string, { orders: number; completed: number; cancelled: number }> = {}
        const label = (d: string | null) => {
          if (!d) return ''
          const dt = new Date(d)
          return dt.toLocaleString('default', { month: 'short' })
        }
        ord.forEach(o => {
          const m = label(o.request_date)
          if (!m) return
          byMonth[m] = byMonth[m] || { orders: 0, completed: 0, cancelled: 0 }
          byMonth[m].orders += 1
          if (o.status === 'fulfilled') byMonth[m].completed += 1
          if (o.status === 'cancelled' || o.status === 'rejected') byMonth[m].cancelled += 1
        })
        const monthOrder = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        const monthlyTrend = Object.entries(byMonth)
          .sort((a,b) => monthOrder.indexOf(a[0]) - monthOrder.indexOf(b[0]))
          .map(([month, v]) => ({ month, ...v }))

        // 4) Delivery performance
        let onTime = 0, delayed = 0
        let totalHours = 0, countDur = 0
        ord.forEach(o => {
          if (o.expected_delivery_date && o.actual_delivery_date) {
            const exp = new Date(o.expected_delivery_date).getTime()
            const act = new Date(o.actual_delivery_date).getTime()
            if (act <= exp) onTime += 1; else delayed += 1
          }
          if (o.actual_delivery_date) {
            const startTs = new Date(o.approved_date || o.request_date || o.actual_delivery_date).getTime()
            const endTs = new Date(o.actual_delivery_date).getTime()
            const hours = (endTs - startTs) / (1000*60*60)
            if (hours > 0) { totalHours += hours; countDur += 1 }
          }
        })
        const avgHours = countDur ? totalHours / countDur : 0
        const averageDeliveryTime = avgHours >= 24 ? `${(avgHours/24).toFixed(1)} days` : `${avgHours.toFixed(1)} hours`

        // 5) Top products by revenue (using expanded view)
        const { data: items } = await supabase
          .from('view_purchase_order_items_expanded')
          .select('order_id, item_name, quantity, total_points, vendor')
          .eq('vendor', vendorName)
          .limit(10000)
        const perItem: Record<string, { revenue: number; orders: number }> = {}
        ;(items || []).forEach(it => {
          const key = it.item_name || 'Unknown'
          perItem[key] = perItem[key] || { revenue: 0, orders: 0 }
          perItem[key].revenue += Number(it.total_points || 0)
          perItem[key].orders += 1
        })
        const topProducts = Object.entries(perItem)
          .map(([name, v]) => ({ name, revenue: v.revenue, orders: v.orders }))
          .sort((a,b) => b.revenue - a.revenue)
          .slice(0, 5)

        // 6) Ratings
        const { data: reviews } = await supabase
          .from('vendor_reviews')
          .select('rating, review_date, status, is_verified')
          .eq('vendor', vendorName)
          .limit(5000)
        const approved = (reviews || []).filter(r => (r.status || 'approved') !== 'rejected')
        const avgRating = approved.length ? approved.reduce((s, r) => s + Number(r.rating || 0), 0) / approved.length : 0
        const byMonthRating: Record<string, { rating: number; count: number }> = {}
        approved.forEach(r => {
          const m = label(r.review_date || null)
          if (!m) return
          byMonthRating[m] = byMonthRating[m] || { rating: 0, count: 0 }
          byMonthRating[m].rating += Number(r.rating || 0)
          byMonthRating[m].count += 1
        })
        const ratingTrend = Object.entries(byMonthRating)
          .sort((a,b) => monthOrder.indexOf(a[0]) - monthOrder.indexOf(b[0]))
          .map(([month, v]) => ({ month, rating: v.count ? Number((v.rating / v.count).toFixed(1)) : 0, reviews: v.count }))

        // 7) Customers (top and new vs returning)
        const orderCountsByStudent: Record<string, { orders: number; revenue: number }> = {}
        ord.forEach(o => {
          const key = o.student
          orderCountsByStudent[key] = orderCountsByStudent[key] || { orders: 0, revenue: 0 }
          orderCountsByStudent[key].orders += 1
          orderCountsByStudent[key].revenue += Number(o.total_points || 0)
        })
        const newCount = Object.values(orderCountsByStudent).filter(x => x.orders === 1).length
        const returningCount = Object.values(orderCountsByStudent).filter(x => x.orders > 1).length

        // Map student IDs to names
        const studentIds = Object.keys(orderCountsByStudent)
        let studentNameMap: Record<string, string> = {}
        if (studentIds.length) {
          const batches = [] as string[][]
          for (let i = 0; i < studentIds.length; i += 200) batches.push(studentIds.slice(i, i+200))
          for (const batch of batches) {
            const { data: st } = await supabase
              .from('students')
              .select('name, first_name, last_name')
              .in('name', batch)
            ;(st || []).forEach(s => { studentNameMap[s.name] = `${s.first_name || ''} ${s.last_name || ''}`.trim() })
          }
        }
        const topCustomers = Object.entries(orderCountsByStudent)
          .map(([id, v]) => ({ name: studentNameMap[id] || id, orders: v.orders, revenue: v.revenue }))
          .sort((a,b) => b.revenue - a.revenue)
          .slice(0, 5)

        // 8) Fulfillment/Conversion
        const fulfillmentRate = totalOrders ? (fulfilled.length / totalOrders) * 100 : 0
        const conversionRate = fulfillmentRate

        const live: AnalyticsData = {
          overview: {
            totalRevenue,
            totalOrders,
            averageOrderValue: Math.round(avgOrder),
            totalCustomers: uniqueStudents.length,
            conversionRate: Number(conversionRate.toFixed(1)),
            fulfillmentRate: Number(fulfillmentRate.toFixed(1)),
            averageRating: Number(avgRating.toFixed(1)),
            responseTime: averageDeliveryTime,
          },
          revenue: {
            monthly: monthlyTrend.map(m => ({ month: m.month, revenue: 0, orders: m.orders })),
            byCategory: [],
            topProducts,
          },
          orders: {
            statusBreakdown,
            monthlyTrend,
            deliveryPerformance: { onTime, delayed, averageDeliveryTime },
          },
          customers: {
            newVsReturning: { new: newCount, returning: returningCount },
            topCustomers,
            geographic: [],
          },
          performance: {
            ratingTrend,
            fulfillmentMetrics: {
              orderProcessingTime: '-',
              pickupTime: '-',
              deliveryTime: averageDeliveryTime,
            },
            issues: [
              { type: 'Cancelled Orders', count: cancelled.length, trend: 'stable' },
              { type: 'Delayed Deliveries', count: delayed, trend: 'stable' },
            ],
          },
        }

        setAnalytics(live)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [timeRange, auth.user])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "Cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-green-500" />
      case 'stable':
        return <BarChart3 className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading analytics...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Navigation user={{
        id: 1,
        firstName: "Vendor",
        lastName: "User",
        email: "vendor@edusponsor.com",
        role: "vendor"
      }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Track your business performance and customer insights
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Points earned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.overview.fulfillmentRate}% fulfillment rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.overview.conversionRate}% conversion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.averageRating}/5.0</div>
              <p className="text-xs text-muted-foreground">
                {analytics.overview.responseTime} avg response
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue and order volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.revenue.monthly.map((month, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{month.month}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{month.revenue.toLocaleString()} pts</div>
                          <div className="text-xs text-muted-foreground">{month.orders} orders</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Category</CardTitle>
                  <CardDescription>Breakdown of revenue by product category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.revenue.byCategory.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{category.category}</span>
                          <span className="text-sm">{category.percentage}%</span>
                        </div>
                        <Progress value={category.percentage} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {category.revenue.toLocaleString()} points
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
                <CardDescription>Your best-selling products by revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.revenue.topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                          <span className="text-sm font-semibold">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.orders} orders</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{product.revenue.toLocaleString()} pts</div>
                        <div className="text-xs text-muted-foreground">
                          {(product.revenue / product.orders).toLocaleString()} pts/order
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Status Breakdown</CardTitle>
                  <CardDescription>Current status of all orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.orders.statusBreakdown.map((status, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(status.status)}
                            <span className="text-sm font-medium">{status.count}</span>
                          </div>
                          <span className="text-sm">{status.percentage}%</span>
                        </div>
                        <Progress value={status.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Order Trend</CardTitle>
                  <CardDescription>Order completion and cancellation trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.orders.monthlyTrend.map((month, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{month.month}</span>
                          <span className="text-sm">{month.orders} orders</span>
                        </div>
                        <div className="flex space-x-2">
                          <div className="flex-1">
                            <div className="text-xs text-green-600 mb-1">
                              Completed: {month.completed}
                            </div>
                            <Progress value={(month.completed / month.orders) * 100} className="h-1" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-red-600 mb-1">
                              Cancelled: {month.cancelled}
                            </div>
                            <Progress value={(month.cancelled / month.orders) * 100} className="h-1" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Performance</CardTitle>
                <CardDescription>On-time delivery metrics and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-2">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold">{analytics.orders.deliveryPerformance.onTime}</div>
                    <div className="text-sm text-muted-foreground">On-time deliveries</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-2">
                      <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                    <div className="text-2xl font-bold">{analytics.orders.deliveryPerformance.delayed}</div>
                    <div className="text-sm text-muted-foreground">Delayed deliveries</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-2">
                      <Clock className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold">{analytics.orders.deliveryPerformance.averageDeliveryTime}</div>
                    <div className="text-sm text-muted-foreground">Average delivery time</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Types</CardTitle>
                  <CardDescription>New vs returning customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-2">
                        {analytics.customers.newVsReturning.new + analytics.customers.newVsReturning.returning}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Customers</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{analytics.customers.newVsReturning.new}</div>
                        <div className="text-sm text-muted-foreground">New Customers</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{analytics.customers.newVsReturning.returning}</div>
                        <div className="text-sm text-muted-foreground">Returning</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Customers</CardTitle>
                  <CardDescription>Your most valuable customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.customers.topCustomers.map((customer, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                            <span className="text-sm font-semibold">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-muted-foreground">{customer.orders} orders</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{customer.revenue.toLocaleString()} pts</div>
                          <div className="text-xs text-muted-foreground">
                            {(customer.revenue / customer.orders).toLocaleString()} avg
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>Orders and revenue by location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {analytics.customers.geographic.map((location, index) => (
                    <div key={index} className="text-center p-4 border rounded-lg">
                      <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-2">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div className="font-semibold">{location.location}</div>
                      <div className="text-sm text-muted-foreground">{location.orders} orders</div>
                      <div className="text-sm font-medium">{location.revenue.toLocaleString()} pts</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Rating Trend</CardTitle>
                  <CardDescription>Customer ratings over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.performance.ratingTrend.map((month, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{month.month}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">{month.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">({month.reviews} reviews)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fulfillment Metrics</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium">Order Processing</p>
                          <p className="text-sm text-muted-foreground">Time to process order</p>
                        </div>
                      </div>
                      <span className="font-semibold">{analytics.performance.fulfillmentMetrics.orderProcessingTime}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Truck className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">Pickup Time</p>
                          <p className="text-sm text-muted-foreground">Time to pickup order</p>
                        </div>
                      </div>
                      <span className="font-semibold">{analytics.performance.fulfillmentMetrics.pickupTime}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Package className="h-5 w-5 text-purple-500" />
                        <div>
                          <p className="font-medium">Delivery Time</p>
                          <p className="text-sm text-muted-foreground">Time to deliver order</p>
                        </div>
                      </div>
                      <span className="font-semibold">{analytics.performance.fulfillmentMetrics.deliveryTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Issues & Trends</CardTitle>
                <CardDescription>Common issues and improvement trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {analytics.performance.issues.map((issue, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{issue.type}</span>
                        {getTrendIcon(issue.trend)}
                      </div>
                      <div className="text-2xl font-bold">{issue.count}</div>
                      <div className="text-xs text-muted-foreground">
                        Trend: {issue.trend}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}