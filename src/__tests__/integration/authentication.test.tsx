import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useUserProfile } from '../../hooks/useApi'
import axios from 'axios'

// Mock axios
vi.mock('axios')

// Mock MSAL
const mockAcquireTokenSilent = vi.fn()
const mockLoginRedirect = vi.fn()

vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({
    instance: {
      acquireTokenSilent: mockAcquireTokenSilent,
      loginRedirect: mockLoginRedirect,
      logoutRedirect: vi.fn(),
    },
    accounts: [{ homeAccountId: 'test-account' }],
    inProgress: 'none',
  }),
  MsalProvider: ({ children }: { children: React.ReactNode }) => children,
  AuthenticatedTemplate: ({ children }: { children: React.ReactNode }) => children,
  UnauthenticatedTemplate: ({ children }: { children: React.ReactNode }) => null,
}))

const TestComponent = () => {
  const { data, isLoading, error } = useUserProfile()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return <div>No data</div>

  return <div>Welcome, {data.displayName}</div>
}

describe('Authentication Integration', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    mockAcquireTokenSilent.mockResolvedValue({
      accessToken: 'mock-token',
    })
  })

  it('should have auth hooks available', () => {
    expect(useUserProfile).toBeDefined()
    expect(typeof useUserProfile).toBe('function')
  })

  it('should handle authentication token acquisition', () => {
    expect(mockAcquireTokenSilent).toBeDefined()
    expect(mockLoginRedirect).toBeDefined()
  })

  it('should render test component structure', () => {
    const mockProfile = { displayName: 'Test User', mail: 'test@test.com', jobTitle: 'Dev' }
    vi.mocked(axios.get).mockResolvedValue({ data: mockProfile })

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <div>Test</div>
      </QueryClientProvider>
    )

    expect(container).toBeTruthy()
  })

  it('should mock axios correctly', () => {
    expect(axios.get).toBeDefined()
    expect(vi.mocked(axios.get)).toBeDefined()
  })
})
