// Vendor-related TypeScript interfaces for EduSponsor Frappe integration

export interface Vendor {
  name: string // Frappe document name
  vendor_name: string
  vendor_category: string // Link to VendorCategory
  contact_person: string
  email: string
  phone: string
  address: string
  website?: string
  business_registration?: string
  tax_id?: string
  business_type?: 'sole-proprietorship' | 'partnership' | 'corporation' | 'llc'
  employee_count?: number
  established_year?: number
  description?: string
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  verification_status: 'verified' | 'pending' | 'rejected'
  join_date: string
  average_rating?: number
  total_reviews?: number
  response_time?: string
  fulfillment_rate?: number
  profile_image?: string
  cover_image?: string
  notes?: string
  creation?: string
  modified?: string
  owner?: string
  modified_by?: string
}

export interface VendorDocument {
  name: string
  parent: string // Link to Vendor
  parenttype: string
  parentfield: string
  document_type: 'business-registration' | 'tax-certificate' | 'bank-statement' | 'identification'
  document_name: string
  file: string // File URL
  status: 'verified' | 'pending' | 'rejected'
  verified_by?: string
  verification_date?: string
  notes?: string
  creation?: string
  modified?: string
}

export interface VendorSpecialty {
  name: string
  parent: string // Link to Vendor
  parenttype: string
  parentfield: string
  specialty: string
  creation?: string
  modified?: string
}

export interface VendorCertification {
  name: string
  parent: string // Link to Vendor
  parenttype: string
  parentfield: string
  certification_name: string
  issuing_authority: string
  issue_date: string
  expiry_date?: string
  certificate_file: string // File URL
  creation?: string
  modified?: string
}

export interface VendorCategory {
  name: string
  category_name: string
  description?: string
  is_active: boolean
  parent_category?: string // Link to VendorCategory
  creation?: string
  modified?: string
}

export interface PaymentAccount {
  name: string
  vendor: string // Link to Vendor
  bank_name: string
  account_number: string
  account_holder: string
  branch?: string
  is_primary: boolean
  status: 'active' | 'inactive'
  account_type: 'savings' | 'current' | 'business'
  swift_code?: string
  routing_number?: string
  creation?: string
  modified?: string
}

export interface VendorPayment {
  name: string
  vendor: string // Link to Vendor
  payment_amount: number
  payment_date: string
  payment_method: 'bank-transfer' | 'check' | 'cash' | 'online'
  payment_account: string // Link to PaymentAccount
  reference_number?: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  notes?: string
  processed_by?: string
  processed_date?: string
  creation?: string
  modified?: string
}

export interface VendorAnalytics {
  name: string
  vendor: string // Link to Vendor
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  start_date: string
  end_date: string
  total_orders: number
  total_revenue: number
  total_points_earned: number
  average_order_value: number
  fulfillment_rate: number
  average_rating: number
  total_reviews: number
  response_time_avg?: string
  top_products?: string
  customer_satisfaction?: number
  creation?: string
  modified?: string
}

export interface VendorReview {
  name: string
  vendor: string // Link to Vendor
  student: string // Link to Student
  purchase_order: string // Link to PurchaseOrder
  rating: number
  review_title?: string
  review_text?: string
  review_date: string
  is_verified: boolean
  status: 'approved' | 'pending' | 'rejected'
  helpful_count: number
  creation?: string
  modified?: string
}

export interface VendorApplication {
  name: string
  application_number: string
  business_name: string
  business_category: string // Link to VendorCategory
  contact_person: string
  email: string
  phone: string
  address: string
  website?: string
  business_registration?: string
  tax_id?: string
  business_type?: 'sole-proprietorship' | 'partnership' | 'corporation' | 'llc'
  employee_count?: number
  established_year?: number
  description?: string
  application_date: string
  status: 'pending' | 'under-review' | 'approved' | 'rejected'
  reviewed_by?: string
  review_date?: string
  rejection_reason?: string
  notes?: string
  creation?: string
  modified?: string
}

export interface ApplicationDocument {
  name: string
  parent: string // Link to VendorApplication
  parenttype: string
  parentfield: string
  document_type: 'business-registration' | 'tax-certificate' | 'bank-statement' | 'identification' | 'business-license'
  document_name: string
  file: string // File URL
  upload_date: string
  creation?: string
  modified?: string
}

export interface CatalogItem {
  name: string // Frappe document name
  item_name: string
  description: string
  category: string // Link to ProductCategory
  vendor: string // Link to Vendor
  point_price: number
  approximate_value_lkr: number
  image?: string
  is_active: boolean
  stock_quantity?: number
  created_date: string
  last_updated: string
  max_quantity_per_month?: number
  weight?: number
  dimensions?: string
  warranty_period?: number
  return_policy?: string
  item_code?: string
  creation?: string
  modified?: string
}

export interface ProductCategory {
  name: string
  category_name: string
  description?: string
  is_active: boolean
  parent_category?: string // Link to ProductCategory
  creation?: string
  modified?: string
}

export interface EducationLevel {
  name: string
  parent: string // Link to CatalogItem
  parenttype: string
  parentfield: string
  education_level: 'primary' | 'secondary' | 'ordinary-level' | 'advanced-level' | 'undergraduate' | 'postgraduate'
  creation?: string
  modified?: string
}

export interface PurchaseOrder {
  name: string // Frappe document name
  student: string // Link to Student
  vendor: string // Link to Vendor
  total_points: number
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled' | 'cancelled'
  request_date: string
  approved_date?: string
  fulfilled_date?: string
  rejection_reason?: string
  qr_code?: string
  notes?: string
  delivery_method: 'pickup' | 'delivery'
  delivery_address?: string
  expected_delivery_date?: string
  actual_delivery_date?: string
  approved_by?: string
  fulfilled_by?: string
  creation?: string
  modified?: string
}

export interface PurchaseOrderItem {
  name: string
  parent: string // Link to PurchaseOrder
  parenttype: string
  parentfield: string
  item: string // Link to CatalogItem
  quantity: number
  points_per_item: number
  total_points: number
  creation?: string
  modified?: string
}

// Vendor filters and query types
export interface VendorFilters {
  status?: ('active' | 'inactive' | 'pending' | 'suspended')[]
  verification_status?: ('verified' | 'pending' | 'rejected')[]
  vendor_category?: string[]
  business_type?: ('sole-proprietorship' | 'partnership' | 'corporation' | 'llc')[]
  search?: string
}

export interface VendorQueryOptions {
  fields?: string[]
  filters?: VendorFilters
  order_by?: string
  limit?: number
  start?: number
}

export interface CatalogItemFilters {
  is_active?: boolean
  category?: string[]
  vendor?: string[]
  education_level?: ('primary' | 'secondary' | 'ordinary-level' | 'advanced-level' | 'undergraduate' | 'postgraduate')[]
  min_price?: number
  max_price?: number
  search?: string
}

export interface CatalogItemQueryOptions {
  fields?: string[]
  filters?: CatalogItemFilters
  order_by?: string
  limit?: number
  start?: number
}

export interface PurchaseOrderFilters {
  status?: ('pending' | 'approved' | 'rejected' | 'fulfilled' | 'cancelled')[]
  student?: string
  vendor?: string
  delivery_method?: ('pickup' | 'delivery')[]
  date_from?: string
  date_to?: string
}

export interface PurchaseOrderQueryOptions {
  fields?: string[]
  filters?: PurchaseOrderFilters
  order_by?: string
  limit?: number
  start?: number
}