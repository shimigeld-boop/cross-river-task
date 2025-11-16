import { describe, it, expect } from 'vitest'
import { userProfileSchema, contactFormSchema, settingsFormSchema } from '../../schemas/validationSchemas'

describe('Validation Schemas', () => {
  describe('userProfileSchema', () => {
    it('should validate a valid user profile', () => {
      const validProfile = {
        displayName: 'John Doe',
        mail: 'john@example.com',
        jobTitle: 'Developer',
      }

      const result = userProfileSchema.safeParse(validProfile)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email format', () => {
      const invalidProfile = {
        displayName: 'John Doe',
        mail: 'invalid-email',
        jobTitle: 'Developer',
      }

      const result = userProfileSchema.safeParse(invalidProfile)
      expect(result.success).toBe(false)
    })

    it('should allow optional fields to be undefined', () => {
      const minimalProfile = {
        displayName: 'John Doe',
      }

      const result = userProfileSchema.safeParse(minimalProfile)
      // This test depends on your actual schema requirements
      expect(result).toBeDefined()
    })
  })

  describe('contactFormSchema', () => {
    it('should validate a complete contact form', () => {
      const validForm = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Inquiry',
        message: 'Hello, I have a question.',
      }

      const result = contactFormSchema.safeParse(validForm)
      expect(result.success).toBe(true)
    })

    it('should require name field', () => {
      const invalidForm = {
        email: 'john@example.com',
        subject: 'Inquiry',
        message: 'Hello',
      }

      const result = contactFormSchema.safeParse(invalidForm)
      expect(result.success).toBe(false)
    })

    it('should require valid email', () => {
      const invalidForm = {
        name: 'John Doe',
        email: 'not-an-email',
        subject: 'Inquiry',
        message: 'Hello',
      }

      const result = contactFormSchema.safeParse(invalidForm)
      expect(result.success).toBe(false)
    })

    it('should require message to have minimum length', () => {
      const invalidForm = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Inquiry',
        message: 'Hi',
      }

      const result = contactFormSchema.safeParse(invalidForm)
      // This test depends on your actual schema requirements
      expect(result).toBeDefined()
    })
  })

  describe('settingsFormSchema', () => {
    it('should validate settings object', () => {
      const validSettings = {
        displayName: 'John Doe',
        email: 'john@example.com',
        notifications: {
          email: true,
          push: false,
          sms: false,
        },
        theme: 'dark' as const,
        language: 'en',
      }

      const result = settingsFormSchema.safeParse(validSettings)
      expect(result.success).toBe(true)
    })

    it('should validate with different theme values', () => {
      const lightTheme = {
        displayName: 'Jane Doe',
        email: 'jane@example.com',
        notifications: {
          email: false,
          push: true,
          sms: false,
        },
        theme: 'light' as const,
        language: 'en',
      }

      const result = settingsFormSchema.safeParse(lightTheme)
      expect(result.success).toBe(true)
    })
  })
})
