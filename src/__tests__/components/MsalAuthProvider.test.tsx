import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MsalAuthProvider } from '../../components/providers/MsalAuthProvider'

// Mock MSAL browser
vi.mock('@azure/msal-browser', () => ({
  PublicClientApplication: vi.fn().mockImplementation(() => ({
    initialize: vi.fn().mockResolvedValue(undefined),
    acquireTokenSilent: vi.fn(),
    loginRedirect: vi.fn(),
    logoutRedirect: vi.fn(),
  })),
}))

// Mock MSAL React
vi.mock('@azure/msal-react', () => ({
  MsalProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Mock config
vi.mock('../../config/authConfig', () => ({
  msalConfig: {
    auth: {
      clientId: 'test-client-id',
      authority: 'https://login.microsoftonline.com/test-tenant',
      redirectUri: 'http://localhost:3000',
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: false,
    },
  },
}))

describe('MsalAuthProvider', () => {
  it('should render loading state initially', () => {
    render(
      <MsalAuthProvider>
        <div>Test Child</div>
      </MsalAuthProvider>
    )

    expect(screen.getByText('Loading authentication...')).toBeTruthy()
  })

  it('should render children after initialization', async () => {
    render(
      <MsalAuthProvider>
        <div>Test Child</div>
      </MsalAuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Child')).toBeTruthy()
    })
  })

  it('should initialize MSAL instance', async () => {
    const { container } = render(
      <MsalAuthProvider>
        <div>Content</div>
      </MsalAuthProvider>
    )

    await waitFor(() => {
      expect(container.textContent).toContain('Content')
    })
  })

  it('should not render children before initialization', () => {
    const { container } = render(
      <MsalAuthProvider>
        <div data-testid="child">Test Child</div>
      </MsalAuthProvider>
    )

    // Initially should show loading
    const child = container.querySelector('[data-testid="child"]')
    expect(child).toBeNull()
  })
})
