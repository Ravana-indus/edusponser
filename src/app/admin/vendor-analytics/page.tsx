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
  Mail,
  Building,
  FileText,
  Settings,
  ThumbsUp,
  ThumbsDown,
  Activity,
  Award,
  Globe,
  TrendingDownIcon,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Plus,
  XCircle
} from "lucide-react"
import Navigation from "@/components/layout/Navigation"

interface VendorAnalytics {
  overview: {
    totalVendors: number
    activeVendors: number
    pendingVendors: number
    suspendedVendors: number
    totalRevenue: number
    totalOrders: number
    averageOrderValue: number
    totalCustomers: number
    averageRating: number
    fulfillmentRate: number
    applicationProcessingTime: string
    vendorRetentionRate: number
  }
  revenue: {
    monthly: Array<{
      month: string
      revenue: number
      orders: number
      vendors: number
    }>
    byCategory: Array<{
      category: string
      revenue: number
      percentage: number
      growth: number
    }>
    byVendor: Array<{
      name: string
      revenue: number
      orders: number
      growth: number
    }>
    topPerformers: Array<{
      name: string
      revenue: number
      growth: number
      rating: number
    }>
  }
  performance: {
    ratingDistribution: Array<{
      rating: string
      count: number
      percentage: number
    }>
    fulfillmentMetrics: {
      onTimeDelivery: number
      averageProcessingTime: string
      averageDeliveryTime: string
      returnRate: number
    }
    vendorPerformance: Array<{
      name: string
      rating: number
      fulfillmentRate: number
      responseTime: string
      issues: number
    }>
    qualityTrends: Array<{
      month: string
      averageRating: number
      fulfillmentRate: number
      complaintRate: number
    }>
  }
  operations: {
    applicationTrends: Array<{
      month: string
      applications: number
      approved: number
      rejected: number
    }>
    processingTimes: Array<{
      stage: string
      averageTime: string
      target: string
      status: 'good' | 'warning' | 'poor'
    }>
    vendorLifecycle: Array<{
      stage: string
      count: number
      percentage: number
    }>
    geographicDistribution: Array<{
      region: string
      vendors: number
      revenue: number
      growth: number
    }>
  }
  financial: {
    paymentProcessing: Array<{
      month: string
      processed: number
      failed: number
      averageAmount: number
    }>
    revenueDistribution: Array<{
      range: string
      count: number
      percentage: number
    }>
    costAnalysis: {
      platformFees: number
      paymentProcessing: number
      supportCosts: number
      totalCosts: number
      netRevenue: number
    }
    vendorPayouts: Array<{
      vendor: string
      amount: number
      orders: number
      lastPayment: string
    }>
  }
}

