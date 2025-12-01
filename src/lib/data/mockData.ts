// Mock data structure for EduSponsor platform

export interface Student {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  age: number
  educationLevel: 'primary' | 'secondary' | 'ordinary-level' | 'advanced-level' | 'undergraduate' | 'graduate' | 'postgraduate' | 'vocational'
  grade?: number // For primary and secondary (1-13)
  school: string
  major?: string // For university students
  stream?: string // For A/L students (Science, Commerce, Arts, Technology)
  gpa?: number // For university students
  examResults?: string // For O/L and A/L students
  bio: string
  goals: string
  challenges: string
  whyNeedSupport: string
  status: 'pending' | 'approved' | 'rejected'
  joinDate: string
  totalPoints: number
  donorId?: number | null
  profileImage?: string
  district: string // Sri Lankan district
  province: string // Sri Lankan province
  
  // Enhanced fields
  gramaNiladharaiDivision?: string
  gramaNiladharaiName?: string
  gramaNiladharaiContact?: string
  schoolAddress?: string
  schoolPhone?: string
  schoolPrincipal?: string
  schoolType?: 'government' | 'private' | 'international' | 'semi-government'
  studentClass?: string
  indexNumber?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  emergencyContactRelation?: string
  medicalConditions?: string
  allergies?: string
  bloodGroup?: string
  nationality?: string
  religion?: string
  languages?: string[]
  
  // Financial system fields
  availablePoints: number
  investedPoints: number
  insurancePoints: number
  healthInsuranceStatus?: 'active' | 'inactive' | 'pending'
  healthInsuranceProvider?: string
  healthInsurancePolicyNumber?: string
  healthInsuranceExpiry?: string
  
  // Additional metadata
  lastUpdated: string
  profileCompleted: boolean
  documentsVerified: boolean
}

export interface Donor {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  company?: string
  occupation: string
  annualIncome: 'under-50k' | '50k-100k' | '100k-150k' | '150k-200k' | '200k-250k' | 'over-250k'
  bio: string
  motivation: string
  studentPreference: 'any' | 'stem' | 'arts' | 'business' | 'healthcare' | 'undergraduate' | 'graduate'
  communicationFrequency: 'weekly' | 'monthly' | 'quarterly' | 'minimal'
  anonymous: boolean
  status: 'active' | 'inactive' | 'suspended'
  joinDate: string
  totalDonated: number
  totalPoints: number
  profileImage?: string
}

// Financial System Interfaces
export interface PointsTransaction {
  id: number
  studentId: number
  type: 'earned' | 'spent' | 'invested' | 'withdrawn' | 'insurance' | 'refund'
  amount: number
  description: string
  date: string
  referenceId?: string // Purchase order ID, investment ID, etc.
  balance: number
  category: 'sponsorship' | 'purchase' | 'investment' | 'insurance' | 'withdrawal' | 'bonus' | 'penalty'
}

export interface StudentGoal {
  id: number
  studentId: number
  title: string
  description: string
  targetAmount: number
  currentAmount: number
  category: 'education' | 'laptop' | 'trip' | 'equipment' | 'health' | 'other'
  targetDate: string
  status: 'active' | 'completed' | 'cancelled' | 'paused'
  isPublic: boolean
  createdDate: string
  updatedDate: string
}

export interface WithdrawalRequest {
  id: number
  studentId: number
  amount: number
  reason: string
  category: 'emergency' | 'education' | 'health' | 'personal' | 'other'
  status: 'pending' | 'approved' | 'rejected' | 'processed'
  requestDate: string
  processedDate?: string
  approvedBy?: number
  rejectionReason?: string
  bankDetails: {
    bankName: string
    accountNumber: string
    accountHolder: string
    branch: string
  }
  documents?: string[]
}

export interface Investment {
  id: number
  studentId: number
  amount: number
  platform: string
  investmentType: 'nft' | 'stocks' | 'bonds' | 'crypto' | 'other'
  status: 'active' | 'completed' | 'failed' | 'withdrawn'
  investmentDate: string
  maturityDate?: string
  expectedReturn: number
  actualReturn?: number
  description: string
  transactionHash?: string
  currentValue?: number
}

export interface HealthInsurance {
  id: number
  studentId: number
  provider: string
  policyNumber: string
  coverageAmount: number
  premiumAmount: number
  startDate: string
  expiryDate: string
  status: 'active' | 'expired' | 'cancelled'
  coverageDetails: string[]
  beneficiaryName?: string
  beneficiaryRelation?: string
}

export interface EducationUpdate {
  id: number
  studentId: number
  title: string
  content: string
  type: 'academic' | 'achievement' | 'project' | 'competition' | 'extracurricular' | 'personal'
  date: string
  isPublic: boolean
  attachments?: string[]
  tags?: string[]
}

export interface Sponsorship {
  id: number
  donorId: number
  studentId: number
  startDate: string
  endDate?: string
  status: 'active' | 'paused' | 'cancelled' | 'completed' | 'opt-out-pending'
  monthlyAmount: number
  monthlyPoints: number
  optOutRequestedDate?: string
  optOutEffectiveDate?: string
  optOutReason?: string
  studentInfoHidden: boolean
}

export interface Payment {
  id: number
  donorId: number
  studentId: number
  sponsorshipId: number
  date: string
  amount: number
  points: number
  status: 'completed' | 'pending' | 'failed' | 'refunded'
  transactionId?: string
}

export interface StudentUpdate {
  id: number
  studentId: number
  title: string
  content: string
  type: 'academic' | 'project' | 'personal' | 'milestone'
  date: string
  isPublic: boolean
}

export interface PlatformStats {
  totalStudents: number
  approvedStudents: number
  pendingStudents: number
  totalDonors: number
  activeDonors: number
  totalDonated: number
  totalPoints: number
  monthlyRevenue: number
  activeSponsorships: number
  averageGPA: number
  studentRetention: number
  donorRetention: number
}

export interface CatalogItem {
  id: number
  name: string
  description: string
  category: 'books' | 'stationery' | 'uniforms' | 'technology' | 'equipment' | 'fees' | 'transport' | 'meals' | 'other'
  pointPrice: number
  approximateValueLKR: number // Approximate value in Sri Lankan Rupees
  image?: string
  isActive: boolean
  stockQuantity?: number // For physical items
  createdDate: string
  lastUpdated: string
  educationLevels: string[] // Which education levels can purchase this item
  maxQuantityPerMonth?: number // Limit per student per month
}

export interface PurchaseOrder {
  id: number
  studentId: number
  items: OrderItem[]
  totalPoints: number
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled' | 'cancelled'
  requestDate: string
  approvedDate?: string
  fulfilledDate?: string
  rejectionReason?: string
  qrCode?: string
  notes?: string
  deliveryMethod: 'pickup' | 'delivery'
  deliveryAddress?: string
}

export interface OrderItem {
  id: number
  catalogItemId: number
  quantity: number
  pointsPerItem: number
  totalPoints: number
}

