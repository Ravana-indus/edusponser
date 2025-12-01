import { frappeClient } from '../client'
import {
  Vendor,
  VendorApplication,
  CatalogItem,
  PurchaseOrder,
  PaymentAccount,
  VendorPayment,
  VendorAnalytics,
  VendorReview,
  VendorFilters,
  VendorQueryOptions,
  CatalogItemFilters,
  CatalogItemQueryOptions,
  PurchaseOrderFilters,
  PurchaseOrderQueryOptions,
  DOCTYPES,
} from '../types'

export class VendorService {
  // Vendor CRUD operations
  async getVendors(options: VendorQueryOptions = {}): Promise<Vendor[]> {
    const filters = this.buildVendorFilters(options.filters)
    
    return frappeClient.getDocs<Vendor>(DOCTYPES.VENDOR, {
      fields: options.fields || [
        'name', 'vendor_name', 'vendor_category', 'contact_person', 'email', 'phone',
        'status', 'verification_status', 'total_orders', 'total_amount',
        'average_rating', 'total_reviews', 'join_date'
      ],
      filters,
      order_by: options.order_by || 'creation desc',
      limit: options.limit,
      start: options.start,
    })
  }

  async getVendor(name: string): Promise<Vendor> {
    return frappeClient.getDoc<Vendor>(DOCTYPES.VENDOR, name)
  }

  async createVendor(data: Partial<Vendor>): Promise<Vendor> {
    return frappeClient.createDoc<Vendor>(DOCTYPES.VENDOR, data)
  }

  async updateVendor(name: string, data: Partial<Vendor>): Promise<Vendor> {
    return frappeClient.updateDoc<Vendor>(DOCTYPES.VENDOR, name, data)
  }

  async deleteVendor(name: string): Promise<void> {
    return frappeClient.deleteDoc(DOCTYPES.VENDOR, name)
  }

  // Vendor Application CRUD operations
  async getVendorApplications(): Promise<VendorApplication[]> {
    return frappeClient.getDocs<VendorApplication>(DOCTYPES.VENDOR_APPLICATION, {
      order_by: 'creation desc',
    })
  }

  async getVendorApplication(name: string): Promise<VendorApplication> {
    return frappeClient.getDoc<VendorApplication>(DOCTYPES.VENDOR_APPLICATION, name)
  }

  async createVendorApplication(data: Partial<VendorApplication>): Promise<VendorApplication> {
    return frappeClient.createDoc<VendorApplication>(DOCTYPES.VENDOR_APPLICATION, data)
  }

  async updateVendorApplication(name: string, data: Partial<VendorApplication>): Promise<VendorApplication> {
    return frappeClient.updateDoc<VendorApplication>(DOCTYPES.VENDOR_APPLICATION, name, data)
  }

  async approveVendorApplication(applicationName: string): Promise<VendorApplication> {
    return frappeClient.updateDoc<VendorApplication>(DOCTYPES.VENDOR_APPLICATION, applicationName, {
      status: 'approved',
      review_date: new Date().toISOString().split('T')[0],
    })
  }

  async rejectVendorApplication(applicationName: string, reason: string): Promise<VendorApplication> {
    return frappeClient.updateDoc<VendorApplication>(DOCTYPES.VENDOR_APPLICATION, applicationName, {
      status: 'rejected',
      review_date: new Date().toISOString().split('T')[0],
      rejection_reason: reason,
    })
  }

  // Catalog Item CRUD operations
  async getCatalogItems(options: CatalogItemQueryOptions = {}): Promise<CatalogItem[]> {
    const filters = this.buildCatalogItemFilters(options.filters)
    
    return frappeClient.getDocs<CatalogItem>(DOCTYPES.CATALOG_ITEM, {
      fields: options.fields || [
        'name', 'item_name', 'description', 'category', 'vendor',
        'point_price', 'approximate_value_lkr', 'is_active', 'stock_quantity',
        'created_date', 'image'
      ],
      filters,
      order_by: options.order_by || 'creation desc',
      limit: options.limit,
      start: options.start,
    })
  }

  async getCatalogItem(name: string): Promise<CatalogItem> {
    return frappeClient.getDoc<CatalogItem>(DOCTYPES.CATALOG_ITEM, name)
  }

