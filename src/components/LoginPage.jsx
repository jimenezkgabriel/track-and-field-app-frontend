import { Alert, Box, Card, CardContent, Container, Link, Stack, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppContext } from '../utils/AppContext.jsx'
import LoginForm from './LoginForm.jsx'

const LoginPage = () => {
  const location = useLocation()
  const [showAlert, setShowAlert] = useState(false)
  const { sessionExpired } = useAppContext()

  useEffect(() => {
    if (location.state?.registered) {
      setShowAlert(true)
    }
  }, [location])

  return (
    <Box
      sx={{
        display: 'grid',
        placeItems: 'center',
        bgcolor: 'background.default',
        p: 2,
        flex: 1,
      }}
    >
      <Container maxWidth="xs">
        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              {sessionExpired && (
                <Alert severity="info">
                  Session expired or you are logged out. Please sign in.
                </Alert>
              )}
              {showAlert && (
                <Alert severity="success" onClose={() => setShowAlert(false)}>
                  Account created successfully! Please sign in.
                </Alert>
              )}
              <Typography variant="h5">Sign in</Typography>
              <LoginForm />
              <Typography variant="body2" sx={{ textAlign: 'center' }}>
                Don't have an account?{' '}
                <Link
                  href="/register"
                  underline="hover"
                  sx={{ cursor: 'pointer', fontWeight: 600 }}
                >
                  Create one
                </Link>
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default LoginPage
