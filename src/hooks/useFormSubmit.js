import { useState } from 'react'

export const useFormSubmit = () => {
    const [errors, setErrors] = useState({})
    const [generalError, setGeneralError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleFieldChange = (fieldName) => {
        setGeneralError('')
        setErrors((prev) => ({ ...prev, [fieldName]: '' }))
    }

    const handleError = (error) => {
        console.error('Form error:', error)

        if (error.response?.data?.errors) {
            setErrors(error.response.data.errors)
        } else if (error.response?.data?.message) {
            setGeneralError(error.response.data.message)
        } else {
            setGeneralError('An error occurred. Please try again.')
        }
    }

    const resetErrors = () => {
        setErrors({})
        setGeneralError('')
    }

    return {
        errors,
        generalError,
        loading,
        setLoading,
        handleFieldChange,
        handleError,
        resetErrors,
    }
}
