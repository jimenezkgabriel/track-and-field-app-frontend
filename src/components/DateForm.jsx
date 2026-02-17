import { useEffect, useState } from 'react'
import { Alert, Box, Button, CircularProgress, Stack, TextField } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

const DateForm = ({
    onSuccess,
    onCancel,
    onSubmit,
    initialTitle = '',
    initialDescription = '',
    initialDate = null,
    submitLabel = 'Submit',
    errorMessage,
    errorClear,
}) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [selectedDate, setSelectedDate] = useState(dayjs())
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setTitle(initialTitle || '')
        setDescription(initialDescription || '')
        setSelectedDate(initialDate ? dayjs(initialDate) : dayjs())
    }, [initialTitle, initialDescription, initialDate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title.trim()) return

        setLoading(true)
        try {
            const payload = {
                title: title.trim(),
                date: selectedDate.toDate(),
                description: description.trim(),
            }
            if (onSubmit) {
                await onSubmit(payload)
            }
            setTitle('')
            setDescription('')
            setSelectedDate(dayjs())
            onSuccess?.()
        } catch (error) {
            console.error('Event submission error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ pt: 1 }}>
            <Stack spacing={2.5}>
                {errorMessage && (
                    <Alert severity="error" onClose={errorClear}>
                        {errorMessage}
                    </Alert>
                )}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Event Date"
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                        disablePast
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                size: 'small',
                                required: true,
                            },
                        }}
                    />
                </LocalizationProvider>
                <TextField
                    label="Event Title"
                    placeholder="e.g., Championship Meet"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="small"
                    required
                />
                <TextField
                    label="Description"
                    placeholder="Optional notes about this event..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="small"
                    multiline
                    rows={4}
                />
                <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end', pt: 1 }}>
                    <Button variant="outlined" onClick={onCancel} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={!title.trim() || loading}
                        sx={{ textTransform: 'none' }}
                    >
                        {loading ? <CircularProgress size={24} /> : submitLabel}
                    </Button>
                </Stack>
            </Stack>
        </Box>
    )
}

export default DateForm
