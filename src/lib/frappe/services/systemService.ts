import { frappeClient } from '../client'
import {
  School,
  District,
  Province,
  SystemSettings,
  PlatformStats,
  Notification,
  CommunicationLog,
  SchoolFilters,
  SchoolQueryOptions,
  PointsTransactionFilters,
  PointsTransactionQueryOptions,
  NotificationFilters,
  NotificationQueryOptions,
  DOCTYPES,
} from '../types'

export class SystemService {
  // School CRUD operations
  async getSchools(options: SchoolQueryOptions = {}): Promise<School[]> {
    const filters = this.buildSchoolFilters(options.filters)
    
    return frappeClient.getDocs<School>(DOCTYPES.SCHOOL, {
      fields: options.fields || [
        'name', 'school_name', 'school_type', 'category', 'address',
        'district', 'province', 'phone', 'email', 'status',
        'student_count', 'teacher_count'
      ],
      filters,
      order_by: options.order_by || 'school_name asc',
      limit: options.limit,
      start: options.start,
    })
  }

  async getSchool(name: string): Promise<School> {
    return frappeClient.getDoc<School>(DOCTYPES.SCHOOL, name)
  }

  async createSchool(data: Partial<School>): Promise<School> {
    return frappeClient.createDoc<School>(DOCTYPES.SCHOOL, data)
  }

  async updateSchool(name: string, data: Partial<School>): Promise<School> {
    return frappeClient.updateDoc<School>(DOCTYPES.SCHOOL, name, data)
  }

  async deleteSchool(name: string): Promise<void> {
    return frappeClient.deleteDoc(DOCTYPES.SCHOOL, name)
  }

  // District CRUD operations
  async getDistricts(): Promise<District[]> {
    return frappeClient.getDocs<District>(DOCTYPES.DISTRICT, {
      filters: { is_active: true },
      order_by: 'district_name asc',
    })
  }

  async getDistrict(name: string): Promise<District> {
    return frappeClient.getDoc<District>(DOCTYPES.DISTRICT, name)
  }

  // Province CRUD operations
  async getProvinces(): Promise<Province[]> {
    return frappeClient.getDocs<Province>(DOCTYPES.PROVINCE, {
      filters: { is_active: true },
      order_by: 'province_name asc',
    })
  }

  async getProvince(name: string): Promise<Province> {
    return frappeClient.getDoc<Province>(DOCTYPES.PROVINCE, name)
  }

  // System Settings
  async getSystemSettings(): Promise<SystemSettings> {
    return frappeClient.getDoc<SystemSettings>(DOCTYPES.SYSTEM_SETTINGS, 'System Settings')
  }

  async updateSystemSettings(data: Partial<SystemSettings>): Promise<SystemSettings> {
    return frappeClient.updateDoc<SystemSettings>(DOCTYPES.SYSTEM_SETTINGS, 'System Settings', data)
  }

  // Platform Stats
  async getPlatformStats(period: string = 'monthly'): Promise<PlatformStats[]> {
    return frappeClient.getDocs<PlatformStats>(DOCTYPES.PLATFORM_STATS, {
      filters: { period },
      order_by: 'start_date desc',
      limit: 12,
    })
  }

  async getLatestPlatformStats(): Promise<PlatformStats> {
    const stats = await this.getPlatformStats()
    return stats[0] || {} as PlatformStats
  }

  // Notifications
  async getNotifications(options: NotificationQueryOptions = {}): Promise<Notification[]> {
    const filters = this.buildNotificationFilters(options.filters)
    
    return frappeClient.getDocs<Notification>(DOCTYPES.NOTIFICATION, {
      fields: options.fields || [
        'name', 'recipient_type', 'recipient', 'title', 'message',
        'type', 'category', 'status', 'created_date', 'action_required'
      ],
      filters,
      order_by: options.order_by || 'created_date desc',
      limit: options.limit,
      start: options.start,
    })
  }

  async getNotification(name: string): Promise<Notification> {
    return frappeClient.getDoc<Notification>(DOCTYPES.NOTIFICATION, name)
  }

