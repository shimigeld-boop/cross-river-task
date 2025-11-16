'use client'

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactNode, useState } from 'react'

import { MsalAuthProvider } from './MsalAuthProvider'

/**
 * Material UI theme configuration
 * Customize colors, typography, and other design tokens here
 */
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
})

/**
 * Props for the Providers component
 * @interface ProvidersProps
 */
interface ProvidersProps {
  /** Child components to wrap with all providers */
  children: ReactNode
}

/**
 * Providers Component
 *
 * Wraps the application with all necessary providers:
 * - TanStack Query for data fetching and caching
 * - MSAL for authentication
 * - Material UI theme
 * - CSS baseline for consistent styling
 *
 * @component
 * @param {ProvidersProps} props - Component props
 * @returns {JSX.Element} Nested providers with children
 *
 * @example
 * ```tsx
 * <Providers>
 *   <App />
 * </Providers>
 * ```
 */
export const Providers = ({ children }: ProvidersProps) => {
  /**
   * Create a stable QueryClient instance
   * useState ensures the client is only created once
   */
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes (replaces cacheTime)
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <MsalAuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </MsalAuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
