# EduSponsor Vendor Management System - Frappe ERPNext Doctypes

## Overview
This document outlines the Frappe ERPNext doctypes and fields required to implement the EduSponsor vendor management system. The system includes vendor management, product catalogs, purchase orders, payment processing, and administrative oversight.

## Core Doctypes

### 1. Vendor
**Module:** EduSponsor  
**Description:** Main vendor record containing business information, contact details, and status

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
| Field Name | Type | Label | Options | Required |
|------------|------|-------|---------|----------|
| `document_type` | Select | Document Type | Business Registration, Tax Certificate, Bank Statement, Identification | Yes |
| `document_name` | Data | Document Name | | Yes |
| `file` | Attach | File | | Yes |
| `status` | Select | Status | Verified, Pending, Rejected | Yes |
| `verified_by` | Link | Verified By | (User) | No |
| `verification_date` | Datetime | Verification Date | | No |
| `notes` | Text | Notes | | No |

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

### 2. Vendor Category
**Module:** EduSponsor  
**Description:** Categories for vendor classification

#### Fields:
| Field Name | Type | Label | Required |
|------------|------|-------|----------|
| `category_name` | Data | Category Name | Yes |
| `description` | Text | Description | No |
| `is_active` | Check | Is Active | Yes |
| `parent_category` | Link | Parent Category | (Vendor Category) | No |

---

### 3. Product
**Module:** EduSponsor  
**Description:** Product catalog items offered by vendors

#### Fields:
| Field Name | Type | Label | Options | Required | Default |
|------------|------|-------|---------|----------|---------|
| `product_name` | Data | Product Name | | Yes | |
| `vendor` | Link | Vendor | (Vendor) | Yes | |
| `description` | Text | Description | | No | |
| `category` | Link | Category | (Product Category) | Yes | |
| `point_price` | Int | Point Price | | Yes | 0 |
| `approximate_value_lkr` | Currency | Approximate Value (LKR) | | Yes | 0 |
| `is_active` | Check | Is Active | | Yes | 1 |
| `stock_quantity` | Int | Stock Quantity | | Yes | 0 |
| `created_date` | Date | Created Date | | Yes | Today |
| `last_updated` | Datetime | Last Updated | | Yes | Now |
| `max_quantity_per_month` | Int | Max Quantity Per Month | | No | 0 |
| `product_image` | Attach Image | Product Image | | No | |
| `weight` | Float | Weight (kg) | | No | 0 |
| `dimensions` | Data | Dimensions | | No | |
| `warranty_period` | Int | Warranty Period (days) | | No | 0 |
| `return_policy` | Text | Return Policy | | No | |

#### Child Table: Product Education Levels
| Field Name | Type | Label | Required |
|------------|------|-------|----------|
| `education_level` | Select | Education Level | Primary, Secondary, Ordinary Level, Advanced Level, Undergraduate, Postgraduate | Yes |

---

### 4. Product Category
**Module:** EduSponsor  
**Description:** Categories for product classification

#### Fields:
| Field Name | Type | Label | Required |
|------------|------|-------|----------|
| `category_name` | Data | Category Name | Yes |
| `description` | Text | Description | No |
| `is_active` | Check | Is Active | Yes |
| `parent_category` | Link | Parent Category | (Product Category) | No |

---

### 5. Purchase Order
**Module:** EduSponsor  
**Description:** Purchase orders created by vendors for students

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
| `approved_by` | Link | Approved By | (User) | No | |
| `fulfilled_by` | Link | Fulfilled By | (User) | No | |

#### Child Table: Purchase Order Items
| Field Name | Type | Label | Required |
|------------|------|-------|----------|
| `product` | Link | Product | (Product) | Yes |
| `quantity` | Int | Quantity | Yes |
| `points_per_item` | Int | Points Per Item | Yes |
| `total_points` | Int | Total Points | Yes |

---

### 6. Student
**Module:** EduSponsor  
**Description:** Student records for the platform