  async createNotification(data: Partial<Notification>): Promise<Notification> {
    return frappeClient.createDoc<Notification>(DOCTYPES.NOTIFICATION, data)
  }

  async markNotificationAsRead(name: string): Promise<Notification> {
    return frappeClient.updateDoc<Notification>(DOCTYPES.NOTIFICATION, name, {
      status: 'read',
      read_date: new Date().toISOString(),
    })
  }

  async archiveNotification(name: string): Promise<Notification> {
    return frappeClient.updateDoc<Notification>(DOCTYPES.NOTIFICATION, name, {
      status: 'archived',
    })
  }

  async getUnreadCount(recipientType: string, recipient: string): Promise<number> {
    const notifications = await frappeClient.getDocs<Notification>(DOCTYPES.NOTIFICATION, {
      filters: {
        recipient_type: recipientType,
        recipient,
        status: 'unread',
      },
    })
    return notifications.length
  }

  // Communication Log
  async getCommunicationLogs(filters?: any): Promise<CommunicationLog[]> {
    return frappeClient.getDocs<CommunicationLog>(DOCTYPES.COMMUNICATION_LOG, {
      filters: filters || {},
      order_by: 'sent_date desc',
      limit: 100,
    })
  }

  async createCommunicationLog(data: Partial<CommunicationLog>): Promise<CommunicationLog> {
    return frappeClient.createDoc<CommunicationLog>(DOCTYPES.COMMUNICATION_LOG, data)
  }

  // Points Transactions
  async getPointsTransactions(options: PointsTransactionQueryOptions = {}): Promise<any[]> {
    const filters = this.buildPointsTransactionFilters(options.filters)
    
    return frappeClient.getDocs(DOCTYPES.POINTS_TRANSACTION, {
      fields: options.fields || [
        'name', 'student', 'type', 'amount', 'description', 'date',
        'category', 'balance', 'created_by'
      ],
      filters,
      order_by: options.order_by || 'creation desc',
      limit: options.limit,
      start: options.start,
    })
  }

  // Search and filter utilities
  async searchSchools(query: string): Promise<School[]> {
    return frappeClient.searchLink(DOCTYPES.SCHOOL, query, { filters: { status: 'active' } })
  }

  async getSchoolsByDistrict(districtName: string): Promise<School[]> {
    return frappeClient.getDocs<School>(DOCTYPES.SCHOOL, {
      filters: { district: districtName, status: 'active' },
      order_by: 'school_name asc',
    })
  }

  async getSchoolsByProvince(provinceName: string): Promise<School[]> {
    return frappeClient.getDocs<School>(DOCTYPES.SCHOOL, {
      filters: { province: provinceName, status: 'active' },
      order_by: 'school_name asc',
    })
  }

  // Custom methods for system operations
  async generatePlatformStats(): Promise<PlatformStats> {
    return frappeClient.callMethod('edusponsor.api.generate_platform_stats')
  }

  async sendNotification(
    recipientType: string,
    recipient: string,
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    category: string = 'system',
    actionRequired: boolean = false
  ): Promise<Notification> {
    return this.createNotification({
      recipient_type: recipientType,
      recipient,
      title,
      message,
      type,
      category,
      action_required: actionRequired,
      status: 'unread',
      created_date: new Date().toISOString(),
    })
  }

  async sendBulkNotifications(
    recipients: Array<{ type: string; id: string }>,
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    category: string = 'system'
  ): Promise<Notification[]> {
    const notifications: Notification[] = []
    
    for (const recipient of recipients) {
      const notification = await this.sendNotification(
        recipient.type,
        recipient.id,
        title,
        message,
        type,
        category
      )
      notifications.push(notification)
    }
    
    return notifications
  }

  async getSystemHealth(): Promise<any> {
    return frappeClient.callMethod('edusponsor.api.get_system_health')
  }

  async getSystemLogs(options: {
    limit?: number
    offset?: number
    user_role?: string
    action?: string
    date_from?: string
    date_to?: string
  } = {}): Promise<any[]> {
    return frappeClient.callMethod('edusponsor.api.get_system_logs', options)
  }

  async runReport(reportName: string, filters?: Record<string, any>): Promise<any> {
    return frappeClient.runReport(reportName, filters)
  }

