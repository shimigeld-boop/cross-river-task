import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SettingsPage from '../../app/settings/page'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/settings',
}))

// Mock MSAL
vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({
    instance: {
      acquireTokenSilent: vi.fn(),
      loginRedirect: vi.fn(),
      logoutRedirect: vi.fn(),
    },
    accounts: [
      {
        username: 'test@example.com',
        name: 'Test User',
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

describe('Settings Page', () => {
  it('should render the settings page', () => {
    renderWithProviders(<SettingsPage />)
    
    const settingsHeaders = screen.getAllByText('Settings')
    expect(settingsHeaders.length).toBeGreaterThan(0)
  })

  it('should display profile settings section', () => {
    renderWithProviders(<SettingsPage />)
    
    expect(screen.getByText('Profile Settings')).toBeTruthy()
  })

  it('should display notification preferences section', () => {
    renderWithProviders(<SettingsPage />)
    
    expect(screen.getByText('Notification Preferences')).toBeTruthy()
  })

  it('should display appearance section', () => {
    renderWithProviders(<SettingsPage />)
    
    expect(screen.getByText('Appearance')).toBeTruthy()
  })

  it('should display all notification toggles', () => {
    renderWithProviders(<SettingsPage />)
    
    expect(screen.getByText('Email Notifications')).toBeTruthy()
    expect(screen.getByText('Push Notifications')).toBeTruthy()
    expect(screen.getByText('SMS Notifications')).toBeTruthy()
  })

  it('should display theme selector', () => {
    renderWithProviders(<SettingsPage />)
    
    const themeLabels = screen.getAllByText('Theme')
    expect(themeLabels.length).toBeGreaterThan(0)
  })

  it('should display language selector', () => {
    renderWithProviders(<SettingsPage />)
    
    const languageLabels = screen.getAllByText('Language')
    expect(languageLabels.length).toBeGreaterThan(0)
  })

  it('should display save settings button', () => {
    renderWithProviders(<SettingsPage />)
    
    expect(screen.getByText('Save Settings')).toBeTruthy()
  })

  it('should toggle notification switches', () => {
    renderWithProviders(<SettingsPage />)
    
    const emailSwitch = screen.getByRole('checkbox', { name: /Email Notifications/i }) as HTMLInputElement
    expect(emailSwitch.checked).toBe(true)
    
    fireEvent.click(emailSwitch)
    expect(emailSwitch.checked).toBe(false)
  })

  it('should show success message after saving', async () => {
    renderWithProviders(<SettingsPage />)
    
    const saveButton = screen.getByText('Save Settings')
    fireEvent.click(saveButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Settings saved successfully/i)).toBeTruthy()
    })
  })

  it('should update display name field', () => {
    renderWithProviders(<SettingsPage />)
    
    const nameInput = screen.getByLabelText(/Display Name/i) as HTMLInputElement
    fireEvent.change(nameInput, { target: { value: 'New Name' } })
    
    expect(nameInput.value).toBe('New Name')
  })

  it('should have all form fields populated with default values', () => {
    renderWithProviders(<SettingsPage />)
    
    const nameInput = screen.getByLabelText(/Display Name/i) as HTMLInputElement
    const emailInputs = screen.getAllByLabelText(/Email/i)
    
    expect(nameInput.value).toBeTruthy()
    expect(emailInputs.length).toBeGreaterThan(0)
  })
})
