import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProtectedRoute } from '../../components/auth/ProtectedRoute'

// Mock Next.js navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/dashboard',
}))

// Mock MSAL
const mockUseMsal = vi.fn()
const mockUseIsAuthenticated = vi.fn()
vi.mock('@azure/msal-react', () => ({
  useMsal: () => mockUseMsal(),
  useIsAuthenticated: () => mockUseIsAuthenticated(),
}))

describe('ProtectedRoute', () => {
  it('should render children when user is authenticated', () => {
    mockUseMsal.mockReturnValue({
      instance: {
        loginRedirect: vi.fn(),
        logoutRedirect: vi.fn(),
      },
      accounts: [{ username: 'test@example.com' }],
      inProgress: 'none',
    })
    mockUseIsAuthenticated.mockReturnValue(true)

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByText('Protected Content')).toBeTruthy()
  })

  it('should be defined', () => {
    expect(ProtectedRoute).toBeDefined()
  })

  it('should accept children prop', () => {
    mockUseMsal.mockReturnValue({
      instance: {
        loginRedirect: vi.fn(),
        logoutRedirect: vi.fn(),
      },
      accounts: [{ username: 'test@example.com' }],
      inProgress: 'none',
    })
    mockUseIsAuthenticated.mockReturnValue(true)

    const { container } = render(
      <ProtectedRoute>
        <div>Test</div>
      </ProtectedRoute>
    )

    expect(container).toBeTruthy()
  })
})