#### Fields:
| Field Name | Type | Label | Required | Default |
|------------|------|-------|----------|---------|
| `student_name` | Data | Student Name | Yes | |
| `student_id` | Data | Student ID | Yes | |
| `email` | Data | Email | Yes | |
| `phone` | Data | Phone | No | |
| `address` | Text | Address | No | |
| `date_of_birth` | Date | Date of Birth | No | |
| `education_level` | Select | Education Level | Primary, Secondary, Ordinary Level, Advanced Level, Undergraduate, Postgraduate | Yes | |
| `school` | Data | School | No | |
| `grade` | Data | Grade | No | |
| `parent_name` | Data | Parent Name | No | |
| `parent_phone` | Data | Parent Phone | No | |
| `parent_email` | Data | Parent Email | No | |
| `total_points` | Int | Total Points | Yes | 0 |
| `points_used` | Int | Points Used | Yes | 0 |
| `points_available` | Int | Points Available | Yes | 0 |
| `status` | Select | Status | Active, Inactive, Suspended | Yes | Active |
| `join_date` | Date | Join Date | Yes | Today |
| `profile_image` | Attach Image | Profile Image | No | |

---

### 7. Payment Account
**Module:** EduSponsor  
**Description:** Vendor payment accounts and bank details

#### Fields:
| Field Name | Type | Label | Required | Default |
|------------|------|-------|----------|---------|
| `vendor` | Link | Vendor | (Vendor) | Yes | |
| `bank_name` | Data | Bank Name | Yes | |
| `account_number` | Data | Account Number | Yes | |
| `account_holder` | Data | Account Holder | Yes | |
| `branch` | Data | Branch | No | |
| `is_primary` | Check | Is Primary | Yes | 0 |
| `status` | Select | Status | Active, Inactive | Yes | Active |
| `account_type` | Select | Account Type | Savings, Current, Business | Yes | Savings |
| `swift_code` | Data | SWIFT Code | No | |
| `routing_number` | Data | Routing Number | No | |

---

### 8. Vendor Payment
**Module:** EduSponsor  
**Description:** Payment records for vendors

#### Fields:
| Field Name | Type | Label | Required | Default |
|------------|------|-------|----------|---------|
| `vendor` | Link | Vendor | (Vendor) | Yes | |
| `payment_amount` | Currency | Payment Amount | Yes | 0 |
| `payment_date` | Date | Payment Date | Yes | Today |
| `payment_method` | Select | Payment Method | Bank Transfer, Check, Cash, Online | Yes | Bank Transfer |
| `payment_account` | Link | Payment Account | (Payment Account) | Yes | |
| `reference_number` | Data | Reference Number | No | |
| `status` | Select | Status | Pending, Completed, Failed, Cancelled | Yes | Pending |
| `notes` | Text | Notes | No | |
| `processed_by` | Link | Processed By | (User) | No | |
| `processed_date` | Datetime | Processed Date | No | |

---

### 9. Vendor Analytics
**Module:** EduSponsor  
**Description:** Analytics and performance metrics for vendors

#### Fields:
| Field Name | Type | Label | Required | Default |
|------------|------|-------|----------|---------|
| `vendor` | Link | Vendor | (Vendor) | Yes | |
| `period` | Select | Period | Daily, Weekly, Monthly, Quarterly, Yearly | Yes | Monthly |
| `start_date` | Date | Start Date | Yes | |
| `end_date` | Date | End Date | Yes | |
| `total_orders` | Int | Total Orders | Yes | 0 |
| `total_revenue` | Currency | Total Revenue | Yes | 0 |
| `total_points_earned` | Int | Total Points Earned | Yes | 0 |
| `average_order_value` | Currency | Average Order Value | Yes | 0 |
| `fulfillment_rate` | Percent | Fulfillment Rate | Yes | 0 |
| `average_rating` | Float | Average Rating | Yes | 0 |
| `total_reviews` | Int | Total Reviews | Yes | 0 |
| `response_time_avg` | Time | Average Response Time | No | |
| `top_products` | Text | Top Products | No | |
| `customer_satisfaction` | Percent | Customer Satisfaction | No | 0 |

---

### 10. Vendor Review
**Module:** EduSponsor  
**Description:** Customer reviews and ratings for vendors

#### Fields:
| Field Name | Type | Label | Required | Default |
|------------|------|-------|----------|---------|
| `vendor` | Link | Vendor | (Vendor) | Yes | |
| `student` | Link | Student | (Student) | Yes | |
| `purchase_order` | Link | Purchase Order | (Purchase Order) | Yes | |
| `rating` | Rating | Rating | Yes | 0 |
| `review_title` | Data | Review Title | No | |
| `review_text` | Text | Review Text | No | |
| `review_date` | Date | Review Date | Yes | Today |
| `is_verified` | Check | Is Verified Purchase | Yes | 1 |
| `status` | Select | Status | Approved, Pending, Rejected | Yes | Pending |
| `helpful_count` | Int | Helpful Count | Yes | 0 |

