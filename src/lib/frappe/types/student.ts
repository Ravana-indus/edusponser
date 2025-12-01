// Student-related TypeScript interfaces for EduSponsor Frappe integration

export interface Student {
  name: string // Frappe document name
  first_name: string
  last_name: string
  email: string
  phone: string
  age: number
  education_level: 'primary' | 'secondary' | 'ordinary-level' | 'advanced-level' | 'undergraduate' | 'graduate' | 'postgraduate' | 'vocational'
  grade?: number
  school: string // Link to School
  major?: string
  stream?: 'science' | 'commerce' | 'arts' | 'technology'
  gpa?: number
  exam_results?: string
  bio: string
  goals: string
  challenges: string
  why_need_support: string
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  join_date: string
  total_points: number
  available_points: number
  invested_points: number
  insurance_points: number
  profile_image?: string
  district: string // Link to District
  province: string // Link to Province
  grama_niladharai_division?: string
  grama_niladharai_name?: string
  grama_niladharai_contact?: string
  school_address?: string
  school_phone?: string
  school_principal?: string
  school_type?: 'government' | 'private' | 'international' | 'semi-government'
  student_class?: string
  index_number?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  emergency_contact_relation?: string
  medical_conditions?: string
  allergies?: string
  blood_group?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
  nationality?: string
  religion?: string
  languages?: string
  health_insurance_status?: 'active' | 'inactive' | 'pending'
  health_insurance_provider?: string
  health_insurance_policy_number?: string
  health_insurance_expiry?: string
  last_updated: string
  profile_completed: boolean
  documents_verified: boolean
  creation?: string
  modified?: string
  owner?: string
  modified_by?: string
}

export interface StudentDocument {
  name: string
  parent: string // Link to Student
  parenttype: string
  parentfield: string
  document_type: 'birth-certificate' | 'id-card' | 'school-certificate' | 'income-certificate' | 'medical-certificate'
  document_name: string
  file: string // File URL
  status: 'verified' | 'pending' | 'rejected'
  verified_by?: string
  verification_date?: string
  notes?: string
  creation?: string
  modified?: string
}

export interface StudentGoal {
  name: string
  student: string // Link to Student
  title: string
  description: string
  target_amount: number
  current_amount: number
  category: 'education' | 'laptop' | 'trip' | 'equipment' | 'health' | 'other'
  target_date: string
  status: 'active' | 'completed' | 'cancelled' | 'paused'
  is_public: boolean
  created_date: string
  updated_date: string
  creation?: string
  modified?: string
}

export interface WithdrawalRequest {
  name: string
  student: string // Link to Student
  amount: number
  reason: string
  category: 'emergency' | 'education' | 'health' | 'personal' | 'other'
  status: 'pending' | 'approved' | 'rejected' | 'processed'
  request_date: string
  processed_date?: string
  approved_by?: string
  rejection_reason?: string
  bank_name: string
  account_number: string
  account_holder: string
  branch: string
  conversion_rate: number
  cash_amount: number
  creation?: string
  modified?: string
}

export interface WithdrawalDocument {
  name: string
  parent: string // Link to WithdrawalRequest
  parenttype: string
  parentfield: string
  document_type: 'id' | 'bank-statement' | 'medical-certificate' | 'income-certificate' | 'other'
  document_name: string
  file: string // File URL
  creation?: string
  modified?: string
}

export interface Investment {
  name: string
  student: string // Link to Student
  amount: number
  platform: string
  investment_type: 'nft' | 'stocks' | 'bonds' | 'crypto' | 'other'
  status: 'active' | 'completed' | 'failed' | 'withdrawn'
  investment_date: string
  maturity_date?: string
  expected_return: number
  actual_return?: number
  description: string
  transaction_hash?: string
  current_value?: number
  creation?: string
  modified?: string
}

export interface HealthInsurance {
  name: string
  student: string // Link to Student
  provider: string
  policy_number: string
  coverage_amount: number
  premium_amount: number
  start_date: string
  expiry_date: string
  status: 'active' | 'expired' | 'cancelled'
  beneficiary_name?: string
  beneficiary_relation?: string
  creation?: string
  modified?: string
}

export interface CoverageDetail {
  name: string
  parent: string // Link to HealthInsurance
  parenttype: string
  parentfield: string
  coverage_type: string
  coverage_limit: number
  details?: string
  creation?: string
  modified?: string
}

export interface EducationUpdate {
  name: string
  student: string // Link to Student
  title: string
  content: string
  type: 'academic' | 'achievement' | 'project' | 'competition' | 'extracurricular' | 'personal'
  date: string
  is_public: boolean
  created_by?: string
  creation?: string
  modified?: string
}

export interface UpdateAttachment {
  name: string
  parent: string // Link to EducationUpdate
  parenttype: string
  parentfield: string
  file_name: string
  file: string // File URL
  creation?: string
  modified?: string
}

export interface UpdateTag {
  name: string
  parent: string // Link to EducationUpdate
  parenttype: string
  parentfield: string
  tag: string
  creation?: string
  modified?: string
}

export interface StudentUpdate {
  name: string
  student: string // Link to Student
  title: string
  content: string
  type: 'academic' | 'project' | 'personal' | 'milestone'
  date: string
  is_public: boolean
  creation?: string
  modified?: string
}

// Student filters and query types
export interface StudentFilters {
  status?: ('pending' | 'approved' | 'rejected' | 'suspended')[]
  education_level?: ('primary' | 'secondary' | 'ordinary-level' | 'advanced-level' | 'undergraduate' | 'graduate' | 'postgraduate' | 'vocational')[]
  district?: string[]
  province?: string[]
  school?: string[]
  search?: string
}

export interface StudentQueryOptions {
  fields?: string[]
  filters?: StudentFilters
  order_by?: string
  limit?: number
  start?: number
}