'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import { useMsal } from '@azure/msal-react'
import { useQuery } from '@tanstack/react-query'
import { graphConfig } from '@/config/authConfig'
import axios from 'axios'

interface UserProfile {
  displayName: string
  mail: string
  jobTitle: string
  officeLocation: string
  mobilePhone: string
  businessPhones: string[]
  id: string
}

const fetchUserProfile = async (accessToken: string): Promise<UserProfile> => {
  const response = await axios.get<UserProfile>(graphConfig.graphMeEndpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return response.data
}

const ProfilePage = () => {
  const { instance, accounts } = useMsal()

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
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
            Profile
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box className="flex flex-col items-center">
                    <Avatar sx={{ width: 120, height: 120, mb: 2 }} className="mb-4">
                      {userProfile?.displayName?.charAt(0) || 'U'}
                    </Avatar>
                    <Typography variant="h5" gutterBottom>
                      {isLoading ? 'Loading...' : userProfile?.displayName || 'User'}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {userProfile?.jobTitle || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {userProfile?.officeLocation || 'N/A'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Contact Information
                  </Typography>
                  <Divider className="mb-4" />
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Email"
                        secondary={userProfile?.mail || accounts[0]?.username || 'N/A'}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Mobile Phone"
                        secondary={userProfile?.mobilePhone || 'N/A'}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary="Business Phone"
                        secondary={userProfile?.businessPhones?.[0] || 'N/A'}
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText primary="User ID" secondary={userProfile?.id || 'N/A'} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default ProfilePage
