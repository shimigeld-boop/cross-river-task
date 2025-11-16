'use client'

import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { ReactNode, useEffect, useState } from 'react'

import { msalConfig } from '@/config/authConfig'

/** MSAL instance for authentication */
const msalInstance = new PublicClientApplication(msalConfig)

/**
 * Props for the MsalAuthProvider component
 * @interface MsalAuthProviderProps
 */
interface MsalAuthProviderProps {
  /** Child components to wrap with MSAL context */
  children: ReactNode
}

/**
 * MSAL Authentication Provider Component
 *
 * Initializes and provides MSAL (Microsoft Authentication Library) context
 * to the entire application. Must be initialized before rendering children.
 *
 * @component
 * @param {MsalAuthProviderProps} props - Component props
 * @returns {JSX.Element} MSAL provider with children or loading state
 *
 * @example
 * ```tsx
 * <MsalAuthProvider>
 *   <App />
 * </MsalAuthProvider>
 * ```
 */
export const MsalAuthProvider = ({ children }: MsalAuthProviderProps) => {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    /**
     * Initialize MSAL instance
     * Required before any authentication operations
     */
    const initializeMsal = async () => {
      await msalInstance.initialize()
      setIsInitialized(true)
    }

    initializeMsal()
  }, [])

  if (!isInitialized) {
    return <div>Loading authentication...</div>
  }

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>
}
