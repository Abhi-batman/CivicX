import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

// Mock email database for validation
const MOCK_USERS = [
    { email: 'demo@example.com', password: 'password123', name: 'Demo User', id: '1' },
];

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check for stored user on app start
        loadStoredUser();
    }, []);

    const loadStoredUser = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Error loading stored user:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkEmailExists = (email) => {
        return MOCK_USERS.some(u => u.email.toLowerCase() === email.toLowerCase());
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const login = async (email, password) => {
        // Validate email format
        if (!validateEmail(email)) {
            throw new Error('Invalid email format');
        }

        // Check if email exists
        const existingUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!existingUser) {
            throw new Error('Email not found. Please sign up first.');
        }

        // Check password (in real app, this would be done on backend)
        if (existingUser.password !== password) {
            throw new Error('Incorrect password');
        }

        // Create user data without password
        const userData = {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
        };

        // Store user data
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);

        return userData;
    };

    const signup = async (name, email, password) => {
        // Validate email format
        if (!validateEmail(email)) {
            throw new Error('Invalid email format');
        }

        // Check if email already exists
        if (checkEmailExists(email)) {
            throw new Error('Email already exists. Please login instead.');
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
        };

        // Add to mock database (in real app, this would be backend)
        MOCK_USERS.push({ ...newUser, password });

        // Store user data
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
        setIsAuthenticated(true);

        return newUser;
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const updateUserProfile = async (updates) => {
        try {
            const updatedUser = { ...user, ...updates };
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            return updatedUser;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated,
            login,
            signup,
            logout,
            updateUserProfile,
            checkEmailExists,
            validateEmail,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

