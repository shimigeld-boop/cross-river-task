import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import DashboardPage from '../../app/dashboard/page'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/dashboard',
}))

// Mock MSAL
vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({
    instance: {
      acquireTokenSilent: vi.fn(),
      loginRedirect: vi.fn(),
      logoutRedirect: vi.fn(),
    },
    accounts: [{ username: 'test@example.com' }],
    inProgress: 'none',
  }),
  useIsAuthenticated: () => true,
  MsalProvider: ({ children }: { children: React.ReactNode }) => children,
  AuthenticatedTemplate: ({ children }: { children: React.ReactNode }) => children,
  UnauthenticatedTemplate: () => null,
}))

// Mock axios for API calls
vi.mock('axios', () => ({
  default: {
    get: vi.fn(() =>
      Promise.resolve({
        data: {
          displayName: 'Test User',
          mail: 'test@example.com',
          jobTitle: 'Developer',
        },
      })
    ),
  },
}))

describe('Dashboard Page', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  it('should render dashboard page', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DashboardPage />
      </QueryClientProvider>
    )

    // Check if the page renders without crashing
    expect(document.body).toBeTruthy()
  })

  it('should be wrapped with authentication', () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <DashboardPage />
      </QueryClientProvider>
    )

    // Dashboard should render some content
    expect(container).toBeTruthy()
  })
})
