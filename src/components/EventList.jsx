import { useState } from 'react';
import { Box, CircularProgress, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import EventItem from './EventItem.jsx';
import RecordForm from './RecordForm.jsx';

const EventList = ({ events, loading, editEvent, deleteEvent, fieldLabel, fieldPlaceholder, errorMessage, onErrorClear, readOnly = false }) => {
    const [editingEvent, setEditingEvent] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);

    const canEdit = !readOnly && Boolean(editEvent);
    const canDelete = !readOnly && Boolean(deleteEvent);

    const handleEditOpen = (event) => {
        if (!canEdit) return;
        setEditingEvent(event);
        setOpenEdit(true);
    };

    const handleEditClose = () => {
        setOpenEdit(false);
        setEditingEvent(null);
    };

    const handleEditSubmit = async (payload) => {
        if (!editingEvent?._id) return;
        await editEvent(editingEvent._id, payload);
    };

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
                    <Typography variant="body1">No records yet. Add your first record to get started!</Typography>
                </Box>
            ) : (
                events.map((event) => (
                    <EventItem
                        key={event._id ?? event.id}
                        record={event.record}
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
                    <DialogTitle sx={{ fontWeight: 600 }}>Edit Record</DialogTitle>
                    <DialogContent sx={{ pt: 3 }}>
                        <RecordForm
                            fieldLabel={fieldLabel}
                            fieldPlaceholder={fieldPlaceholder}
                            initialRecord={editingEvent?.record}
                            initialDescription={editingEvent?.description}
                            submitLabel="Save Edits"
                            onSubmit={handleEditSubmit}
                            onSuccess={handleEditClose}
                            onCancel={handleEditClose}
                            errorMessage={errorMessage}
                            onErrorClear={onErrorClear}
                            isActive={openEdit}
                        />
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default EventList;