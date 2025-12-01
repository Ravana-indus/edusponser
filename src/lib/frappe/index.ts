// Main export file for EduSponsor Frappe integration

// Configuration
export * from './config'

// Client
export { frappeClient, FrappeClient } from './client'

// Authentication
export * from './auth'

// Types
export * from './types'

// Services
export { studentService } from './services/studentService'
export { donorService } from './services/donorService'
export { vendorService } from './services/vendorService'
export { systemService } from './services/systemService'

// Utilities and Hooks
export * from './utils/hooks'
export * from './utils/helpers'

// Re-export commonly used items for convenience
export { DOCTYPES } from './types'

// Default export for easy importing
import * as config from './config'
import { frappeClient, FrappeClient } from './client'
import * as auth from './auth'
import * as types from './types'
import { studentService } from './services/studentService'
import { donorService } from './services/donorService'
import { vendorService } from './services/vendorService'
import { systemService } from './services/systemService'
import * as hooks from './utils/hooks'
import * as helpers from './utils/helpers'

const frappeIntegration = {
  config,
  client: { frappeClient, FrappeClient },
  auth,
  types,
  services: {
    student: studentService,
    donor: donorService,
    vendor: vendorService,
    system: systemService,
  },
  utils: {
    hooks,
    helpers,
  },
}

export default frappeIntegration