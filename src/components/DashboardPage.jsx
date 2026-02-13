import { Box, Button, Container, Grid, Paper, Stack, Typography } from '@mui/material'

import { useAppContext } from '../utils/AppContext.jsx'

const DashboardPage = () => {
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

    return (
        <Box sx={{ width: '100%' }}>
            <Box
                sx={{
                    width: '100%',
                    borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                    backgroundColor: 'background.paper',
                }}
            >
                <Container maxWidth={false} sx={{ py: 1.5 }}>
                    <Typography variant="body2" color="text.secondary">
                        Weather API placeholder
                    </Typography>
                </Container>
            </Box>

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
                            {events.length > 0
                                ? events.map((event, index) => {
                                    const label = getEventLabel(event, index)

                                    return (
                                        <Button
                                            key={`${label}-${index}`}
                                            variant="contained"
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
                                : (
                                    <Typography variant="body2" color="text.secondary">
                                        Add event buttons here
                                    </Typography>
                                )}
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
