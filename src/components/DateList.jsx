import { useState } from 'react'
import { Box, CircularProgress, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material'
import DateItem from './DateItem.jsx'
import DateForm from './DateForm.jsx'

const DateList = ({ events, loading, editEvent, deleteEvent, errorMessage, onErrorClear, readOnly = false }) => {
    const [editingEvent, setEditingEvent] = useState(null)
    const [openEdit, setOpenEdit] = useState(false)
    const [editError, setEditError] = useState('')

    const canEdit = !readOnly && Boolean(editEvent)
    const canDelete = !readOnly && Boolean(deleteEvent)

    const handleEditOpen = (event) => {
        if (!canEdit) return
        setEditingEvent(event)
        setEditError('')
        setOpenEdit(true)
    }

    const handleEditClose = () => {
        setOpenEdit(false)
        setEditingEvent(null)
        setEditError('')
    }

    const handleEditSubmit = async (payload) => {
        if (!editingEvent?._id) return
        try {
            await editEvent(editingEvent._id, payload)
        } catch (error) {
            setEditError('Failed to update event. Please try again.')
            throw error
        }
    }

    return (
        <>
            {loading ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        py: 4,
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : events.length === 0 ? (
                <Box
                    sx={{
                        py: 4,
                        textAlign: 'center',
                        color: 'text.secondary',
                    }}
                >
                    <Typography variant="body1">No upcoming events yet. Create your first event to get started!</Typography>
                </Box>
            ) : (
                events.map((event) => (
                    <DateItem
                        key={event._id ?? event.id}
                        title={event.title}
                        date={event.date}
                        description={event.description}
                        createdAt={event.createdAt}
                        updatedAt={event.updatedAt}
                        onEdit={canEdit ? () => handleEditOpen(event) : null}
                        onDelete={canDelete ? () => deleteEvent(event._id) : null}
                    />
                ))
            )}

            {!readOnly && (
                <Dialog
                    open={openEdit}
                    onClose={handleEditClose}
                    maxWidth="sm"
                    fullWidth
                    slotProps={{
                        Paper: {
                            sx: { borderRadius: 2 },
                        },
                    }}
                >
                    <DialogTitle sx={{ fontWeight: 600 }}>Edit Event</DialogTitle>
                    <DialogContent sx={{ pt: 3 }}>
                        <DateForm
                            initialTitle={editingEvent?.title}
                            initialDescription={editingEvent?.description}
                            initialDate={editingEvent?.date}
                            submitLabel="Save Changes"
                            onSubmit={handleEditSubmit}
                            onSuccess={handleEditClose}
                            onCancel={handleEditClose}
                            errorMessage={editError}
                            errorClear={() => setEditError('')}
                            isActive={openEdit}
                        />
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}

export default DateList