// Mock data
export const mockStudents: Student[] = [
  {
    id: 1,
    firstName: "Kavindu",
    lastName: "Perera",
    email: "kavindu.perera@email.com",
    phone: "+94-77-123-4567",
    age: 8,
    educationLevel: "primary",
    grade: 3,
    school: "Ananda College",
    bio: "Young student passionate about learning mathematics and science. Dreams of becoming an engineer.",
    goals: "To excel in studies and become a successful engineer to help develop Sri Lanka.",
    challenges: "Parents struggle to afford educational materials and extra classes.",
    whyNeedSupport: "My parents work hard but find it difficult to provide all the educational resources I need.",
    status: "approved",
    joinDate: "2024-01-15",
    totalPoints: 60000,
    donorId: 1,
    district: "Colombo",
    province: "Western",
    
    // Enhanced fields
    gramaNiladharaiDivision: "Colombo Divisional Secretariat",
    gramaNiladharaiName: "Mr. Sunil Perera",
    gramaNiladharaiContact: "+94-11-234-5678",
    schoolAddress: "Ananda College, Colombo 10",
    schoolPhone: "+94-11-234-5678",
    schoolPrincipal: "Dr. D.M.S. Dissanayake",
    schoolType: "government",
    studentClass: "3-B",
    indexNumber: "AN2024001",
    emergencyContactName: "Ranjani Perera",
    emergencyContactPhone: "+94-77-123-4568",
    emergencyContactRelation: "Mother",
    medicalConditions: "None",
    allergies: "None",
    bloodGroup: "O+",
    nationality: "Sri Lankan",
    religion: "Buddhism",
    languages: ["Sinhala", "English"],
    
    // Financial system fields
    availablePoints: 45000,
    investedPoints: 10000,
    insurancePoints: 5000,
    healthInsuranceStatus: "active",
    healthInsuranceProvider: "Sri Lanka Insurance",
    healthInsurancePolicyNumber: "SLI-EDU-2024-001",
    healthInsuranceExpiry: "2025-01-15",
    
    // Additional metadata
    lastUpdated: "2024-03-15",
    profileCompleted: true,
    documentsVerified: true
  },
  {
    id: 2,
    firstName: "Nimali",
    lastName: "Rajapaksa",
    email: "nimali.rajapaksa@email.com",
    phone: "+94-71-234-5678",
    age: 16,
    educationLevel: "ordinary-level",
    grade: 11,
    school: "Mahamaya Girls' College",
    examResults: "A's in Mathematics, Science, and English",
    bio: "Dedicated O/L student aiming for excellent results to pursue science stream in A/L.",
    goals: "To become a doctor and serve rural communities in Sri Lanka.",
    challenges: "Need additional tutoring and exam preparation materials.",
    whyNeedSupport: "My family cannot afford extra classes and quality study materials for O/L exams.",
    status: "approved",
    joinDate: "2024-02-20",
    totalPoints: 100000,
    donorId: 1,
    district: "Kandy",
    province: "Central",
    
    // Enhanced fields
    gramaNiladharaiDivision: "Kandy Divisional Secretariat",
    gramaNiladharaiName: "Mrs. Kusum Silva",
    gramaNiladharaiContact: "+94-81-234-5678",
    schoolAddress: "Mahamaya Girls' College, Kandy",
    schoolPhone: "+94-81-234-5678",
    schoolPrincipal: "Mrs. W.D.P. Wijeratne",
    schoolType: "government",
    studentClass: "11-C",
    indexNumber: "MM2024012",
    emergencyContactName: "Rajapaksa Bandara",
    emergencyContactPhone: "+94-71-234-5679",
    emergencyContactRelation: "Father",
    medicalConditions: "Asthma (mild)",
    allergies: "Dust",
    bloodGroup: "A+",
    nationality: "Sri Lankan",
    religion: "Buddhism",
    languages: ["Sinhala", "English", "Tamil"],
    
    // Financial system fields
    availablePoints: 50000,
    investedPoints: 10000,
    insurancePoints: 5000,
    healthInsuranceStatus: "active",
    healthInsuranceProvider: "Sri Lanka Insurance",
    healthInsurancePolicyNumber: "SLI-EDU-2024-002",
    healthInsuranceExpiry: "2025-02-20",
    
    // Additional metadata
    lastUpdated: "2024-03-15",
    profileCompleted: true,
    documentsVerified: false
  },
  {
    id: 3,
    firstName: "Tharindu",
    lastName: "Silva",
    email: "tharindu.silva@email.com",
    phone: "+94-76-345-6789",
    age: 18,
    educationLevel: "advanced-level",
    grade: 13,
    school: "Royal College",
    stream: "Science",
    examResults: "3A's in Physics, Chemistry, Biology",
    bio: "A/L science student preparing for medical college entrance exams.",
    goals: "To enter medical school and specialize in pediatric care.",
    challenges: "High cost of exam preparation classes and medical school application fees.",
    whyNeedSupport: "I need financial support for exam preparation and future medical education costs.",
    status: "approved",
    joinDate: "2024-01-10",
    totalPoints: 120000,
    donorId: 2,
    district: "Colombo",
    province: "Western",
    
    // Enhanced fields
    gramaNiladharaiDivision: "Colombo Divisional Secretariat",
    gramaNiladharaiName: "Mr. Nimal Fernando",
    gramaNiladharaiContact: "+94-11-345-6789",
    schoolAddress: "Royal College, Colombo 07",
    schoolPhone: "+94-11-345-6789",
    schoolPrincipal: "Mr. B.A. Abeyratne",
    schoolType: "government",
    studentClass: "13-A",
    indexNumber: "RC2024035",
    emergencyContactName: "Silva Perera",
    emergencyContactPhone: "+94-76-345-6790",
    emergencyContactRelation: "Father",
    medicalConditions: "None",
    allergies: "None",
    bloodGroup: "B+",
    nationality: "Sri Lankan",
    religion: "Christianity",
    languages: ["Sinhala", "English"],
    
    // Financial system fields
    availablePoints: 90000,
    investedPoints: 20000,
    insurancePoints: 10000,
    healthInsuranceStatus: "active",
    healthInsuranceProvider: "Ceylinco Insurance",
    healthInsurancePolicyNumber: "CEY-EDU-2024-002",
    healthInsuranceExpiry: "2025-01-10",
    
    // Additional metadata
    lastUpdated: "2024-03-10",
    profileCompleted: true,
    documentsVerified: true
  },
  {
    id: 4,
    firstName: "Sanduni",
    lastName: "Fernando",
    email: "sanduni.fernando@email.com",
    phone: "+94-75-456-7890",
    age: 20,
    educationLevel: "undergraduate",
    school: "University of Moratuwa",
    major: "Computer Science",
    gpa: 3.7,
    bio: "Computer science student interested in software development and AI.",
    goals: "To become a software engineer and contribute to Sri Lanka's tech industry.",
    challenges: "Need laptop and programming resources for coursework.",
    whyNeedSupport: "Financial support would help me get a better laptop and access online learning platforms.",
    status: "approved",
    joinDate: "2024-01-25",
    totalPoints: 150000,
    donorId: 3,
    district: "Galle",
    province: "Southern",
    
    // Enhanced fields
    gramaNiladharaiDivision: "Galle Divisional Secretariat",
    gramaNiladharaiName: "Mrs. Kamala Jayawardene",
    gramaNiladharaiContact: "+94-91-456-7890",
    schoolAddress: "University of Moratuwa, Katubedda",
    schoolPhone: "+94-11-265-0251",
    schoolPrincipal: "Prof. N.D. Gunawardena",
    schoolType: "government",
    studentClass: "Year 2 Semester 1",
    indexNumber: "UOM-CS-2022-045",
    emergencyContactName: "Fernando Perera",
    emergencyContactPhone: "+94-75-456-7891",
    emergencyContactRelation: "Father",
    medicalConditions: "None",
    allergies: "None",
    bloodGroup: "AB+",
    nationality: "Sri Lankan",
    religion: "Catholicism",
    languages: ["Sinhala", "English"],
    
    // Financial system fields
    availablePoints: 100000,
    investedPoints: 30000,
    insurancePoints: 20000,
    healthInsuranceStatus: "active",
    healthInsuranceProvider: "AIA Insurance",
    healthInsurancePolicyNumber: "AIA-EDU-2024-003",
    healthInsuranceExpiry: "2025-01-25",
    
    // Additional metadata
    lastUpdated: "2024-03-12",
    profileCompleted: true,
    documentsVerified: true
  },
  {
    id: 5,
    firstName: "Chamath",
    lastName: "Wickramasinghe",
    email: "chamath.w@email.com",
    phone: "+94-70-567-8901",
    age: 24,
    educationLevel: "graduate",
    school: "University of Peradeniya",
    major: "Agricultural Science",
    gpa: 3.8,
    bio: "Graduate student researching sustainable farming practices for Sri Lankan agriculture.",
    goals: "To complete my Master's and work on improving agricultural productivity in Sri Lanka.",
    challenges: "Research costs and field work expenses are substantial.",
    whyNeedSupport: "Need funding for research materials, travel, and specialized equipment.",
    status: "pending",
    joinDate: "2024-03-01",
    totalPoints: 0,
    donorId: null,
    district: "Kandy",
    province: "Central",
    
    // Enhanced fields
    gramaNiladharaiDivision: "Kandy Divisional Secretariat",
    gramaNiladharaiName: "Mr. Sunil Shantha",
    gramaNiladharaiContact: "+94-81-567-8901",
    schoolAddress: "University of Peradeniya, Peradeniya",
    schoolPhone: "+94-81-239-2311",
    schoolPrincipal: "Prof. Upul B. Dissanayake",
    schoolType: "government",
    studentClass: "MSc Year 1",
    indexNumber: "UOP-AGRI-2023-012",
    emergencyContactName: "Wickramasinghe Bandara",
    emergencyContactPhone: "+94-70-567-8902",
    emergencyContactRelation: "Father",
    medicalConditions: "None",
    allergies: "None",
    bloodGroup: "O+",
    nationality: "Sri Lankan",
    religion: "Buddhism",
    languages: ["Sinhala", "English"],
    
    // Financial system fields
    availablePoints: 0,
    investedPoints: 0,
    insurancePoints: 0,
    healthInsuranceStatus: "inactive",
    
    // Additional metadata
    lastUpdated: "2024-03-01",
    profileCompleted: true,
    documentsVerified: false
  },
  {
    id: 6,
    firstName: "Hashini",
    lastName: "Bandara",
    email: "hashini.bandara@email.com",
    phone: "+94-77-678-9012",
    age: 12,
    educationLevel: "secondary",
    grade: 7,
    school: "Vishaka Girls' High School",
    bio: "Secondary school student excelling in arts and languages.",
    goals: "To become a teacher and educate children in rural areas.",
    challenges: "Need art supplies and English learning materials.",
    whyNeedSupport: "My parents cannot afford extra art classes and English learning resources.",
    status: "approved",
    joinDate: "2024-02-15",
    totalPoints: 45000,
    donorId: 4,
    district: "Colombo",
    province: "Western",
    
    // Enhanced fields
    gramaNiladharaiDivision: "Colombo Divisional Secretariat",
    gramaNiladharaiName: "Mrs. Nimali Perera",
    gramaNiladharaiContact: "+94-11-678-9012",
    schoolAddress: "Vishaka Girls' High School, Colombo 07",
    schoolPhone: "+94-11-678-9012",
    schoolPrincipal: "Mrs. Sandamali Aviruppola",
    schoolType: "government",
    studentClass: "7-D",
    indexNumber: "VG2024028",
    emergencyContactName: "Bandara Liyanage",
    emergencyContactPhone: "+94-77-678-9013",
    emergencyContactRelation: "Mother",
    medicalConditions: "None",
    allergies: "None",
    bloodGroup: "A+",
    nationality: "Sri Lankan",
    religion: "Buddhism",
    languages: ["Sinhala", "English"],
    
    // Financial system fields
    availablePoints: 35000,
    investedPoints: 5000,
    insurancePoints: 5000,
    healthInsuranceStatus: "active",
    healthInsuranceProvider: "Sri Lanka Insurance",
    healthInsurancePolicyNumber: "SLI-EDU-2024-004",
    healthInsuranceExpiry: "2025-02-15",
    
    // Additional metadata
    lastUpdated: "2024-03-08",
    profileCompleted: true,
    documentsVerified: true
  }
]