  async createCatalogItem(data: Partial<CatalogItem>): Promise<CatalogItem> {
    return frappeClient.createDoc<CatalogItem>(DOCTYPES.CATALOG_ITEM, data)
  }

  async updateCatalogItem(name: string, data: Partial<CatalogItem>): Promise<CatalogItem> {
    return frappeClient.updateDoc<CatalogItem>(DOCTYPES.CATALOG_ITEM, name, data)
  }

  async deleteCatalogItem(name: string): Promise<void> {
    return frappeClient.deleteDoc(DOCTYPES.CATALOG_ITEM, name)
  }

  // Purchase Order CRUD operations
  async getPurchaseOrders(options: PurchaseOrderQueryOptions = {}): Promise<PurchaseOrder[]> {
    const filters = this.buildPurchaseOrderFilters(options.filters)
    
    return frappeClient.getDocs<PurchaseOrder>(DOCTYPES.PURCHASE_ORDER, {
      fields: options.fields || [
        'name', 'student', 'vendor', 'total_points', 'status',
        'request_date', 'approved_date', 'fulfilled_date', 'delivery_method'
      ],
      filters,
      order_by: options.order_by || 'creation desc',
      limit: options.limit,
      start: options.start,
    })
  }

  async getPurchaseOrder(name: string): Promise<PurchaseOrder> {
    return frappeClient.getDoc<PurchaseOrder>(DOCTYPES.PURCHASE_ORDER, name)
  }

  async createPurchaseOrder(data: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    return frappeClient.createDoc<PurchaseOrder>(DOCTYPES.PURCHASE_ORDER, data)
  }

  async updatePurchaseOrder(name: string, data: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    return frappeClient.updateDoc<PurchaseOrder>(DOCTYPES.PURCHASE_ORDER, name, data)
  }

  async deletePurchaseOrder(name: string): Promise<void> {
    return frappeClient.deleteDoc(DOCTYPES.PURCHASE_ORDER, name)
  }

  // Payment Account CRUD operations
  async getPaymentAccounts(vendorName: string): Promise<PaymentAccount[]> {
    return frappeClient.getDocs<PaymentAccount>(DOCTYPES.PAYMENT_ACCOUNT, {
      filters: { vendor: vendorName },
      order_by: 'is_primary desc, creation desc',
    })
  }

  async createPaymentAccount(data: Partial<PaymentAccount>): Promise<PaymentAccount> {
    return frappeClient.createDoc<PaymentAccount>(DOCTYPES.PAYMENT_ACCOUNT, data)
  }

  async updatePaymentAccount(name: string, data: Partial<PaymentAccount>): Promise<PaymentAccount> {
    return frappeClient.updateDoc<PaymentAccount>(DOCTYPES.PAYMENT_ACCOUNT, name, data)
  }

  async deletePaymentAccount(name: string): Promise<void> {
    return frappeClient.deleteDoc(DOCTYPES.PAYMENT_ACCOUNT, name)
  }

  async setPrimaryPaymentAccount(name: string): Promise<void> {
    // First, get the vendor name from this payment account
    const account = await frappeClient.getDoc<PaymentAccount>(DOCTYPES.PAYMENT_ACCOUNT, name)
    const vendorName = account.vendor

    // Set all accounts to non-primary
    const allAccounts = await this.getPaymentAccounts(vendorName)
    for (const acc of allAccounts) {
      if (acc.name !== name && acc.is_primary) {
        await frappeClient.updateDoc<PaymentAccount>(DOCTYPES.PAYMENT_ACCOUNT, acc.name, {
          is_primary: false,
        })
      }
    }

    // Set this account as primary
    await frappeClient.updateDoc<PaymentAccount>(DOCTYPES.PAYMENT_ACCOUNT, name, {
      is_primary: true,
    })
  }

  // Vendor Payment CRUD operations
  async getVendorPayments(vendorName: string): Promise<VendorPayment[]> {
    return frappeClient.getDocs<VendorPayment>(DOCTYPES.VENDOR_PAYMENT, {
      filters: { vendor: vendorName },
      order_by: 'creation desc',
    })
  }

  async createVendorPayment(data: Partial<VendorPayment>): Promise<VendorPayment> {
    return frappeClient.createDoc<VendorPayment>(DOCTYPES.VENDOR_PAYMENT, data)
  }

