import { Alert, Button, CircularProgress, Stack, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { postApi } from '../lib/api.js'
import { useFormSubmit } from '../hooks/useFormSubmit.js'

const RegisterForm = () => {
    const navigate = useNavigate()
    const { errors, generalError, loading, setLoading, handleFieldChange, handleError, resetErrors } = useFormSubmit()

    const handleSubmit = async (e) => {
        e.preventDefault()
        resetErrors()
        setLoading(true)

        const formData = new FormData(e.target)
        const payload = Object.fromEntries(formData.entries())

        try {
            const { data } = await postApi(`users/register`, payload)
            console.log('Registration successful:', data)
            navigate('/', { state: { registered: true } })
        } catch (error) {
            handleError(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
            {generalError && <Alert severity="error">{generalError}</Alert>}
            <TextField
                label="Username"
                type="text"
                id="username"
                name="username"
                required
                fullWidth
                error={!!errors.username}
                helperText={errors.username}
                onChange={() => handleFieldChange('username')}
            />
            <TextField
                label="Email"
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                required
                fullWidth
                error={!!errors.email}
                helperText={errors.email}
                onChange={() => handleFieldChange('email')}
            />
            <TextField
                label="Password"
                type="password"
                id="password"
                name="password"
                autoComplete="new-password"
                required
                fullWidth
                error={!!errors.password}
                helperText={errors.password}
                onChange={() => handleFieldChange('password')}
            />
            <Button type="submit" variant="contained" fullWidth disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
            </Button>
        </Stack>
    )
}

export default RegisterForm