export const mockDonors: Donor[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@email.com",
    phone: "+1-555-0987",
    company: "Tech Corp",
    occupation: "Software Engineer",
    annualIncome: "100k-150k",
    bio: "Passionate about education and technology. Believe in the power of education to transform lives.",
    motivation: "I was fortunate to receive a scholarship that changed my life. Now I want to pay it forward and help other students achieve their dreams.",
    studentPreference: "stem",
    communicationFrequency: "monthly",
    anonymous: false,
    status: "active",
    joinDate: "2024-01-01",
    totalDonated: 450, // 3 students × $50 × 3 months
    totalPoints: 450000
  },
  {
    id: 2,
    firstName: "Lisa",
    lastName: "Wong",
    email: "lisa.wong@email.com",
    phone: "+1-555-0988",
    company: "Healthcare Inc",
    occupation: "Doctor",
    annualIncome: "150k-200k",
    bio: "Healthcare professional dedicated to improving access to education for future healthcare workers.",
    motivation: "I see the need for more healthcare professionals, especially from diverse backgrounds. Supporting nursing students is my way of contributing to the future of healthcare.",
    studentPreference: "healthcare",
    communicationFrequency: "quarterly",
    anonymous: false,
    status: "active",
    joinDate: "2024-01-05",
    totalDonated: 200, // 2 students × $50 × 2 months
    totalPoints: 200000
  },
  {
    id: 3,
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@email.com",
    phone: "+1-555-0989",
    company: "",
    occupation: "Teacher",
    annualIncome: "50k-100k",
    bio: "High school teacher who believes in the power of education to create opportunities.",
    motivation: "As a teacher, I see students with potential but limited resources. I want to help deserving students pursue higher education and achieve their goals.",
    studentPreference: "any",
    communicationFrequency: "monthly",
    anonymous: true,
    status: "inactive",
    joinDate: "2024-02-01",
    totalDonated: 50,
    totalPoints: 50000
  },
  {
    id: 4,
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1-555-0990",
    company: "Creative Agency",
    occupation: "Graphic Designer",
    annualIncome: "75k-100k",
    bio: "Creative professional passionate about supporting arts education and creative careers.",
    motivation: "I believe in the importance of arts education and want to support students pursuing creative fields that often get less funding.",
    studentPreference: "arts",
    communicationFrequency: "weekly",
    anonymous: false,
    status: "active",
    joinDate: "2024-02-15",
    totalDonated: 100,
    totalPoints: 100000
  },
  {
    id: 5,
    firstName: "Michael",
    lastName: "Davis",
    email: "michael.davis@email.com",
    phone: "+1-555-0991",
    company: "Investment Firm",
    occupation: "Financial Analyst",
    annualIncome: "over-250k",
    bio: "Finance professional committed to supporting business education and entrepreneurship.",
    motivation: "I want to support the next generation of business leaders and entrepreneurs who will create jobs and drive economic growth.",
    studentPreference: "business",
    communicationFrequency: "monthly",
    anonymous: false,
    status: "active",
    joinDate: "2024-03-01",
    totalDonated: 50,
    totalPoints: 50000
  }
]

