# Cross River Task - Next.js with MSAL Authentication

A modern, production-ready Next.js application with Microsoft Authentication Library (MSAL) integration, Material UI components, TailwindCSS styling, TanStack Router for navigation, TanStack Query for data fetching, and Zod for validation.

## Features

- ✅ **MSAL Authentication** - Secure Microsoft Azure AD authentication
- ✅ **Next.js 14** - Latest Next.js with App Router
- ✅ **TypeScript** - Full TypeScript support
- ✅ **Material UI** - Beautiful, responsive UI components
- ✅ **TailwindCSS** - Utility-first CSS framework
- ✅ **TanStack Query** - Powerful async state management
- ✅ **Zod** - Schema validation for forms and data
- ✅ **Responsive Design** - Mobile-first, fully responsive layout
- ✅ **Protected Routes** - Secure route protection with MSAL
- ✅ **Microsoft Graph Integration** - Fetch user profile data

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.x or higher
- npm, yarn, or pnpm
- Azure AD application registration (for authentication)

## Azure AD Setup

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory** > **App registrations** > **New registration**
3. Register your application:
   - Name: `Cross River Task`
   - Supported account types: Choose based on your needs
   - Redirect URI: `http://localhost:3000` (for development)
4. After registration, note the **Application (client) ID** and **Directory (tenant) ID**
5. Go to **Authentication** and configure:
   - Add platform: **Single-page application**
   - Add redirect URI: `http://localhost:3000`
   - Enable **Access tokens** and **ID tokens**
6. Go to **API permissions** and add:
   - Microsoft Graph > Delegated permissions > `User.Read`

## Installation

1. Clone the repository or navigate to the project directory:
```bash
cd cross-river-task
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
cp .env.local.example .env.local
```

4. Edit `.env.local` and add your Azure AD credentials:
```env
NEXT_PUBLIC_AZURE_AD_CLIENT_ID=your-client-id-here
NEXT_PUBLIC_AZURE_AD_TENANT_ID=your-tenant-id-here
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000
NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI=http://localhost:3000
```

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
cross-river-task/
├── src/
│   ├── app/                      # Next.js app directory
│   │   ├── dashboard/           # Dashboard page
│   │   ├── profile/             # User profile page
│   │   ├── settings/            # Settings page
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   └── globals.css          # Global styles
│   ├── components/              # React components
│   │   ├── auth/               # Authentication components
│   │   │   └── ProtectedRoute.tsx
│   │   ├── layout/             # Layout components
│   │   │   └── DashboardLayout.tsx
│   │   └── providers/          # Context providers
│   │       ├── MsalAuthProvider.tsx
│   │       └── Providers.tsx
│   ├── config/                  # Configuration files
│   │   └── authConfig.ts       # MSAL configuration
│   ├── hooks/                   # Custom React hooks
│   │   └── useApi.ts           # API hooks with TanStack Query
│   └── schemas/                 # Zod validation schemas
│       └── validationSchemas.ts
├── .env.local.example          # Environment variables template
├── .gitignore                  # Git ignore file
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.ts          # TailwindCSS configuration
└── tsconfig.json               # TypeScript configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Authentication Flow

1. User visits the application
2. User clicks "Sign in with Microsoft"
3. Redirected to Microsoft login page
4. After successful authentication, redirected back to the app
5. MSAL stores tokens in session storage
6. Protected routes check authentication status
7. Authenticated API calls use access tokens automatically

## Key Components

### MsalAuthProvider
Wraps the application with MSAL context for authentication.

### ProtectedRoute
Higher-order component that protects routes requiring authentication.

### DashboardLayout
Responsive layout with navigation drawer and app bar.

### useApi Hooks
Custom hooks for authenticated API calls using TanStack Query:
- `useUserProfile()` - Fetch user profile from Microsoft Graph
- `useUserPhoto()` - Fetch user photo
- `useAuthenticatedQuery()` - Generic authenticated query
- `useAuthenticatedMutation()` - Generic authenticated mutation

## Validation

All forms use Zod schemas for validation:
- `userProfileSchema` - User profile data
- `loginFormSchema` - Login form
- `contactFormSchema` - Contact form
- `settingsFormSchema` - Settings form

## Styling

The project combines Material UI and TailwindCSS:
- Material UI provides component library
- TailwindCSS provides utility classes
- TailwindCSS preflight is disabled to avoid conflicts

## Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 600px
- Tablet: 600px - 960px
- Desktop: > 960px

Navigation drawer collapses to hamburger menu on mobile devices.

## Security Considerations

- Tokens stored in session storage (not localStorage)
- Protected routes redirect unauthenticated users
- MSAL handles token refresh automatically
- API calls include bearer tokens in headers
- CORS and CSP headers should be configured in production

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Update environment variables for production
3. Configure your hosting platform (Vercel, Azure, etc.)
4. Update Azure AD redirect URIs for production domain
5. Enable HTTPS in production

## Troubleshooting

### Authentication Issues
- Verify Azure AD credentials in `.env.local`
- Check redirect URIs match in Azure portal
- Clear browser cache and session storage
- Ensure API permissions are granted

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (18.x or higher)
- Clear `.next` directory and rebuild

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [MSAL.js Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [Material UI Documentation](https://mui.com/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Zod Documentation](https://zod.dev/)

## License

MIT

## Support

For issues and questions, please create an issue in the repository.
