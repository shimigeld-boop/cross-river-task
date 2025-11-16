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
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactFormSchema, type ContactForm } from '@/schemas/validationSchemas'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      phone: '',
    },
  })

  const onSubmit = (data: ContactForm) => {
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
    // Here you would send the data to your API
    console.log('Form submitted:', data)
    reset()
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
              <Box component="form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <TextField
                  fullWidth
                  label="Name"
                  {...register('name')}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  required
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  required
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Phone (Optional)"
                  {...register('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Subject"
                  {...register('subject')}
                  error={!!errors.subject}
                  helperText={errors.subject?.message}
                  required
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Message"
                  multiline
                  rows={6}
                  {...register('message')}
                  error={!!errors.message}
                  helperText={errors.message?.message}
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
