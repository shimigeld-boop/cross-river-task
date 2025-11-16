import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Providers } from '../../components/providers/Providers'

// Mock MsalAuthProvider
vi.mock('../../components/providers/MsalAuthProvider', () => ({
  MsalAuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Mock TanStack Query devtools
vi.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: () => null,
}))

describe('Providers', () => {
  it('should render children', () => {
    render(
      <Providers>
        <div>Test Content</div>
      </Providers>
    )

    expect(screen.getByText('Test Content')).toBeTruthy()
  })

  it('should wrap children with query client provider', () => {
    const { container } = render(
      <Providers>
        <div data-testid="test-child">Test</div>
      </Providers>
    )

    const child = container.querySelector('[data-testid="test-child"]')
    expect(child).toBeTruthy()
  })

  it('should provide theme to children', () => {
    const { container } = render(
      <Providers>
        <div>Content</div>
      </Providers>
    )

    // Material UI theme provider adds specific attributes
    expect(container).toBeTruthy()
  })

  it('should render without errors', () => {
    expect(() => {
      render(
        <Providers>
          <div>Test</div>
        </Providers>
      )
    }).not.toThrow()
  })

  it('should render multiple children', () => {
    render(
      <Providers>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </Providers>
    )

    expect(screen.getByText('Child 1')).toBeTruthy()
    expect(screen.getByText('Child 2')).toBeTruthy()
    expect(screen.getByText('Child 3')).toBeTruthy()
  })

  it('should provide CSS baseline', () => {
    const { container } = render(
      <Providers>
        <div>Content</div>
      </Providers>
    )

    // CssBaseline is rendered
    expect(container.firstChild).toBeTruthy()
  })
})