export const mockSponsorships: Sponsorship[] = [
  {
    id: 1,
    donorId: 1,
    studentId: 1,
    startDate: "2024-01-15",
    status: "active",
    monthlyAmount: 50,
    monthlyPoints: 50000,
    studentInfoHidden: false
  },
  {
    id: 2,
    donorId: 1,
    studentId: 2,
    startDate: "2024-02-15",
    status: "opt-out-pending",
    monthlyAmount: 50,
    monthlyPoints: 50000,
    studentInfoHidden: true,
    optOutRequestedDate: "2024-03-15",
    optOutEffectiveDate: "2024-04-15",
    optOutReason: "Need to reduce monthly commitments"
  },
  {
    id: 3,
    donorId: 1,
    studentId: 6,
    startDate: "2024-03-01",
    status: "active",
    monthlyAmount: 50,
    monthlyPoints: 50000,
    studentInfoHidden: false
  },
  {
    id: 4,
    donorId: 2,
    studentId: 3,
    startDate: "2024-01-10",
    status: "active",
    monthlyAmount: 50,
    monthlyPoints: 50000,
    studentInfoHidden: false
  },
  {
    id: 5,
    donorId: 2,
    studentId: 4,
    startDate: "2024-02-01",
    status: "active",
    monthlyAmount: 50,
    monthlyPoints: 50000,
    studentInfoHidden: false
  },
  {
    id: 6,
    donorId: 3,
    studentId: 4,
    startDate: "2024-02-01",
    endDate: "2024-02-29",
    status: "cancelled",
    monthlyAmount: 50,
    monthlyPoints: 50000,
    studentInfoHidden: false
  },
  {
    id: 7,
    donorId: 4,
    studentId: 2,
    startDate: "2024-03-15",
    status: "active",
    monthlyAmount: 50,
    monthlyPoints: 50000,
    studentInfoHidden: false
  },
  {
    id: 8,
    donorId: 5,
    studentId: 5,
    startDate: "2024-03-01",
    status: "opt-out-pending",
    monthlyAmount: 50,
    monthlyPoints: 50000,
    studentInfoHidden: true,
    optOutRequestedDate: "2024-03-15",
    optOutEffectiveDate: "2024-04-15",
    optOutReason: "Financial constraints"
  }
]

export const mockPayments: Payment[] = [
  // Donor 1 - Student 1 payments
  {
    id: 1,
    donorId: 1,
    studentId: 1,
    sponsorshipId: 1,
    date: "2024-03-01",
    amount: 50,
    points: 50000,
    status: "completed",
    transactionId: "txn_001"
  },
  {
    id: 2,
    donorId: 1,
    studentId: 1,
    sponsorshipId: 1,
    date: "2024-02-01",
    amount: 50,
    points: 50000,
    status: "completed",
    transactionId: "txn_002"
  },
  {
    id: 3,
    donorId: 1,
    studentId: 1,
    sponsorshipId: 1,
    date: "2024-01-01",
    amount: 50,
    points: 50000,
    status: "completed",
    transactionId: "txn_003"
  },
  // Donor 1 - Student 2 payments
  {
    id: 4,
    donorId: 1,
    studentId: 2,
    sponsorshipId: 2,
    date: "2024-03-01",
    amount: 50,
    points: 50000,
    status: "completed",
    transactionId: "txn_004"
  },
  {
    id: 5,
    donorId: 1,
    studentId: 2,
    sponsorshipId: 2,
    date: "2024-02-01",
    amount: 50,
    points: 50000,
    status: "completed",
    transactionId: "txn_005"
  },
  // Donor 1 - Student 6 payments
  {
    id: 6,
    donorId: 1,
    studentId: 6,
    sponsorshipId: 3,
    date: "2024-03-01",
    amount: 50,
    points: 50000,
    status: "completed",
    transactionId: "txn_006"
  },
  // Donor 2 - Student 3 payments
  {
    id: 7,
    donorId: 2,
    studentId: 3,
    sponsorshipId: 4,
    date: "2024-03-01",
    amount: 50,
    points: 50000,
    status: "completed",
    transactionId: "txn_007"
  },
  {
    id: 8,
    donorId: 2,
    studentId: 3,
    sponsorshipId: 4,
    date: "2024-02-01",
    amount: 50,
    points: 50000,
    status: "completed",
    transactionId: "txn_008"
  },
  // Donor 2 - Student 4 payments
  {
    id: 9,
    donorId: 2,
    studentId: 4,
    sponsorshipId: 5,
    date: "2024-03-01",
    amount: 50,
    points: 50000,
    status: "completed",
    transactionId: "txn_009"
  },
  {
    id: 10,
    donorId: 2,
    studentId: 4,
    sponsorshipId: 5,
    date: "2024-02-01",
    amount: 50,
    points: 50000,
    status: "completed",
    transactionId: "txn_010"
  },
  // Donor 3 - Student 4 payments (cancelled)
  {
    id: 11,
    donorId: 3,
    studentId: 4,
    sponsorshipId: 6,
    date: "2024-02-01",
    amount: 50,
    points: 50000,
    status: "completed",
    transactionId: "txn_011"
  },
  // Donor 4 - Student 2 payments
  {
    id: 12,
    donorId: 4,
    studentId: 2,
    sponsorshipId: 7,
    date: "2024-03-15",
    amount: 50,
    points: 50000,
    status: "completed",
    transactionId: "txn_012"
  },
  // Donor 5 - Student 5 payments
  {
    id: 13,
    donorId: 5,
    studentId: 5,
    sponsorshipId: 8,
    date: "2024-03-01",
    amount: 50,
    points: 50000,
    status: "completed",
    transactionId: "txn_013"
  }
]

