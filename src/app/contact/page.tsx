'use client'

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Alert,
} from '@mui/material'
import { useState } from 'react'
import { contactFormSchema, type ContactForm } from '@/schemas/validationSchemas'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

const ContactPage = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      contactFormSchema.parse(formData)
      setErrors({})
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 5000)
      // Here you would send the data to your API
      console.log('Form submitted:', formData)

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        phone: '',
      })
    } catch (error: any) {
      const validationErrors: Record<string, string> = {}
      error.errors?.forEach((err: any) => {
        validationErrors[err.path[0]] = err.message
      })
      setErrors(validationErrors)
    }
  }

  const handleChange =
    (field: keyof ContactForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [field]: e.target.value })
      if (errors[field]) {
        setErrors({ ...errors, [field]: '' })
      }
    }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Container maxWidth="md">
          <Typography variant="h4" component="h1" gutterBottom className="mb-6">
            Contact Us
          </Typography>

          {submitted && (
            <Alert severity="success" className="mb-4">
              Your message has been sent successfully!
            </Alert>
          )}

          <Card>
            <CardContent>
              <Box component="form" onSubmit={handleSubmit} className="space-y-4">
                <TextField
                  fullWidth
                  label="Name"
                  value={formData.name}
                  onChange={handleChange('name')}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Phone (Optional)"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Subject"
                  value={formData.subject}
                  onChange={handleChange('subject')}
                  error={!!errors.subject}
                  helperText={errors.subject}
                  required
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Message"
                  multiline
                  rows={6}
                  value={formData.message}
                  onChange={handleChange('message')}
                  error={!!errors.message}
                  helperText={errors.message}
                  required
                  margin="normal"
                />

                <Box className="flex justify-end mt-4">
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ textTransform: 'none' }}
                  >
                    Send Message
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default ContactPage
