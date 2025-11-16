'use client'

import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { Box, CircularProgress } from '@mui/material'
import { ReactNode, useEffect } from 'react'

/**
 * Props for the ProtectedRoute component
 * @interface ProtectedRouteProps
 */
interface ProtectedRouteProps {
  /** Child components to render when authenticated */
  children: ReactNode
}

/**
 * ProtectedRoute Component
 *
 * Wraps components that require authentication.
 * Redirects unauthenticated users to Microsoft login.
 * Shows a loading spinner while checking authentication status.
 *
 * @component
 * @param {ProtectedRouteProps} props - Component props
 * @returns {JSX.Element} Protected content or loading spinner
 *
 * @example
 * ```tsx
 * <ProtectedRoute>
 *   <DashboardPage />
 * </ProtectedRoute>
 * ```
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useIsAuthenticated()
  const { instance } = useMsal()

  useEffect(() => {
    if (!isAuthenticated) {
      instance.loginRedirect({
        scopes: ['user.read'],
      })
    }
  }, [isAuthenticated, instance])

  if (!isAuthenticated) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  return <>{children}</>
}
