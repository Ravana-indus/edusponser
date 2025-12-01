// Main types export file for EduSponsor Frappe integration

// Student types
export * from './student'

// Donor types
export * from './donor'

// Vendor types
export * from './vendor'

// System types
export * from './system'

// Common utility types
export interface ApiResponse<T = any> {
  message: T
  status_code?: number
  exc?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total_count: number
  page: number
  page_length: number
}

export interface SearchOptions {
  txt: string
  doctype: string
  filters?: Record<string, any>
  reference_doctype?: string
  limit?: number
}

export interface ReportOptions {
  report_name: string
  filters?: Record<string, any>
  user?: string
}

export interface FileUploadOptions {
  doctype?: string
  docname?: string
  fieldname?: string
  is_private?: boolean
}

// Form data types
export interface LoginForm {
  usr: string
  pwd: string
}

export interface RegisterForm {
  first_name: string
  last_name: string
  email: string
  phone: string
  password: string
  role: 'student' | 'donor' | 'vendor'
}

// Error types
export interface ApiError {
  statusCode: number
  message: string
  details?: any
}

export interface ValidationError {
  field: string
  message: string
  type: string
}

// Query helper types
export interface FilterExpression {
  [key: string]: any
}

export interface SortExpression {
  field: string
  direction: 'asc' | 'desc'
}

export interface QueryOptions {
  fields?: string[]
  filters?: FilterExpression
  order_by?: string | SortExpression[]
  limit?: number
  start?: number
  group_by?: string[]
  having?: FilterExpression
}

// WebSocket types (if needed)
export interface WebSocketMessage {
  type: string
  data: any
  timestamp: string
}

export interface NotificationMessage extends WebSocketMessage {
  type: 'notification'
  data: {
    recipient_type: string
    recipient: string
    title: string
    message: string
    category: string
  }
}

// Export all doctype names for easy reference
export const DOCTYPES = {
  // Student module
  STUDENT: 'Student',
  STUDENT_DOCUMENT: 'Student Document',
  STUDENT_GOAL: 'Student Goal',
  WITHDRAWAL_REQUEST: 'Withdrawal Request',
  WITHDRAWAL_DOCUMENT: 'Withdrawal Document',
  INVESTMENT: 'Investment',
  HEALTH_INSURANCE: 'Health Insurance',
  COVERAGE_DETAIL: 'Coverage Detail',
  EDUCATION_UPDATE: 'Education Update',
  UPDATE_ATTACHMENT: 'Update Attachment',
  UPDATE_TAG: 'Update Tag',
  STUDENT_UPDATE: 'Student Update',
  
  // Donor module
  DONOR: 'Donor',
  SPONSORSHIP: 'Sponsorship',
  PAYMENT: 'Payment',
  
  // Vendor module
  VENDOR: 'Vendor',
  VENDOR_DOCUMENT: 'Vendor Document',
  VENDOR_SPECIALTY: 'Vendor Specialty',
  VENDOR_CERTIFICATION: 'Vendor Certification',
  VENDOR_CATEGORY: 'Vendor Category',
  PAYMENT_ACCOUNT: 'Payment Account',
  VENDOR_PAYMENT: 'Vendor Payment',
  VENDOR_ANALYTICS: 'Vendor Analytics',
  VENDOR_REVIEW: 'Vendor Review',
  VENDOR_APPLICATION: 'Vendor Application',
  APPLICATION_DOCUMENT: 'Application Document',
  CATALOG_ITEM: 'Catalog Item',
  PRODUCT_CATEGORY: 'Product Category',
  EDUCATION_LEVEL: 'Education Level',
  PURCHASE_ORDER: 'Purchase Order',
  PURCHASE_ORDER_ITEM: 'Purchase Order Item',
  
  // System module
  SCHOOL: 'School',
  DISTRICT: 'District',
  PROVINCE: 'Province',
  POINTS_TRANSACTION: 'Points Transaction',
  SYSTEM_SETTINGS: 'System Settings',
  PLATFORM_STATS: 'Platform Stats',
  NOTIFICATION: 'Notification',
  COMMUNICATION_LOG: 'Communication Log',
  USER_ROLE: 'User Role',
  AUDIT_LOG: 'Audit Log',
} as const

export type DoctypeName = typeof DOCTYPES[keyof typeof DOCTYPES]