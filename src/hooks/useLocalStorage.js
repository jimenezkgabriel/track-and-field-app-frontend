import { useState, useEffect } from 'react'

export const useLocalStorage = (key, initialValue) => {
    const [value, setValue] = useState(() => {
        try {
            const stored = localStorage.getItem(key)
            if (stored !== null) {
                try {
                    return JSON.parse(stored)
                } catch {
                    // If parsing fails, return the raw value
                    return stored
                }
            }
            return initialValue
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error)
            return initialValue
        }
    })

    useEffect(() => {
        try {
            if (value !== null && value !== undefined) {
                const valueToStore = typeof value === 'string' ? value : JSON.stringify(value)
                localStorage.setItem(key, valueToStore)
            } else {
                localStorage.removeItem(key)
            }
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error)
        }
    }, [key, value])

    return [value, setValue]
}
