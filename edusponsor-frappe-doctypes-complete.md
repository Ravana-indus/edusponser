# EduSponsor Complete System - Frappe ERPNext Doctypes

## Overview
This document outlines the complete Frappe ERPNext doctypes and fields required to implement the entire EduSponsor educational sponsorship platform. The system includes student management, donor/sponsor management, vendor management, financial operations, schools, administrative oversight, and comprehensive analytics.

## System Architecture
The EduSponsor platform consists of the following core modules:
1. **Student Management**: Student registration, profiles, academic tracking
2. **Donor/Sponsor Management**: Donor registration, sponsorships, donations
3. **Vendor Management**: Educational vendors, products, purchase orders
4. **Financial System**: Points-based economy, payments, investments, insurance
5. **School Management**: Educational institutions, academic programs
6. **Administrative Management**: Platform oversight, approvals, analytics
7. **Communication System**: Updates, messaging, notifications

## Core Doctypes

### 1. Student
**Module:** EduSponsor  
**Description:** Student registration and profile management with comprehensive academic and personal information

#### Fields:
| Field Name | Type | Label | Options | Required | Default |
|------------|------|-------|---------|----------|---------|
| `first_name` | Data | First Name | | Yes | |
| `last_name` | Data | Last Name | | Yes | |
| `email` | Data | Email | | Yes | |
| `phone` | Data | Phone | | Yes | |
| `age` | Int | Age | | Yes | |
| `education_level` | Select | Education Level | Primary, Secondary, Ordinary Level, Advanced Level, Undergraduate, Graduate, Postgraduate, Vocational | Yes | |
| `grade` | Int | Grade | | No | |
| `school` | Link | School | (School) | Yes | |
| `major` | Data | Major | | No | |
| `stream` | Select | Stream | Science, Commerce, Arts, Technology | No | |
| `gpa` | Float | GPA | | No | 0 |
| `exam_results` | Text | Exam Results | | No | |
| `bio` | Text | Biography | | No | |
| `goals` | Text | Educational Goals | | No | |
| `challenges` | Text | Challenges | | No | |
| `why_need_support` | Text | Why Need Support | | No | |
| `status` | Select | Status | Pending, Approved, Rejected, Suspended | Yes | Pending |
| `join_date` | Date | Join Date | | Yes | Today |
| `total_points` | Int | Total Points | | Yes | 0 |
| `available_points` | Int | Available Points | | Yes | 0 |
| `invested_points` | Int | Invested Points | | Yes | 0 |
| `insurance_points` | Int | Insurance Points | | Yes | 0 |
| `profile_image` | Attach Image | Profile Image | | No | |
| `district` | Link | District | (District) | Yes | |
| `province` | Link | Province | (Province) | Yes | |
| `grama_niladharai_division` | Data | Grama Niladharai Division | | No | |
| `grama_niladharai_name` | Data | Grama Niladharai Name | | No | |
| `grama_niladharai_contact` | Data | Grama Niladharai Contact | | No | |
| `school_address` | Text | School Address | | No | |
| `school_phone` | Data | School Phone | | No | |
| `school_principal` | Data | School Principal | | No | |
| `school_type` | Select | School Type | Government, Private, International, Semi-Government | No | |
| `student_class` | Data | Student Class | | No | |
| `index_number` | Data | Index Number | | No | |
| `emergency_contact_name` | Data | Emergency Contact Name | | No | |
| `emergency_contact_phone` | Data | Emergency Contact Phone | | No | |
| `emergency_contact_relation` | Data | Emergency Contact Relation | | No | |
| `medical_conditions` | Text | Medical Conditions | | No | |
| `allergies` | Text | Allergies | | No | |
| `blood_group` | Select | Blood Group | A+, A-, B+, B-, AB+, AB-, O+, O- | No | |
| `nationality` | Data | Nationality | | No | |
| `religion` | Data | Religion | | No | |
| `languages` | Text | Languages | | No | |
| `health_insurance_status` | Select | Health Insurance Status | Active, Inactive, Pending | No | Inactive |
| `health_insurance_provider` | Data | Health Insurance Provider | | No | |
| `health_insurance_policy_number` | Data | Health Insurance Policy Number | | No | |
| `health_insurance_expiry` | Date | Health Insurance Expiry | | No | |
| `last_updated` | Datetime | Last Updated | | Yes | Now |
| `profile_completed` | Check | Profile Completed | | Yes | 0 |
| `documents_verified` | Check | Documents Verified | | Yes | 0 |

#### Child Table: Student Documents
| Field Name | Type | Label | Required |
|------------|------|-------|----------|
| `document_type` | Select | Document Type | Birth Certificate, ID Card, School Certificate, Income Certificate, Medical Certificate | Yes |
| `document_name` | Data | Document Name | Yes |
| `file` | Attach | File | Yes |
| `status` | Select | Status | Verified, Pending, Rejected | Yes |
| `verified_by` | Link | Verified By | (User) | No |
| `verification_date` | Datetime | Verification Date | No |
| `notes` | Text | Notes | No |

---

### 2. Donor
**Module:** EduSponsor  
**Description:** Donor/Sponsor registration and profile management

