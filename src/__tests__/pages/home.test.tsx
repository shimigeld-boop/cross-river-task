import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import HomePage from '../../app/page'

// Mock Next.js navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
}))

// Mock MSAL
const mockLoginRedirect = vi.fn()
const mockInstance = {
  loginRedirect: mockLoginRedirect,
  logoutRedirect: vi.fn(),
  acquireTokenSilent: vi.fn(),
}

vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({
    instance: mockInstance,
    accounts: [],
    inProgress: 'none',
  }),
  useIsAuthenticated: () => false,
  MsalProvider: ({ children }: { children: React.ReactNode }) => children,
}))

describe('Home Page', () => {
  it('should render the home page', () => {
    render(<HomePage />)
    
    expect(screen.getByText('Welcome to Cross River Task')).toBeTruthy()
  })

  it('should display the sign in button', () => {
    render(<HomePage />)
    
    expect(screen.getByText('Sign in with Microsoft')).toBeTruthy()
  })

  it('should display application description', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/modern Next.js application/i)).toBeTruthy()
  })

  it('should call loginRedirect when sign in button is clicked', async () => {
    render(<HomePage />)
    
    const signInButton = screen.getByText('Sign in with Microsoft')
    fireEvent.click(signInButton)
    
    expect(mockLoginRedirect).toHaveBeenCalledWith({
      scopes: ['user.read'],
    })
  })

  it('should have proper heading hierarchy', () => {
    const { container } = render(<HomePage />)
    
    const h1 = container.querySelector('h1')
    expect(h1).toBeTruthy()
    expect(h1?.textContent).toContain('Welcome to Cross River Task')
  })
})
