import { z } from 'zod'

/**
 * Validation Schemas Module
 *
 * Contains Zod schemas for runtime validation of forms and API data.
 * All schemas include helpful error messages for better UX.
 *
 * @module validationSchemas
 */

// ==================== User Profile ====================

/**
 * User profile validation schema
 * Validates data from Microsoft Graph API
 */
export const userProfileSchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
  mail: z.string().email('Invalid email address'),
  jobTitle: z.string().optional(),
  officeLocation: z.string().optional(),
  mobilePhone: z.string().optional(),
  businessPhones: z.array(z.string()).optional(),
})

/** Type inference from userProfileSchema */
export type UserProfile = z.infer<typeof userProfileSchema>

// ==================== Forms ====================

/**
 * Login form validation schema
 * Validates email and password inputs
 */
export const loginFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

/** Type inference from loginFormSchema */
export type LoginForm = z.infer<typeof loginFormSchema>

/**
 * Contact form validation schema
 * Validates contact form submissions with optional phone number
 */
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]*$/, 'Invalid phone number')
    .optional(),
})

/** Type inference from contactFormSchema */
export type ContactForm = z.infer<typeof contactFormSchema>

/**
 * Settings form validation schema
 * Validates user preferences and notification settings
 */
export const settingsFormSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sms: z.boolean(),
  }),
  theme: z.enum(['light', 'dark', 'auto']),
  language: z.string().min(2, 'Language is required'),
})

/** Type inference from settingsFormSchema */
export type SettingsForm = z.infer<typeof settingsFormSchema>

// ==================== API Response ====================

/**
 * Generic API response validation schema
 * Validates standard API response structure
 */
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
})

/** Type inference from apiResponseSchema */
export type ApiResponse = z.infer<typeof apiResponseSchema>
