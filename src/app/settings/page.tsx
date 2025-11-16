'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import {
  Container,
  Typography,
  Card,
  CardContent,
  FormGroup,
  FormControlLabel,
  Switch,
  Button,
  TextField,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material'
import { useState } from 'react'
import { settingsFormSchema, type SettingsForm } from '@/schemas/validationSchemas'
import { useMsal } from '@azure/msal-react'

const SettingsPage = () => {
  const { accounts } = useMsal()
  const [settings, setSettings] = useState<SettingsForm>({
    displayName: accounts[0]?.name || '',
    email: accounts[0]?.username || '',
    notifications: {
      email: true,
      push: false,
      sms: false,
    },
    theme: 'light',
    language: 'en',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    try {
      settingsFormSchema.parse(settings)
      setErrors({})
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      // Here you would typically save to an API
      console.log('Settings saved:', settings)
    } catch (error: any) {
      const validationErrors: Record<string, string> = {}
      error.errors?.forEach((err: any) => {
        validationErrors[err.path[0]] = err.message
      })
      setErrors(validationErrors)
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Container maxWidth="md">
          <Typography variant="h4" component="h1" gutterBottom className="mb-6">
            Settings
          </Typography>

          {saved && (
            <Alert severity="success" className="mb-4">
              Settings saved successfully!
            </Alert>
          )}

          <Card className="mb-4">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Profile Settings
              </Typography>
              <Box className="space-y-4">
                <TextField
                  fullWidth
                  label="Display Name"
                  value={settings.displayName}
                  onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
                  error={!!errors.displayName}
                  helperText={errors.displayName}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  error={!!errors.email}
                  helperText={errors.email}
                  margin="normal"
                />
              </Box>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notification Preferences
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.email}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            email: e.target.checked,
                          },
                        })
                      }
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.push}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            push: e.target.checked,
                          },
                        })
                      }
                    />
                  }
                  label="Push Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.sms}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            sms: e.target.checked,
                          },
                        })
                      }
                    />
                  }
                  label="SMS Notifications"
                />
              </FormGroup>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Appearance
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel>Theme</InputLabel>
                <Select
                  value={settings.theme}
                  label="Theme"
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      theme: e.target.value as 'light' | 'dark' | 'auto',
                    })
                  }
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                  <MenuItem value="auto">Auto</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Language</InputLabel>
                <Select
                  value={settings.language}
                  label="Language"
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Spanish</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                  <MenuItem value="de">German</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>

          <Box className="flex justify-end">
            <Button
              variant="contained"
              size="large"
              onClick={handleSave}
              sx={{ textTransform: 'none' }}
            >
              Save Settings
            </Button>
          </Box>
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default SettingsPage