#### Fields:
| Field Name | Type | Label | Options | Required | Default |
|------------|------|-------|---------|----------|---------|
| `first_name` | Data | First Name | | Yes | |
| `last_name` | Data | Last Name | | Yes | |
| `email` | Data | Email | | Yes | |
| `phone` | Data | Phone | | Yes | |
| `company` | Data | Company | | No | |
| `occupation` | Data | Occupation | | Yes | |
| `annual_income` | Select | Annual Income | Under 50k, 50k-100k, 100k-150k, 150k-200k, 200k-250k, Over 250k | Yes | |
| `bio` | Text | Biography | | No | |
| `motivation` | Text | Motivation | | No | |
| `student_preference` | Select | Student Preference | Any, STEM, Arts, Business, Healthcare, Undergraduate, Graduate | Yes | Any |
| `communication_frequency` | Select | Communication Frequency | Weekly, Monthly, Quarterly, Minimal | Yes | Monthly |
| `anonymous` | Check | Anonymous | | Yes | 0 |
| `status` | Select | Status | Active, Inactive, Suspended | Yes | Active |
| `join_date` | Date | Join Date | | Yes | Today |
| `total_donated` | Currency | Total Donated | | Yes | 0 |
| `total_points` | Int | Total Points | | Yes | 0 |
| `profile_image` | Attach Image | Profile Image | | No | |
| `newsletter_subscription` | Check | Newsletter Subscription | | Yes | 1 |
| `tax_id` | Data | Tax ID | | No | |
| `payment_method` | Select | Preferred Payment Method | Credit Card, Bank Transfer, PayPal, Other | Yes | Credit Card |

---

### 3. Sponsorship
**Module:** EduSponsor  
**Description:** Sponsorship relationships between donors and students

#### Fields:
| Field Name | Type | Label | Options | Required | Default |
|------------|------|-------|---------|----------|---------|
| `donor` | Link | Donor | (Donor) | Yes | |
| `student` | Link | Student | (Student) | Yes | |
| `start_date` | Date | Start Date | | Yes | Today |
| `end_date` | Date | End Date | | No | |
| `status` | Select | Status | Active, Paused, Cancelled, Completed, Opt-out Pending | Yes | Active |
| `monthly_amount` | Currency | Monthly Amount | | Yes | 0 |
| `monthly_points` | Int | Monthly Points | | Yes | 0 |
| `opt_out_requested_date` | Date | Opt-out Requested Date | | No | |
| `opt_out_effective_date` | Date | Opt-out Effective Date | | No | |
| `opt_out_reason` | Text | Opt-out Reason | | No | |
| `student_info_hidden` | Check | Student Info Hidden | | Yes | 0 |
| `auto_renew` | Check | Auto Renew | | Yes | 1 |
| `special_instructions` | Text | Special Instructions | | No | |

---

### 4. Payment
**Module:** EduSponsor  
**Description:** Payment processing and tracking

#### Fields:
| Field Name | Type | Label | Options | Required | Default |
|------------|------|-------|---------|----------|---------|
| `donor` | Link | Donor | (Donor) | Yes | |
| `student` | Link | Student | (Student) | Yes | |
| `sponsorship` | Link | Sponsorship | (Sponsorship) | Yes | |
| `date` | Date | Payment Date | | Yes | Today |
| `amount` | Currency | Amount | | Yes | 0 |
| `points` | Int | Points | | Yes | 0 |
| `status` | Select | Status | Completed, Pending, Failed, Refunded | Yes | Pending |
| `transaction_id` | Data | Transaction ID | | No | |
| `payment_method` | Select | Payment Method | Credit Card, Bank Transfer, PayPal, Other | Yes | |
| `payment_gateway` | Data | Payment Gateway | | No | |
| `failure_reason` | Text | Failure Reason | | No | |
| `processed_by` | Link | Processed By | (User) | No |
| `processed_date` | Datetime | Processed Date | | No |

---

### 5. School
**Module:** EduSponsor  
**Description:** Educational institution management

#### Fields:
| Field Name | Type | Label | Options | Required | Default |
|------------|------|-------|---------|----------|---------|
| `school_name` | Data | School Name | | Yes | |
| `school_type` | Select | School Type | Government, Private, International, Semi-Government | Yes | |
| `category` | Select | Category | Primary, Secondary, Tertiary, Vocational | Yes | |
| `address` | Text | Address | | Yes | |
| `district` | Link | District | (District) | Yes | |
| `province` | Link | Province | (Province) | Yes | |
| `phone` | Data | Phone | | Yes | |
| `email` | Data | Email | | No | |
| `website` | Data | Website | | No | |
| `principal_name` | Data | Principal Name | | Yes | |
| `principal_phone` | Data | Principal Phone | | No | |
| `principal_email` | Data | Principal Email | | No | |
| `established_year` | Int | Established Year | | No | |
| `student_count` | Int | Student Count | | No | 0 |
| `teacher_count` | Int | Teacher Count | | No | 0 |
| `status` | Select | Status | Active, Inactive, Closed | Yes | Active |
| `accreditation` | Text | Accreditation | | No | |
| `facilities` | Text | Facilities | | No | |
| `special_programs` | Text | Special Programs | | No | |
| `contact_person` | Data | Contact Person | | No | |
| `contact_person_designation` | Data | Contact Person Designation | | No | |

---

### 6. District
**Module:** EduSponsor  
**Description:** Sri Lankan districts for geographical organization

#### Fields:
| Field Name | Type | Label | Required |
|------------|------|-------|----------|
| `district_name` | Data | District Name | Yes |
| `province` | Link | Province | (Province) | Yes |
| `code` | Data | District Code | Yes |
| `is_active` | Check | Is Active | Yes |

---

### 7. Province
**Module:** EduSponsor  
**Description:** Sri Lankan provinces for geographical organization

#### Fields:
| Field Name | Type | Label | Required |
|------------|------|-------|----------|
| `province_name` | Data | Province Name | Yes |
| `code` | Data | Province Code | Yes |
| `is_active` | Check | Is Active | Yes |

---

### 8. Points Transaction
**Module:** EduSponsor  
**Description:** Points-based economy transaction tracking

#### Fields:
| Field Name | Type | Label | Options | Required | Default |
|------------|------|-------|---------|----------|---------|
| `student` | Link | Student | (Student) | Yes | |
| `type` | Select | Transaction Type | Earned, Spent, Invested, Withdrawn, Insurance, Refund, Bonus, Penalty | Yes | |
| `amount` | Int | Amount | | Yes | 0 |
| `description` | Text | Description | | Yes | |
| `date` | Datetime | Transaction Date | | Yes | Now |
| `reference_id` | Data | Reference ID | | No | |
| `balance` | Int | Balance | | Yes | 0 |
| `category` | Select | Category | Sponsorship, Purchase, Investment, Insurance, Withdrawal, Bonus, Penalty | Yes | |
| `created_by` | Link | Created By | (User) | No |