  async processVendorPayment(name: string): Promise<VendorPayment> {
    return frappeClient.updateDoc<VendorPayment>(DOCTYPES.VENDOR_PAYMENT, name, {
      status: 'completed',
      processed_date: new Date().toISOString(),
    })
  }

  // Vendor Analytics
  async getVendorAnalytics(vendorName: string, period: string = 'monthly'): Promise<VendorAnalytics[]> {
    return frappeClient.getDocs<VendorAnalytics>(DOCTYPES.VENDOR_ANALYTICS, {
      filters: { vendor: vendorName, period },
      order_by: 'start_date desc',
      limit: 12, // Last 12 periods
    })
  }

  // Vendor Reviews
  async getVendorReviews(vendorName: string): Promise<VendorReview[]> {
    return frappeClient.getDocs<VendorReview>(DOCTYPES.VENDOR_REVIEW, {
      filters: { vendor: vendorName },
      order_by: 'creation desc',
    })
  }

  async createVendorReview(data: Partial<VendorReview>): Promise<VendorReview> {
    return frappeClient.createDoc<VendorReview>(DOCTYPES.VENDOR_REVIEW, data)
  }

  async approveVendorReview(name: string): Promise<VendorReview> {
    return frappeClient.updateDoc<VendorReview>(DOCTYPES.VENDOR_REVIEW, name, {
      status: 'approved',
    })
  }

  // Vendor-specific operations
  async getVendorCatalogItems(vendorName: string): Promise<CatalogItem[]> {
    return frappeClient.getDocs<CatalogItem>(DOCTYPES.CATALOG_ITEM, {
      filters: { vendor: vendorName, is_active: true },
      order_by: 'item_name asc',
    })
  }

  async getVendorPurchaseOrders(vendorName: string): Promise<PurchaseOrder[]> {
    return frappeClient.getDocs<PurchaseOrder>(DOCTYPES.PURCHASE_ORDER, {
      filters: { vendor: vendorName },
      order_by: 'creation desc',
    })
  }

  async getVendorStats(vendorName: string): Promise<any> {
    return frappeClient.callMethod('edusponsor.api.get_vendor_stats', {
      vendor: vendorName,
    })
  }

  // Purchase Order specific operations
  async approvePurchaseOrder(name: string): Promise<PurchaseOrder> {
    return frappeClient.updateDoc<PurchaseOrder>(DOCTYPES.PURCHASE_ORDER, name, {
      status: 'approved',
      approved_date: new Date().toISOString().split('T')[0],
    })
  }

  async rejectPurchaseOrder(name: string, reason: string): Promise<PurchaseOrder> {
    return frappeClient.updateDoc<PurchaseOrder>(DOCTYPES.PURCHASE_ORDER, name, {
      status: 'rejected',
      rejection_reason: reason,
    })
  }

  async fulfillPurchaseOrder(name: string): Promise<PurchaseOrder> {
    return frappeClient.updateDoc<PurchaseOrder>(DOCTYPES.PURCHASE_ORDER, name, {
      status: 'fulfilled',
      fulfilled_date: new Date().toISOString().split('T')[0],
    })
  }

  async cancelPurchaseOrder(name: string): Promise<PurchaseOrder> {
    return frappeClient.updateDoc<PurchaseOrder>(DOCTYPES.PURCHASE_ORDER, name, {
      status: 'cancelled',
    })
  }

  // Search and filter utilities
  async searchVendors(query: string): Promise<Vendor[]> {
    return frappeClient.searchLink(DOCTYPES.VENDOR, query, { filters: { status: 'active' } })
  }

  async searchCatalogItems(query: string): Promise<CatalogItem[]> {
    return frappeClient.searchLink(DOCTYPES.CATALOG_ITEM, query, { filters: { is_active: true } })
  }

  async getVendorsByCategory(categoryName: string): Promise<Vendor[]> {
    return frappeClient.getDocs<Vendor>(DOCTYPES.VENDOR, {
      filters: { vendor_category: categoryName, status: 'active' },
      order_by: 'vendor_name asc',
    })
  }

  async getCatalogItemsByCategory(categoryName: string): Promise<CatalogItem[]> {
    return frappeClient.getDocs<CatalogItem>(DOCTYPES.CATALOG_ITEM, {
      filters: { category: categoryName, is_active: true },
      order_by: 'item_name asc',
    })
  }

