import { frappeClient } from '../client'
import {
  Donor,
  Sponsorship,
  Payment,
  DonorFilters,
  DonorQueryOptions,
  SponsorshipFilters,
  SponsorshipQueryOptions,
  PaymentFilters,
  PaymentQueryOptions,
  DOCTYPES,
} from '../types'

export class DonorService {
  // Donor CRUD operations
  async getDonors(options: DonorQueryOptions = {}): Promise<Donor[]> {
    const filters = this.buildDonorFilters(options.filters)
    
    return frappeClient.getDocs<Donor>(DOCTYPES.DONOR, {
      fields: options.fields || [
        'name', 'first_name', 'last_name', 'email', 'phone', 'company',
        'occupation', 'annual_income', 'status', 'total_donated',
        'total_points', 'join_date', 'profile_image'
      ],
      filters,
      order_by: options.order_by || 'creation desc',
      limit: options.limit,
      start: options.start,
    })
  }

  async getDonor(name: string): Promise<Donor> {
    return frappeClient.getDoc<Donor>(DOCTYPES.DONOR, name)
  }

  async createDonor(data: Partial<Donor>): Promise<Donor> {
    return frappeClient.createDoc<Donor>(DOCTYPES.DONOR, data)
  }

  async updateDonor(name: string, data: Partial<Donor>): Promise<Donor> {
    return frappeClient.updateDoc<Donor>(DOCTYPES.DONOR, name, data)
  }

  async deleteDonor(name: string): Promise<void> {
    return frappeClient.deleteDoc(DOCTYPES.DONOR, name)
  }

  // Sponsorship CRUD operations
  async getSponsorships(options: SponsorshipQueryOptions = {}): Promise<Sponsorship[]> {
    const filters = this.buildSponsorshipFilters(options.filters)
    
    return frappeClient.getDocs<Sponsorship>(DOCTYPES.SPONSORSHIP, {
      fields: options.fields || [
        'name', 'donor', 'student', 'start_date', 'end_date', 'status',
        'monthly_amount', 'monthly_points', 'student_info_hidden'
      ],
      filters,
      order_by: options.order_by || 'start_date desc',
      limit: options.limit,
      start: options.start,
    })
  }

  async getSponsorship(name: string): Promise<Sponsorship> {
    return frappeClient.getDoc<Sponsorship>(DOCTYPES.SPONSORSHIP, name)
  }

  async createSponsorship(data: Partial<Sponsorship>): Promise<Sponsorship> {
    return frappeClient.createDoc<Sponsorship>(DOCTYPES.SPONSORSHIP, data)
  }

  async updateSponsorship(name: string, data: Partial<Sponsorship>): Promise<Sponsorship> {
    return frappeClient.updateDoc<Sponsorship>(DOCTYPES.SPONSORSHIP, name, data)
  }

  async deleteSponsorship(name: string): Promise<void> {
    return frappeClient.deleteDoc(DOCTYPES.SPONSORSHIP, name)
  }

  // Payment CRUD operations
  async getPayments(options: PaymentQueryOptions = {}): Promise<Payment[]> {
    const filters = this.buildPaymentFilters(options.filters)
    
    return frappeClient.getDocs<Payment>(DOCTYPES.PAYMENT, {
      fields: options.fields || [
        'name', 'donor', 'student', 'sponsorship', 'date', 'amount',
        'points', 'status', 'payment_method', 'transaction_id'
      ],
      filters,
      order_by: options.order_by || 'date desc',
      limit: options.limit,
      start: options.start,
    })
  }

  async getPayment(name: string): Promise<Payment> {
    return frappeClient.getDoc<Payment>(DOCTYPES.PAYMENT, name)
  }

  async createPayment(data: Partial<Payment>): Promise<Payment> {
    return frappeClient.createDoc<Payment>(DOCTYPES.PAYMENT, data)
  }

  async updatePayment(name: string, data: Partial<Payment>): Promise<Payment> {
    return frappeClient.updateDoc<Payment>(DOCTYPES.PAYMENT, name, data)
  }