---

### 9. Student Goal
**Module:** EduSponsor  
**Description:** Student financial goals and savings targets

#### Fields:
| Field Name | Type | Label | Options | Required | Default |
|------------|------|-------|---------|----------|---------|
| `student` | Link | Student | (Student) | Yes | |
| `title` | Data | Goal Title | | Yes | |
| `description` | Text | Description | | Yes | |
| `target_amount` | Int | Target Amount (Points) | | Yes | 0 |
| `current_amount` | Int | Current Amount (Points) | | Yes | 0 |
| `category` | Select | Category | Education, Laptop, Trip, Equipment, Health, Other | Yes | |
| `target_date` | Date | Target Date | | Yes | |
| `status` | Select | Status | Active, Completed, Cancelled, Paused | Yes | Active |
| `is_public` | Check | Is Public | | Yes | 1 |
| `created_date` | Date | Created Date | | Yes | Today |
| `updated_date` | Datetime | Updated Date | | Yes | Now |

---

### 10. Withdrawal Request
**Module:** EduSponsor  
**Description:** Student withdrawal requests for cash conversion

#### Fields:
| Field Name | Type | Label | Options | Required | Default |
|------------|------|-------|---------|----------|---------|
| `student` | Link | Student | (Student) | Yes | |
| `amount` | Int | Amount (Points) | | Yes | 0 |
| `reason` | Text | Reason | | Yes | |
| `category` | Select | Category | Emergency, Education, Health, Personal, Other | Yes | |
| `status` | Select | Status | Pending, Approved, Rejected, Processed | Yes | Pending |
| `request_date` | Date | Request Date | | Yes | Today |
| `processed_date` | Date | Processed Date | | No | |
| `approved_by` | Link | Approved By | (User) | No |
| `rejection_reason` | Text | Rejection Reason | | No | |
| `bank_name` | Data | Bank Name | | Yes | |
| `account_number` | Data | Account Number | | Yes | |
| `account_holder` | Data | Account Holder | | Yes | |
| `branch` | Data | Branch | | Yes | |
| `conversion_rate` | Float | Conversion Rate (LKR per Point) | | Yes | 0.5 |
| `cash_amount` | Currency | Cash Amount (LKR) | | Yes | 0 |

#### Child Table: Withdrawal Documents
| Field Name | Type | Label | Required |
|------------|------|-------|----------|
| `document_type` | Select | Document Type | ID, Bank Statement, Medical Certificate, Income Certificate, Other | Yes |
| `document_name` | Data | Document Name | Yes |
| `file` | Attach | File | Yes |

---

### 11. Investment
**Module:** EduSponsor  
**Description:** Student investment portfolio management

#### Fields:
| Field Name | Type | Label | Options | Required | Default |
|------------|------|-------|---------|----------|---------|
| `student` | Link | Student | (Student) | Yes | |
| `amount` | Int | Amount (Points) | | Yes | 0 |
| `platform` | Data | Platform | | Yes | |
| `investment_type` | Select | Investment Type | NFT, Stocks, Bonds, Crypto, Other | Yes | |
| `status` | Select | Status | Active, Completed, Failed, Withdrawn | Yes | Active |
| `investment_date` | Date | Investment Date | | Yes | Today |
| `maturity_date` | Date | Maturity Date | | No | |
| `expected_return` | Float | Expected Return (%) | | Yes | 0 |
| `actual_return` | Float | Actual Return (%) | | No | |
| `description` | Text | Description | | Yes | |
| `transaction_hash` | Data | Transaction Hash | | No | |
| `current_value` | Int | Current Value (Points) | | No | 0 |

---

### 12. Health Insurance
**Module:** EduSponsor  
**Description:** Student health insurance management

#### Fields:
| Field Name | Type | Label | Options | Required | Default |
|------------|------|-------|---------|----------|---------|
| `student` | Link | Student | (Student) | Yes | |
| `provider` | Data | Provider | | Yes | |
| `policy_number` | Data | Policy Number | | Yes | |
| `coverage_amount` | Currency | Coverage Amount | | Yes | 0 |
| `premium_amount` | Int | Premium Amount (Points) | | Yes | 0 |
| `start_date` | Date | Start Date | | Yes | Today |
| `expiry_date` | Date | Expiry Date | | Yes | |
| `status` | Select | Status | Active, Expired, Cancelled | Yes | Active |
| `beneficiary_name` | Data | Beneficiary Name | | No | |
| `beneficiary_relation` | Data | Beneficiary Relation | | No | |

#### Child Table: Coverage Details
| Field Name | Type | Label | Required |
|------------|------|-------|----------|
| `coverage_type` | Data | Coverage Type | Yes |
| `coverage_limit` | Currency | Coverage Limit | Yes |
| `details` | Text | Details | No |

---

### 13. Education Update
**Module:** EduSponsor  
**Description:** Student progress updates and achievements

#### Fields:
| Field Name | Type | Label | Options | Required | Default |
|------------|------|-------|---------|----------|---------|
| `student` | Link | Student | (Student) | Yes | |
| `title` | Data | Update Title | | Yes | |
| `content` | Text | Content | | Yes | |
| `type` | Select | Update Type | Academic, Achievement, Project, Competition, Extracurricular, Personal | Yes | |
| `date` | Date | Update Date | | Yes | Today |
| `is_public` | Check | Is Public | | Yes | 1 |
| `created_by` | Link | Created By | (User) | No |

