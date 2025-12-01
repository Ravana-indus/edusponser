// Donor-related TypeScript interfaces for EduSponsor Frappe integration

export interface Donor {
  name: string // Frappe document name
  first_name: string
  last_name: string
  email: string
  phone: string
  company?: string
  occupation: string
  annual_income: 'under-50k' | '50k-100k' | '100k-150k' | '150k-200k' | '200k-250k' | 'over-250k'
  bio: string
  motivation: string
  student_preference: 'any' | 'stem' | 'arts' | 'business' | 'healthcare' | 'undergraduate' | 'graduate'
  communication_frequency: 'weekly' | 'monthly' | 'quarterly' | 'minimal'
  anonymous: boolean
  status: 'active' | 'inactive' | 'suspended'
  join_date: string
  total_donated: number
  total_points: number
  profile_image?: string
  newsletter_subscription: boolean
  tax_id?: string
  payment_method: 'credit-card' | 'bank-transfer' | 'paypal' | 'other'
  creation?: string
  modified?: string
  owner?: string
  modified_by?: string
}

export interface Sponsorship {
  name: string
  donor: string // Link to Donor
  student: string // Link to Student
  start_date: string
  end_date?: string
  status: 'active' | 'paused' | 'cancelled' | 'completed' | 'opt-out-pending'
  monthly_amount: number
  monthly_points: number
  opt_out_requested_date?: string
  opt_out_effective_date?: string
  opt_out_reason?: string
  student_info_hidden: boolean
  auto_renew: boolean
  special_instructions?: string
  creation?: string
  modified?: string
}

export interface Payment {
  name: string
  donor: string // Link to Donor
  student: string // Link to Student
  sponsorship: string // Link to Sponsorship
  date: string
  amount: number
  points: number
  status: 'completed' | 'pending' | 'failed' | 'refunded'
  transaction_id?: string
  payment_method: 'credit-card' | 'bank-transfer' | 'paypal' | 'other'
  payment_gateway?: string
  failure_reason?: string
  processed_by?: string
  processed_date?: string
  creation?: string
  modified?: string
}

// Donor filters and query types
export interface DonorFilters {
  status?: ('active' | 'inactive' | 'suspended')[]
  annual_income?: ('under-50k' | '50k-100k' | '100k-150k' | '150k-200k' | '200k-250k' | 'over-250k')[]
  student_preference?: ('any' | 'stem' | 'arts' | 'business' | 'healthcare' | 'undergraduate' | 'graduate')[]
  communication_frequency?: ('weekly' | 'monthly' | 'quarterly' | 'minimal')[]
  search?: string
}

export interface DonorQueryOptions {
  fields?: string[]
  filters?: DonorFilters
  order_by?: string
  limit?: number
  start?: number
}

export interface SponsorshipFilters {
  status?: ('active' | 'paused' | 'cancelled' | 'completed' | 'opt-out-pending')[]
  donor?: string
  student?: string
  start_date_from?: string
  start_date_to?: string
  student_info_hidden?: boolean
}

export interface SponsorshipQueryOptions {
  fields?: string[]
  filters?: SponsorshipFilters
  order_by?: string
  limit?: number
  start?: number
}

export interface PaymentFilters {
  status?: ('completed' | 'pending' | 'failed' | 'refunded')[]
  donor?: string
  student?: string
  sponsorship?: string
  payment_method?: ('credit-card' | 'bank-transfer' | 'paypal' | 'other')[]
  date_from?: string
  date_to?: string
}

export interface PaymentQueryOptions {
  fields?: string[]
  filters?: PaymentFilters
  order_by?: string
  limit?: number
  start?: number
}