  async deletePayment(name: string): Promise<void> {
    return frappeClient.deleteDoc(DOCTYPES.PAYMENT, name)
  }

  // Donor-specific operations
  async getDonorSponsorships(donorName: string): Promise<Sponsorship[]> {
    return frappeClient.getDocs<Sponsorship>(DOCTYPES.SPONSORSHIP, {
      filters: { donor: donorName },
      order_by: 'creation desc',
    })
  }

  async getActiveSponsorships(donorName: string): Promise<Sponsorship[]> {
    return frappeClient.getDocs<Sponsorship>(DOCTYPES.SPONSORSHIP, {
      filters: { donor: donorName, status: 'active' },
      order_by: 'creation desc',
    })
  }

  async getDonorPayments(donorName: string): Promise<Payment[]> {
    return frappeClient.getDocs<Payment>(DOCTYPES.PAYMENT, {
      filters: { donor: donorName },
      order_by: 'creation desc',
    })
  }

  async getMonthlyCommitment(donorName: string): Promise<number> {
    const activeSponsorships = await this.getActiveSponsorships(donorName)
    return activeSponsorships.reduce((total, sponsorship) => total + sponsorship.monthly_amount, 0)
  }

  async getMonthlyPoints(donorName: string): Promise<number> {
    const activeSponsorships = await this.getActiveSponsorships(donorName)
    return activeSponsorships.reduce((total, sponsorship) => total + sponsorship.monthly_points, 0)
  }

  // Sponsorship-specific operations
  async requestOptOut(sponsorshipName: string, reason: string): Promise<Sponsorship> {
    return frappeClient.updateDoc<Sponsorship>(DOCTYPES.SPONSORSHIP, sponsorshipName, {
      status: 'opt-out-pending',
      opt_out_requested_date: new Date().toISOString().split('T')[0],
      opt_out_reason: reason,
    })
  }

  async approveOptOut(sponsorshipName: string): Promise<Sponsorship> {
    return frappeClient.updateDoc<Sponsorship>(DOCTYPES.SPONSORSHIP, sponsorshipName, {
      status: 'completed',
      opt_out_effective_date: new Date().toISOString().split('T')[0],
    })
  }

  async rejectOptOut(sponsorshipName: string): Promise<Sponsorship> {
    return frappeClient.updateDoc<Sponsorship>(DOCTYPES.SPONSORSHIP, sponsorshipName, {
      status: 'active',
      opt_out_requested_date: null,
      opt_out_effective_date: null,
      opt_out_reason: null,
    })
  }

  async pauseSponsorship(sponsorshipName: string): Promise<Sponsorship> {
    return frappeClient.updateDoc<Sponsorship>(DOCTYPES.SPONSORSHIP, sponsorshipName, {
      status: 'paused',
    })
  }

  async resumeSponsorship(sponsorshipName: string): Promise<Sponsorship> {
    return frappeClient.updateDoc<Sponsorship>(DOCTYPES.SPONSORSHIP, sponsorshipName, {
      status: 'active',
    })
  }

  async cancelSponsorship(sponsorshipName: string): Promise<Sponsorship> {
    return frappeClient.updateDoc<Sponsorship>(DOCTYPES.SPONSORSHIP, sponsorshipName, {
      status: 'cancelled',
      end_date: new Date().toISOString().split('T')[0],
    })
  }

  // Payment-specific operations
  async processPayment(paymentName: string): Promise<Payment> {
    return frappeClient.updateDoc<Payment>(DOCTYPES.PAYMENT, paymentName, {
      status: 'completed',
      processed_date: new Date().toISOString(),
    })
  }

  async failPayment(paymentName: string, reason: string): Promise<Payment> {
    return frappeClient.updateDoc<Payment>(DOCTYPES.PAYMENT, paymentName, {
      status: 'failed',
      failure_reason: reason,
    })
  }

  async refundPayment(paymentName: string): Promise<Payment> {
    return frappeClient.updateDoc<Payment>(DOCTYPES.PAYMENT, paymentName, {
      status: 'refunded',
    })
  }

