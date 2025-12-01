// Frappe ERPNext Configuration for EduSponsor

export interface FrappeConfig {
  baseUrl: string
  apiKey?: string
  apiSecret?: string
  timeout: number
  retryAttempts: number
  retryDelay: number
}

export const frappeConfig: FrappeConfig = {
  baseUrl: process.env.NEXT_PUBLIC_FRAPPE_URL || 'http://localhost:8000',
  apiKey: process.env.NEXT_PUBLIC_FRAPPE_API_KEY,
  apiSecret: process.env.NEXT_PUBLIC_FRAPPE_API_SECRET,
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
}

// API Endpoints
export const FRAPPE_ENDPOINTS = {
  // Authentication
  LOGIN: '/api/method/login',
  LOGOUT: '/api/method/logout',
  GET_USER: '/api/method/frappe.auth.get_user',
  
  // Generic CRUD
  GET_DOC: '/api/resource/:doctype',
  GET_DOCS: '/api/resource/:doctype',
  CREATE_DOC: '/api/resource/:doctype',
  UPDATE_DOC: '/api/resource/:doctype/:docname',
  DELETE_DOC: '/api/resource/:doctype/:docname',
  
  // Custom API methods
  CUSTOM_METHOD: '/api/method/:method',
  
  // File upload
  UPLOAD_FILE: '/api/method/upload_file',
  
  // Reports
  GET_REPORT: '/api/method/frappe.desk.query_report.run',
  
  // Search
  SEARCH_LINK: '/api/method/frappe.desk.search.search_link',
} as const

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const

// Error Types
export class FrappeAPIError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any
  ) {
    super(message)
    this.name = 'FrappeAPIError'
  }
}

export class FrappeAuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FrappeAuthError'
  }
}

export class FrappeValidationError extends Error {
  constructor(public validationErrors: any[]) {
    super('Validation failed')
    this.name = 'FrappeValidationError'
  }
}