export default function VendorAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('6months')
  const [analytics, setAnalytics] = useState<VendorAnalytics | null>(null)

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = () => {
    const mockAnalytics: VendorAnalytics = {
      overview: {
        totalVendors: 45,
        activeVendors: 32,
        pendingVendors: 8,
        suspendedVendors: 5,
        totalRevenue: 8800000,
        totalOrders: 1750,
        averageOrderValue: 5028,
        totalCustomers: 1200,
        averageRating: 4.4,
        fulfillmentRate: 94,
        applicationProcessingTime: "3.5 days",
        vendorRetentionRate: 87
      },
      revenue: {
        monthly: [
          { month: 'Oct', revenue: 1200000, orders: 238, vendors: 28 },
          { month: 'Nov', revenue: 1350000, orders: 268, vendors: 30 },
          { month: 'Dec', revenue: 1500000, orders: 298, vendors: 32 },
          { month: 'Jan', revenue: 1400000, orders: 278, vendors: 31 },
          { month: 'Feb', revenue: 1300000, orders: 258, vendors: 30 },
          { month: 'Mar', revenue: 1450000, orders: 288, vendors: 32 }
        ],
        byCategory: [
          { category: 'Books', revenue: 3200000, percentage: 36.4, growth: 12.5 },
          { category: 'Technology', revenue: 2400000, percentage: 27.3, growth: 18.2 },
          { category: 'Stationery', revenue: 1600000, percentage: 18.2, growth: 8.3 },
          { category: 'Uniforms', revenue: 960000, percentage: 10.9, growth: 15.8 },
          { category: 'Equipment', revenue: 640000, percentage: 7.2, growth: 5.2 }
        ],
        byVendor: [
          { name: 'Book Haven', revenue: 1200000, growth: 15.2 },
          { name: 'Tech Solutions', revenue: 980000, growth: 22.1 },
          { name: 'Stationery Hub', revenue: 750000, growth: 8.7 },
          { name: 'Uniform World', revenue: 620000, growth: 12.3 },
          { name: 'Educational Equipment Co', revenue: 480000, growth: -5.2 }
        ],
        topPerformers: [
          { name: 'Tech Solutions', revenue: 980000, growth: 22.1, rating: 4.8 },
          { name: 'Book Haven', revenue: 1200000, growth: 15.2, rating: 4.7 },
          { name: 'Uniform World', revenue: 620000, growth: 12.3, rating: 4.6 },
          { name: 'Stationery Hub', revenue: 750000, growth: 8.7, rating: 4.4 },
          { name: 'Learning Tools Ltd', revenue: 380000, growth: 25.8, rating: 4.9 }
        ]
      },
      performance: {
        ratingDistribution: [
          { rating: '5.0', count: 18, percentage: 40 },
          { rating: '4.0-4.9', count: 15, percentage: 33.3 },
          { rating: '3.0-3.9', count: 8, percentage: 17.8 },
          { rating: '2.0-2.9', count: 3, percentage: 6.7 },
          { rating: '1.0-1.9', count: 1, percentage: 2.2 }
        ],
        fulfillmentMetrics: {
          onTimeDelivery: 94,
          averageProcessingTime: "4.2 hours",
          averageDeliveryTime: "1.8 days",
          returnRate: 2.1
        },
        vendorPerformance: [
          { name: 'Tech Solutions', rating: 4.8, fulfillmentRate: 98, responseTime: "1 hour", issues: 2 },
          { name: 'Book Haven', rating: 4.7, fulfillmentRate: 96, responseTime: "2 hours", issues: 3 },
          { name: 'Learning Tools Ltd', rating: 4.9, fulfillmentRate: 99, responseTime: "30 minutes", issues: 1 },
          { name: 'Uniform World', rating: 4.6, fulfillmentRate: 94, responseTime: "3 hours", issues: 5 },
          { name: 'Stationery Hub', rating: 4.4, fulfillmentRate: 91, responseTime: "4 hours", issues: 8 }
        ],
        qualityTrends: [
          { month: 'Oct', averageRating: 4.3, fulfillmentRate: 92, complaintRate: 3.2 },
          { month: 'Nov', averageRating: 4.4, fulfillmentRate: 93, complaintRate: 2.8 },
          { month: 'Dec', averageRating: 4.5, fulfillmentRate: 94, complaintRate: 2.5 },
          { month: 'Jan', averageRating: 4.4, fulfillmentRate: 93, complaintRate: 2.9 },
          { month: 'Feb', averageRating: 4.4, fulfillmentRate: 94, complaintRate: 2.3 },
          { month: 'Mar', averageRating: 4.5, fulfillmentRate: 95, complaintRate: 2.1 }
        ]
      },
      operations: {
        applicationTrends: [
          { month: 'Oct', applications: 12, approved: 8, rejected: 2 },
          { month: 'Nov', applications: 15, approved: 10, rejected: 3 },
          { month: 'Dec', applications: 18, approved: 12, rejected: 4 },
          { month: 'Jan', applications: 14, approved: 9, rejected: 3 },
          { month: 'Feb', applications: 16, approved: 11, rejected: 3 },
          { month: 'Mar', applications: 20, approved: 14, rejected: 4 }
        ],
        processingTimes: [
          { stage: 'Initial Review', averageTime: '1.2 days', target: '1 day', status: 'warning' },
          { stage: 'Document Verification', averageTime: '2.1 days', target: '2 days', status: 'good' },
          { stage: 'Background Check', averageTime: '1.8 days', target: '2 days', status: 'good' },
          { stage: 'Final Decision', averageTime: '0.8 days', target: '1 day', status: 'good' },
          { stage: 'Onboarding', averageTime: '2.5 days', target: '2 days', status: 'warning' }
        ],
        vendorLifecycle: [
          { stage: 'Application', count: 8, percentage: 17.8 },
          { stage: 'Active', count: 32, percentage: 71.1 },
          { stage: 'Suspended', count: 3, percentage: 6.7 },
          { stage: 'Inactive', count: 2, percentage: 4.4 }
        ],
        geographicDistribution: [
          { region: 'Colombo', vendors: 18, revenue: 4200000, growth: 15.2 },
          { region: 'Kandy', vendors: 12, revenue: 2800000, growth: 12.8 },
          { region: 'Galle', vendors: 8, revenue: 1200000, growth: 8.5 },
          { region: 'Jaffna', vendors: 4, revenue: 450000, growth: 22.1 },
          { region: 'Other', vendors: 3, revenue: 150000, growth: 5.2 }
        ]
      },
      financial: {
        paymentProcessing: [
          { month: 'Oct', processed: 2350000, failed: 25000, averageAmount: 5028 },
          { month: 'Nov', processed: 2650000, failed: 28000, averageAmount: 5028 },
          { month: 'Dec', processed: 2950000, failed: 32000, averageAmount: 5028 },
          { month: 'Jan', processed: 2750000, failed: 30000, averageAmount: 5028 },
          { month: 'Feb', processed: 2550000, failed: 27000, averageAmount: 5028 },
          { month: 'Mar', processed: 2850000, failed: 31000, averageAmount: 5028 }
        ],
        revenueDistribution: [
          { range: '0-10K', count: 8, percentage: 17.8 },
          { range: '10K-50K', count: 12, percentage: 26.7 },
          { range: '50K-100K', count: 15, percentage: 33.3 },
          { range: '100K-500K', count: 8, percentage: 17.8 },
          { range: '500K+', count: 2, percentage: 4.4 }
        ],
        costAnalysis: {
          platformFees: 440000,
          paymentProcessing: 176000,
          supportCosts: 132000,
          totalCosts: 748000,
          netRevenue: 8052000
        },
        vendorPayouts: [
          { vendor: 'Book Haven', amount: 1152000, orders: 238, lastPayment: '2024-03-25' },
          { vendor: 'Tech Solutions', amount: 940800, orders: 188, lastPayment: '2024-03-25' },
          { vendor: 'Stationery Hub', amount: 720000, orders: 144, lastPayment: '2024-03-25' },
          { vendor: 'Uniform World', amount: 595200, orders: 119, lastPayment: '2024-03-25' },
          { vendor: 'Educational Equipment Co', amount: 460800, orders: 92, lastPayment: '2024-02-25' }
        ]
      }
    }

    setAnalytics(mockAnalytics)
    setLoading(false)
  }

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (growth < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return "text-green-600"
    if (growth < 0) return "text-red-600"
    return "text-gray-600"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'poor': return 'text-red-600'
      default: return 'text-gray-600'
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
              <p>Loading vendor analytics...</p>
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
              <h1 className="text-3xl font-bold">Vendor Analytics</h1>
              <p className="text-muted-foreground">
                Comprehensive insights and performance metrics for vendors
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
              <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.totalVendors}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.overview.activeVendors} active • {analytics.overview.vendorRetentionRate}% retention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(analytics.overview.totalRevenue / 1000000).toFixed(1)}M</div>
              <p className="text-xs text-muted-foreground">
                From {analytics.overview.totalOrders} orders
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
                {analytics.overview.fulfillmentRate}% fulfillment rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.applicationProcessingTime}</div>
              <p className="text-xs text-muted-foreground">
                Avg. application processing
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue and vendor growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.revenue.monthly.map((month, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{month.month}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{(month.revenue / 1000000).toFixed(1)}M</div>
                          <div className="text-xs text-muted-foreground">{month.orders} orders • {month.vendors} vendors</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Category</CardTitle>
                  <CardDescription>Breakdown by product category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.revenue.byCategory.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{category.category}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{category.percentage}%</span>
                            {getGrowthIcon(category.growth)}
                            <span className={`text-xs ${getGrowthColor(category.growth)}`}>
                              {category.growth > 0 ? '+' : ''}{category.growth}%
                            </span>
                          </div>
                        </div>
                        <Progress value={category.percentage} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {(category.revenue / 1000000).toFixed(1)}M revenue
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Vendors</CardTitle>
                  <CardDescription>Vendors with highest growth and ratings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.revenue.topPerformers.map((vendor, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                            <span className="text-sm font-semibold">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{vendor.name}</p>
                            <div className="flex items-center space-x-2">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span className="text-sm">{vendor.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{(vendor.revenue / 1000000).toFixed(1)}M</div>
                          <div className="flex items-center justify-end space-x-1">
                            {getGrowthIcon(vendor.growth)}
                            <span className={`text-xs ${getGrowthColor(vendor.growth)}`}>
                              {vendor.growth > 0 ? '+' : ''}{vendor.growth}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Distribution</CardTitle>
                  <CardDescription>Vendor revenue ranges</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.financial.revenueDistribution.map((range, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{range.range}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{range.percentage}%</span>
                            <span className="text-xs text-muted-foreground">({range.count} vendors)</span>
                          </div>
                        </div>
                        <Progress value={range.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Rating Distribution</CardTitle>
                  <CardDescription>Customer satisfaction across vendors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.performance.ratingDistribution.map((rating, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{rating.rating} Stars</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{rating.percentage}%</span>
                            <span className="text-xs text-muted-foreground">({rating.count} vendors)</span>
                          </div>
                        </div>
                        <Progress value={rating.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fulfillment Metrics</CardTitle>
                  <CardDescription>Order processing and delivery performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold">{analytics.performance.fulfillmentMetrics.onTimeDelivery}%</div>
                      <div className="text-sm text-muted-foreground">On-time delivery</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                        <Clock className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold">{analytics.performance.fulfillmentMetrics.averageProcessingTime}</div>
                      <div className="text-sm text-muted-foreground">Avg. processing</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
                        <Truck className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold">{analytics.performance.fulfillmentMetrics.averageDeliveryTime}</div>
                      <div className="text-sm text-muted-foreground">Avg. delivery</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2">
                        <AlertTriangle className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="text-2xl font-bold">{analytics.performance.fulfillmentMetrics.returnRate}%</div>
                      <div className="text-sm text-muted-foreground">Return rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Performance</CardTitle>
                  <CardDescription>Key performance indicators by vendor</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.performance.vendorPerformance.map((vendor, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                            <span className="text-sm font-semibold">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{vendor.name}</p>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span>{vendor.rating}</span>
                              <span>•</span>
                              <span>{vendor.fulfillmentRate}% fulfillment</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{vendor.responseTime}</div>
                          <div className="text-xs text-muted-foreground">
                            {vendor.issues} issues
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quality Trends</CardTitle>
                  <CardDescription>Monthly quality and satisfaction metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.performance.qualityTrends.map((trend, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{trend.month}</span>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span className="text-sm">{trend.averageRating}</span>
                            </div>
                            <div className="text-sm">{trend.fulfillmentRate}%</div>
                            <div className="text-sm text-red-600">{trend.complaintRate}%</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <Progress value={trend.averageRating * 20} className="h-1" />
                          <Progress value={trend.fulfillmentRate} className="h-1" />
                          <Progress value={trend.complaintRate * 10} className="h-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="operations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Application Trends</CardTitle>
                  <CardDescription>Monthly application processing metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.operations.applicationTrends.map((trend, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{trend.month}</span>
                          <div className="flex items-center space-x-4">
                            <div className="text-sm">{trend.applications} applications</div>
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span className="text-sm">{trend.approved}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <XCircle className="h-3 w-3 text-red-500" />
                              <span className="text-sm">{trend.rejected}</span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <Progress value={(trend.applications / 25) * 100} className="h-1" />
                          <Progress value={(trend.approved / trend.applications) * 100} className="h-1" />
                          <Progress value={(trend.rejected / trend.applications) * 100} className="h-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Processing Times</CardTitle>
                  <CardDescription>Application processing stage performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.operations.processingTimes.map((stage, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                            <span className="text-sm font-semibold">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{stage.stage}</p>
                            <p className="text-sm text-muted-foreground">Target: {stage.target}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{stage.averageTime}</div>
                          <div className={`text-xs ${getStatusColor(stage.status)}`}>
                            {stage.status.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Lifecycle</CardTitle>
                  <CardDescription>Current distribution of vendor stages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {analytics.operations.vendorLifecycle.map((stage, index) => (
                      <div key={index} className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold mb-2">{stage.count}</div>
                        <div className="text-sm font-medium mb-1">{stage.stage}</div>
                        <div className="text-xs text-muted-foreground">{stage.percentage}% of total</div>
                        <Progress value={stage.percentage} className="h-2 mt-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Geographic Distribution</CardTitle>
                  <CardDescription>Vendor distribution by region</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.operations.geographicDistribution.map((region, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                            <MapPin className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{region.region}</p>
                            <p className="text-sm text-muted-foreground">{region.vendors} vendors</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{(region.revenue / 1000000).toFixed(1)}M</div>
                          <div className="flex items-center justify-end space-x-1">
                            {getGrowthIcon(region.growth)}
                            <span className={`text-xs ${getGrowthColor(region.growth)}`}>
                              {region.growth > 0 ? '+' : ''}{region.growth}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Processing</CardTitle>
                  <CardDescription>Monthly payment processing metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.financial.paymentProcessing.map((payment, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{payment.month}</span>
                          <div className="flex items-center space-x-4">
                            <div className="text-sm">{(payment.processed / 1000000).toFixed(1)}M processed</div>
                            <div className="text-sm text-red-600">{(payment.failed / 1000).toFixed(0)}K failed</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Progress value={(payment.processed / 3000000) * 100} className="h-1" />
                          <Progress value={(payment.failed / payment.processed) * 100} className="h-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost Analysis</CardTitle>
                  <CardDescription>Platform costs and net revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-lg font-bold">{(analytics.financial.costAnalysis.platformFees / 1000).toFixed(0)}K</div>
                        <div className="text-sm text-muted-foreground">Platform Fees</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-lg font-bold">{(analytics.financial.costAnalysis.paymentProcessing / 1000).toFixed(0)}K</div>
                        <div className="text-sm text-muted-foreground">Payment Processing</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-lg font-bold">{(analytics.financial.costAnalysis.supportCosts / 1000).toFixed(0)}K</div>
                        <div className="text-sm text-muted-foreground">Support Costs</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-lg font-bold">{(analytics.financial.costAnalysis.netRevenue / 1000000).toFixed(1)}M</div>
                        <div className="text-sm text-muted-foreground">Net Revenue</div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span>Total Costs</span>
                        <span className="font-semibold">{(analytics.financial.costAnalysis.totalCosts / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Profit Margin</span>
                        <span className="font-semibold">
                          {((analytics.financial.costAnalysis.netRevenue / analytics.overview.totalRevenue) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Vendor Payouts</CardTitle>
                <CardDescription>Latest vendor payment transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.financial.vendorPayouts.map((payout, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                          <DollarSign className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{payout.vendor}</p>
                          <p className="text-sm text-muted-foreground">{payout.orders} orders</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{(payout.amount / 1000).toFixed(0)}K</div>
                        <div className="text-xs text-muted-foreground">{payout.lastPayment}</div>
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