import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock MSAL
vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({
    instance: {
      acquireTokenSilent: vi.fn(),
      loginRedirect: vi.fn(),
      logoutRedirect: vi.fn(),
    },
    accounts: [],
    inProgress: 'none',
  }),
  useIsAuthenticated: () => false,
  MsalProvider: ({ children }: { children: React.ReactNode }) => children,
  AuthenticatedTemplate: ({ children }: { children: React.ReactNode }) => children,
  UnauthenticatedTemplate: ({ children }: { children: React.ReactNode }) => null,
}))

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))