#### Child Table: Update Attachments
| Field Name | Type | Label | Required |
|------------|------|-------|----------|
| `file_name` | Data | File Name | Yes |
| `file` | Attach | File | Yes |

#### Child Table: Update Tags
| Field Name | Type | Label | Required |
|------------|------|-------|----------|
| `tag` | Data | Tag | Yes |

---

### 14. Student Update
**Module:** EduSponsor  
**Description:** Student updates for sponsors (simplified version)

#### Fields:
| Field Name | Type | Label | Options | Required | Default |
|------------|------|-------|---------|----------|---------|
| `student` | Link | Student | (Student) | Yes | |
| `title` | Data | Title | | Yes | |
| `content` | Text | Content | | Yes | |
| `type` | Select | Type | Academic, Project, Personal, Milestone | Yes | |
| `date` | Date | Date | | Yes | Today |
| `is_public` | Check | Is Public | | Yes | 1 |

---

### 15. Catalog Item
**Module:** EduSponsor  
**Description:** Educational products and services catalog

#### Fields:
| Field Name | Type | Label | Options | Required | Default |
|------------|------|-------|---------|----------|---------|
| `item_name` | Data | Item Name | | Yes | |
| `description` | Text | Description | | Yes | |
| `category` | Link | Category | (Product Category) | Yes | |
| `vendor` | Link | Vendor | (Vendor) | Yes | |
| `point_price` | Int | Point Price | | Yes | 0 |
| `approximate_value_lkr` | Currency | Approximate Value (LKR) | | Yes | 0 |
| `image` | Attach Image | Image | | No | |
| `is_active` | Check | Is Active | | Yes | 1 |
| `stock_quantity` | Int | Stock Quantity | | No | 0 |
| `created_date` | Date | Created Date | | Yes | Today |
| `last_updated` | Datetime | Last Updated | | Yes | Now |
| `max_quantity_per_month` | Int | Max Quantity Per Month | | No | 0 |
| `weight` | Float | Weight (kg) | | No | 0 |
| `dimensions` | Data | Dimensions | | No | |
| `warranty_period` | Int | Warranty Period (days) | | No | 0 |
| `return_policy` | Text | Return Policy | | No | |
| `item_code` | Data | Item Code | | No | |

#### Child Table: Education Levels
| Field Name | Type | Label | Required |
|------------|------|-------|----------|
| `education_level` | Select | Education Level | Primary, Secondary, Ordinary Level, Advanced Level, Undergraduate, Postgraduate | Yes |

---

### 16. Product Category
**Module:** EduSponsor  
**Description:** Product categorization system

#### Fields:
| Field Name | Type | Label | Required |
|------------|------|-------|----------|
| `category_name` | Data | Category Name | Yes |
| `description` | Text | Description | No |
| `is_active` | Check | Is Active | Yes |
| `parent_category` | Link | Parent Category | (Product Category) | No |

---

### 17. Purchase Order
**Module:** EduSponsor  
**Description:** Student purchase orders for educational items

#### Fields:
| Field Name | Type | Label | Options | Required | Default |
|------------|------|-------|---------|----------|---------|
| `student` | Link | Student | (Student) | Yes | |
| `vendor` | Link | Vendor | (Vendor) | Yes | |
| `total_points` | Int | Total Points | | Yes | 0 |
| `status` | Select | Status | Pending, Approved, Rejected, Fulfilled, Cancelled | Yes | Pending |
| `request_date` | Date | Request Date | | Yes | Today |
| `approved_date` | Date | Approved Date | | No | |
| `fulfilled_date` | Date | Fulfilled Date | | No | |
| `rejection_reason` | Text | Rejection Reason | | No | |
| `qr_code` | Data | QR Code | | No | |
| `notes` | Text | Notes | | No | |
| `delivery_method` | Select | Delivery Method | Pickup, Delivery | Yes | Pickup |
| `delivery_address` | Text | Delivery Address | | No | |
| `expected_delivery_date` | Date | Expected Delivery Date | | No | |
| `actual_delivery_date` | Date | Actual Delivery Date | | No | |
| `approved_by` | Link | Approved By | (User) | No |
| `fulfilled_by` | Link | Fulfilled By | (User) | No |

#### Child Table: Purchase Order Items
| Field Name | Type | Label | Required |
|------------|------|-------|----------|
| `item` | Link | Item | (Catalog Item) | Yes |
| `quantity` | Int | Quantity | Yes |
| `points_per_item` | Int | Points Per Item | Yes |
| `total_points` | Int | Total Points | Yes |

---

### 18. Vendor
**Module:** EduSponsor  
**Description:** Educational vendor management

#### Fields:
| Field Name | Type | Label | Options | Required | Default |
|------------|------|-------|---------|----------|---------|
| `vendor_name` | Data | Vendor Name | | Yes | |
| `vendor_category` | Link | Vendor Category | (Vendor Category) | Yes | |
| `contact_person` | Data | Contact Person | | Yes | |
| `email` | Data | Email | | Yes | |
| `phone` | Data | Phone | | Yes | |
| `address` | Text | Address | | Yes | |
| `website` | Data | Website | | No | |
| `business_registration` | Data | Business Registration | | No | |
| `tax_id` | Data | Tax ID | | No | |
| `business_type` | Select | Business Type | Sole Proprietorship, Partnership, Corporation, LLC | No | Sole Proprietorship |
| `employee_count` | Int | Employee Count | | No | 0 |
| `established_year` | Int | Established Year | | No | |
| `description` | Text | Description | | No | |
| `status` | Select | Status | Active, Inactive, Pending, Suspended | Yes | Pending |
| `verification_status` | Select | Verification Status | Verified, Pending, Rejected | Yes | Pending |
| `join_date` | Date | Join Date | | Yes | Today |
| `average_rating` | Float | Average Rating | | No | 0 |
| `total_reviews` | Int | Total Reviews | | No | 0 |
| `response_time` | Data | Response Time | | No | 24 hours |
| `fulfillment_rate` | Percent | Fulfillment Rate | | No | 0 |
| `profile_image` | Attach Image | Profile Image | | No | |
| `cover_image` | Attach Image | Cover Image | | No | |
| `notes` | Text | Notes | | No | |

