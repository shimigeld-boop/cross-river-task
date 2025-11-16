import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useUserProfile, useUserPhoto, useAuthenticatedQuery } from '../../hooks/useApi'
import axios from 'axios'
import type { ReactNode } from 'react'

// Mock axios
vi.mock('axios')

// Mock MSAL
const mockAcquireTokenSilent = vi.fn()
vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({
    instance: {
      acquireTokenSilent: mockAcquireTokenSilent,
      loginRedirect: vi.fn(),
      logoutRedirect: vi.fn(),
    },
    accounts: [{ homeAccountId: 'test-account' }],
    inProgress: 'none',
  }),
  MsalProvider: ({ children }: { children: ReactNode }) => children,
  AuthenticatedTemplate: ({ children }: { children: ReactNode }) => children,
  UnauthenticatedTemplate: ({ children }: { children: ReactNode }) => null,
}))

// Create a wrapper for TanStack Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  const Wrapper = ({ children }: { children: ReactNode }) => {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
  return Wrapper
}

describe('useApi hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAcquireTokenSilent.mockResolvedValue({
      accessToken: 'mock-access-token',
    })
  })

  describe('useUserProfile', () => {
    it('should have correct query structure', () => {
      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      })

      // Check that the hook returns the expected TanStack Query structure
      expect(result.current).toHaveProperty('data')
      expect(result.current).toHaveProperty('isLoading')
      expect(result.current).toHaveProperty('error')
      expect(result.current).toHaveProperty('isSuccess')
      expect(result.current).toHaveProperty('isError')
    })
  })

  describe('useUserPhoto', () => {
    it('should have correct query structure', () => {
      const { result } = renderHook(() => useUserPhoto(), {
        wrapper: createWrapper(),
      })

      // Check that the hook returns the expected TanStack Query structure
      expect(result.current).toHaveProperty('data')
      expect(result.current).toHaveProperty('isLoading')
      expect(result.current).toHaveProperty('isSuccess')
    })
  })

  describe('useAuthenticatedQuery', () => {
    it('should be a function', () => {
      expect(typeof useAuthenticatedQuery).toBe('function')
    })
  })
})
