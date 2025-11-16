# Project: Next.js with MSAL Authentication

## Tech Stack
- Next.js 14 with TypeScript
- MSAL (Microsoft Authentication Library) for Azure AD authentication
- Material UI v5 for components
- TailwindCSS v3 for styling
- TanStack Query v5 for data fetching and async state management
- Zod v3 for validation

## Project Structure
- `/src/app` - Next.js app directory with pages
- `/src/components` - Reusable React components
- `/src/config` - Configuration files (MSAL auth config)
- `/src/hooks` - Custom React hooks for API calls
- `/src/schemas` - Zod validation schemas
- `/src/types` - TypeScript type definitions

## Key Features
- ✅ Microsoft Azure AD authentication with MSAL
- ✅ Protected routes with authentication checks
- ✅ Responsive dashboard layout with Material UI
- ✅ Microsoft Graph API integration
- ✅ Form validation with Zod
- ✅ Data fetching with TanStack Query
- ✅ Responsive design with TailwindCSS

## Development Status
✅ Project fully initialized and configured
✅ All dependencies installed
✅ Build successful (verified)
✅ All core features implemented

## Quick Start
See QUICKSTART.md for setup instructions and Azure AD configuration.

## Important Notes
- Azure AD credentials must be configured in `.env.local`
- TailwindCSS preflight is disabled to avoid conflicts with Material UI
- All forms use Zod schemas for validation
- API calls are authenticated via MSAL tokens