#### Child Table: Vendor Documents
| Field Name | Type | Label | Required |
|------------|------|-------|----------|
| `document_type` | Select | Document Type | Business Registration, Tax Certificate, Bank Statement, Identification | Yes |
| `document_name` | Data | Document Name | Yes |
| `file` | Attach | File | Yes |
| `status` | Select | Status | Verified, Pending, Rejected | Yes |
| `verified_by` | Link | Verified By | (User) | No |
| `verification_date` | Datetime | Verification Date | No |
| `notes` | Text | Notes | No |

#### Child Table: Vendor Specialties
| Field Name | Type | Label | Required |
|------------|------|-------|----------|
| `specialty` | Data | Specialty | Yes |

#### Child Table: Vendor Certifications
| Field Name | Type | Label | Required |
|------------|------|-------|----------|
| `certification_name` | Data | Certification Name | Yes |
| `issuing_authority` | Data | Issuing Authority | Yes |
| `issue_date` | Date | Issue Date | Yes |
| `expiry_date` | Date | Expiry Date | No |
| `certificate_file` | Attach | Certificate File | Yes |

---

### 19. Vendor Category
**Module:** EduSponsor  
**Description:** Vendor categorization system

#### Fields:
| Field Name | Type | Label | Required |
|------------|------|-------|----------|
| `category_name` | Data | Category Name | Yes |
| `description` | Text | Description | No |
| `is_active` | Check | Is Active | Yes |
| `parent_category` | Link | Parent Category | (Vendor Category) | No |

---

### 20. Payment Account
**Module:** EduSponsor  
**Description:** Vendor payment accounts and bank details

#### Fields:
| Field Name | Type | Label | Options | Required | Default |
|------------|------|-------|---------|----------|---------|
| `vendor` | Link | Vendor | (Vendor) | Yes | |
| `bank_name` | Data | Bank Name | | Yes | |
| `account_number` | Data | Account Number | | Yes | |
| `account_holder` | Data | Account Holder | | Yes | |
| `branch` | Data | Branch | | No | |
| `is_primary` | Check | Is Primary | | Yes | 0 |
| `status` | Select | Status | Active, Inactive | Yes | Active |
| `account_type` | Select | Account Type | Savings, Current, Business | Yes | Savings |
| `swift_code` | Data | SWIFT Code | | No | |
| `routing_number` | Data | Routing Number | | No | |

---

### 21. Vendor Payment
**Module:** EduSponsor  
**Description:** Vendor payment processing

#### Fields:
| Field Name | Type | Label | Options | Required | Default |
|------------|------|-------|---------|----------|---------|
| `vendor` | Link | Vendor | (Vendor) | Yes | |
| `payment_amount` | Currency | Payment Amount | | Yes | 0 |
| `payment_date` | Date | Payment Date | | Yes | Today |
| `payment_method` | Select | Payment Method | Bank Transfer, Check, Cash, Online | Yes | Bank Transfer |
| `payment_account` | Link | Payment Account | (Payment Account) | Yes | |
| `reference_number` | Data | Reference Number | | No | |
| `status` | Select | Status | Pending, Completed, Failed, Cancelled | Yes | Pending |
| `notes` | Text | Notes | | No | |
| `processed_by` | Link | Processed By | (User) | No |
| `processed_date` | Datetime | Processed Date | | No |

---

### 22. Vendor Analytics
**Module:** EduSponsor  
**Description:** Vendor performance analytics

#### Fields:
| Field Name | Type | Label | Options | Required | Default |
|------------|------|-------|---------|----------|---------|
| `vendor` | Link | Vendor | (Vendor) | Yes | |
| `period` | Select | Period | Daily, Weekly, Monthly, Quarterly, Yearly | Yes | Monthly |
| `start_date` | Date | Start Date | | Yes | |
| `end_date` | Date | End Date | | Yes | |
| `total_orders` | Int | Total Orders | | Yes | 0 |
| `total_revenue` | Currency | Total Revenue | | Yes | 0 |
| `total_points_earned` | Int | Total Points Earned | | Yes | 0 |
| `average_order_value` | Currency | Average Order Value | | Yes | 0 |
| `fulfillment_rate` | Percent | Fulfillment Rate | | Yes | 0 |
| `average_rating` | Float | Average Rating | | Yes | 0 |
| `total_reviews` | Int | Total Reviews | | Yes | 0 |
| `response_time_avg` | Time | Average Response Time | | No | |
| `top_products` | Text | Top Products | | No | |
| `customer_satisfaction` | Percent | Customer Satisfaction | | No | 0 |

---

### 23. Vendor Review
**Module:** EduSponsor  
**Description:** Customer reviews for vendors

#### Fields:
| Field Name | Type | Label | Options | Required | Default |
|------------|------|-------|---------|----------|---------|
| `vendor` | Link | Vendor | (Vendor) | Yes | |
| `student` | Link | Student | (Student) | Yes | |
| `purchase_order` | Link | Purchase Order | (Purchase Order) | Yes | |
| `rating` | Rating | Rating | | Yes | 0 |
| `review_title` | Data | Review Title | | No | |
| `review_text` | Text | Review Text | | No | |
| `review_date` | Date | Review Date | | Yes | Today |
| `is_verified` | Check | Is Verified Purchase | | Yes | 1 |
| `status` | Select | Status | Approved, Pending, Rejected | Yes | Pending |
| `helpful_count` | Int | Helpful Count | | Yes | 0 |

---

### 24. Vendor Application
**Module:** EduSponsor  
**Description:** Vendor registration applications

