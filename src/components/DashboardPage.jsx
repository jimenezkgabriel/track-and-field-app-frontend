import { Box, Button, Container, Grid, Paper, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import { useAppContext } from '../utils/AppContext.jsx'
import Weather from './Weather.jsx'

const DashboardPage = () => {
    const navigate = useNavigate()
    const { user } = useAppContext()
    const events = user?.eventsInvolved ?? []
    const eventLabelMap = {
        '100m': '100 Meter Sprint',
        'long jump': 'Long Jump',
        'javelin toss': 'Javelin Toss',
    }
    const accountSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString()
        : 'Unknown'

    const getEventLabel = (event, index) => {
        const rawLabel = typeof event === 'string' ? event : event?.name ?? `Event ${index + 1}`
        const normalized = rawLabel.toLowerCase()

        return eventLabelMap[normalized] ?? rawLabel
    }

    const handleEventClick = (label) => {
        if (label === '100 Meter Sprint') {
            navigate('/hundred-meter')
        }
        if (label === 'Javelin Toss') {
            navigate('/javelin-toss')
        }
        if (label === 'Long Jump') {
            // navigate('/long-jump')
            alert('Long Jump page coming soon!')
        }
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Weather />

            <Container maxWidth="lg" sx={{ py: { xs: 2, md: 3 } }}>
                <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 2.5 }}>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Paper elevation={12} sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 8 }}>
                            <Stack spacing={1}>
                                <Typography variant="h6">Welcome, {user?.username ?? 'Athlete'}</Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontStyle: 'italic' }}
                                >
                                    Account since {accountSince}
                                </Typography>
                            </Stack>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 9 }}>
                        <Stack
                            direction="row"
                            spacing={1}
                            useFlexGap
                            flexWrap="wrap"
                            alignItems="center"
                            justifyContent={{ xs: 'center', md: 'flex-start' }}
                            sx={{ height: '100%' }}
                        >
                            {events.map((event, index) => {
                                const label = getEventLabel(event, index)

                                return (
                                    <Button
                                        key={`${label}-${index}`}
                                        variant="contained"
                                        onClick={() => handleEventClick(label)}
                                        sx={{
                                            width: 88,
                                            height: 88,
                                            borderRadius: '50%',
                                            p: 0,
                                            fontSize: '0.9rem',
                                            textTransform: 'none',
                                        }}
                                    >
                                        {label}
                                    </Button>
                                )
                            })
                            }
                            <Button
                                aria-label="Add event"
                                variant="outlined"
                                sx={{
                                    width: 88,
                                    height: 88,
                                    borderRadius: '50%',
                                    borderWidth: 3,
                                    p: 0,
                                    fontSize: '2rem',
                                    lineHeight: 1
                                }}
                            >
                                +
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>

                <Stack spacing={2} sx={{ mb: 3 }}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate('/javelin-toss')}
                        sx={{ alignSelf: 'flex-start' }}
                    >
                        [DEV] Go to Javelin Toss
                    </Button>
                </Stack>

                <Grid container spacing={{ xs: 2, md: 3 }}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Paper elevation={12} sx={{ p: { xs: 2, md: 2.5 }, minHeight: 240, borderRadius: 8 }}>
                            <Typography variant="subtitle1">Progress report charts placeholder</Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper elevation={12} sx={{ p: { xs: 2, md: 2.5 }, minHeight: 240, borderRadius: 8 }}>
                            <Typography variant="subtitle1">Upcoming events placeholder</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default DashboardPage
