import { Box, Card, CardContent, Container, Link, Stack, Typography } from '@mui/material'
import RegisterForm from './RegisterForm.jsx'

const RegisterPage = () => {
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
                            <Typography variant="h5">Create Account</Typography>
                            <RegisterForm />
                            <Typography variant="body2" sx={{ textAlign: 'center' }}>
                                Already have an account?{' '}
                                <Link
                                    href="/"
                                    underline="hover"
                                    sx={{ cursor: 'pointer', fontWeight: 600 }}
                                >
                                    Sign in
                                </Link>
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    )
}

export default RegisterPage