  // File operations
  async uploadFile(file: File, options: {
    doctype?: string
    docname?: string
    fieldname?: string
    is_private?: boolean
  } = {}): Promise<any> {
    return frappeClient.uploadFile(file, options)
  }

  async getFileUrl(fileId: string): Promise<string> {
    return frappeClient.callMethod('edusponsor.api.get_file_url', { file_id: fileId })
  }

  // Utility methods
  async getDoctypeList(): Promise<string[]> {
    return frappeClient.callMethod('frappe.client.get_list', {
      doctype: 'DocType',
      fields: ['name'],
      order_by: 'name asc',
    })
  }

  async getDoctypeFields(doctype: string): Promise<any[]> {
    return frappeClient.callMethod('frappe.client.get_list', {
      doctype: 'DocField',
      filters: { parent: doctype },
      fields: ['fieldname', 'fieldtype', 'label', 'options', 'reqd'],
      order_by: 'idx asc',
    })
  }

  async getServerInfo(): Promise<any> {
    return frappeClient.callMethod('frappe.client.get_server_info')
  }

  async getVersion(): Promise<string> {
    const info = await this.getServerInfo()
    return info.version || 'Unknown'
  }

  // Private helper methods
  private buildSchoolFilters(filters?: SchoolFilters): Record<string, any> {
    if (!filters) return {}

    const frappeFilters: Record<string, any> = {}

    if (filters.status && filters.status.length > 0) {
      frappeFilters.status = ['in', ...filters.status]
    }

    if (filters.school_type && filters.school_type.length > 0) {
      frappeFilters.school_type = ['in', ...filters.school_type]
    }

    if (filters.category && filters.category.length > 0) {
      frappeFilters.category = ['in', ...filters.category]
    }

    if (filters.district && filters.district.length > 0) {
      frappeFilters.district = ['in', ...filters.district]
    }

    if (filters.province && filters.province.length > 0) {
      frappeFilters.province = ['in', ...filters.province]
    }

    if (filters.search) {
      frappeFilters.or_filters = [
        ['school_name', 'like', `%${filters.search}%`],
        ['address', 'like', `%${filters.search}%`],
        ['principal_name', 'like', `%${filters.search}%`],
      ]
    }

    return frappeFilters
  }

  private buildNotificationFilters(filters?: NotificationFilters): Record<string, any> {
    if (!filters) return {}

    const frappeFilters: Record<string, any> = {}

    if (filters.recipient_type && filters.recipient_type.length > 0) {
      frappeFilters.recipient_type = ['in', ...filters.recipient_type]
    }

    if (filters.recipient) {
      frappeFilters.recipient = filters.recipient
    }

    if (filters.type && filters.type.length > 0) {
      frappeFilters.type = ['in', ...filters.type]
    }

    if (filters.category && filters.category.length > 0) {
      frappeFilters.category = ['in', ...filters.category]
    }

    if (filters.status && filters.status.length > 0) {
      frappeFilters.status = ['in', ...filters.status]
    }

    if (filters.action_required !== undefined) {
      frappeFilters.action_required = filters.action_required
    }

    if (filters.date_from) {
      frappeFilters.created_date = ['>=', filters.date_from]
    }

    if (filters.date_to) {
      frappeFilters.created_date = ['<=', filters.date_to]
    }

    return frappeFilters
  }

  private buildPointsTransactionFilters(filters?: PointsTransactionFilters): Record<string, any> {
    if (!filters) return {}

    const frappeFilters: Record<string, any> = {}

    if (filters.type && filters.type.length > 0) {
      frappeFilters.type = ['in', ...filters.type]
    }

    if (filters.category && filters.category.length > 0) {
      frappeFilters.category = ['in', ...filters.category]
    }

    if (filters.student) {
      frappeFilters.student = filters.student
    }

    if (filters.date_from) {
      frappeFilters.date = ['>=', filters.date_from]
    }

    if (filters.date_to) {
      frappeFilters.date = ['<=', filters.date_to]
    }

    return frappeFilters
  }
}

// Export singleton instance
export const systemService = new SystemService()