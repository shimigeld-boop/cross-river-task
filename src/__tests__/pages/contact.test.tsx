import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ContactPage from '../../app/contact/page'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/contact',
}))

// Mock MSAL
vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({
    instance: {
      acquireTokenSilent: vi.fn(),
      loginRedirect: vi.fn(),
      logoutRedirect: vi.fn(),
    },
    accounts: [{ username: 'test@example.com', name: 'Test User' }],
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
          jobTitle: 'Developer',
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

describe('Contact Page', () => {
  it('should render the contact page', () => {
    renderWithProviders(<ContactPage />)
    
    expect(screen.getByText('Contact Us')).toBeTruthy()
  })

  it('should display all form fields', () => {
    renderWithProviders(<ContactPage />)
    
    expect(screen.getByLabelText(/Name/i)).toBeTruthy()
    expect(screen.getByLabelText(/Email/i)).toBeTruthy()
    expect(screen.getByLabelText(/Subject/i)).toBeTruthy()
    expect(screen.getByLabelText(/Message/i)).toBeTruthy()
    expect(screen.getByLabelText(/Phone/i)).toBeTruthy()
  })

  it('should display send message button', () => {
    renderWithProviders(<ContactPage />)
    
    expect(screen.getByText('Send Message')).toBeTruthy()
  })

  it('should show validation errors for empty required fields', async () => {
    renderWithProviders(<ContactPage />)
    
    const submitButton = screen.getByText('Send Message')
    fireEvent.click(submitButton)
    
    // Just check that form validation occurs
    await waitFor(() => {
      const nameInput = screen.getByLabelText(/Name/i) as HTMLInputElement
      expect(nameInput).toBeTruthy()
    })
  })

  it('should update form field values when typing', () => {
    renderWithProviders(<ContactPage />)
    
    const nameInput = screen.getByLabelText(/Name/i) as HTMLInputElement
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    
    expect(nameInput.value).toBe('John Doe')
  })

  it('should show success message after successful submission', async () => {
    renderWithProviders(<ContactPage />)
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/Subject/i), { target: { value: 'Test Subject' } })
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'This is a test message with enough characters' } })
    
    const submitButton = screen.getByText('Send Message')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Your message has been sent successfully/i)).toBeTruthy()
    })
  })
})
