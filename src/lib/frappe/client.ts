import { supabase } from '@/lib/supabase/client'

// Replaces Frappe client with Supabase-backed client implementing similar methods
// Note: Adjust table/view/rpc names to match your Supabase schema

export class FrappeAPIError extends Error {
  constructor(public statusCode: number, message: string, public details?: any) {
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

class FrappeClient {
  private token: string | null = null

  async login(usernameOrEmail: string, password: string) {
    const isEmail = usernameOrEmail.includes('@')
    const { data, error } = await supabase.auth.signInWithPassword({
      email: isEmail ? usernameOrEmail : `${usernameOrEmail}@example.com`,
      password,
    })
    if (error) throw new FrappeAuthError(error.message)
    this.token = data.session?.access_token ?? null
  }

  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw new FrappeAuthError(error.message)
    this.token = null
  }

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) throw new FrappeAuthError(error?.message || 'No user')

    // Map to expected shape used by UI
    const profile = await this.fetchSingle('profiles', { id: user.id })
    return {
      username: profile?.username || (user.email?.split('@')[0] ?? ''),
      email: user.email ?? '',
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      roles: profile?.roles ?? [],
      user_image: profile?.avatar_url,
    }
  }

  // Generic helpers mapped to Supabase
  async getDoc<T = any>(table: string, id: string): Promise<T> {
    const { data, error } = await supabase.from(this.mapTable(table)).select('*').eq('name', id).single()
    if (error) throw new FrappeAPIError(400, error.message, error)
    return data as T
  }

  async getDocs<T = any>(table: string, options: any = {}): Promise<T[]> {
    let query = supabase.from(this.mapTable(table)).select('*', { count: 'exact' })

    const filters = options.filters || {}
    for (const [key, value] of Object.entries(filters)) {
      if (Array.isArray(value) && value.length >= 2 && value[0] === 'in') {
        query = query.in(key, value.slice(1))
      } else if (Array.isArray(value) && value.length === 3 && typeof value[1] === 'string') {
        const [, op, val] = value as [string, string, any]
        switch (op) {
          case 'like':
            query = query.ilike(key, val.replace(/%/g, '%'))
            break
          case '>=':
            query = query.gte(key, val)
            break
          case '<=':
            query = query.lte(key, val)
            break
          default:
            query = query.eq(key, val)
        }
      } else if (key === 'or_filters' && Array.isArray(value)) {
        const orExpr = (value as any[])
          .map(([f, op, v]) => {
            if (op === 'like') return `${f}.ilike.${v.replace(/%/g, '%')}`
            if (op === '>=') return `${f}.gte.${v}`
            if (op === '<=') return `${f}.lte.${v}`
            return `${f}.eq.${v}`
          })
          .join(',')
        query = query.or(orExpr)
      } else {
        query = (query as any).eq(key, value)
      }
    }

    if (options.order_by) {
      if (typeof options.order_by === 'string') {
        const [col, direction] = String(options.order_by).split(' ')
        query = query.order(col, { ascending: (direction ?? 'asc').toLowerCase() === 'asc' })
      }
    }

    if (options.limit !== undefined) {
      const start = options.start ?? 0
      const end = start + options.limit - 1
      query = query.range(start, end)
    }

    const { data, error } = await query
    if (error) throw new FrappeAPIError(400, error.message, error)
    return (data as unknown) as T[]
  }

  async createDoc<T = any>(table: string, data: any): Promise<T> {
    const { data: inserted, error } = await supabase.from(this.mapTable(table)).insert(data).select('*').single()
    if (error) throw new FrappeAPIError(400, error.message, error)
    return inserted as T
  }

  async updateDoc<T = any>(table: string, id: string, data: any): Promise<T> {
    const { data: updated, error } = await supabase.from(this.mapTable(table)).update(data).eq('name', id).select('*').single()
    if (error) throw new FrappeAPIError(400, error.message, error)
    return updated as T
  }

  async deleteDoc(table: string, id: string): Promise<void> {
    const { error } = await supabase.from(this.mapTable(table)).delete().eq('name', id)
    if (error) throw new FrappeAPIError(400, error.message, error)
  }

  // Frappe-style link search helper
  async searchLink<T = any>(doctype: string, txt: string, options: {
    filters?: Record<string, any>
    reference_doctype?: string
    limit?: number
  } = {}): Promise<T[]> {
    let query = supabase.from(this.mapTable(doctype)).select('*')
    // Try common searchable fields
    const like = `%${txt}%`
    query = query.or([
      `name.ilike.${like}`,
      `first_name.ilike.${like}`,
      `last_name.ilike.${like}`,
      `email.ilike.${like}`,
      `school_name.ilike.${like}`,
      `title.ilike.${like}`,
    ].join(','))

    const { filters = {}, limit } = options
    for (const [k, v] of Object.entries(filters)) {
      query = (query as any).eq(k, v)
    }
    if (limit) query = query.limit(limit)

    const { data, error } = await query
    if (error) throw new FrappeAPIError(400, error.message, error)
    return (data as unknown) as T[]
  }

  async callMethod<T = any>(fn: string, params?: any): Promise<T> {
    const { data, error } = await supabase.rpc(this.mapRpc(fn), params)
    if (error) throw new FrappeAPIError(400, error.message, error)
    return data as T
  }

  async runReport(name: string, filters?: Record<string, any>): Promise<any> {
    // Represent reports as Postgres views or RPCs
    const { data, error } = await supabase.rpc(this.mapRpc(`report_${name}`), filters || {})
    if (error) throw new FrappeAPIError(400, error.message, error)
    return data
  }

  async uploadFile(file: File, _options?: { doctype?: string; docname?: string; fieldname?: string }): Promise<any> {
    const path = `${Date.now()}_${file.name}`
    const { error } = await supabase.storage.from('uploads').upload(path, file, { upsert: false })
    if (error) throw new FrappeAPIError(400, error.message, error)
    const { data: publicUrl } = supabase.storage.from('uploads').getPublicUrl(path)
    return { file_url: publicUrl.publicUrl, path }
  }

  // Utilities
  setToken(token: string) { this.token = token }
  getToken() { return this.token }
  isAuthenticated() { return !!this.token }

  private mapTable(doctype: string): string {
    // Map Frappe doctypes to Supabase tables
    const map: Record<string, string> = {
      'Student': 'students',
      'Student Document': 'student_documents',
      'Student Goal': 'student_goals',
      'Withdrawal Request': 'withdrawal_requests',
      'Investment': 'investments',
      'Health Insurance': 'health_insurance',
      'Education Update': 'education_updates',
      'Student Update': 'student_updates',

      'Vendor': 'vendors',
      'Vendor Document': 'vendor_documents',
      'Vendor Specialty': 'vendor_specialties',
      'Vendor Certification': 'vendor_certifications',
      'Vendor Category': 'vendor_categories',
      'Payment Account': 'payment_accounts',
      'Vendor Payment': 'vendor_payments',
      'Vendor Analytics': 'vendor_analytics',
      'Vendor Review': 'vendor_reviews',
      'Vendor Application': 'vendor_applications',
      'Application Document': 'application_documents',
      'Catalog Item': 'catalog_items',
      'Product Category': 'product_categories',
      'Education Level': 'education_levels',
      'Purchase Order': 'purchase_orders',
      'Purchase Order Item': 'purchase_order_items',

      'Donor': 'donors',
      'Sponsorship': 'sponsorships',
      'Payment': 'payments',

      'School': 'schools',
      'District': 'districts',
      'Province': 'provinces',
      'Points Transaction': 'points_transactions',
      'System Settings': 'system_settings',
      'Platform Stats': 'platform_stats',
      'Notification': 'notifications',
      'Communication Log': 'communication_logs',
    }
    return map[doctype] ?? doctype
  }

  private mapRpc(method: string): string {
    // Map Frappe server methods to Supabase Postgres functions
    const map: Record<string, string> = {
      'edusponsor.api.allocate_points': 'allocate_points',
      'edusponsor.api.deduct_points': 'deduct_points',
      'edusponsor.api.generate_platform_stats': 'generate_platform_stats',
      'edusponsor.api.get_system_health': 'get_system_health',
      'edusponsor.api.get_system_logs': 'get_system_logs',
      'edusponsor.api.update_donor_stats': 'update_donor_stats',
      'frappe.client.get_server_info': 'get_server_info',
      'frappe.client.get_list': 'get_list',
    }
    return map[method] ?? method
  }

  private async fetchSingle(table: string, filters: Record<string, any>) {
    let query = supabase.from(table).select('*')
    for (const [k, v] of Object.entries(filters)) {
      query = query.eq(k, v)
    }
    const { data } = await query.single()
    return data as any
  }
}

export const frappeClient = new FrappeClient()
export { FrappeClient }