export const mockStudentUpdates: StudentUpdate[] = [
  {
    id: 1,
    studentId: 1,
    title: "Midterm Results - Great Success!",
    content: "Just received my midterm results and I'm thrilled to share that I got A's in all my courses! Data Structures and Algorithms was challenging but I managed to score 95%. Your support is really helping me focus on my studies.",
    type: "academic",
    date: "2024-03-10",
    isPublic: true
  },
  {
    id: 2,
    studentId: 1,
    title: "Working on Educational App Project",
    content: "I'm currently working on a group project for my software engineering class. We're building an educational app that helps elementary students learn math through gamification. It's exciting to work on something that aligns with my goals!",
    type: "project",
    date: "2024-02-28",
    isPublic: true
  },
  {
    id: 3,
    studentId: 1,
    title: "Thank You for Your Support",
    content: "I wanted to express my sincere gratitude for your sponsorship. Your support has allowed me to reduce my work hours and dedicate more time to my studies. It's making a real difference in my academic performance.",
    type: "personal",
    date: "2024-02-15",
    isPublic: true
  },
  {
    id: 4,
    studentId: 3,
    title: "Clinical Rotations Started",
    content: "This week I started my first clinical rotation at the local hospital. It's challenging but incredibly rewarding. I'm getting hands-on experience and learning so much about patient care.",
    type: "academic",
    date: "2024-03-05",
    isPublic: true
  },
  {
    id: 5,
    studentId: 3,
    title: "NCLEX Preparation",
    content: "I've started preparing for my NCLEX exam. The study materials you helped me purchase are invaluable. I'm using them every day and feeling more confident about passing the exam.",
    type: "milestone",
    date: "2024-02-20",
    isPublic: true
  },
  {
    id: 6,
    studentId: 4,
    title: "Business Plan Competition",
    content: "I've entered a business plan competition with my idea for a social enterprise that provides job training for homeless youth. Your support allowed me to pay the entry fee and get the resources I need.",
    type: "project",
    date: "2024-02-25",
    isPublic: true
  }
]

// Mock catalog items
export const mockCatalogItems: CatalogItem[] = [
  {
    id: 1,
    name: "Primary School Textbook Set",
    description: "Complete set of textbooks for primary school grades 1-5",
    category: "books",
    pointPrice: 8000,
    approximateValueLKR: 8000,
    isActive: true,
    stockQuantity: 50,
    createdDate: "2024-01-01",
    lastUpdated: "2024-01-01",
    educationLevels: ["primary"],
    maxQuantityPerMonth: 1
  },
  {
    id: 2,
    name: "O/L Exam Preparation Guide",
    description: "Comprehensive guide for O/L examination preparation",
    category: "books",
    pointPrice: 12000,
    approximateValueLKR: 12000,
    isActive: true,
    stockQuantity: 30,
    createdDate: "2024-01-01",
    lastUpdated: "2024-01-01",
    educationLevels: ["ordinary-level"],
    maxQuantityPerMonth: 2
  },
  {
    id: 3,
    name: "A/L Science Package",
    description: "Study materials for A/L Science stream (Physics, Chemistry, Biology)",
    category: "books",
    pointPrice: 15000,
    approximateValueLKR: 15000,
    isActive: true,
    stockQuantity: 25,
    createdDate: "2024-01-01",
    lastUpdated: "2024-01-01",
    educationLevels: ["advanced-level"],
    maxQuantityPerMonth: 1
  },
  {
    id: 4,
    name: "School Stationery Set",
    description: "Complete stationery set including pens, pencils, notebooks, and geometry box",
    category: "stationery",
    pointPrice: 3000,
    approximateValueLKR: 3000,
    isActive: true,
    stockQuantity: 100,
    createdDate: "2024-01-01",
    lastUpdated: "2024-01-01",
    educationLevels: ["primary", "secondary", "ordinary-level", "advanced-level"],
    maxQuantityPerMonth: 2
  },
  {
    id: 5,
    name: "School Uniform",
    description: "Standard school uniform with school badge",
    category: "uniforms",
    pointPrice: 5000,
    approximateValueLKR: 5000,
    isActive: true,
    stockQuantity: 40,
    createdDate: "2024-01-01",
    lastUpdated: "2024-01-01",
    educationLevels: ["primary", "secondary", "ordinary-level", "advanced-level"],
    maxQuantityPerMonth: 1
  },
  {
    id: 6,
    name: "Laptop Computer",
    description: "Basic laptop suitable for university students",
    category: "technology",
    pointPrice: 100000,
    approximateValueLKR: 100000,
    isActive: true,
    stockQuantity: 10,
    createdDate: "2024-01-01",
    lastUpdated: "2024-01-01",
    educationLevels: ["undergraduate", "graduate", "postgraduate"],
    maxQuantityPerMonth: 1
  },
  {
    id: 7,
    name: "Monthly Bus Pass",
    description: "Monthly bus pass for students commuting to school/university",
    category: "transport",
    pointPrice: 4000,
    approximateValueLKR: 4000,
    isActive: true,
    createdDate: "2024-01-01",
    lastUpdated: "2024-01-01",
    educationLevels: ["secondary", "ordinary-level", "advanced-level", "undergraduate", "graduate"],
    maxQuantityPerMonth: 1
  },
  {
    id: 8,
    name: "School Shoes",
    description: "Durable school shoes for daily wear",
    category: "uniforms",
    pointPrice: 3500,
    approximateValueLKR: 3500,
    isActive: true,
    stockQuantity: 60,
    createdDate: "2024-01-01",
    lastUpdated: "2024-01-01",
    educationLevels: ["primary", "secondary", "ordinary-level", "advanced-level"],
    maxQuantityPerMonth: 1
  },
  {
    id: 9,
    name: "Mathematics Tutoring",
    description: "Monthly mathematics tutoring sessions",
    category: "fees",
    pointPrice: 6000,
    approximateValueLKR: 6000,
    isActive: true,
    createdDate: "2024-01-01",
    lastUpdated: "2024-01-01",
    educationLevels: ["primary", "secondary", "ordinary-level"],
    maxQuantityPerMonth: 1
  },
  {
    id: 10,
    name: "Science Lab Equipment",
    description: "Basic science lab equipment for experiments",
    category: "equipment",
    pointPrice: 8000,
    approximateValueLKR: 8000,
    isActive: true,
    stockQuantity: 20,
    createdDate: "2024-01-01",
    lastUpdated: "2024-01-01",
    educationLevels: ["ordinary-level", "advanced-level"],
    maxQuantityPerMonth: 1
  }
]

// Mock purchase orders
export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 1,
    studentId: 1,
    items: [
      {
        id: 1,
        catalogItemId: 1,
        quantity: 1,
        pointsPerItem: 8000,
        totalPoints: 8000
      },
      {
        id: 2,
        catalogItemId: 4,
        quantity: 1,
        pointsPerItem: 3000,
        totalPoints: 3000
      }
    ],
    totalPoints: 11000,
    status: "fulfilled",
    requestDate: "2024-02-01",
    approvedDate: "2024-02-02",
    fulfilledDate: "2024-02-05",
    qrCode: "QR001",
    deliveryMethod: "pickup"
  },
  {
    id: 2,
    studentId: 3,
    items: [
      {
        id: 3,
        catalogItemId: 3,
        quantity: 1,
        pointsPerItem: 15000,
        totalPoints: 15000
      }
    ],
    totalPoints: 15000,
    status: "approved",
    requestDate: "2024-02-15",
    approvedDate: "2024-02-16",
    qrCode: "QR002",
    deliveryMethod: "delivery",
    deliveryAddress: "Royal College, Colombo 07"
  },
  {
    id: 3,
    studentId: 4,
    items: [
      {
        id: 4,
        catalogItemId: 6,
        quantity: 1,
        pointsPerItem: 100000,
        totalPoints: 100000
      }
    ],
    totalPoints: 100000,
    status: "pending",
    requestDate: "2024-03-01",
    deliveryMethod: "pickup",
    notes: "Need laptop for programming assignments"
  },
  {
    id: 4,
    studentId: 6,
    items: [
      {
        id: 5,
        catalogItemId: 4,
        quantity: 1,
        pointsPerItem: 3000,
        totalPoints: 3000
      },
      {
        id: 6,
        catalogItemId: 9,
        quantity: 1,
        pointsPerItem: 6000,
        totalPoints: 6000
      }
    ],
    totalPoints: 9000,
    status: "approved",
    requestDate: "2024-02-20",
    approvedDate: "2024-02-21",
    qrCode: "QR004",
    deliveryMethod: "delivery",
    deliveryAddress: "Vishaka Girls' High School, Colombo 07"
  }
]

