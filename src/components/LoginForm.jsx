import { Alert, Button, CircularProgress, Stack, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { postApi } from '../lib/api.js'
import { useAppContext } from '../utils/AppContext.jsx'
import { useFormSubmit } from '../hooks/useFormSubmit.js'
import { useEffect } from 'react'

const LoginForm = () => {
    const navigate = useNavigate()
    const { user, setUser, setToken, setSessionExpired } = useAppContext()
    const { errors, generalError, loading, setLoading, handleFieldChange, handleError, resetErrors } = useFormSubmit()

    const handleSubmit = async (e) => {
        e.preventDefault()
        resetErrors()
        setLoading(true)

        const formData = new FormData(e.target)
        const payload = Object.fromEntries(formData.entries())

        try {
            const { data } = await postApi(`users/login`, payload)
            console.log('Login successful:', data)
            console.log('data.user:', data.user)
            const { username, eventsInvolved } = data.user
            setUser({ username, eventsInvolved })
            setToken(data.token)
            setSessionExpired(false)
            navigate('/dashboard')
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
                autoComplete="current-password"
                required
                fullWidth
                error={!!errors.password}
                helperText={errors.password}
                onChange={() => handleFieldChange('password')}
            />
            <Button type="submit" variant="contained" fullWidth disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Log in'}
            </Button>
        </Stack>
    )
}

export default LoginForm