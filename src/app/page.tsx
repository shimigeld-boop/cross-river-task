'use client'

import { Box, Container, Typography, Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useMsal } from '@azure/msal-react'
import { useEffect } from 'react'

const HomePage = () => {
  const router = useRouter()
  const { instance, accounts } = useMsal()

  useEffect(() => {
    if (accounts.length > 0) {
      router.push('/dashboard')
    }
  }, [accounts, router])

  const handleLogin = async () => {
    try {
      await instance.loginRedirect({
        scopes: ['user.read'],
      })
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <Container maxWidth="lg">
      <Box className="flex flex-col items-center justify-center min-h-screen" sx={{ py: 4 }}>
        <Typography
          variant="h2"
          component="h1"
          className="mb-8 text-center"
          sx={{ fontWeight: 700 }}
        >
          Welcome to Cross River Task
        </Typography>
        <Typography variant="h6" className="mb-8 text-center text-gray-600" sx={{ maxWidth: 600 }}>
          A modern Next.js application with MSAL authentication, Material UI, TailwindCSS, TanStack
          Router, and TanStack Query
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleLogin}
          className="px-8 py-3"
          sx={{
            textTransform: 'none',
            fontSize: '1.125rem',
          }}
        >
          Sign in with Microsoft
        </Button>
      </Box>
    </Container>
  )
}

export default HomePage