#### Fields:
| Field Name | Type | Label | Options | Required | Default |
|------------|------|-------|---------|----------|---------|
| `application_number` | Data | Application Number | | Yes | |
| `business_name` | Data | Business Name | | Yes | |
| `business_category` | Link | Business Category | (Vendor Category) | Yes | |
| `contact_person` | Data | Contact Person | | Yes | |
| `email` | Data | Email | | Yes | |
| `phone` | Data | Phone | | Yes | |
| `address` | Text | Address | | Yes | |
| `website` | Data | Website | | No | |
| `business_registration` | Data | Business Registration | | No | |
| `tax_id` | Data | Tax ID | | No | |
| `business_type` | Select | Business Type | Sole Proprietorship, Partnership, Corporation, LLC | No | Sole Proprietorship |
| `employee_count` | Int | Employee Count | | No | 0 |
| `established_year` | Int | Established Year | | No | |
| `description` | Data | Business Description | | No | |
| `application_date` | Date | Application Date | | Yes | Today |
| `status` | Select | Status | Pending, Under Review, Approved, Rejected | Yes | Pending |
| `reviewed_by` | Link | Reviewed By | (User) | No |
| `review_date` | Date | Review Date | | No | |
| `rejection_reason` | Text | Rejection Reason | | No | |
| `notes` | Text | Notes | | No |

#### Child Table: Application Documents
| Field Name | Type | Label | Required |
|------------|------|-------|----------|
| `document_type` | Select | Document Type | Business Registration, Tax Certificate, Bank Statement, Identification, Business License | Yes |
| `document_name` | Data | Document Name | Yes |
| `file` | Attach | File | Yes |
| `upload_date` | Datetime | Upload Date | Yes | Now |

---

### 25. System Settings
**Module:** EduSponsor  
**Description:** System-wide configuration settings

#### Fields:
| Field Name | Type | Label | Options | Required | Default |
|------------|------|-------|---------|----------|---------|
| `points_to_lkr_rate` | Float | Points to LKR Rate | | Yes | 0.5 |
| `max_products_per_vendor` | Int | Max Products Per Vendor | | Yes | 100 |
| `max_orders_per_day` | Int | Max Orders Per Day | | Yes | 50 |
| `auto_approve_threshold` | Int | Auto Approve Threshold (orders) | | Yes | 10 |
| `vendor_approval_required` | Check | Vendor Approval Required | | Yes | 1 |
| `email_notifications_enabled` | Check | Email Notifications Enabled | | Yes | 1 |
| `sms_notifications_enabled` | Check | SMS Notifications Enabled | | Yes | 0 |
| `default_fulfillment_days` | Int | Default Fulfillment Days | | Yes | 3 |
| `max_upload_size` | Int | Max Upload Size (MB) | | Yes | 5 |
| `supported_file_types` | Text | Supported File Types | | No | pdf,jpg,jpeg,png |
| `monthly_points_per_dollar` | Int | Monthly Points Per Dollar | | Yes | 1000 |
| `min_withdrawal_amount` | Int | Minimum Withdrawal Amount (Points) | | Yes | 1000 |
| `max_withdrawal_amount` | Int | Maximum Withdrawal Amount (Points) | | Yes | 50000 |
| `withdrawal_fee_percentage` | Float | Withdrawal Fee Percentage | | Yes | 2 |
| `investment_min_amount` | Int | Minimum Investment Amount (Points) | | Yes | 5000 |
| `insurance_min_coverage` | Currency | Minimum Insurance Coverage | | Yes | 100000 |
| `student_approval_required` | Check | Student Approval Required | | Yes | 1 |
| `donor_verification_required` | Check | Donor Verification Required | | Yes | 1 |

---

### 26. Platform Stats
**Module:** EduSponsor  
**Description:** Platform-wide statistics and metrics

#### Fields:
| Field Name | Type | Label | Options | Required | Default |
|------------|------|-------|---------|----------|---------|
| `total_students` | Int | Total Students | | Yes | 0 |
| `approved_students` | Int | Approved Students | | Yes | 0 |
| `pending_students` | Int | Pending Students | | Yes | 0 |
| `total_donors` | Int | Total Donors | | Yes | 0 |
| `active_donors` | Int | Active Donors | | Yes | 0 |
| `total_donated` | Currency | Total Donated | | Yes | 0 |
| `total_points` | Int | Total Points | | Yes | 0 |
| `monthly_revenue` | Currency | Monthly Revenue | | Yes | 0 |
| `active_sponsorships` | Int | Active Sponsorships | | Yes | 0 |
| `average_gpa` | Float | Average GPA | | Yes | 0 |
| `student_retention` | Percent | Student Retention | | Yes | 0 |
| `donor_retention` | Percent | Donor Retention | | Yes | 0 |
| `total_vendors` | Int | Total Vendors | | Yes | 0 |
| `active_vendors` | Int | Active Vendors | | Yes | 0 |
| `total_orders` | Int | Total Orders | | Yes | 0 |
| `fulfilled_orders` | Int | Fulfilled Orders | | Yes | 0 |
| `period` | Select | Period | Daily, Weekly, Monthly, Quarterly, Yearly | Yes | Monthly |
| `start_date` | Date | Start Date | | Yes | |
| `end_date` | Date | End Date | | Yes | |

---

### 27. Notification
**Module:** EduSponsor  
**Description:** System notifications and alerts

#### Fields:
| Field Name | Type | Label | Options | Required | Default |
|------------|------|-------|---------|----------|---------|
| `recipient_type` | Select | Recipient Type | Student, Donor, Vendor, Admin | Yes | |
| `recipient` | Dynamic Link | Recipient | | Yes | |
| `title` | Data | Title | | Yes | |
| `message` | Text | Message | | Yes | |
| `type` | Select | Type | Info, Success, Warning, Error | Yes | Info |
| `category` | Select | Category | System, Payment, Order, Update, Approval, Reminder | Yes | System |
| `status` | Select | Status | Unread, Read, Archived | Yes | Unread |
| `created_date` | Datetime | Created Date | | Yes | Now |
| `read_date` | Datetime | Read Date | | No | |
| `action_required` | Check | Action Required | | Yes | 0 |
| `action_link` | Data | Action Link | | No |
| `expiry_date` | Datetime | Expiry Date | | No |