---

### 11. Vendor Application
**Module:** EduSponsor  
**Description:** Vendor registration applications

#### Fields:
| Field Name | Type | Label | Required | Default |
|------------|------|-------|----------|---------|
| `application_number` | Data | Application Number | Yes | |
| `business_name` | Data | Business Name | Yes | |
| `business_category` | Link | Business Category | (Vendor Category) | Yes | |
| `contact_person` | Data | Contact Person | Yes | |
| `email` | Data | Email | Yes | |
| `phone` | Data | Phone | Yes | |
| `address` | Text | Address | Yes | |
| `website` | Data | Website | No | |
| `business_registration` | Data | Business Registration | No | |
| `tax_id` | Data | Tax ID | No | |
| `business_type` | Select | Business Type | Sole Proprietorship, Partnership, Corporation, LLC | No | Sole Proprietorship |
| `employee_count` | Int | Employee Count | No | 0 |
| `established_year` | Int | Established Year | No | |
| `description` | Data | Business Description | No | |
| `application_date` | Date | Application Date | Yes | Today |
| `status` | Select | Status | Pending, Under Review, Approved, Rejected | Yes | Pending |
| `reviewed_by` | Link | Reviewed By | (User) | No | |
| `review_date` | Date | Review Date | No | |
| `rejection_reason` | Text | Rejection Reason | No | |
| `notes` | Text | Notes | No | |

#### Child Table: Application Documents
| Field Name | Type | Label | Required |
|------------|------|-------|----------|
| `document_type` | Select | Document Type | Business Registration, Tax Certificate, Bank Statement, Identification, Business License | Yes |
| `document_name` | Data | Document Name | Yes |
| `file` | Attach | File | Yes |
| `upload_date` | Datetime | Upload Date | Yes | Now |

---

### 12. System Settings
**Module:** EduSponsor  
**Description:** System-wide configuration settings

#### Fields:
| Field Name | Type | Label | Required | Default |
|------------|------|-------|----------|---------|
| `points_to_lkr_rate` | Float | Points to LKR Rate | Yes | 0.5 |
| `max_products_per_vendor` | Int | Max Products Per Vendor | Yes | 100 |
| `max_orders_per_day` | Int | Max Orders Per Day | Yes | 50 |
| `auto_approve_threshold` | Int | Auto Approve Threshold (orders) | Yes | 10 |
| `vendor_approval_required` | Check | Vendor Approval Required | Yes | 1 |
| `email_notifications_enabled` | Check | Email Notifications Enabled | Yes | 1 |
| `sms_notifications_enabled` | Check | SMS Notifications Enabled | Yes | 0 |
| `default_fulfillment_days` | Int | Default Fulfillment Days | Yes | 3 |
| `max_upload_size` | Int | Max Upload Size (MB) | Yes | 5 |
| `supported_file_types` | Text | Supported File Types | No | pdf,jpg,jpeg,png |

---

## Relationships and Dependencies

### Primary Relationships:
1. **Vendor → Product**: One-to-Many (One vendor can have multiple products)
2. **Vendor → Payment Account**: One-to-Many (One vendor can have multiple payment accounts)
3. **Vendor → Purchase Order**: One-to-Many (One vendor can have multiple purchase orders)
4. **Vendor → Vendor Analytics**: One-to-Many (One vendor can have multiple analytics records)
5. **Vendor → Vendor Review**: One-to-Many (One vendor can have multiple reviews)
6. **Product → Purchase Order Items**: One-to-Many (One product can be in multiple purchase orders)
7. **Student → Purchase Order**: One-to-Many (One student can have multiple purchase orders)
8. **Student → Vendor Review**: One-to-Many (One student can write multiple reviews)
9. **Purchase Order → Purchase Order Items**: One-to-Many (One purchase order can have multiple items)

### Category Hierarchies:
1. **Vendor Category**: Self-referencing for nested categories
2. **Product Category**: Self-referencing for nested categories

## Custom Scripts and Workflows

