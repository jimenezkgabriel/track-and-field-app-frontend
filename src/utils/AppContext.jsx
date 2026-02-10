import { createContext, useContext, useMemo, useState } from "react";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);

    const value = useMemo(() => ({ userId, setUserId, token, setToken }), [userId, token]);

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};
