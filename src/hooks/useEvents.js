import { useState, useEffect } from 'react'
import * as api from '../lib/api.js';
import { useAppContext } from '../utils/AppContext';


export const useEvents = (endpoint) => {
    const { token } = useAppContext();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const clearError = () => setError(null);

    const fetchEvents = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.getApi(endpoint, token);
            const data = response.data;
            
            // Add artificial delay to see loading spinner (remove in production)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Handle response format: {message, record} or array
            if (Array.isArray(data)) {
                setEvents(data);
            } else if (data.record) {
                setEvents(Array.isArray(data.record) ? data.record : [data.record]);
            } else {
                setEvents([]);
            }
        } catch (err) {
            console.error('Error fetching events:', err);
            setError('Failed to load events. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const editEvent = async (eventId, updatedData) => {
        setError(null);
        try {
            const response = await api.putApi(`${endpoint}update/${eventId}`, updatedData, token);
            const updatedRecord = response.data.record || response.data;
            setEvents((prevEvents) =>
                prevEvents.map((event) => (event._id === eventId ? updatedRecord : event))
            );
            return updatedRecord;
        } catch (err) {
            console.error('Error updating event:', err);
            const message = err?.response?.data?.message || 'Failed to update event. Please try again later.';
            setError(message);
            throw err;
        }
    };

    const createEvent = async (payload) => {
        setError(null);
        try {
            const createEndpoint = endpoint.endsWith('/') ? `${endpoint}record` : `${endpoint}/record`;
            const response = await api.postApi(createEndpoint, payload, token);
            const newRecord = response.data.record || response.data;
            setEvents((prevEvents) => [newRecord, ...prevEvents]);
            return newRecord;
        } catch (err) {
            console.error('Error creating event:', err);
            const message = err?.response?.data?.message || 'Failed to create event. Please try again later.';
            setError(message);
            throw err;
        }
    };

    const deleteEvent = async (eventId) => {
        setError(null);
        try {
            await api.deleteApi(`${endpoint}delete/${eventId}`, token);
            setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
        } catch (err) {
            console.error('Error deleting event:', err);
            setError('Failed to delete event. Please try again later.');
            throw err;
        }
    };

    useEffect(() => {
        if (!token) return;
        fetchEvents();
    }, [endpoint, token]);

    return { events, loading, error, clearError, createEvent, editEvent, deleteEvent, refetch: fetchEvents };
}