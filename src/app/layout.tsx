import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers/Providers'
import { ErrorBoundary } from '@/components/error/ErrorBoundary'

export const metadata: Metadata = {
  title: 'Cross River Task',
  description: 'Next.js app with MSAL authentication',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}

export default RootLayout