---

### 28. Communication Log
**Module:** EduSponsor  
**Description:** Communication history between users

#### Fields:
| Field Name | Type | Label | Options | Required | Default |
|------------|------|-------|---------|----------|---------|
| `from_user` | Link | From User | (User) | Yes | |
| `to_user` | Link | To User | (User) | Yes | |
| `from_role` | Select | From Role | Student, Donor, Vendor, Admin | Yes | |
| `to_role` | Select | To Role | Student, Donor, Vendor, Admin | Yes | |
| `subject` | Data | Subject | | Yes | |
| `message` | Text | Message | | Yes | |
| `message_type` | Select | Message Type | Email, SMS, In-App, Phone | Yes | In-App |
| `status` | Select | Status | Sent, Delivered, Read, Failed | Yes | Sent |
| `sent_date` | Datetime | Sent Date | | Yes | Now |
| `read_date` | Datetime | Read Date | | No | |
| `parent_message` | Link | Parent Message | (Communication Log) | No |
| `attachments` | Text | Attachments | | No |

---

### 29. User Role
**Module:** EduSponsor  
**Description:** Custom user roles and permissions

#### Fields:
| Field Name | Type | Label | Options | Required | Default |
|------------|------|-------|---------|----------|---------|
| `role_name` | Data | Role Name | | Yes | |
| `description` | Text | Description | | Yes | |
| `role_type` | Select | Role Type | System, Custom | Yes | System |
| `is_active` | Check | Is Active | | Yes | 1 |
| `permissions` | Text | Permissions | JSON format | Yes | |

---

### 30. Audit Log
**Module:** EduSponsor  
**Description:** System audit trail for security and compliance

#### Fields:
| Field Name | Type | Label | Options | Required | Default |
|------------|------|-------|---------|----------|---------|
| `user` | Link | User | (User) | Yes | |
| `user_role` | Select | User Role | Student, Donor, Vendor, Admin, System | Yes | |
| `action` | Data | Action | | Yes | |
| `doctype` | Data | DocType | | Yes | |
| `docname` | Data | DocName | | Yes | |
| `old_value` | Text | Old Value | | No | |
| `new_value` | Text | New Value | | No | |
| `timestamp` | Datetime | Timestamp | | Yes | Now |
| `ip_address` | Data | IP Address | | No | |
| `user_agent` | Data | User Agent | | No |
| `status` | Select | Status | Success, Failed | Yes | Success |

## Relationships and Dependencies

### Primary Relationships:
1. **Student → Sponsorship**: One-to-Many (One student can have multiple sponsorships)
2. **Donor → Sponsorship**: One-to-Many (One donor can sponsor multiple students)
3. **Student → Points Transaction**: One-to-Many (One student can have many transactions)
4. **Student → Student Goal**: One-to-Many (One student can have multiple goals)
5. **Student → Withdrawal Request**: One-to-Many (One student can make multiple withdrawal requests)
6. **Student → Investment**: One-to-Many (One student can have multiple investments)
7. **Student → Health Insurance**: One-to-One (One student can have one health insurance)
8. **Student → Education Update**: One-to-Many (One student can post many updates)
9. **Student → Purchase Order**: One-to-Many (One student can make multiple purchases)
10. **Vendor → Catalog Item**: One-to-Many (One vendor can have multiple products)
11. **Vendor → Payment Account**: One-to-Many (One vendor can have multiple payment accounts)
12. **Vendor → Purchase Order**: One-to-Many (One vendor can receive multiple orders)
13. **Vendor → Vendor Analytics**: One-to-Many (One vendor can have multiple analytics records)
14. **Vendor → Vendor Review**: One-to-Many (One vendor can receive multiple reviews)
15. **Catalog Item → Purchase Order Items**: One-to-Many (One product can be in multiple orders)
16. **School → Student**: One-to-Many (One school can have many students)
17. **District → School**: One-to-Many (One district can have many schools)
18. **Province → District**: One-to-Many (One province can have many districts)

### Category Hierarchies:
1. **Product Category**: Self-referencing for nested categories
2. **Vendor Category**: Self-referencing for nested categories

## Custom Scripts and Workflows

### 1. Student Approval Workflow
```python
# Custom Script for Student Approval
def on_update(doc, method):
    if doc.status == "Approved" and doc.documents_verified:
        # Send approval email
        send_student_approval_email(doc)
        
        # Create initial points allocation if donor assigned
        if doc.donor_id:
            create_initial_points_allocation(doc)
            
        # Update platform stats
        update_platform_stats()
```

### 2. Sponsorship Management
```python
# Custom Script for Sponsorship Lifecycle
def on_update(doc, method):
    if doc.status == "Active":
        # Create monthly payment schedule
        create_monthly_payment_schedule(doc)
        
        # Notify both donor and student
        send_sponsorship_activation_emails(doc)
        
    elif doc.status == "Opt-out Pending":
        # Initiate opt-out process
        initiate_opt_out_process(doc)
        
        # Notify admin for review
        notify_admin_opt_out_request(doc)
```

### 3. Points System Management
```python
# Custom Script for Points Transactions
def on_submit(doc, method):
    if doc.type == "Earned":
        # Add points to student balance
        update_student_points(doc.student, doc.amount, "add")
        
    elif doc.type == "Spent":
        # Deduct points from student balance
        update_student_points(doc.student, doc.amount, "subtract")
        
    elif doc.type == "Invested":
        # Create investment record
        create_investment_record(doc)
        
    # Update transaction balance
    doc.balance = get_current_student_balance(doc.student)
```