// Mock data for financial system
export const mockPointsTransactions: PointsTransaction[] = [
  {
    id: 1,
    studentId: 1,
    type: "earned",
    amount: 50000,
    description: "Monthly sponsorship from John Smith",
    date: "2024-03-01",
    referenceId: "1",
    balance: 50000,
    category: "sponsorship"
  },
  {
    id: 2,
    studentId: 1,
    type: "spent",
    amount: 8000,
    description: "Purchase: Primary School Textbook Set",
    date: "2024-02-15",
    referenceId: "1",
    balance: 42000,
    category: "purchase"
  },
  {
    id: 3,
    studentId: 1,
    type: "invested",
    amount: 10000,
    description: "NFT investment in educational platform",
    date: "2024-02-10",
    referenceId: "INV001",
    balance: 32000,
    category: "investment"
  },
  {
    id: 4,
    studentId: 1,
    type: "insurance",
    amount: 5000,
    description: "Health insurance premium payment",
    date: "2024-02-01",
    referenceId: "INS001",
    balance: 27000,
    category: "insurance"
  },
  {
    id: 5,
    studentId: 3,
    type: "earned",
    amount: 50000,
    description: "Monthly sponsorship from Lisa Wong",
    date: "2024-03-01",
    referenceId: "2",
    balance: 50000,
    category: "sponsorship"
  },
  {
    id: 6,
    studentId: 3,
    type: "spent",
    amount: 15000,
    description: "Purchase: A/L Science Package",
    date: "2024-02-20",
    referenceId: "2",
    balance: 35000,
    category: "purchase"
  },
  {
    id: 7,
    studentId: 4,
    type: "earned",
    amount: 50000,
    description: "Monthly sponsorship from David Brown",
    date: "2024-03-01",
    referenceId: "3",
    balance: 50000,
    category: "sponsorship"
  },
  {
    id: 8,
    studentId: 4,
    type: "invested",
    amount: 30000,
    description: "NFT investment in tech education platform",
    date: "2024-02-25",
    referenceId: "INV002",
    balance: 20000,
    category: "investment"
  }
]

export const mockStudentGoals: StudentGoal[] = [
  {
    id: 1,
    studentId: 1,
    title: "Laptop for Programming",
    description: "Save points to purchase a laptop for learning programming and computer skills",
    targetAmount: 100000,
    currentAmount: 25000,
    category: "laptop",
    targetDate: "2025-01-15",
    status: "active",
    isPublic: true,
    createdDate: "2024-02-01",
    updatedDate: "2024-03-01"
  },
  {
    id: 2,
    studentId: 3,
    title: "Medical School Entrance Fees",
    description: "Save for medical school entrance examination and application fees",
    targetAmount: 150000,
    currentAmount: 45000,
    category: "education",
    targetDate: "2024-12-01",
    status: "active",
    isPublic: true,
    createdDate: "2024-01-15",
    updatedDate: "2024-03-01"
  },
  {
    id: 3,
    studentId: 4,
    title: "Higher Education Fund",
    description: "Save points for Master's degree in Computer Science",
    targetAmount: 500000,
    currentAmount: 120000,
    category: "education",
    targetDate: "2026-06-01",
    status: "active",
    isPublic: true,
    createdDate: "2024-01-25",
    updatedDate: "2024-03-01"
  },
  {
    id: 4,
    studentId: 6,
    title: "Art Supplies for School",
    description: "Save for quality art supplies and materials",
    targetAmount: 25000,
    currentAmount: 15000,
    category: "equipment",
    targetDate: "2024-06-01",
    status: "active",
    isPublic: true,
    createdDate: "2024-02-15",
    updatedDate: "2024-03-01"
  }
]

export const mockWithdrawalRequests: WithdrawalRequest[] = [
  {
    id: 1,
    studentId: 1,
    amount: 10000,
    reason: "Emergency medical expenses for family member",
    category: "emergency",
    status: "approved",
    requestDate: "2024-02-10",
    processedDate: "2024-02-12",
    approvedBy: 1,
    bankDetails: {
      bankName: "Bank of Ceylon",
      accountNumber: "1234567890",
      accountHolder: "Ranjani Perera",
      branch: "Colombo Main Branch"
    },
    documents: ["medical_report.pdf", "id_copy.pdf"]
  },
  {
    id: 2,
    studentId: 4,
    amount: 20000,
    reason: "Need funds for specialized programming course",
    category: "education",
    status: "pending",
    requestDate: "2024-03-01",
    bankDetails: {
      bankName: "Commercial Bank",
      accountNumber: "0987654321",
      accountHolder: "Sanduni Fernando",
      branch: "Galle Branch"
    }
  }
]

export const mockInvestments: Investment[] = [
  {
    id: 1,
    studentId: 1,
    amount: 10000,
    platform: "EduNFT Platform",
    investmentType: "nft",
    status: "active",
    investmentDate: "2024-02-10",
    maturityDate: "2024-08-10",
    expectedReturn: 12000,
    description: "Educational NFT collection for primary education",
    transactionHash: "0x123abc456def789ghi",
    currentValue: 11000
  },
  {
    id: 2,
    studentId: 3,
    amount: 20000,
    platform: "CryptoLearn",
    investmentType: "crypto",
    status: "active",
    investmentDate: "2024-02-15",
    maturityDate: "2024-08-15",
    expectedReturn: 25000,
    description: "Cryptocurrency investment for education funding",
    transactionHash: "0x456def789ghi012jkl",
    currentValue: 22000
  },
  {
    id: 3,
    studentId: 4,
    amount: 30000,
    platform: "TechStocks Edu",
    investmentType: "stocks",
    status: "active",
    investmentDate: "2024-02-25",
    maturityDate: "2024-08-25",
    expectedReturn: 36000,
    description: "Technology stocks for education funding",
    currentValue: 33000
  }
]

