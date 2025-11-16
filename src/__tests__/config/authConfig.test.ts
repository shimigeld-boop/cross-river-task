import { describe, it, expect } from 'vitest'
import { msalConfig, loginRequest } from '../../config/authConfig'

describe('Auth Configuration', () => {
  describe('msalConfig', () => {
    it('should have valid auth configuration', () => {
      expect(msalConfig).toBeDefined()
      expect(msalConfig.auth).toBeDefined()
      expect(msalConfig.auth.clientId).toBeDefined()
    })

    it('should have cache configuration', () => {
      expect(msalConfig.cache).toBeDefined()
      if (msalConfig.cache) {
        expect(msalConfig.cache.cacheLocation).toBeDefined()
      }
    })

    it('should have system configuration', () => {
      expect(msalConfig.system).toBeDefined()
    })

    it('should use sessionStorage or localStorage for cache', () => {
      const validCacheLocations = ['sessionStorage', 'localStorage']
      if (msalConfig.cache) {
        expect(validCacheLocations).toContain(msalConfig.cache.cacheLocation)
      }
    })
  })

  describe('loginRequest', () => {
    it('should have scopes defined', () => {
      expect(loginRequest).toBeDefined()
      expect(loginRequest.scopes).toBeDefined()
      expect(Array.isArray(loginRequest.scopes)).toBe(true)
    })

    it('should include User.Read scope', () => {
      expect(loginRequest.scopes).toContain('User.Read')
    })

    it('should have at least one scope', () => {
      expect(loginRequest.scopes.length).toBeGreaterThan(0)
    })
  })
})