### 1. Vendor Approval Workflow
```python
# Custom Script for Vendor Approval
def on_update(doc, method):
    if doc.status == "Active" and doc.verification_status == "Verified":
        # Send approval email
        send_vendor_approval_email(doc)
        
        # Create default payment account if none exists
        if not frappe.db.exists("Payment Account", {"vendor": doc.name}):
            create_default_payment_account(doc)
```

### 2. Purchase Order Processing
```python
# Custom Script for Purchase Order Status Updates
def on_update(doc, method):
    if doc.status == "Approved":
        # Deduct points from student
        deduct_student_points(doc.student, doc.total_points)
        
        # Notify vendor
        send_vendor_order_notification(doc)
        
    elif doc.status == "Fulfilled":
        # Update product stock
        update_product_stock(doc)
        
        # Notify student
        send_student_fulfillment_notification(doc)
```

### 3. Points System
```python
# Custom Script for Points Calculation
def calculate_order_points(items):
    total_points = 0
    for item in items:
        total_points += item.quantity * item.points_per_item
    return total_points

def validate_student_points(student, required_points):
    available_points = frappe.db.get_value("Student", student, "points_available")
    return available_points >= required_points
```

## Reports and Analytics

### 1. Vendor Performance Report
- **Purpose**: Track vendor performance metrics
- **Fields**: Vendor name, Total orders, Total revenue, Average rating, Fulfillment rate, Response time
- **Filters**: Date range, Vendor category, Status

### 2. Product Sales Report
- **Purpose**: Analyze product sales performance
- **Fields**: Product name, Vendor, Category, Total sales, Revenue, Stock level
- **Filters**: Date range, Product category, Vendor

### 3. Student Points Report
- **Purpose**: Track student points usage and balance
- **Fields**: Student name, Total points, Points used, Points available, Last activity
- **Filters**: Date range, Education level, School

### 4. Vendor Analytics Dashboard
- **Purpose**: Real-time vendor performance dashboard
- **Metrics**: Active vendors, Total revenue, Average order value, Top vendors, Vendor categories distribution

## Security and Permissions

### Role-Based Access Control:
1. **System Manager**: Full access to all doctypes and settings
2. **Vendor**: Access to own vendor record, products, purchase orders, payment accounts
3. **Student**: Access to own student record, purchase orders, points balance
4. **Administrator**: Access to vendor management, approvals, analytics

### Permission Rules:
- Vendors can only view/edit their own records
- Students can only view their own records and create purchase orders
- Administrators have full access to vendor management and approval workflows
- System managers have access to system settings and configuration

## Implementation Notes

### 1. Data Migration
- Export existing vendor data from current system
- Map fields to Frappe doctype structure
- Import data using Frappe data import tools
- Validate data integrity post-migration

### 2. API Integration
- Create REST API endpoints for mobile app integration
- Implement webhook notifications for real-time updates
- Set up authentication and authorization for API access

### 3. Email Templates
- Create email templates for vendor approval notifications
- Set up order confirmation emails
- Configure payment receipt templates
- Create review request emails

### 4. Backup and Recovery
- Configure automated daily backups
- Set up disaster recovery procedures
- Implement data retention policies
- Create backup validation scripts

## Testing Plan

### 1. Unit Testing
- Test all doctype field validations
- Verify custom script functionality
- Test permission and access controls
- Validate calculation formulas

### 2. Integration Testing
- Test vendor registration workflow
- Verify purchase order processing
- Test payment processing
- Validate points system calculations

### 3. User Acceptance Testing
- Test vendor dashboard functionality
- Verify student purchase experience
- Test admin management tools
- Validate reporting and analytics

## Deployment Checklist

### Pre-Deployment:
- [ ] Complete all doctype development
- [ ] Implement custom scripts and workflows
- [ ] Create all reports and dashboards
- [ ] Set up email templates
- [ ] Configure permissions and roles
- [ ] Complete data migration
- [ ] Perform comprehensive testing

### Post-Deployment:
- [ ] Monitor system performance
- [ ] Validate data integrity
- [ ] Train users on new system
- [ ] Set up monitoring and alerts
- [ ] Document maintenance procedures
- [ ] Establish support channels

This comprehensive doctype structure provides a solid foundation for implementing the EduSponsor vendor management system using Frappe ERPNext as the backend.