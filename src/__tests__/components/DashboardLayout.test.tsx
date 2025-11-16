import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'

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
const mockLogoutRedirect = vi.fn()
vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({
    instance: {
      logoutRedirect: mockLogoutRedirect,
      loginRedirect: vi.fn(),
      acquireTokenSilent: vi.fn(),
    },
    accounts: [
      {
        name: 'Test User',
        username: 'test@example.com',
      },
    ],
    inProgress: 'none',
  }),
  useIsAuthenticated: () => true,
}))

describe('DashboardLayout', () => {
  it('should render the layout with children', () => {
    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    )

    expect(screen.getByText('Test Content')).toBeTruthy()
  })

  it('should display the app name in the app bar', () => {
    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    )

    expect(screen.getByText('Cross River Task')).toBeTruthy()
  })

  it('should display user name', () => {
    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    )

    expect(screen.getByText('Test User')).toBeTruthy()
  })

  it('should render all menu items', () => {
    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    )

    const allMenuItems = screen.getAllByText('Dashboard')
    expect(allMenuItems.length).toBeGreaterThan(0)
    expect(screen.getAllByText('Profile').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Contact').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Settings').length).toBeGreaterThan(0)
  })

  it('should render logout button in menu', () => {
    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    )

    const logoutButtons = screen.getAllByText('Logout')
    expect(logoutButtons.length).toBeGreaterThan(0)
  })

  it('should call logout when logout button is clicked', () => {
    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    )

    const logoutButtons = screen.getAllByText('Logout')
    fireEvent.click(logoutButtons[0])

    expect(mockLogoutRedirect).toHaveBeenCalled()
  })

  it('should navigate when menu items are clicked', () => {
    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    )

    const profileButtons = screen.getAllByText('Profile')
    fireEvent.click(profileButtons[0])

    expect(mockPush).toHaveBeenCalledWith('/profile')
  })

  it('should render menu icon for mobile', () => {
    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    )

    const menuButton = screen.getByLabelText('open drawer')
    expect(menuButton).toBeTruthy()
  })

  it('should have proper drawer structure', () => {
    const { container } = render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    )

    const drawers = container.querySelectorAll('[class*="MuiDrawer"]')
    expect(drawers.length).toBeGreaterThan(0)
  })

  it('should render app bar', () => {
    const { container } = render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    )

    const appBar = container.querySelector('[class*="MuiAppBar"]')
    expect(appBar).toBeTruthy()
  })
})
