import { createContext, useContext, useEffect, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage('user', null);
    const [token, setToken] = useLocalStorage('token', null);
    const [sessionExpiredValue, setSessionExpiredValue] = useLocalStorage('sessionExpired', '0');

    const sessionExpired = sessionExpiredValue === '1';
    const setSessionExpired = (value) => {
        setSessionExpiredValue(value ? '1' : '0');
    };

    const isTokenExpired = (jwt) => {
        if (!jwt) return true;
        const parts = jwt.split('.');
        if (parts.length !== 3) return true;

        try {
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
            if (!payload?.exp) return false;
            return payload.exp * 1000 < Date.now();
        } catch (error) {
            console.warn('Invalid token payload:', error);
            return true;
        }
    };

    useEffect(() => {
        if (!token) return;
        if (isTokenExpired(token)) {
            setToken(null);
            setUser(null);
            setSessionExpired(true);
        }
    }, [token, setToken, setUser, setSessionExpired]);

    useEffect(() => {
        if (token && sessionExpired) {
            setSessionExpired(false);
        }
    }, [token, sessionExpired, setSessionExpired]);

    const value = useMemo(
        () => ({ user, setUser, token, setToken, sessionExpired, setSessionExpired }),
        [user, token, sessionExpired, setUser, setToken, setSessionExpired]
    );

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};
