# Quick Start Guide

## Prerequisites Setup

### 1. Azure AD Application Registration

Before running this application, you need to register it in Azure AD:

1. **Go to Azure Portal**
   - Visit https://portal.azure.com/
   - Sign in with your Microsoft account

2. **Register Application**
   - Navigate to: Azure Active Directory → App registrations → New registration
   - Application name: `Cross River Task` (or your preferred name)
   - Supported account types: Select based on your needs
     - Single tenant: Your organization only
     - Multi-tenant: Any Azure AD directory
     - Personal Microsoft accounts: Include consumer accounts
   - Redirect URI: 
     - Type: Single-page application (SPA)
     - URI: `http://localhost:3000`
   - Click **Register**

3. **Copy Credentials**
   - After registration, copy these values from the Overview page:
     - **Application (client) ID**
     - **Directory (tenant) ID**

4. **Configure Authentication**
   - Go to: Authentication
   - Under "Implicit grant and hybrid flows", enable:
     - ✅ Access tokens
     - ✅ ID tokens
   - Under "Supported account types", verify your selection
   - Click **Save**

5. **Set API Permissions**
   - Go to: API permissions
   - Click "Add a permission"
   - Select: Microsoft Graph
   - Select: Delegated permissions
   - Add: `User.Read` (Sign in and read user profile)
   - Click "Add permissions"
   - (Optional) Click "Grant admin consent" if you have admin rights

## Application Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Azure AD credentials:

```env
NEXT_PUBLIC_AZURE_AD_CLIENT_ID=your-application-client-id-here
NEXT_PUBLIC_AZURE_AD_TENANT_ID=your-directory-tenant-id-here
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000
NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI=http://localhost:3000
```

**Important:** Replace the placeholder values with your actual Azure AD credentials!

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## First Login

1. Click **"Sign in with Microsoft"** on the home page
2. You'll be redirected to Microsoft's login page
3. Sign in with your Microsoft account (the one associated with your Azure AD)
4. Approve the requested permissions (User.Read)
5. You'll be redirected back to the dashboard

## Testing the Application

### Pages to Explore

- **Dashboard** (`/dashboard`) - Overview with user stats
- **Profile** (`/profile`) - View your Microsoft profile information
- **Contact** (`/contact`) - Form with Zod validation
- **Settings** (`/settings`) - User preferences with validation

### Features to Test

1. **Authentication Flow**
   - Sign in / Sign out
   - Protected routes (try accessing `/dashboard` without login)
   - Token refresh (automatic)

2. **Data Fetching**
   - User profile from Microsoft Graph API
   - TanStack Query caching
   - Loading states

3. **Form Validation**
   - Contact form with Zod validation
   - Settings form with Zod validation
   - Error messages

4. **Responsive Design**
   - Resize browser window
   - Mobile navigation drawer
   - Tablet/desktop layouts

## Troubleshooting

### "Login failed" or redirect issues
- Verify Azure AD credentials in `.env.local`
- Check redirect URI matches in Azure portal
- Clear browser cache and session storage
- Ensure you're using the correct tenant ID

### "Cannot read user profile"
- Verify `User.Read` permission is granted
- Check if admin consent is required
- Try signing out and signing in again

### Build errors
- Run `npm install` to ensure dependencies are installed
- Delete `.next` folder and rebuild
- Check Node.js version (18.x or higher)

### TypeScript errors in IDE
- Restart TypeScript server in VS Code
- Run `npm run build` to verify (it should succeed)
- Check that all dependencies are installed

## Production Deployment

### 1. Update Azure AD Configuration

Add production redirect URIs to your Azure AD app:
- `https://your-domain.com`
- `https://your-domain.com/dashboard`

### 2. Update Environment Variables

Create production environment variables:

```env
NEXT_PUBLIC_AZURE_AD_CLIENT_ID=your-client-id
NEXT_PUBLIC_AZURE_AD_TENANT_ID=your-tenant-id
NEXT_PUBLIC_REDIRECT_URI=https://your-domain.com
NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI=https://your-domain.com
```

### 3. Build and Deploy

```bash
npm run build
npm run start
```

Or deploy to platforms like:
- Vercel (recommended for Next.js)
- Azure Static Web Apps
- Netlify
- AWS Amplify

## Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review [MSAL.js documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- Check [Next.js documentation](https://nextjs.org/docs)

## Next Steps

- Customize the theme in `src/components/providers/Providers.tsx`
- Add more API endpoints in `src/hooks/useApi.ts`
- Create custom validation schemas in `src/schemas/validationSchemas.ts`
- Add more pages and routes
- Integrate with your backend API
