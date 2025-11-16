'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Container, Grid, Paper, Typography, Card, CardContent, Box, Skeleton } from '@mui/material'
import { useMsal } from '@azure/msal-react'
import { useQuery } from '@tanstack/react-query'
import { graphConfig } from '@/config/authConfig'
import axios from 'axios'

interface UserProfile {
  displayName: string
  mail: string
  jobTitle: string
  officeLocation: string
}

const fetchUserProfile = async (accessToken: string): Promise<UserProfile> => {
  const response = await axios.get<UserProfile>(graphConfig.graphMeEndpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return response.data
}

const DashboardPage = () => {
  const { instance, accounts } = useMsal()

  const {
    data: userProfile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      if (!accounts[0]) {
        throw new Error('No account found')
      }
      const account = accounts[0]
      const response = await instance.acquireTokenSilent({
        scopes: ['User.Read'],
        account,
      })
      return fetchUserProfile(response.accessToken)
    },
    enabled: accounts.length > 0,
  })

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h1" gutterBottom className="mb-6">
            Dashboard
          </Typography>

          {error && (
            <Box sx={{ mb: 3 }}>
              <Typography color="error">
                Error loading profile: {(error as Error).message}
              </Typography>
            </Box>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <Card className="h-full">
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Welcome
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {isLoading ? (
                      <Skeleton width="60%" />
                    ) : (
                      userProfile?.displayName || accounts[0]?.name
                    )}
                  </Typography>
                  <Typography color="textSecondary">
                    {isLoading ? <Skeleton width="40%" /> : userProfile?.jobTitle || 'User'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <Card className="h-full">
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Email
                  </Typography>
                  <Typography variant="h6" component="h2">
                    {isLoading ? (
                      <Skeleton width="80%" />
                    ) : (
                      userProfile?.mail || accounts[0]?.username || 'N/A'
                    )}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <Card className="h-full">
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Office Location
                  </Typography>
                  <Typography variant="h6" component="h2">
                    {isLoading ? <Skeleton width="50%" /> : userProfile?.officeLocation || 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Paper className="p-6">
                <Typography variant="h6" gutterBottom>
                  Quick Stats
                </Typography>
                <Box className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <Box className="text-center">
                    <Typography variant="h4" color="primary">
                      12
                    </Typography>
                    <Typography color="textSecondary">Active Projects</Typography>
                  </Box>
                  <Box className="text-center">
                    <Typography variant="h4" color="primary">
                      48
                    </Typography>
                    <Typography color="textSecondary">Tasks Completed</Typography>
                  </Box>
                  <Box className="text-center">
                    <Typography variant="h4" color="primary">
                      95%
                    </Typography>
                    <Typography color="textSecondary">Success Rate</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default DashboardPage
