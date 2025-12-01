// System-related TypeScript interfaces for EduSponsor Frappe integration

export interface School {
  name: string // Frappe document name
  school_name: string
  school_type: 'government' | 'private' | 'international' | 'semi-government'
  category: 'primary' | 'secondary' | 'tertiary' | 'vocational'
  address: string
  district: string // Link to District
  province: string // Link to Province
  phone: string
  email?: string
  website?: string
  principal_name: string
  principal_phone?: string
  principal_email?: string
  established_year?: number
  student_count?: number
  teacher_count?: number
  status: 'active' | 'inactive' | 'closed'
  accreditation?: string
  facilities?: string
  special_programs?: string
  contact_person?: string
  contact_person_designation?: string
  creation?: string
  modified?: string
}

export interface District {
  name: string
  district_name: string
  province: string // Link to Province
  code: string
  is_active: boolean
  creation?: string
  modified?: string
}

export interface Province {
  name: string
  province_name: string
  code: string
  is_active: boolean
  creation?: string
  modified?: string
}

export interface PointsTransaction {
  name: string
  student: string // Link to Student
  type: 'earned' | 'spent' | 'invested' | 'withdrawn' | 'insurance' | 'refund' | 'bonus' | 'penalty'
  amount: number
  description: string
  date: string
  reference_id?: string
  balance: number
  category: 'sponsorship' | 'purchase' | 'investment' | 'insurance' | 'withdrawal' | 'bonus' | 'penalty'
  created_by?: string
  creation?: string
  modified?: string
}

export interface SystemSettings {
  name: string
  points_to_lkr_rate: number
  max_products_per_vendor: number
  max_orders_per_day: number
  auto_approve_threshold: number
  vendor_approval_required: boolean
  email_notifications_enabled: boolean
  sms_notifications_enabled: boolean
  default_fulfillment_days: number
  max_upload_size: number
  supported_file_types?: string
  monthly_points_per_dollar: number
  min_withdrawal_amount: number
  max_withdrawal_amount: number
  withdrawal_fee_percentage: number
  investment_min_amount: number
  insurance_min_coverage: number
  student_approval_required: boolean
  donor_verification_required: boolean
  creation?: string
  modified?: string
}

export interface PlatformStats {
  name: string
  total_students: number
  approved_students: number
  pending_students: number
  total_donors: number
  active_donors: number
  total_donated: number
  total_points: number
  monthly_revenue: number
  active_sponsorships: number
  average_gpa: number
  student_retention: number
  donor_retention: number
  total_vendors: number
  active_vendors: number
  total_orders: number
  fulfilled_orders: number
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  start_date: string
  end_date: string
  creation?: string
  modified?: string
}

export interface Notification {
  name: string
  recipient_type: 'student' | 'donor' | 'vendor' | 'admin'
  recipient: string // Dynamic link based on recipient_type
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  category: 'system' | 'payment' | 'order' | 'update' | 'approval' | 'reminder'
  status: 'unread' | 'read' | 'archived'
  created_date: string
  read_date?: string
  action_required: boolean
  action_link?: string
  expiry_date?: string
  creation?: string
  modified?: string
}

export interface CommunicationLog {
  name: string
  from_user: string // Link to User
  to_user: string // Link to User
  from_role: 'student' | 'donor' | 'vendor' | 'admin'
  to_role: 'student' | 'donor' | 'vendor' | 'admin'
  subject: string
  message: string
  message_type: 'email' | 'sms' | 'in-app' | 'phone'
  status: 'sent' | 'delivered' | 'read' | 'failed'
  sent_date: string
  read_date?: string
  parent_message?: string // Link to CommunicationLog
  attachments?: string
  creation?: string
  modified?: string
}

export interface UserRole {
  name: string
  role_name: string
  description: string
  role_type: 'system' | 'custom'
  is_active: boolean
  permissions: string // JSON format
  creation?: string
  modified?: string
}

export interface AuditLog {
  name: string
  user: string // Link to User
  user_role: 'student' | 'donor' | 'vendor' | 'admin' | 'system'
  action: string
  doctype: string
  docname: string
  old_value?: string
  new_value?: string
  timestamp: string
  ip_address?: string
  user_agent?: string
  status: 'success' | 'failed'
  creation?: string
  modified?: string
}

// System filters and query types
export interface SchoolFilters {
  status?: ('active' | 'inactive' | 'closed')[]
  school_type?: ('government' | 'private' | 'international' | 'semi-government')[]
  category?: ('primary' | 'secondary' | 'tertiary' | 'vocational')[]
  district?: string[]
  province?: string[]
  search?: string
}

export interface SchoolQueryOptions {
  fields?: string[]
  filters?: SchoolFilters
  order_by?: string
  limit?: number
  start?: number
}

export interface PointsTransactionFilters {
  type?: ('earned' | 'spent' | 'invested' | 'withdrawn' | 'insurance' | 'refund' | 'bonus' | 'penalty')[]
  category?: ('sponsorship' | 'purchase' | 'investment' | 'insurance' | 'withdrawal' | 'bonus' | 'penalty')[]
  student?: string
  date_from?: string
  date_to?: string
}

export interface PointsTransactionQueryOptions {
  fields?: string[]
  filters?: PointsTransactionFilters
  order_by?: string
  limit?: number
  start?: number
}

export interface NotificationFilters {
  recipient_type?: ('student' | 'donor' | 'vendor' | 'admin')[]
  recipient?: string
  type?: ('info' | 'success' | 'warning' | 'error')[]
  category?: ('system' | 'payment' | 'order' | 'update' | 'approval' | 'reminder')[]
  status?: ('unread' | 'read' | 'archived')[]
  action_required?: boolean
  date_from?: string
  date_to?: string
}

export interface NotificationQueryOptions {
  fields?: string[]
  filters?: NotificationFilters
  order_by?: string
  limit?: number
  start?: number
}