import { Box, Container, Typography } from '@mui/material'
import { useAppContext } from '../utils/AppContext.jsx'

const DashboardPage = () => {
    const { token, user } = useAppContext()

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: 'background.default',
                p: 4,
                flex: 1,
            }}
        >
            <Container maxWidth="md">
                <Typography variant="h1" sx={{ mb: 4, fontSize: { xs: '2rem', md: '3rem' } }}>
                    {token || 'No token available'}
                </Typography>
                <Typography variant="h4">
                    <ul>
                    {user?.eventsInvolved.includes('100m') && <li>100m Dash</li>}
                    </ul>
                </Typography>
            </Container>
        </Box>
    )
}

export default DashboardPage
