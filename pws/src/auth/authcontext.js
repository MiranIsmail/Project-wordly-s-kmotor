import { createContext, useContext, useState, useEffect } from 'react';
import { getToken as fetchToken, setToken, removeToken } from './authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const token = fetchToken();
        if (token) {
            setLoggedIn(true);
        }
    }, []);

    const login = (token) => {
        setToken(token);
        setLoggedIn(true);
    };

    const logout = () => {
        removeToken();
        setLoggedIn(false);
    };

    // Expose getToken to the components
    const getToken = () => {
        return fetchToken();
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, getToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