  // Search and filter utilities
  async searchDonors(query: string): Promise<Donor[]> {
    return frappeClient.searchLink(DOCTYPES.DONOR, query, { filters: { status: 'active' } })
  }

  async getDonorsByIncomeLevel(incomeLevel: string): Promise<Donor[]> {
    return frappeClient.getDocs<Donor>(DOCTYPES.DONOR, {
      filters: { annual_income: incomeLevel, status: 'active' },
      order_by: 'total_donated desc',
    })
  }

  async getDonorsByStudentPreference(preference: string): Promise<Donor[]> {
    return frappeClient.getDocs<Donor>(DOCTYPES.DONOR, {
      filters: { student_preference: preference, status: 'active' },
      order_by: 'creation desc',
    })
  }

  // Custom methods for donor operations
  async activateDonor(name: string): Promise<Donor> {
    return frappeClient.updateDoc<Donor>(DOCTYPES.DONOR, name, {
      status: 'active',
    })
  }

  async deactivateDonor(name: string): Promise<Donor> {
    return frappeClient.updateDoc<Donor>(DOCTYPES.DONOR, name, {
      status: 'inactive',
    })
  }

  async suspendDonor(name: string): Promise<Donor> {
    return frappeClient.updateDoc<Donor>(DOCTYPES.DONOR, name, {
      status: 'suspended',
    })
  }

  async updateDonationStats(donorName: string): Promise<Donor> {
    // This would typically call a custom server method to recalculate donation stats
    return frappeClient.callMethod('edusponsor.api.update_donor_stats', {
      donor: donorName,
    })
  }

  // Private helper methods
  private buildDonorFilters(filters?: DonorFilters): Record<string, any> {
    if (!filters) return {}

    const frappeFilters: Record<string, any> = {}

    if (filters.status && filters.status.length > 0) {
      frappeFilters.status = ['in', ...filters.status]
    }

    if (filters.annual_income && filters.annual_income.length > 0) {
      frappeFilters.annual_income = ['in', ...filters.annual_income]
    }

    if (filters.student_preference && filters.student_preference.length > 0) {
      frappeFilters.student_preference = ['in', ...filters.student_preference]
    }

    if (filters.communication_frequency && filters.communication_frequency.length > 0) {
      frappeFilters.communication_frequency = ['in', ...filters.communication_frequency]
    }

    if (filters.search) {
      frappeFilters.or_filters = [
        ['first_name', 'like', `%${filters.search}%`],
        ['last_name', 'like', `%${filters.search}%`],
        ['email', 'like', `%${filters.search}%`],
        ['company', 'like', `%${filters.search}%`],
      ]
    }

    return frappeFilters
  }

  private buildSponsorshipFilters(filters?: SponsorshipFilters): Record<string, any> {
    if (!filters) return {}

    const frappeFilters: Record<string, any> = {}

    if (filters.status && filters.status.length > 0) {
      frappeFilters.status = ['in', ...filters.status]
    }

    if (filters.donor) {
      frappeFilters.donor = filters.donor
    }

    if (filters.student) {
      frappeFilters.student = filters.student
    }

    if (filters.start_date_from) {
      frappeFilters.start_date = ['>=', filters.start_date_from]
    }

    if (filters.start_date_to) {
      frappeFilters.start_date = ['<=', filters.start_date_to]
    }

    if (filters.student_info_hidden !== undefined) {
      frappeFilters.student_info_hidden = filters.student_info_hidden
    }

    return frappeFilters
  }

  private buildPaymentFilters(filters?: PaymentFilters): Record<string, any> {
    if (!filters) return {}

    const frappeFilters: Record<string, any> = {}

    if (filters.status && filters.status.length > 0) {
      frappeFilters.status = ['in', ...filters.status]
    }

    if (filters.donor) {
      frappeFilters.donor = filters.donor
    }

    if (filters.student) {
      frappeFilters.student = filters.student
    }

    if (filters.sponsorship) {
      frappeFilters.sponsorship = filters.sponsorship
    }

    if (filters.payment_method && filters.payment_method.length > 0) {
      frappeFilters.payment_method = ['in', ...filters.payment_method]
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
export const donorService = new DonorService()