  // Custom methods for vendor operations
  async activateVendor(name: string): Promise<Vendor> {
    return frappeClient.updateDoc<Vendor>(DOCTYPES.VENDOR, name, {
      status: 'active',
    })
  }

  async deactivateVendor(name: string): Promise<Vendor> {
    return frappeClient.updateDoc<Vendor>(DOCTYPES.VENDOR, name, {
      status: 'inactive',
    })
  }

  async suspendVendor(name: string): Promise<Vendor> {
    return frappeClient.updateDoc<Vendor>(DOCTYPES.VENDOR, name, {
      status: 'suspended',
    })
  }

  async verifyVendor(name: string): Promise<Vendor> {
    return frappeClient.updateDoc<Vendor>(DOCTYPES.VENDOR, name, {
      verification_status: 'verified',
    })
  }

  async unverifyVendor(name: string): Promise<Vendor> {
    return frappeClient.updateDoc<Vendor>(DOCTYPES.VENDOR, name, {
      verification_status: 'pending',
    })
  }

  // File upload operations
  async uploadVendorDocument(
    vendorName: string,
    documentType: string,
    documentName: string,
    file: File
  ): Promise<any> {
    return frappeClient.uploadFile(file)
  }

  async uploadCatalogItemImage(catalogItemName: string, file: File): Promise<any> {
    return frappeClient.uploadFile(file)
  }

  // Private helper methods
  private buildVendorFilters(filters?: VendorFilters): Record<string, any> {
    if (!filters) return {}

    const frappeFilters: Record<string, any> = {}

    if (filters.status && filters.status.length > 0) {
      frappeFilters.status = ['in', ...filters.status]
    }

    if (filters.verification_status && filters.verification_status.length > 0) {
      frappeFilters.verification_status = ['in', ...filters.verification_status]
    }

    if (filters.vendor_category && filters.vendor_category.length > 0) {
      frappeFilters.vendor_category = ['in', ...filters.vendor_category]
    }

    if (filters.business_type && filters.business_type.length > 0) {
      frappeFilters.business_type = ['in', ...filters.business_type]
    }

    if (filters.search) {
      frappeFilters.or_filters = [
        ['vendor_name', 'like', `%${filters.search}%`],
        ['contact_person', 'like', `%${filters.search}%`],
        ['email', 'like', `%${filters.search}%`],
      ]
    }

    return frappeFilters
  }

  private buildCatalogItemFilters(filters?: CatalogItemFilters): Record<string, any> {
    if (!filters) return {}

    const frappeFilters: Record<string, any> = {}

    if (filters.is_active !== undefined) {
      frappeFilters.is_active = filters.is_active
    }

    if (filters.category && filters.category.length > 0) {
      frappeFilters.category = ['in', ...filters.category]
    }

    if (filters.vendor && filters.vendor.length > 0) {
      frappeFilters.vendor = ['in', ...filters.vendor]
    }

    if (filters.education_level && filters.education_level.length > 0) {
      frappeFilters.education_level = ['in', ...filters.education_level]
    }

    if (filters.min_price !== undefined) {
      frappeFilters.point_price = ['>=', filters.min_price]
    }

    if (filters.max_price !== undefined) {
      frappeFilters.point_price = ['<=', filters.max_price]
    }

    if (filters.search) {
      frappeFilters.or_filters = [
        ['item_name', 'like', `%${filters.search}%`],
        ['description', 'like', `%${filters.search}%`],
      ]
    }

    return frappeFilters
  }

  private buildPurchaseOrderFilters(filters?: PurchaseOrderFilters): Record<string, any> {
    if (!filters) return {}

    const frappeFilters: Record<string, any> = {}

    if (filters.status && filters.status.length > 0) {
      frappeFilters.status = ['in', ...filters.status]
    }

    if (filters.student) {
      frappeFilters.student = filters.student
    }

    if (filters.vendor) {
      frappeFilters.vendor = filters.vendor
    }

    if (filters.delivery_method && filters.delivery_method.length > 0) {
      frappeFilters.delivery_method = ['in', ...filters.delivery_method]
    }

    if (filters.date_from) {
      frappeFilters.request_date = ['>=', filters.date_from]
    }

    if (filters.date_to) {
      frappeFilters.request_date = ['<=', filters.date_to]
    }

    return frappeFilters
  }
}

// Export singleton instance
export const vendorService = new VendorService()