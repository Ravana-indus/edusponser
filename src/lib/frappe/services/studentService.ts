import { frappeClient } from '../client'
import {
  Student,
  StudentDocument,
  StudentGoal,
  WithdrawalRequest,
  Investment,
  HealthInsurance,
  EducationUpdate,
  StudentUpdate,
  StudentFilters,
  StudentQueryOptions,
  DOCTYPES,
} from '../types'

export class StudentService {
  // Student CRUD operations
  async getStudents(options: StudentQueryOptions = {}): Promise<Student[]> {
    const filters = this.buildStudentFilters(options.filters)
    
    return frappeClient.getDocs<Student>(DOCTYPES.STUDENT, {
      fields: options.fields || [
        'name', 'first_name', 'last_name', 'email', 'phone', 'age',
        'education_level', 'school', 'status', 'total_points',
        'available_points', 'profile_image', 'join_date'
      ],
      filters,
      order_by: options.order_by || 'join_date desc',
      limit: options.limit,
      start: options.start,
    })
  }

  async getStudent(name: string): Promise<Student> {
    return await frappeClient.getDoc<Student>(DOCTYPES.STUDENT, name)
  }

  async getStudentByEmail(email: string): Promise<Student | null> {
    try {
      const rows = await frappeClient.getDocs<Student>(DOCTYPES.STUDENT, {
        filters: { email },
        limit: 1,
      })
      return rows && rows.length > 0 ? rows[0] : null
    } catch (err) {
      return null
    }
  }

  async createStudent(data: Partial<Student>): Promise<Student> {
    return frappeClient.createDoc<Student>(DOCTYPES.STUDENT, data)
  }

  async updateStudent(name: string, data: Partial<Student>): Promise<Student> {
    return frappeClient.updateDoc<Student>(DOCTYPES.STUDENT, name, data)
  }

  async deleteStudent(name: string): Promise<void> {
    return frappeClient.deleteDoc(DOCTYPES.STUDENT, name)
  }

  // Student Documents
  async getStudentDocuments(studentName: string): Promise<StudentDocument[]> {
    return frappeClient.getDocs<StudentDocument>(DOCTYPES.STUDENT_DOCUMENT, {
      filters: { parent: studentName },
      order_by: 'created_date desc',
    })
  }

  async uploadStudentDocument(
    studentName: string,
    documentType: string,
    documentName: string,
    file: File
  ): Promise<StudentDocument> {
    const uploadedFile = await frappeClient.uploadFile(file)

    return frappeClient.createDoc<StudentDocument>(DOCTYPES.STUDENT_DOCUMENT, {
      parent: studentName,
      parenttype: DOCTYPES.STUDENT,
      parentfield: 'documents',
      document_type: documentType,
      document_name: documentName,
      file: uploadedFile.file_url,
      status: 'pending',
    })
  }

  // Student Goals
  async getStudentGoals(studentName: string): Promise<StudentGoal[]> {
    return frappeClient.getDocs<StudentGoal>(DOCTYPES.STUDENT_GOAL, {
      filters: { student: studentName },
      order_by: 'created_date desc',
    })
  }

  async createStudentGoal(data: Partial<StudentGoal>): Promise<StudentGoal> {
    return frappeClient.createDoc<StudentGoal>(DOCTYPES.STUDENT_GOAL, data)
  }

  async updateStudentGoal(name: string, data: Partial<StudentGoal>): Promise<StudentGoal> {
    return frappeClient.updateDoc<StudentGoal>(DOCTYPES.STUDENT_GOAL, name, data)
  }

  // Withdrawal Requests
  async getWithdrawalRequests(studentName?: string): Promise<WithdrawalRequest[]> {
    const filters = studentName ? { student: studentName } : {}
    return frappeClient.getDocs<WithdrawalRequest>(DOCTYPES.WITHDRAWAL_REQUEST, {
      filters,
      order_by: 'request_date desc',
    })
  }

  async createWithdrawalRequest(data: Partial<WithdrawalRequest>): Promise<WithdrawalRequest> {
    return frappeClient.createDoc<WithdrawalRequest>(DOCTYPES.WITHDRAWAL_REQUEST, data)
  }

  async approveWithdrawalRequest(name: string): Promise<WithdrawalRequest> {
    return frappeClient.updateDoc<WithdrawalRequest>(DOCTYPES.WITHDRAWAL_REQUEST, name, {
      status: 'approved',
      processed_date: new Date().toISOString().split('T')[0],
    })
  }

  async rejectWithdrawalRequest(name: string, reason: string): Promise<WithdrawalRequest> {
    return frappeClient.updateDoc<WithdrawalRequest>(DOCTYPES.WITHDRAWAL_REQUEST, name, {
      status: 'rejected',
      rejection_reason: reason,
    })
  }

  // Investments
  async getInvestments(studentName: string): Promise<Investment[]> {
    return frappeClient.getDocs<Investment>(DOCTYPES.INVESTMENT, {
      filters: { student: studentName },
      order_by: 'investment_date desc',
    })
  }

  async createInvestment(data: Partial<Investment>): Promise<Investment> {
    return frappeClient.createDoc<Investment>(DOCTYPES.INVESTMENT, data)
  }

  async updateInvestment(name: string, data: Partial<Investment>): Promise<Investment> {
    return frappeClient.updateDoc<Investment>(DOCTYPES.INVESTMENT, name, data)
  }

