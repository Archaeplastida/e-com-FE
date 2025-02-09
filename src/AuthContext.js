import React, { createContext, useState, useEffect } from 'react';
import { logout as apiLogout, verify } from './apis/auth';
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState(null);

    const logoutUser = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setToken(null);
        setUsername(null);
    }

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        let user_name;
        if (storedToken && storedUsername) {
            user_name = (jwtDecode(storedToken)).user_name;
            verify(storedToken)
                .then(isValid => {
                    if (storedUsername === user_name) {
                        setToken(storedToken);
                        setUsername(storedUsername);
                    }
                })
                .catch(error => {
                    console.error(error);
                    logoutUser();
                })
        } else logoutUser();
    }, []);

    const login = (token, username) => {
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        setToken(token);
        setUsername(username);
    };

    const logout = async () => {
        try {
            await apiLogout(token);
        } catch (error) {
            console.error(error.message);
        } finally {
            logoutUser();
        }
    };

    return (
        <AuthContext.Provider value={{ token, username, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};