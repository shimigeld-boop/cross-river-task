/**
 * Environment Variable Validation Module
 *
 * Validates required environment variables at build/runtime
 * to catch configuration issues early.
 *
 * @module env
 */

/** Required environment variable names */
const requiredEnvVars = [
  'NEXT_PUBLIC_AZURE_AD_CLIENT_ID',
  'NEXT_PUBLIC_AZURE_AD_TENANT_ID',
] as const

/**
 * Validates that all required environment variables are set
 * and not using placeholder values
 *
 * @returns {boolean} True if all environment variables are valid
 *
 * @example
 * ```ts
 * if (validateEnv()) {
 *   console.log('Environment configured correctly')
 * }
 * ```
 */
export const validateEnv = (): boolean => {
  const missing: string[] = []

  requiredEnvVars.forEach((envVar) => {
    const value = process.env[envVar]
    const isPlaceholder = value === 'YOUR_CLIENT_ID' || value === 'YOUR_TENANT_ID'

    if (!value || isPlaceholder) {
      missing.push(envVar)
    }
  })

  if (missing.length > 0) {
    console.warn(
      `⚠️  Missing or invalid environment variables:\n${missing.join('\n')}\n\nPlease configure your .env.local file. See QUICKSTART.md for details.`
    )
  }

  return missing.length === 0
}

/**
 * Validate environment variables on module import
 * Only runs on server-side (build time)
 */
if (typeof window === 'undefined') {
  validateEnv()
}