export const mockHealthInsurance: HealthInsurance[] = [
  {
    id: 1,
    studentId: 1,
    provider: "Sri Lanka Insurance",
    policyNumber: "SLI-EDU-2024-001",
    coverageAmount: 500000,
    premiumAmount: 5000,
    startDate: "2024-01-15",
    expiryDate: "2025-01-15",
    status: "active",
    coverageDetails: ["Hospitalization", "Emergency care", "Outpatient treatment", "Medication"],
    beneficiaryName: "Ranjani Perera",
    beneficiaryRelation: "Mother"
  },
  {
    id: 2,
    studentId: 3,
    provider: "Ceylinco Insurance",
    policyNumber: "CEY-EDU-2024-002",
    coverageAmount: 750000,
    premiumAmount: 10000,
    startDate: "2024-01-10",
    expiryDate: "2025-01-10",
    status: "active",
    coverageDetails: ["Hospitalization", "Emergency care", "Outpatient treatment", "Medication", "Dental care"],
    beneficiaryName: "Silva Perera",
    beneficiaryRelation: "Father"
  },
  {
    id: 3,
    studentId: 4,
    provider: "AIA Insurance",
    policyNumber: "AIA-EDU-2024-003",
    coverageAmount: 1000000,
    premiumAmount: 20000,
    startDate: "2024-01-25",
    expiryDate: "2025-01-25",
    status: "active",
    coverageDetails: ["Hospitalization", "Emergency care", "Outpatient treatment", "Medication", "Dental care", "Vision care"],
    beneficiaryName: "Fernando Perera",
    beneficiaryRelation: "Father"
  },
  {
    id: 4,
    studentId: 6,
    provider: "Sri Lanka Insurance",
    policyNumber: "SLI-EDU-2024-004",
    coverageAmount: 500000,
    premiumAmount: 5000,
    startDate: "2024-02-15",
    expiryDate: "2025-02-15",
    status: "active",
    coverageDetails: ["Hospitalization", "Emergency care", "Outpatient treatment", "Medication"],
    beneficiaryName: "Bandara Liyanage",
    beneficiaryRelation: "Mother"
  }
]

export const mockEducationUpdates: EducationUpdate[] = [
  {
    id: 1,
    studentId: 1,
    title: "Mathematics Competition Winner",
    content: "Won first place in the inter-school mathematics competition! Received a gold medal and certificate.",
    type: "achievement",
    date: "2024-03-10",
    isPublic: true,
    tags: ["mathematics", "competition", "achievement"],
    attachments: ["certificate.pdf", "photo.jpg"]
  },
  {
    id: 2,
    studentId: 1,
    title: "Science Project Completed",
    content: "Successfully completed a science project on renewable energy. The project was selected for the district science fair.",
    type: "project",
    date: "2024-02-28",
    isPublic: true,
    tags: ["science", "project", "renewable energy"]
  },
  {
    id: 3,
    studentId: 3,
    title: "A/L Mock Exam Results",
    content: "Excellent results in A/L mock exams: 3A's in Physics, Chemistry, and Biology. Ranked 2nd in the class.",
    type: "academic",
    date: "2024-03-05",
    isPublic: true,
    tags: ["A/L", "exams", "results"]
  },
  {
    id: 4,
    studentId: 3,
    title: "Volunteer Work at Hospital",
    content: "Started volunteering at the local hospital every weekend. Gaining valuable experience in healthcare.",
    type: "extracurricular",
    date: "2024-02-20",
    isPublic: true,
    tags: ["volunteer", "healthcare", "experience"]
  },
  {
    id: 5,
    studentId: 4,
    title: "Programming Competition",
    content: "Participated in the national programming competition and reached the semi-finals. Learned a lot about algorithms.",
    type: "competition",
    date: "2024-02-25",
    isPublic: true,
    tags: ["programming", "competition", "algorithms"]
  },
  {
    id: 6,
    studentId: 4,
    title: "AI Workshop Completed",
    content: "Completed a 3-day workshop on Artificial Intelligence and Machine Learning. Received certification.",
    type: "academic",
    date: "2024-03-01",
    isPublic: true,
    tags: ["AI", "machine learning", "workshop", "certification"]
  },
  {
    id: 7,
    studentId: 6,
    title: "Art Exhibition",
    content: "My artwork was selected for the school art exhibition. Sold two paintings and received great feedback.",
    type: "achievement",
    date: "2024-02-15",
    isPublic: true,
    tags: ["art", "exhibition", "achievement"]
  }
]

export const mockPlatformStats: PlatformStats = {
  totalStudents: mockStudents.length,
  approvedStudents: mockStudents.filter(s => s.status === 'approved').length,
  pendingStudents: mockStudents.filter(s => s.status === 'pending').length,
  totalDonors: mockDonors.length,
  activeDonors: mockDonors.filter(d => d.status === 'active').length,
  totalDonated: mockDonors.reduce((sum, d) => sum + d.totalDonated, 0),
  totalPoints: mockDonors.reduce((sum, d) => sum + d.totalPoints, 0),
  monthlyRevenue: mockSponsorships.filter(s => s.status === 'active').length * 50,
  activeSponsorships: mockSponsorships.filter(s => s.status === 'active').length,
  averageGPA: mockStudents.reduce((sum, s) => sum + s.gpa, 0) / mockStudents.length,
  studentRetention: 95,
  donorRetention: 88
}

// Helper functions
export const getStudentById = (id: number): Student | undefined => {
  return mockStudents.find(student => student.id === id)
}

export const getDonorById = (id: number): Donor | undefined => {
  return mockDonors.find(donor => donor.id === id)
}

export const getSponsorshipByDonorId = (donorId: number): Sponsorship[] => {
  return mockSponsorships.filter(sponsorship => sponsorship.donorId === donorId)
}

export const getSponsorshipByStudentId = (studentId: number): Sponsorship[] => {
  return mockSponsorships.filter(sponsorship => sponsorship.studentId === studentId)
}

export const getPaymentsByDonorId = (donorId: number): Payment[] => {
  return mockPayments.filter(payment => payment.donorId === donorId)
}

export const getPaymentsByStudentId = (studentId: number): Payment[] => {
  return mockPayments.filter(payment => payment.studentId === studentId)
}

export const getStudentUpdatesByStudentId = (studentId: number): StudentUpdate[] => {
  return mockStudentUpdates.filter(update => update.studentId === studentId)
}

export const getDonorSponsoredStudent = (donorId: number): Student | null => {
  const activeSponsorship = mockSponsorships.find(
    s => s.donorId === donorId && s.status === 'active'
  )
  if (activeSponsorship) {
    return getStudentById(activeSponsorship.studentId) || null
  }
  return null
}

export const getDonorSponsoredStudents = (donorId: number): Student[] => {
  const activeSponsorships = mockSponsorships.filter(
    s => s.donorId === donorId && s.status === 'active'
  )
  return activeSponsorships.map(sponsorship => getStudentById(sponsorship.studentId)).filter(Boolean) as Student[]
}

export const getDonorActiveSponsorships = (donorId: number): Sponsorship[] => {
  return mockSponsorships.filter(
    sponsorship => sponsorship.donorId === donorId && sponsorship.status === 'active'
  )
}

export const getDonorAllSponsorships = (donorId: number): Sponsorship[] => {
  return mockSponsorships.filter(
    sponsorship => sponsorship.donorId === donorId && (sponsorship.status === 'active' || sponsorship.status === 'opt-out-pending')
  )
}

