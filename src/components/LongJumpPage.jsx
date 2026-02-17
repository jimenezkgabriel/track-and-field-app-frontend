import { useState } from 'react'
import { Box, Button, Container, Dialog, DialogContent, DialogTitle, Paper, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useEvents } from '../hooks/useEvents.js'
import RecordForm from './RecordForm.jsx'
import EventList from './EventList.jsx'
import Weather from './Weather.jsx'

const LongJumpPage = () => {
    const navigate = useNavigate()
    const { events, loading, error, clearError, createEvent, editEvent, deleteEvent, refetch } = useEvents('/long-jump/')
    const [openModal, setOpenModal] = useState(false)

    const getFarthestJump = () => {
        if (!events || events.length === 0) return '--'
        const farthest = Math.max(...events.map(event => parseFloat(event.record)))
        return `${farthest.toFixed(2)}m`
    }

    const handleRecordSuccess = () => {
        setOpenModal(false)
        refetch()
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Weather />
            <Container maxWidth="lg" sx={{ py: { xs: 2, md: 3 } }}>
                <Stack spacing={3}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate('/dashboard')}
                        sx={{ alignSelf: 'flex-start' }}
                    >
                        Back to Dashboard
                    </Button>
                    <Paper elevation={12} sx={{ p: { xs: 2, md: 3 }, borderRadius: 8 }}>
                        <Stack spacing={2} alignItems="center">
                            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                Long Jump
                            </Typography>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: { xs: 2, md: 2.5 },
                                    borderRadius: 4,
                                    backgroundColor: (theme) =>
                                        theme.palette.mode === 'dark'
                                            ? 'rgba(33, 150, 243, 0.1)'
                                            : 'rgba(33, 150, 243, 0.05)',
                                    borderColor: (theme) => theme.palette.primary.light,
                                    width: '100%',
                                    maxWidth: 280,
                                    textAlign: 'center',
                                }}
                            >
                                <Stack spacing={0.5}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Farthest Jump
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontWeight: 700,
                                            color: 'primary.main',
                                        }}
                                    >
                                        {getFarthestJump()}
                                    </Typography>
                                </Stack>
                            </Paper>
                        </Stack>
                    </Paper>
                    <Paper
                        variant="outlined"
                        sx={{ p: { xs: 2, md: 3 }, minHeight: 300 }}
                    >
                        <Stack spacing={2}>
                            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                                <Typography variant="h6">Jump Records</Typography>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => setOpenModal(true)}
                                    sx={{
                                        textTransform: 'none',
                                    }}
                                >
                                    Add New Record
                                </Button>
                            </Stack>
                            <EventList
                                events={events}
                                loading={loading}
                                editEvent={editEvent}
                                deleteEvent={deleteEvent}
                                fieldLabel="Distance (meters)"
                                fieldPlaceholder="e.g., 7.25"
                                errorMessage={error}
                                onErrorClear={clearError}
                            />
                        </Stack>
                    </Paper>

                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate('/dashboard')}
                        sx={{ alignSelf: 'flex-start' }}
                    >
                        Back to Dashboard
                    </Button>
                </Stack>
            </Container>

            <Dialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                maxWidth="sm"
                fullWidth
                slotProps={{
                    Paper: {
                        sx: { borderRadius: 2 },
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 600 }}>Record New Jump</DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <RecordForm
                        fieldLabel="Distance (meters)"
                        fieldPlaceholder="e.g., 7.25"
                        onSubmit={createEvent}
                        onSuccess={handleRecordSuccess}
                        onCancel={() => setOpenModal(false)}
                        errorMessage={error}
                        onErrorClear={clearError}
                        isActive={openModal}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    )
}

export default LongJumpPage
