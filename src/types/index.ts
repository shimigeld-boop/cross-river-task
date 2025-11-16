/**
 * Common Type Definitions
 *
 * Shared TypeScript types and interfaces used throughout the application.
 * Provides type safety and better IDE support.
 *
 * @module types
 */

// ==================== User Types ====================

/**
 * User entity interface
 * Represents an authenticated user in the system
 */
export interface User {
  /** Unique user identifier */
  id: string
  /** User's full name */
  name: string
  /** User's email address */
  email: string
  /** User's display name (optional) */
  displayName?: string
  /** User's job title (optional) */
  jobTitle?: string
  /** User's office location (optional) */
  officeLocation?: string
  /** User's mobile phone number (optional) */
  mobilePhone?: string
  /** Array of user's business phone numbers (optional) */
  businessPhones?: string[]
}

// ==================== API Types ====================

/**
 * API error interface
 * Standardized error structure for API responses
 */
export interface ApiError {
  /** Error message for display */
  message: string
  /** Error code for identification (optional) */
  code?: string
  /** HTTP status code (optional) */
  status?: number
}

/**
 * Paginated response interface
 * Generic type for paginated API responses
 *
 * @template T - The type of data items in the response
 */
export interface PaginatedResponse<T> {
  /** Array of data items */
  data: T[]
  /** Total number of items available */
  total: number
  /** Current page number */
  page: number
  /** Number of items per page */
  pageSize: number
  /** Whether more pages are available */
  hasMore: boolean
}

/**
 * Query parameters interface
 * Standard parameters for API queries with pagination and sorting
 */
export interface QueryParams {
  /** Page number (optional) */
  page?: number
  /** Number of items per page (optional) */
  pageSize?: number
  /** Search query string (optional) */
  search?: string
  /** Field to sort by (optional) */
  sortBy?: string
  /** Sort direction (optional) */
  sortOrder?: 'asc' | 'desc'
}

// ==================== UI Types ====================

/**
 * Theme mode type
 * Available theme options for the application
 */
export type Theme = 'light' | 'dark' | 'auto'

/**
 * Notification settings interface
 * User's notification preferences
 */
export type NotificationSettings = {
  /** Email notifications enabled */
  email: boolean
  /** Push notifications enabled */
  push: boolean
  /** SMS notifications enabled */
  sms: boolean
}
