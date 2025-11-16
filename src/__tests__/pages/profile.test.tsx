import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProfilePage from '../../app/profile/page'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/profile',
}))

// Mock MSAL
const mockAcquireTokenSilent = vi.fn()
vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({
    instance: {
      acquireTokenSilent: mockAcquireTokenSilent,
      loginRedirect: vi.fn(),
      logoutRedirect: vi.fn(),
    },
    accounts: [
      {
        username: 'test@example.com',
        name: 'Test User',
        homeAccountId: 'test-id',
      },
    ],
    inProgress: 'none',
  }),
  useIsAuthenticated: () => true,
}))

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(() =>
      Promise.resolve({
        data: {
          displayName: 'Test User',
          mail: 'test@example.com',
          jobTitle: 'Senior Developer',
          officeLocation: 'New York',
          mobilePhone: '+1234567890',
          businessPhones: ['+0987654321'],
          id: 'test-user-id',
        },
      })
    ),
  },
}))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
})

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
  )
}

describe('Profile Page', () => {
  beforeEach(() => {
    mockAcquireTokenSilent.mockResolvedValue({
      accessToken: 'mock-token',
    })
  })

  it('should render the profile page', () => {
    renderWithProviders(<ProfilePage />)
    
    const profileHeaders = screen.getAllByText('Profile')
    expect(profileHeaders.length).toBeGreaterThan(0)
  })

  it('should display contact information section', () => {
    renderWithProviders(<ProfilePage />)
    
    expect(screen.getByText('Contact Information')).toBeTruthy()
  })

  it('should show user avatar', () => {
    const { container } = renderWithProviders(<ProfilePage />)
    
    const avatar = container.querySelector('[class*="MuiAvatar"]')
    expect(avatar).toBeTruthy()
  })

  it('should display email field', () => {
    renderWithProviders(<ProfilePage />)
    
    expect(screen.getByText('Email')).toBeTruthy()
  })

  it('should display phone fields', () => {
    renderWithProviders(<ProfilePage />)
    
    expect(screen.getByText('Mobile Phone')).toBeTruthy()
    expect(screen.getByText('Business Phone')).toBeTruthy()
  })

  it('should display user ID', () => {
    renderWithProviders(<ProfilePage />)
    
    expect(screen.getByText('User ID')).toBeTruthy()
  })

  it('should render within a card component', () => {
    const { container } = renderWithProviders(<ProfilePage />)
    
    const cards = container.querySelectorAll('[class*="MuiCard"]')
    expect(cards.length).toBeGreaterThan(0)
  })
})
