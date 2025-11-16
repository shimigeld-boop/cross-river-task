import { describe, it, expect } from 'vitest'

// Helper functions that might exist in your project
describe('Utility Helpers', () => {
  describe('String utilities', () => {
    it('should format display names correctly', () => {
      const formatName = (name: string) => {
        return name
          .split(' ')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join(' ')
      }

      expect(formatName('john doe')).toBe('John Doe')
      expect(formatName('JANE SMITH')).toBe('Jane Smith')
    })

    it('should extract initials from name', () => {
      const getInitials = (name: string) => {
        return name
          .split(' ')
          .map((part) => part.charAt(0))
          .join('')
          .toUpperCase()
      }

      expect(getInitials('John Doe')).toBe('JD')
      expect(getInitials('Jane Mary Smith')).toBe('JMS')
    })
  })

  describe('Date utilities', () => {
    it('should format dates correctly', () => {
      const date = new Date('2025-01-15T10:30:00')
      expect(date.toISOString()).toContain('2025-01-15')
    })

    it('should calculate time difference', () => {
      const now = new Date()
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      const diff = now.getTime() - yesterday.getTime()
      
      expect(diff).toBeGreaterThan(0)
      expect(diff).toBeCloseTo(24 * 60 * 60 * 1000, -3)
    })
  })

  describe('Validation utilities', () => {
    it('should validate email format', () => {
      const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
      }

      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
    })

    it('should validate required fields', () => {
      const isRequired = (value: string | undefined | null) => {
        return value !== undefined && value !== null && value.trim().length > 0
      }

      expect(isRequired('value')).toBe(true)
      expect(isRequired('')).toBe(false)
      expect(isRequired('  ')).toBe(false)
      expect(isRequired(undefined)).toBe(false)
      expect(isRequired(null)).toBe(false)
    })
  })

  describe('Object utilities', () => {
    it('should deep clone objects', () => {
      const original = { name: 'John', details: { age: 30 } }
      const cloned = JSON.parse(JSON.stringify(original))
      
      cloned.details.age = 31
      expect(original.details.age).toBe(30)
      expect(cloned.details.age).toBe(31)
    })

    it('should merge objects correctly', () => {
      const obj1 = { a: 1, b: 2 }
      const obj2 = { b: 3, c: 4 }
      const merged = { ...obj1, ...obj2 }
      
      expect(merged).toEqual({ a: 1, b: 3, c: 4 })
    })
  })

  describe('Array utilities', () => {
    it('should filter unique values', () => {
      const array = [1, 2, 2, 3, 3, 3, 4]
      const unique = [...new Set(array)]
      
      expect(unique).toEqual([1, 2, 3, 4])
    })

    it('should group items by property', () => {
      const items = [
        { category: 'A', value: 1 },
        { category: 'B', value: 2 },
        { category: 'A', value: 3 },
      ]
      
      const grouped = items.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = []
        acc[item.category].push(item)
        return acc
      }, {} as Record<string, typeof items>)
      
      expect(grouped.A).toHaveLength(2)
      expect(grouped.B).toHaveLength(1)
    })
  })
})