  // Health Insurance
  async getHealthInsurance(studentName: string): Promise<HealthInsurance[]> {
    return frappeClient.getDocs<HealthInsurance>(DOCTYPES.HEALTH_INSURANCE, {
      filters: { student: studentName },
      order_by: 'start_date desc',
    })
  }

  async createHealthInsurance(data: Partial<HealthInsurance>): Promise<HealthInsurance> {
    return frappeClient.createDoc<HealthInsurance>(DOCTYPES.HEALTH_INSURANCE, data)
  }

  async updateHealthInsurance(name: string, data: Partial<HealthInsurance>): Promise<HealthInsurance> {
    return frappeClient.updateDoc<HealthInsurance>(DOCTYPES.HEALTH_INSURANCE, name, data)
  }

  // Education Updates
  async getEducationUpdates(studentName?: string): Promise<EducationUpdate[]> {
    const filters = studentName ? { student: studentName } : {}
    return frappeClient.getDocs<EducationUpdate>(DOCTYPES.EDUCATION_UPDATE, {
      filters,
      order_by: 'date desc',
    })
  }

  async createEducationUpdate(data: Partial<EducationUpdate>): Promise<EducationUpdate> {
    return frappeClient.createDoc<EducationUpdate>(DOCTYPES.EDUCATION_UPDATE, data)
  }

  async getPublicEducationUpdates(limit: number = 10): Promise<EducationUpdate[]> {
    return frappeClient.getDocs<EducationUpdate>(DOCTYPES.EDUCATION_UPDATE, {
      filters: { is_public: true },
      order_by: 'creation desc',
      limit,
    })
  }

  // Student Updates (simplified for sponsors)
  async getStudentUpdates(studentName: string): Promise<StudentUpdate[]> {
    return frappeClient.getDocs<StudentUpdate>(DOCTYPES.STUDENT_UPDATE, {
      filters: { student: studentName, is_public: true },
      order_by: 'date desc',
    })
  }

  async createStudentUpdate(data: Partial<StudentUpdate>): Promise<StudentUpdate> {
    return frappeClient.createDoc<StudentUpdate>(DOCTYPES.STUDENT_UPDATE, data)
  }

  // Points Transactions
  async getPointsTransactions(studentName: string, limit: number = 50): Promise<any[]> {
    return frappeClient.getDocs(DOCTYPES.POINTS_TRANSACTION, {
      filters: { student: studentName },
      order_by: 'date desc',
      limit,
    })
  }

  async getPointsBalance(studentName: string): Promise<number> {
    const student = await this.getStudent(studentName)
    return student.available_points || 0
  }

  // Search and filter utilities
  async searchStudents(query: string): Promise<Student[]> {
    return frappeClient.searchLink(DOCTYPES.STUDENT, query, { filters: { status: 'approved' } })
  }

  async getStudentsBySchool(schoolName: string): Promise<Student[]> {
    return frappeClient.getDocs<Student>(DOCTYPES.STUDENT, {
      filters: { school: schoolName, status: 'approved' },
      order_by: 'first_name asc',
    })
  }

  async getStudentsByDistrict(districtName: string): Promise<Student[]> {
    return frappeClient.getDocs<Student>(DOCTYPES.STUDENT, {
      filters: { district: districtName, status: 'approved' },
      order_by: 'first_name asc',
    })
  }

  // Custom methods for student operations
  async approveStudent(name: string): Promise<Student> {
    return frappeClient.updateDoc<Student>(DOCTYPES.STUDENT, name, {
      status: 'approved',
      documents_verified: true,
    })
  }

  async rejectStudent(name: string, reason: string): Promise<Student> {
    return frappeClient.updateDoc<Student>(DOCTYPES.STUDENT, name, {
      status: 'rejected',
    })
  }

  async suspendStudent(name: string): Promise<Student> {
    return frappeClient.updateDoc<Student>(DOCTYPES.STUDENT, name, {
      status: 'suspended',
    })
  }

  async allocatePoints(studentName: string, amount: number, description: string): Promise<any> {
    return frappeClient.callMethod('edusponsor.api.allocate_points', {
      student: studentName,
      amount,
      description,
    })
  }

  async deductPoints(studentName: string, amount: number, description: string): Promise<any> {
    return frappeClient.callMethod('edusponsor.api.deduct_points', {
      student: studentName,
      amount,
      description,
    })
  }

  // Private helper methods
  private buildStudentFilters(filters?: StudentFilters): Record<string, any> {
    if (!filters) return {}

    const frappeFilters: Record<string, any> = {}

    if (filters.status && filters.status.length > 0) {
      frappeFilters.status = ['in', ...filters.status]
    }

    if (filters.education_level && filters.education_level.length > 0) {
      frappeFilters.education_level = ['in', ...filters.education_level]
    }

    if (filters.district && filters.district.length > 0) {
      frappeFilters.district = ['in', ...filters.district]
    }

    if (filters.province && filters.province.length > 0) {
      frappeFilters.province = ['in', ...filters.province]
    }

    if (filters.school && filters.school.length > 0) {
      frappeFilters.school = ['in', ...filters.school]
    }

    if (filters.search) {
      frappeFilters.or_filters = [
        ['first_name', 'like', `%${filters.search}%`],
        ['last_name', 'like', `%${filters.search}%`],
        ['email', 'like', `%${filters.search}%`],
      ]
    }

    return frappeFilters
  }
}

// Export singleton instance
export const studentService = new StudentService()