### 4. Purchase Order Processing
```python
# Custom Script for Purchase Order Workflow
def on_update(doc, method):
    if doc.status == "Approved":
        # Deduct points from student
        deduct_student_points(doc.student, doc.total_points)
        
        # Notify vendor
        send_vendor_order_notification(doc)
        
        # Update product stock
        update_product_stock(doc)
        
    elif doc.status == "Fulfilled":
        # Update fulfillment metrics
        update_vendor_fulfillment_metrics(doc.vendor)
        
        # Notify student
        send_student_fulfillment_notification(doc)
```

### 5. Withdrawal Request Processing
```python
# Custom Script for Withdrawal Requests
def on_update(doc, method):
    if doc.status == "Approved":
        # Calculate cash amount
        cash_amount = doc.amount * doc.conversion_rate
        
        # Process withdrawal
        process_withdrawal(doc.student, cash_amount, doc.bank_details)
        
        # Deduct points
        deduct_student_points(doc.student, doc.amount)
        
        # Apply withdrawal fee
        apply_withdrawal_fee(doc.student, doc.amount * doc.withdrawal_fee_percentage / 100)
```

## Reports and Analytics

### 1. Student Performance Report
- **Purpose**: Track student academic performance and engagement
- **Fields**: Student name, GPA, Points earned, Updates posted, Goals achieved
- **Filters**: Education level, School, Date range, Status

### 2. Donor Impact Report
- **Purpose**: Analyze donor contributions and impact
- **Fields**: Donor name, Total donated, Students sponsored, Points generated, Sponsorship duration
- **Filters**: Date range, Donation amount, Student type

### 3. Vendor Performance Report
- **Purpose**: Track vendor performance metrics
- **Fields**: Vendor name, Total orders, Total revenue, Average rating, Fulfillment rate
- **Filters**: Date range, Vendor category, Status

### 4. Financial Overview Report
- **Purpose**: Comprehensive financial analysis
- **Fields**: Total revenue, Monthly revenue, Points in circulation, Withdrawals processed, Investments made
- **Filters**: Date range, Transaction type, User type

### 5. Platform Analytics Dashboard
- **Purpose**: Real-time platform metrics
- **Metrics**: Active students, Active donors, Active vendors, Total sponsorships, Monthly revenue, User engagement

### 6. Student Financial Health Report
- **Purpose**: Monitor student financial well-being
- **Fields**: Student name, Available points, Invested points, Insurance coverage, Goals progress
- **Filters**: Education level, School, Points range

## Security and Permissions

### Role-Based Access Control:
1. **System Manager**: Full access to all doctypes and settings
2. **Administrator**: Access to student/donor/vendor management, approvals, analytics
3. **Student**: Access to own profile, points, purchases, goals, updates
4. **Donor**: Access to own profile, sponsorships, payments, student updates
5. **Vendor**: Access to own profile, products, orders, payments, analytics

### Permission Rules:
- Students can only view/edit their own records
- Donors can only view their sponsorships and sponsored students (with privacy controls)
- Vendors can only manage their own products and orders
- Administrators have full access to management functions
- System managers have access to system configuration

### Data Privacy:
- Student information can be hidden from donors during opt-out transitions
- Personal data is encrypted and access-controlled
- Audit trails track all data access and modifications

## Implementation Notes

### 1. Data Migration
- Export existing data from current system
- Map fields to Frappe doctype structure
- Import data using Frappe data import tools
- Validate data integrity and relationships

### 2. API Integration
- Create REST API endpoints for mobile app integration
- Implement webhook notifications for real-time updates
- Set up authentication and authorization for API access
- Create SDK for third-party integrations

### 3. Email Templates
- Create email templates for various system events
- Set up automated notification workflows
- Configure email delivery settings
- Create multilingual support

### 4. Payment Gateway Integration
- Integrate with payment gateways (Stripe, PayPal, etc.)
- Set up recurring payment processing
- Implement payment failure handling
- Create reconciliation processes

### 5. Mobile App Support
- Design mobile-friendly interfaces
- Implement offline capabilities
- Create push notification system
- Optimize performance for mobile devices

## Testing Plan

### 1. Unit Testing
- Test all doctype field validations
- Verify custom script functionality
- Test permission and access controls
- Validate calculation formulas

### 2. Integration Testing
- Test student registration and approval workflow
- Verify donor sponsorship management
- Test vendor order processing
- Validate points system calculations
- Test withdrawal and investment processes

### 3. Performance Testing
- Test system under high load
- Verify database performance
- Test API response times
- Validate concurrent user handling

### 4. Security Testing
- Test authentication and authorization
- Verify data encryption
- Test API security
- Validate audit trail functionality

### 5. User Acceptance Testing
- Test student dashboard functionality
- Verify donor sponsorship experience
- Test vendor management tools
- Validate admin oversight capabilities

## Deployment Checklist

### Pre-Deployment:
- [ ] Complete all doctype development
- [ ] Implement custom scripts and workflows
- [ ] Create all reports and dashboards
- [ ] Set up email templates and notifications
- [ ] Configure permissions and roles
- [ ] Complete data migration
- [ ] Integrate payment gateways
- [ ] Set up backup and recovery
- [ ] Perform comprehensive testing

### Post-Deployment:
- [ ] Monitor system performance
- [ ] Validate data integrity
- [ ] Train users on new system
- [ ] Set up monitoring and alerts
- [ ] Document maintenance procedures
- [ ] Establish support channels
- [ ] Create user documentation
- [ ] Set up analytics and reporting

This comprehensive doctype structure provides a complete blueprint for implementing the entire EduSponsor educational sponsorship platform using Frappe ERPNext as the backend, covering all aspects from student management to financial operations and administrative oversight.