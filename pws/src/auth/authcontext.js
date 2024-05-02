import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, setToken, removeToken } from './authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const token = getToken();
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

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
