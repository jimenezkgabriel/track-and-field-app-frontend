import { useState, useEffect } from 'react'

export const useLocalStorage = (key, initialValue) => {
    const [value, setValue] = useState(() => {
        try {
            const stored = localStorage.getItem(key)
            return stored !== null ? stored : initialValue
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error)
            return initialValue
        }
    })

    useEffect(() => {
        try {
            if (value !== null && value !== undefined) {
                localStorage.setItem(key, value)
            } else {
                localStorage.removeItem(key)
            }
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error)
        }
    }, [key, value])

    return [value, setValue]
}
