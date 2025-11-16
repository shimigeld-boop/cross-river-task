'use client'

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Box, Button, Paper, Typography } from '@mui/material'
import { Component, ReactNode } from 'react'

/**
 * Props for the ErrorBoundary component
 * @interface Props
 */
interface Props {
  /** Child components to wrap with error boundary */
  children: ReactNode
}

/**
 * State for the ErrorBoundary component
 * @interface State
 */
interface State {
  /** Whether an error has been caught */
  hasError: boolean
  /** The caught error object (if any) */
  error?: Error
}

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 *
 * This is a class component because React Error Boundaries must be class components.
 *
 * @component
 * @see {@link https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary}
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  /**
   * Initializes the error boundary with default state
   * @param {Props} props - Component props
   */
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  /**
   * Updates state when an error is caught
   * This lifecycle method is called after an error is thrown
   *
   * @param {Error} error - The error that was thrown
   * @returns {State} New state with error information
   */
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  /**
   * Logs error information to console
   * Can be extended to send errors to an error reporting service
   *
   * @param {Error} error - The error that was thrown
   * @param {React.ErrorInfo} errorInfo - Information about component stack
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    // TODO: Send to error reporting service (e.g., Sentry)
  }

  /**
   * Resets the error state and redirects to home page
   */
  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
    window.location.href = '/'
  }

  /**
   * Renders either the error UI or the children
   * @returns {ReactNode} Error UI or children components
   */
  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            p: 3,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: 500,
              textAlign: 'center',
            }}
          >
            <ErrorOutlineIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Oops! Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Typography>
            <Button variant="contained" onClick={this.handleReset} sx={{ textTransform: 'none' }}>
              Return to Home
            </Button>
          </Paper>
        </Box>
      )
    }

    return this.props.children
  }
}
