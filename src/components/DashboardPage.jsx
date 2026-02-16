import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    Grid,
    Paper,
    Stack,
    Typography,
    Checkbox,
    CircularProgress,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppContext } from '../utils/AppContext.jsx'
import { putApi } from '../lib/api.js'
import Weather from './Weather.jsx'

const DashboardPage = () => {
    const navigate = useNavigate()
    const { user, setUser, token } = useAppContext()
    const events = user?.eventsInvolved ?? []
    const [eventDialogOpen, setEventDialogOpen] = useState(false)
    const [selectedEvents, setSelectedEvents] = useState([])
    const [isSavingEvents, setIsSavingEvents] = useState(false)
    const eventLabelMap = {
        '100 meter sprint': '100 Meter Sprint',
        'long jump': 'Long Jump',
        'javelin toss': 'Javelin Toss',
    }
    const eventOptions = [
        { value: '100 meter sprint', label: '100 Meter Sprint' },
        { value: 'long jump', label: 'Long Jump' },
        { value: 'javelin toss', label: 'Javelin Toss' },
    ]
    const accountSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString()
        : 'Unknown'

    const normalizeEventLabel = (event, index) => {
        const rawLabel = typeof event === 'string' ? event : event?.name ?? `Event ${index + 1}`
        const normalized = rawLabel.toLowerCase()
        const mappedLabel = eventLabelMap[normalized] ?? rawLabel

        return mappedLabel.toLowerCase()
    }

    const involvedEventSet = useMemo(() => {
        const normalized = events.map((event, index) => normalizeEventLabel(event, index))

        return new Set(normalized)
    }, [events])

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
            navigate('/long-jump')
        }
    }

    const handleEventDialogOpen = () => {
        setSelectedEvents(eventOptions
            .map((option) => (involvedEventSet.has(option.value) ? option.value : null))
            .filter(Boolean))
        setEventDialogOpen(true)
    }

    const handleEventDialogClose = () => {
        setEventDialogOpen(false)
    }

    const handleEventToggle = (value) => {
        setSelectedEvents((prev) => (
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        ))
    }

    const handleEventsSave = async () => {
        try {
            setIsSavingEvents(true)
            await putApi('users/events', { eventsInvolved: selectedEvents }, token)
            setUser((prev) => (prev ? { ...prev, eventsInvolved: selectedEvents } : prev))
            setEventDialogOpen(false)
        } finally {
            setIsSavingEvents(false)
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
                                onClick={handleEventDialogOpen}
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

            <Dialog
                open={eventDialogOpen}
                onClose={handleEventDialogClose}
                maxWidth="xs"
                fullWidth
                slotProps={{
                    Paper: {
                        sx: { borderRadius: 2 },
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 600 }}>Choose your events</DialogTitle>
                <DialogContent sx={{ pt: 1 }}>
                    <FormGroup>
                        {eventOptions.map((option) => (
                            <FormControlLabel
                                key={option.value}
                                control={(
                                    <Checkbox
                                        checked={selectedEvents.includes(option.value)}
                                        onChange={() => handleEventToggle(option.value)}
                                    />
                                )}
                                label={option.label}
                            />
                        ))}
                    </FormGroup>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleEventDialogClose} variant="text" disabled={isSavingEvents}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleEventsSave}
                        variant="contained"
                        disabled={isSavingEvents}
                        startIcon={isSavingEvents ? <CircularProgress size={18} color="inherit" /> : null}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default DashboardPage