export const getDonorMonthlyCommitment = (donorId: number): number => {
  const activeSponsorships = getDonorActiveSponsorships(donorId)
  return activeSponsorships.reduce((total, sponsorship) => total + sponsorship.monthlyAmount, 0)
}

export const getDonorMonthlyPoints = (donorId: number): number => {
  const activeSponsorships = getDonorActiveSponsorships(donorId)
  return activeSponsorships.reduce((total, sponsorship) => total + sponsorship.monthlyPoints, 0)
}

export const getStudentDonor = (studentId: number): Donor | null => {
  const activeSponsorship = mockSponsorships.find(
    s => s.studentId === studentId && s.status === 'active'
  )
  if (activeSponsorship) {
    return getDonorById(activeSponsorship.donorId) || null
  }
  return null
}

// Opt-out functionality helper functions
export const requestOptOut = (sponsorshipId: number, reason?: string): boolean => {
  const sponsorship = mockSponsorships.find(s => s.id === sponsorshipId)
  if (!sponsorship || sponsorship.status !== 'active') return false
  
  const requestedDate = new Date().toISOString().split('T')[0]
  const effectiveDate = new Date()
  effectiveDate.setMonth(effectiveDate.getMonth() + 1)
  const effectiveDateStr = effectiveDate.toISOString().split('T')[0]
  
  sponsorship.status = 'opt-out-pending'
  sponsorship.optOutRequestedDate = requestedDate
  sponsorship.optOutEffectiveDate = effectiveDateStr
  sponsorship.optOutReason = reason
  sponsorship.studentInfoHidden = true
  
  return true
}

export const cancelOptOut = (sponsorshipId: number): boolean => {
  const sponsorship = mockSponsorships.find(s => s.id === sponsorshipId)
  if (!sponsorship || sponsorship.status !== 'opt-out-pending') return false
  
  sponsorship.status = 'active'
  sponsorship.optOutRequestedDate = undefined
  sponsorship.optOutEffectiveDate = undefined
  sponsorship.optOutReason = undefined
  sponsorship.studentInfoHidden = false
  
  return true
}

export const getOptOutPendingSponsorships = (donorId: number): Sponsorship[] => {
  return mockSponsorships.filter(
    sponsorship => sponsorship.donorId === donorId && sponsorship.status === 'opt-out-pending'
  )
}

export const getDaysUntilOptOutEffective = (sponsorshipId: number): number => {
  const sponsorship = mockSponsorships.find(s => s.id === sponsorshipId)
  if (!sponsorship || !sponsorship.optOutEffectiveDate) return 0
  
  const effectiveDate = new Date(sponsorship.optOutEffectiveDate)
  const today = new Date()
  const diffTime = effectiveDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export const processOptOutExpirations = (): void => {
  const today = new Date().toISOString().split('T')[0]
  const expiredOptOuts = mockSponsorships.filter(
    s => s.status === 'opt-out-pending' && s.optOutEffectiveDate && s.optOutEffectiveDate <= today
  )
  
  expiredOptOuts.forEach(sponsorship => {
    sponsorship.status = 'cancelled'
    sponsorship.endDate = sponsorship.optOutEffectiveDate
  })
}

export const isStudentInfoHidden = (studentId: number): boolean => {
  const sponsorship = mockSponsorships.find(
    s => s.studentId === studentId && (s.status === 'opt-out-pending' || s.studentInfoHidden)
  )
  return sponsorship?.studentInfoHidden || false
}

export const getHiddenStudentInfo = (studentId: number): Partial<Student> => {
  const student = getStudentById(studentId)
  if (!student || !isStudentInfoHidden(studentId)) return student || {}
  
  return {
    id: student.id,
    firstName: "Student",
    lastName: "ID: " + student.id,
    educationLevel: student.educationLevel,
    status: student.status,
    joinDate: student.joinDate,
    totalPoints: student.totalPoints,
    availablePoints: student.availablePoints,
    investedPoints: student.investedPoints,
    insurancePoints: student.insurancePoints,
    district: student.district,
    province: student.province,
    lastUpdated: student.lastUpdated,
    profileCompleted: student.profileCompleted,
    documentsVerified: student.documentsVerified
  }
}

// New helper functions for catalog and purchase orders
export const getCatalogItemById = (id: number): CatalogItem | undefined => {
  return mockCatalogItems.find(item => item.id === id)
}

export const getCatalogItemsByCategory = (category: string): CatalogItem[] => {
  return mockCatalogItems.filter(item => item.category === category && item.isActive)
}

export const getCatalogItemsByEducationLevel = (educationLevel: string): CatalogItem[] => {
  return mockCatalogItems.filter(item => 
    item.isActive && item.educationLevels.includes(educationLevel)
  )
}

export const getPurchaseOrdersByStudentId = (studentId: number): PurchaseOrder[] => {
  return mockPurchaseOrders.filter(order => order.studentId === studentId)
}

export const getPurchaseOrderById = (id: number): PurchaseOrder | undefined => {
  return mockPurchaseOrders.find(order => order.id === id)
}

export const getPendingPurchaseOrders = (): PurchaseOrder[] => {
  return mockPurchaseOrders.filter(order => order.status === 'pending')
}

export const getApprovedPurchaseOrders = (): PurchaseOrder[] => {
  return mockPurchaseOrders.filter(order => order.status === 'approved')
}

export const getFulfilledPurchaseOrders = (): PurchaseOrder[] => {
  return mockPurchaseOrders.filter(order => order.status === 'fulfilled')
}

// Helper functions for financial system
export const getPointsTransactionsByStudentId = (studentId: number): PointsTransaction[] => {
  return mockPointsTransactions.filter(transaction => transaction.studentId === studentId)
}

export const getStudentGoalsByStudentId = (studentId: number): StudentGoal[] => {
  return mockStudentGoals.filter(goal => goal.studentId === studentId)
}

export const getWithdrawalRequestsByStudentId = (studentId: number): WithdrawalRequest[] => {
  return mockWithdrawalRequests.filter(request => request.studentId === studentId)
}

export const getInvestmentsByStudentId = (studentId: number): Investment[] => {
  return mockInvestments.filter(investment => investment.studentId === studentId)
}

export const getHealthInsuranceByStudentId = (studentId: number): HealthInsurance[] => {
  return mockHealthInsurance.filter(insurance => insurance.studentId === studentId)
}

export const getEducationUpdatesByStudentId = (studentId: number): EducationUpdate[] => {
  return mockEducationUpdates.filter(update => update.studentId === studentId)
}

export const getPendingWithdrawalRequests = (): WithdrawalRequest[] => {
  return mockWithdrawalRequests.filter(request => request.status === 'pending')
}

export const getActiveInvestmentsByStudentId = (studentId: number): Investment[] => {
  return mockInvestments.filter(investment => investment.studentId === studentId && investment.status === 'active')
}

export const getActiveGoalsByStudentId = (studentId: number): StudentGoal[] => {
  return mockStudentGoals.filter(goal => goal.studentId === studentId && goal.status === 'active')
}

export const getCompletedGoalsByStudentId = (studentId: number): StudentGoal[] => {
  return mockStudentGoals.filter(goal => goal.studentId === studentId && goal.status === 'completed')
}