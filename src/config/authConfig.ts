import { Configuration, LogLevel } from '@azure/msal-browser'

import './env' // Validate environment variables

/**
 * MSAL (Microsoft Authentication Library) Configuration
 *
 * Configures authentication settings for Azure AD integration.
 * Environment variables must be set in .env.local file.
 *
 * @see {@link https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-js-initializing-client-applications}
 */
export const msalConfig: Configuration = {
  auth: {
    /** Azure AD Application (client) ID */
    clientId: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID || 'YOUR_CLIENT_ID',
    /** Azure AD authority URL with tenant ID */
    authority: `https://login.microsoftonline.com/${
      process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID || 'YOUR_TENANT_ID'
    }`,
    /** URI to redirect to after login */
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000',
    /** URI to redirect to after logout */
    postLogoutRedirectUri:
      process.env.NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI || 'http://localhost:3000',
  },
  cache: {
    /** Store tokens in session storage for security */
    cacheLocation: 'sessionStorage',
    /** Don't store auth state in cookies (not needed for SPA) */
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      /**
       * Custom logger callback for MSAL events
       * @param level - Log level (Error, Info, Verbose, Warning)
       * @param message - Log message
       * @param containsPii - Whether message contains personally identifiable information
       */
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message)
            return
          case LogLevel.Info:
            console.info(message)
            return
          case LogLevel.Verbose:
            console.debug(message)
            return
          case LogLevel.Warning:
            console.warn(message)
            return
          default:
            return
        }
      },
    },
  },
}

/**
 * Default login request configuration
 * Specifies scopes required for authentication
 */
export const loginRequest = {
  scopes: ['User.Read'],
}

/**
 * Microsoft Graph API configuration
 * Contains endpoints for Graph API requests
 */
export const graphConfig = {
  /** Endpoint to fetch current user's profile */
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
}
