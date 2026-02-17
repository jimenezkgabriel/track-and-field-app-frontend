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
    Alert,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LineChart } from '@mui/x-charts/LineChart'

import { useAppContext } from '../utils/AppContext.jsx'
import { postApi, putApi, getApi, deleteApi } from '../lib/api.js'
import { useEvents } from '../hooks/useEvents.js'
import Weather from './Weather.jsx'
import EventList from './EventList.jsx'
import DateForm from './DateForm.jsx'
import DateList from './DateList.jsx'

const DashboardPage = () => {
    const navigate = useNavigate()
    const { user, setUser, token } = useAppContext()
    const events = user?.eventsInvolved ?? []
    const {
        events: hundredMeterEvents,
        loading: hundredMeterLoading,
    } = useEvents('/hundred-meter/')
    const {
        events: longJumpEvents,
        loading: longJumpLoading,
    } = useEvents('/long-jump/')
    const {
        events: javelinEvents,
        loading: javelinLoading,
    } = useEvents('/javelin-toss/')
    const {
        events: upcomingEvents,
        loading: upcomingEventsLoading,
        refetch: refetchUpcomingEvents,
    } = useEvents('/calendars/')
    const [eventDialogOpen, setEventDialogOpen] = useState(false)
    const [datePickerOpen, setDatePickerOpen] = useState(false)
    const [selectedEvents, setSelectedEvents] = useState([])
    const [isSavingEvents, setIsSavingEvents] = useState(false)
    const [eventsError, setEventsError] = useState('')
    const [upcomingEventsError, setUpcomingEventsError] = useState('')
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

    const buildChartDataset = (records) => {
        return records
            .map((record) => {
                const dateValue = record?.updatedAt ?? record?.createdAt
                const value = Number(record?.record)

                return {
                    date: dateValue ? new Date(dateValue) : null,
                    value: Number.isFinite(value) ? value : null,
                }
            })
            .filter((item) => item.date && Number.isFinite(item.value))
            .sort((a, b) => a.date - b.date)
    }

    const hundredMeterDataset = useMemo(
        () => buildChartDataset(hundredMeterEvents),
        [hundredMeterEvents]
    )
    const longJumpDataset = useMemo(
        () => buildChartDataset(longJumpEvents),
        [longJumpEvents]
    )
    const javelinDataset = useMemo(
        () => buildChartDataset(javelinEvents),
        [javelinEvents]
    )

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
    const showHundredMeter = involvedEventSet.has('100 meter sprint')
    const showLongJump = involvedEventSet.has('long jump')
    const showJavelinToss = involvedEventSet.has('javelin toss')

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
        setEventsError('')
        setEventDialogOpen(true)
    }

    const handleEventDialogClose = () => {
        setEventDialogOpen(false)
        setEventsError('')
    }

    const handleDatePickerSubmit = async (payload) => {
        try {
            const response = await postApi('calendars/create', payload, token);
            console.log('Event created successfully:', response.data);
            await refetchUpcomingEvents();
        } catch (error) {
            console.error('Error creating event:', error)
            setUpcomingEventsError('Error creating event. Please try again.')
            throw error
        }
    }

    const handleDatePickerEdit = async (eventId, payload) => {
        try {
            const response = await putApi(`calendars/update/${eventId}`, payload, token);
            console.log('Event updated successfully:', response.data);
            await refetchUpcomingEvents();
        } catch (error) {
            console.error('Error updating event:', error)
            throw error
        }
    }

    const handleDatePickerDelete = async (eventId) => {
        try {
            await deleteApi(`calendars/delete/${eventId}`, token);
            console.log('Event deleted successfully');
            await refetchUpcomingEvents();
        } catch (error) {
            console.error('Error deleting event:', error)
        }
    }

    const handleDatePickerOpen = () => {
        setDatePickerOpen(true)
    }

    const handleDatePickerClose = () => {
        setDatePickerOpen(false)
        setUpcomingEventsError('')
    }

    const handleEventToggle = (value) => {
        if (eventsError) {
            setEventsError('')
        }
        setSelectedEvents((prev) => (
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        ))
    }

    const handleEventsSave = async () => {
        try {
            setIsSavingEvents(true)
            setEventsError('')
            await putApi('users/events', { eventsInvolved: selectedEvents }, token)
            setUser((prev) => (prev ? { ...prev, eventsInvolved: selectedEvents } : prev))
            setEventDialogOpen(false)
        } catch (error) {
            const message = error?.response?.data?.message || 'Unable to save events. Please try again.'
            setEventsError(message)
        } finally {
            setIsSavingEvents(false)
        }
    }

    const layoutSx = {
        equalWidthColumn: {
            flex: { xs: '1 1 100%', md: '1 1 0' },
            minWidth: 0,
        },
        responsiveRow: {
            direction: { xs: 'column', md: 'row' },
            spacing: { xs: 2, md: 3 },
        },
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
                            <Stack spacing={2}>
                                <Typography variant="subtitle1">Progress report</Typography>
                                <Stack
                                    spacing={2}
                                    direction={layoutSx.responsiveRow.direction}
                                    sx={{ width: '100%' }}
                                >
                                    {!showHundredMeter && !showLongJump && !showJavelinToss && (
                                        <Typography variant="body2" color="text.secondary">
                                            Select events to see progress charts.
                                        </Typography>
                                    )}
                                    {showHundredMeter && (
                                        <Stack spacing={1.5} sx={layoutSx.equalWidthColumn}>
                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                100 Meter Sprint
                                            </Typography>
                                            {hundredMeterDataset.length > 0 ? (
                                                <LineChart
                                                    dataset={hundredMeterDataset}
                                                    xAxis={[{
                                                        dataKey: 'date',
                                                        scaleType: 'time',
                                                        valueFormatter: (value) => value.toLocaleDateString(),
                                                    }]}
                                                    series={[{
                                                        dataKey: 'value',
                                                        label: 'Time (seconds)',
                                                        showMark: false,
                                                    }]}
                                                    height={160}
                                                    grid={{ horizontal: true }}
                                                />
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    No sprint records yet.
                                                </Typography>
                                            )}
                                        </Stack>
                                    )}

                                    {showLongJump && (
                                        <Stack spacing={1.5} sx={layoutSx.equalWidthColumn}>
                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                Long Jump
                                            </Typography>
                                            {longJumpDataset.length > 0 ? (
                                                <LineChart
                                                    dataset={longJumpDataset}
                                                    xAxis={[{
                                                        dataKey: 'date',
                                                        scaleType: 'time',
                                                        valueFormatter: (value) => value.toLocaleDateString(),
                                                    }]}
                                                    series={[{
                                                        dataKey: 'value',
                                                        label: 'Distance (meters)',
                                                        showMark: false,
                                                    }]}
                                                    height={160}
                                                    grid={{ horizontal: true }}
                                                />
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    No long jump records yet.
                                                </Typography>
                                            )}
                                        </Stack>
                                    )}

                                    {showJavelinToss && (
                                        <Stack spacing={1.5} sx={layoutSx.equalWidthColumn}>
                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                Javelin Toss
                                            </Typography>
                                            {javelinDataset.length > 0 ? (
                                                <LineChart
                                                    dataset={javelinDataset}
                                                    xAxis={[{
                                                        dataKey: 'date',
                                                        scaleType: 'time',
                                                        valueFormatter: (value) => value.toLocaleDateString(),
                                                    }]}
                                                    series={[{
                                                        dataKey: 'value',
                                                        label: 'Distance (meters)',
                                                        showMark: false,
                                                    }]}
                                                    height={160}
                                                    grid={{ horizontal: true }}
                                                />
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    No javelin records yet.
                                                </Typography>
                                            )}
                                        </Stack>
                                    )}
                                </Stack>
                            </Stack>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper elevation={12} sx={{ p: { xs: 2, md: 2.5 }, minHeight: 240, borderRadius: 8 }}>
                            <Stack spacing={1.5} direction={"row"} alignItems="center" justifyContent="space-between">
                                <Typography variant="subtitle1">Upcoming Events</Typography>
                                <Button variant="contained" onClick={handleDatePickerOpen}>
                                    Create New Event
                                </Button>
                            </Stack>
                            <Stack spacing={2} mt={2}>
                                <DateList
                                    events={upcomingEvents}
                                    loading={upcomingEventsLoading}
                                    submitLabel="Update Event"
                                    editEvent={handleDatePickerEdit}
                                    deleteEvent={handleDatePickerDelete}
                                />
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>

                {(showHundredMeter || showLongJump || showJavelinToss) && (
                    <Stack
                        direction={layoutSx.responsiveRow.direction}
                        spacing={layoutSx.responsiveRow.spacing}
                        sx={{ mt: 2.5 }}
                    >
                        {showHundredMeter && (
                            <Box sx={layoutSx.equalWidthColumn}>
                                <Paper elevation={12} sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 8 }}>
                                    <Stack spacing={2}>
                                        <Typography variant="h6">100 Meter Sprint</Typography>
                                        <EventList
                                            events={hundredMeterEvents}
                                            loading={hundredMeterLoading}
                                            readOnly
                                        />
                                    </Stack>
                                </Paper>
                            </Box>
                        )}
                        {showLongJump && (
                            <Box sx={layoutSx.equalWidthColumn}>
                                <Paper elevation={12} sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 8 }}>
                                    <Stack spacing={2}>
                                        <Typography variant="h6">Long Jump</Typography>
                                        <EventList
                                            events={longJumpEvents}
                                            loading={longJumpLoading}
                                            readOnly
                                        />
                                    </Stack>
                                </Paper>
                            </Box>
                        )}
                        {showJavelinToss && (
                            <Box sx={layoutSx.equalWidthColumn}>
                                <Paper elevation={12} sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 8 }}>
                                    <Stack spacing={2}>
                                        <Typography variant="h6">Javelin Toss</Typography>
                                        <EventList
                                            events={javelinEvents}
                                            loading={javelinLoading}
                                            readOnly
                                        />
                                    </Stack>
                                </Paper>
                            </Box>
                        )}
                    </Stack>
                )}
            </Container>

            <Dialog
                open={datePickerOpen}
                onClose={handleDatePickerClose}
                maxWidth="xs"
                fullWidth
                slotProps={{
                    Paper: {
                        sx: { borderRadius: 2 },
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 600 }}>Create Upcoming Event</DialogTitle>
                <DialogContent sx={{ pt: 1 }}>
                    <DateForm
                        onSubmit={handleDatePickerSubmit}
                        onSuccess={handleDatePickerClose}
                        onCancel={handleDatePickerClose}
                        submitLabel="Create Event"
                        errorMessage={upcomingEventsError}
                        errorClear={() => setUpcomingEventsError('')}
                    />
                </DialogContent>
            </Dialog>

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
                    {eventsError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {eventsError}
                        </Alert>
                    )}
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
                    >
                        {isSavingEvents ? <CircularProgress size={18} color="inherit" /> : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default DashboardPage
