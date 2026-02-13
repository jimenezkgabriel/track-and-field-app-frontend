import { useEffect, useState } from 'react'
import { Alert, Box, Button, CircularProgress, Snackbar, Stack, TextField } from '@mui/material'

const RecordForm = ({
    fieldLabel = 'Record',
    fieldPlaceholder = 'e.g., 12.45',
    onSuccess,
    onCancel,
    onSubmit,
    initialRecord = '',
    initialDescription = '',
    submitLabel = 'Submit',
    errorMessage,
    onErrorClear,
    isActive = true,
}) => {
    const [recordValue, setRecordValue] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [openError, setOpenError] = useState(false)

    useEffect(() => {
        const nextValue = initialRecord === 0 || initialRecord ? String(initialRecord) : ''
        setRecordValue(nextValue)
        setDescription(initialDescription || '')
    }, [initialRecord, initialDescription])

    useEffect(() => {
        if (isActive && errorMessage) {
            setOpenError(true)
        }
    }, [errorMessage, isActive])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!recordValue.trim()) return

        setLoading(true)
        try {
            const payload = {
                record: parseFloat(recordValue),
                description,
            }
            if (onSubmit) {
                await onSubmit(payload)
            }
            setRecordValue('')
            setDescription('')
            onSuccess?.()
        } catch (error) {
            console.error('Record submission error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleErrorClose = (_, reason) => {
        if (reason === 'clickaway') return
        setOpenError(false)
        onErrorClear?.()
    }

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ pt: 1 }}>
            <Stack spacing={2}>
                <TextField
                    label={fieldLabel}
                    placeholder={fieldPlaceholder}
                    type="number"
                    slotProps={{ input: { step: '0.01', min: '0' } }}
                    value={recordValue}
                    onChange={(e) => setRecordValue(e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="small"
                    required
                />
                <TextField
                    label="Description"
                    placeholder="Notes about this sprint..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    variant="outlined"
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
                        disabled={!recordValue.trim() || loading}
                        sx={{ textTransform: 'none' }}
                    >
                        {loading ? <CircularProgress size={24} /> : submitLabel}
                    </Button>
                </Stack>
            </Stack>
            <Snackbar
                open={openError}
                autoHideDuration={5000}
                onClose={handleErrorClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default RecordForm